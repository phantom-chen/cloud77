using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace todo_api
{
    public class LogMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public LogMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context)
        {
            var queue = "log_queue";

            var message = string.Format("Method: {0}, Path: {1}, Query: {2}", 
                context.Request.Method, 
                context.Request.Path.Value, 
                context.Request.QueryString.HasValue ? context.Request.QueryString.Value : "");

            var factory = new ConnectionFactory()
            {
                HostName = _configuration["Rabbitmq:HostName"],
                UserName = _configuration["Rabbitmq:UserName"],
                Password = _configuration["Rabbitmq:Password"]
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;
                channel.QueueDeclare(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "", routingKey: queue, basicProperties: properties, body: body);
            }

            await _next(context);
        }
    }
}
