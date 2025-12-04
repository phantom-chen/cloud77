using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace todo_console
{
    public class RabbitMQConfig
    {
        public string HostName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            #region read config
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

            var config = builder.Build();

            var mongodbConfig = config["Mongodb"];
            var rabbitConfig = new RabbitMQConfig()
            {
                HostName = config["Rabbitmq:HostName"],
                UserName = config["Rabbitmq:UserName"],
                Password = config["Rabbitmq:Password"]
            };
            #endregion

            await HandleMessage(rabbitConfig, mongodbConfig);
        }

        private static async Task HandleMessage(RabbitMQConfig rabbitconfig, string mongodbConfig)
        {
            var factory = new ConnectionFactory() { HostName = rabbitconfig.HostName, UserName = rabbitconfig.UserName, Password = rabbitconfig.Password };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                channel.QueueDeclare(queue: "log_queue", durable: true, exclusive: false, autoDelete: false, arguments: null);
                var consumer1 = new EventingBasicConsumer(channel);
                consumer1.Received += (model, ea) =>
                {
                    HandleMessage(mongodbConfig, ReadMessageFromQueue(ea));
                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(queue: "log_queue", autoAck: false, consumer: consumer1);

                while (true)
                {
                    PrintConsoleLog();
                    await Task.Delay(5000);
                }
            }
        }

        static void PrintConsoleLog()
        {
            Console.WriteLine("todo console is listening at {0}", DateTime.Now.ToString());
        }

        static string ReadMessageFromQueue(BasicDeliverEventArgs args)
        {
            var body = args.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            return message;
        }

        private static async void HandleMessage(string mongodbConfig, string message)
        {
            Console.WriteLine("Received message: {0}", message);
            
            MongoClient mongoClient = new MongoClient(mongodbConfig);
            var db = mongoClient.GetDatabase("todo");
            var collection = db.GetCollection<BsonDocument>("logs");
          
            await collection.InsertOneAsync(new BsonDocument
            {
                { "message", message },
                { "timestamp", DateTime.UtcNow.ToString() }
            });

            Console.WriteLine("handle message: {0}", message);
        }
    }
}
