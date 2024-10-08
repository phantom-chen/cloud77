using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using RabbitMQ.Client;

namespace UserService.Contexts
{
    public class MessageQueueContext
    {
        private readonly ConnectionFactory factory;

        public MessageQueueContext(IConfiguration configuration)
        {
            this.factory = new ConnectionFactory()
            {
                HostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost",
                UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
                Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
            }; ;
        }

        public void Send(string queue, string message)
        {
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;
                channel.QueueDeclare(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "", routingKey: queue, basicProperties: properties, body: body);
            }
        }
    }
}
