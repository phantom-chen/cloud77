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

        public override async Task<ServiceReply> SendSimpleMessage(SimpleQueueMessage request, ServerCallContext context)
        {
            using (var connection = await factory.CreateConnectionAsync())
            {
                using (var channel = await connection.CreateChannelAsync())
                {
                    var properties = new BasicProperties();
                    properties.Persistent = true;
                    await channel.QueueDeclareAsync(queue: request.Queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                    var body = Encoding.UTF8.GetBytes(request.Message);
                    await channel.BasicPublishAsync(exchange: "", routingKey: request.Queue, mandatory: false, basicProperties: properties, body: body);
                }
            }

            return new ServiceReply()
            {
                Code = "a",
                Message = "b",
                Id = "c"
            };
        }
    }
}
