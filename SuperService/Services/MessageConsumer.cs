
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using Cloud77.Service.Entity;
using MongoDB.Driver;
using System.Reflection;

namespace SuperService.Services
{
    public class MessageConsumer : IHostedService
    {
        private readonly ILogger<MessageConsumer> logger;
        private readonly SettingCollection collection;
        private readonly string demoMessageQueue;
        private readonly string mailMessageQueue;
        
        public MessageConsumer(
            ILogger<MessageConsumer> logger,
            IConfiguration configuration)
        {
            this.logger = logger;
            demoMessageQueue = configuration["Demo_queue"];
            mailMessageQueue = configuration["Mail_queue"];
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
            if (File.Exists(Path.Combine(dir, "localhost.txt")))
            {
                connection = connection.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "localhost.txt"))[0]);
            }
            var client = new MongoClient(connection);
            collection = new SettingCollection(client, configuration);
        }
        private IEnumerable<SettingEntity> settings;
        public Task StartAsync(CancellationToken cancellationToken)
        {
            settings = collection.Get();
            Task.Run(Execute);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task Execute()
        {
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            var hostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost";
            if (File.Exists(Path.Combine(dir, "localhost.txt")))
            {
              hostName = hostName.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "localhost.txt"))[0]);
            }

            var factory = new ConnectionFactory()
            {
              HostName = hostName,
              UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
              Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
            };
            if (factory != null)
            {
                try
                {
                    using (var connection = factory.CreateConnection())
                    using (var channel = connection.CreateModel())
                    {
                        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                        HandleDemoMessage(channel);
                        HandleMailMessage(channel);

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
        }

        private string Message2String(BasicDeliverEventArgs args)
        {
            var body = args.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            return message;
        }

        private void HandleDemoMessage(IModel channel)
        {
            var queue = demoMessageQueue;
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

        private void HandleMailMessage(IModel channel)
        {
            var queue = mailMessageQueue;
            channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);
                EmailContentEntity content = JsonConvert.DeserializeObject<EmailContentEntity>(message);
                Task.Factory.StartNew(() =>
                {
                    try
                    {
                        var client = new MailClient(settings);
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
