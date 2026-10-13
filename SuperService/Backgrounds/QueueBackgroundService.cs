
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using Cloud77.Abstractions.Entity;
using SuperService.Models;
using ServiceStack.Redis;
using Cloud77.Abstractions;
using Cloud77.Abstractions.Service;

namespace SuperService.Backgrounds
{
    public class QueueBackgroundService : IHostedService
    {
        private readonly ILogger<QueueBackgroundService> logger;

        private readonly string defaultMessageQueue;
        private readonly string mailMessageQueue;
        private readonly string userLinkMessageQueue;

        public QueueBackgroundService(
                ILogger<QueueBackgroundService> logger,
                IConfiguration configuration)
        {
            this.logger = logger;
            defaultMessageQueue = configuration["Default_queue"] ?? "";
            mailMessageQueue = configuration["Mail_queue"] ?? "";
            userLinkMessageQueue = configuration["User_link_queue"] ?? "";
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(Execute);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task Execute()
        {
            var factory = new ConnectionFactory()
            {
                HostName = ServiceDataModel.GetVariable("MQ_HOST"),
                UserName = ServiceDataModel.GetVariable("MQ_USERNAME"),
                Password = ServiceDataModel.GetVariable("MQ_PASSWORD")
            };
            if (factory != null)
            {
                try
                {
                    using (var connection = await factory.CreateConnectionAsync())
                    using (var channel = await connection.CreateChannelAsync())
                    {
                        await channel.BasicQosAsync(prefetchSize: 0, prefetchCount: 1, global: false);

                        HandleDefaultMessage(channel);
                        HandleUserLinkMessage(channel);
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

        private async Task HandleDefaultMessage(IChannel channel)
        {
            var queue = defaultMessageQueue;
            await channel.QueueDeclareAsync(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation($"receive message: {message}");
                RedisClient client = new RedisClient(
                  ServiceDataModel.GetVariable("REDIS_HOST"),
                  6379,
                  ServiceDataModel.GetVariable("REDIS_PASSWORD"));

                client.Set(defaultMessageQueue, message, TimeSpan.FromMinutes(5));
                await channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                logger.LogInformation($"message is processed, save in Redis, key is {defaultMessageQueue}");
            };
            await channel.BasicConsumeAsync(queue, autoAck: false, consumer: consumer);
        }

        private async Task HandleUserLinkMessage(IChannel channel)
        {
            var queue = userLinkMessageQueue;
            await channel.QueueDeclareAsync(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);

                var userLink = JsonConvert.DeserializeObject<UserLink>(message);
                if (userLink == null)
                {
                    await channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
                    return;
                }
                var content = new EmailEntity()
                {
                    Addresses = new string[] { userLink.Email ?? "" },
                    Body = "",
                    Subject = "",
                    IsBodyHtml = true
                };
                if (userLink.Usage == "email")
                {
                    content.Subject = "Confirm user email";
                    content.Body = ServiceDataModel.GenerateEmailConfirmContent(userLink.Email, userLink.Name, userLink.Link);
                }
                if (userLink.Usage == "password")
                {
                    content.Subject = "Reset user password";
                    content.Body = ServiceDataModel.GeneratePasswordResetContent(userLink.Link);
                }
                if (!string.IsNullOrEmpty(content.Subject))
                {
                    SendMail(content);
                }
                await channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            await channel.BasicConsumeAsync(queue, autoAck: false, consumer: consumer);
        }

        private async Task HandleMailMessage(IChannel channel)
        {
            var queue = mailMessageQueue;
            await channel.QueueDeclareAsync(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var message = Message2String(ea) ?? "";
                if (!string.IsNullOrEmpty(message))
                {
                    logger.LogInformation(message);

                    EmailEntity? content = JsonConvert.DeserializeObject<EmailEntity>(message);
                    if (content != null)
                        SendMail(content);
                }

                await channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            await channel.BasicConsumeAsync(queue, autoAck: false, consumer: consumer);
        }

        private void SendMail(EmailEntity content)
        {
            Task.Factory.StartNew(() =>
            {
                try
                {
                    var client = new MailClient();
                    client.Send(content);
                }
                catch (Exception exception)
                {
                    logger.LogError("fail to send mail by AliCloud");
                    logger.LogError(exception.ToString());
                }
            });
        }
    }
}
