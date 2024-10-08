using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using ServiceStack.Redis;
using System.Text;
using System;
using System.Threading;
using System.Threading.Tasks;
using SuperService.Contexts;
using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Driver;
using System.Collections.Generic;
using System.IO;

namespace SuperService.HostedServices
{
    public class MessageConsumerService : IHostedService
    {
        ILogger<MessageConsumerService> logger;
        private readonly IConfiguration configuration;
        MongoClient client;
        public MessageConsumerService(
            ILogger<MessageConsumerService> logger,
            IConfiguration configuration,
            MongoClient client)
        {
            this.logger = logger;
            this.configuration = configuration;
            this.client = client;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(RunService);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private List<SettingMongoEntity> settings;

        private async Task RunService()
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            var collection = client.GetDatabase(dbName).GetCollection<SettingMongoEntity>(Cloud77Utility.Settings);
            settings = collection.Find(Builders<SettingMongoEntity>.Filter.Empty).ToList();

            var defaultQueue = configuration["Default_queue"];
            var mailQueue = configuration["Mail_queue"];

            var factory = CreateFactory();

            if (factory == null)
            {
                return;
            }
            try
            {
                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                    HandleDefaultEvent(channel, defaultQueue);
                    HandleUserCreateEvent(channel, "cloud77_user_create_queue");
                    HandleMailEvent(channel, mailQueue, settings);

                    while (true)
                    {
                        await Task.Delay(500);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation("fail to create connection / model");
                logger.LogInformation(ex.Message);
            }

        }

        private ConnectionFactory CreateFactory()
        {
            try
            {
                var factory = new ConnectionFactory()
                {
                    HostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost",
                    UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
                    Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
                };

                return factory;
            }
            catch (Exception ex)
            {
                logger.LogInformation("fail to create connection factory");
                logger.LogInformation(ex.Message);
                return null;
            }
        }

        private string Message2String(BasicDeliverEventArgs args)
        {
            var body = args.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            return message;
        }

        private void HandleDefaultEvent(IModel channel, string queue)
        {
            channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);

                RedisClient redis = new RedisClient(
                    Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost",
                    6379,
                    Environment.GetEnvironmentVariable("REDIS_PASSWORD") ?? "123456");
                var defaultQueue = configuration["Default_queue"];
                redis.Set(defaultQueue, message, TimeSpan.FromMinutes(5));
                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            channel.BasicConsume(queue, autoAck: false, consumer: consumer);
        }

        private void HandleUserCreateEvent(IModel channel, string queue)
        {
            channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);
                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            channel.BasicConsume(queue, autoAck: false, consumer: consumer);
        }

        private void HandleMailEvent(IModel channel, string queue, List<SettingMongoEntity> settings)
        {
            channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);

                EmailContentEntity content = Newtonsoft.Json.JsonConvert.DeserializeObject<EmailContentEntity>(message);
                Task.Factory.StartNew(() =>
                {
                    try
                    {
                        var client = new MailContext(settings);
                        client.Send(content);
                    }
                    catch (Exception exception)
                    {
                        logger.LogError("fail to send mail by AliCloud");
                        logger.LogError(exception.ToString());
                    }
                });
                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            channel.BasicConsume(queue, autoAck: false, consumer: consumer);
        }
    }
}

