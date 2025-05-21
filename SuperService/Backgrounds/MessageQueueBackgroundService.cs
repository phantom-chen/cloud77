
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using Newtonsoft.Json;
using Cloud77.Service.Entity;
using SuperService.Models;
using ServiceStack.Redis;

namespace SuperService.Backgrounds
{
  public class MessageQueueBackgroundService : IHostedService
  {
    private readonly ILogger<MessageQueueBackgroundService> logger;

    private readonly string defaultMessageQueue;
    private readonly string mailMessageQueue;
    private readonly string userLinkMessageQueue;

    public MessageQueueBackgroundService(
            ILogger<MessageQueueBackgroundService> logger,
            IConfiguration configuration)
    {
      this.logger = logger;
      defaultMessageQueue = configuration["Default_queue"];
      mailMessageQueue = configuration["Mail_queue"];
      userLinkMessageQueue = configuration["User_link_queue"];
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
      var hostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost";
      if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
      {
        hostName = hostName.Replace("localhost", LocalDataModel.IPAddress);
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

    private void HandleDefaultMessage(IModel channel)
    {
      var queue = defaultMessageQueue;
      channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
      var consumer = new EventingBasicConsumer(channel);
      consumer.Received += (model, ea) =>
      {
        var message = Message2String(ea);
        logger.LogInformation(message);
        var hostname = Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost";
        if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
        {
          hostname.Replace("localhost", LocalDataModel.IPAddress);
        }
        RedisClient client = new RedisClient(
                hostname,
                6379,
                Environment.GetEnvironmentVariable("REDIS_PASSWORD") ?? "123456");

        client.Set(defaultMessageQueue, message, TimeSpan.FromMinutes(5));

        channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
      };
      channel.BasicConsume(queue, autoAck: false, consumer: consumer);
    }

    private void HandleUserLinkMessage(IModel channel)
    {
      var queue = userLinkMessageQueue;
      channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
      var consumer = new EventingBasicConsumer(channel);
      consumer.Received += (model, ea) =>
      {
        var message = Message2String(ea);
        logger.LogInformation(message);

        var userLink = JsonConvert.DeserializeObject<UserLink>(message);

        var content = new EmailContentEntity()
        {
          Addresses = new string[] { userLink.Email },
          Body = "",
          Subject = "",
          IsBodyHtml = true
        };
        if (userLink.Usage == "email")
        {
          content.Subject = "Confirm user email";
          content.Body = new LocalDataModel().GenerateEmailConfirmContent(userLink.Email, userLink.Name, userLink.Link);
        }
        if (userLink.Usage == "password")
        {
          content.Subject = "Reset user password";
          content.Body = new LocalDataModel().GeneratePasswordResetContent(userLink.Link);
        }
        if (!string.IsNullOrEmpty(content.Subject))
        {
          SendMail(content);
        }
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

        SendMail(content);

        channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
      };
      channel.BasicConsume(queue, autoAck: false, consumer: consumer);
    }

    private void SendMail(EmailContentEntity content)
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
