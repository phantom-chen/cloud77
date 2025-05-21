using Grpc.Core;
using RabbitMQ.Client;
using SuperService.Protos;
using System.Text;

namespace SuperService.Services
{
    public class MessageService : Protos.MessageService.MessageServiceBase
    {
        private readonly ConnectionFactory factory;

        public MessageService(ConnectionFactory factory)
        {
            this.factory = factory;
        }

        public override Task<ServiceReply> SendSimpleMessage(SimpleQueueMessage request, ServerCallContext context)
        {
            using (var connection = factory.CreateConnection())
            {
                using (var channel = connection.CreateModel())
                {
                    var properties = channel.CreateBasicProperties();
                    properties.Persistent = true;
                    channel.QueueDeclare(queue: request.Queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                    var body = Encoding.UTF8.GetBytes(request.Message);
                    channel.BasicPublish(exchange: "", routingKey: request.Queue, basicProperties: properties, body: body);
                }
            }

            return Task.FromResult(new ServiceReply()
            {
                Code = "a",
                Message = "b",
                Id = "c"
            });
        }
    }
}
