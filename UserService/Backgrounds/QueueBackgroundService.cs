
using Cloud77.Abstractions;
using Cloud77.Abstractions.Service;
using MongoDB.Driver;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using UserService.Collections;

namespace UserService.Backgrounds
{
    public class QueueBackgroundService : IHostedService
    {
        private readonly ILogger<QueueBackgroundService> logger;
        private readonly string userResourceServer;
        private readonly IMongoDatabase database;

        public QueueBackgroundService(
            ILogger<QueueBackgroundService> logger,
            IConfiguration configuration)
        {
            this.logger = logger;
            userResourceServer = configuration["User_resource_server"] ?? "";

            var client = new MongoClient(ServiceDataModel.GetVariable("DB_CONNECTION"));
            database = client.GetDatabase(configuration["Database"]);
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
                    using (var connection = factory.CreateConnection())
                    using (var channel = connection.CreateModel())
                    {
                        channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                        HandleUserResourceMessage(channel);

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

        private void HandleUserResourceMessage(IModel channel)
        {
            var queue = userResourceServer;
            channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var message = Message2String(ea);
                logger.LogInformation(message);

                var user = System.Text.Json.JsonSerializer.Deserialize<UserRole>(message);
                
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    // Handle user resource message
                    new TaskCollection(database).DeleteSome(user.Email);

                    new PostCollection(database).DeleteSome(user.Email);
                    new UserDataModel(user.Email).DeletePosts();

                    var value = $"{user.Email}_resource_deleted_{userResourceServer}";
                    File.AppendAllLines(Path.Combine(ServiceDataModel.Root, "users", user.Email, "user_resource_deleted.txt"), new string[] { value });
                }
                
                channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
            };
            channel.BasicConsume(queue, autoAck: false, consumer: consumer);
        }
    }
}
