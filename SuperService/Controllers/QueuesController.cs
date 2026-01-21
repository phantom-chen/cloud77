using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using SuperService.Models;
using System.Text;
using Cloud77.Abstractions.Message;
using Cloud77.Abstractions;

namespace SuperService.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class QueuesController : ControllerBase, IDisposable
    {
        private readonly ILogger<QueuesController> logger;
        private readonly IConfiguration configuration;
        private readonly ConnectionFactory factory;
        private readonly IBus bus;
        private readonly TextLoggingModel textLogging;
        private MailClient? client;

        public QueuesController(
            ILogger<QueuesController> logger,
            IConfiguration configuration,
            ConnectionFactory factory,
            IBus bus
            )
        {
            this.logger = logger;
            this.configuration = configuration;
            this.factory = factory;
            this.bus = bus;
            textLogging = new TextLoggingModel();
        }

        [HttpPost]
        public IActionResult Get([FromQuery] string message)
        {
            logger.LogInformation($"receive the message '{message}'");

            Send(configuration["Default_queue"] ?? "", message);

            return Ok("message is sent to the queue");
        }

        [HttpPost]
        [Route("health")]
        public IActionResult Post([FromBody] EmailEntity body)
        {
            // ignore health_check_enabled for now
            logger.LogInformation(ServiceDataModel.GetSetting("health_check_enable"));
            EmailEntity mail = new EmailEntity()
            {
                Addresses = new string[] { body.Addresses.FirstOrDefault() ?? ServiceDataModel.GetSetting("health_check_address") },
                Subject = body.Subject ?? ServiceDataModel.GetSetting("health_check_subject"),
                Body = body.Body ?? ServiceDataModel.GetSetting("health_check_body")
            };

            client = new MailClient();
            client.Send(mail);
            return Ok();
        }

        [HttpPost]
        [Route("links/{usage}")]
        public IActionResult PostQueueMessages(string usage, [FromBody] UserRole body)
        {
            // usage could be email or password
            if (usage != "email" && usage != "password")
            {
                return BadRequest("invalid usage");
            }
            if (string.IsNullOrEmpty(body.Email) || string.IsNullOrEmpty(body.Name))
            {
                return BadRequest("missing email or name");
            }
            var content = new EmailEntity()
            {
                Addresses = new string[] { body.Email ?? "" },
                Body = "",
                Subject = "",
                IsBodyHtml = true
            };
            var link = "https://github.com";
            if (usage == "email")
            {
                //content.Subject = "Please verify your email address";
                //content.Body = $"<p>Dear {body.Name},</p><p>Please verify your email address by clicking the link below:</p><p><a href='#'>Verify Email</a></p><p>Thank you!</p>";
                content.Subject = "Confirm user email";
                content.Body = ServiceDataModel.GenerateEmailConfirmContent(body.Email, body.Name, link);
            }
            else if (usage == "password")
            {
                //content.Subject = "Password Reset Request";
                //content.Body = $"<p>Dear {body.Name},</p><p>You can reset your password by clicking the link below:</p><p><a href='#'>Reset Password</a></p><p>If you did not request a password reset, please ignore this email.</p>";
                content.Subject = "Reset user password";
                content.Body = ServiceDataModel.GeneratePasswordResetContent(link);
            }
            
            client = new MailClient();
            client.Send(content);
            return Ok(new MailSent(body.Email));
        }

        [HttpPost]
        [Route("mails")]
        public IActionResult PostMail([FromBody] EmailEntity body)
        {
            EmailEntity content = new EmailEntity()
            {
                Addresses = new string[] { body.Addresses.FirstOrDefault() ?? "" },
                Subject = body.Subject,
                Body = body.Body
            };
            Send(configuration["Mail_queue"] ?? "", Newtonsoft.Json.JsonConvert.SerializeObject(content));
            return Ok(new MailSent(body.Addresses.FirstOrDefault()));
        }

        [HttpPost]
        [Route("buses")]
        public IActionResult PostSimpleMessage([FromBody] Greeting message)
        {
            var sender = Guid.NewGuid().ToString();
            bus.Publish(new Greeting() { Content = message.Content, Sender = sender });
            return Ok(new GreetingSent(sender));
        }

        private void Send(string queue, string message)
        {
            if (string.IsNullOrEmpty(queue) || string.IsNullOrEmpty(message))
            {
                return;
            }

            textLogging.PushLog($"send message '{message}' to the queue '{queue}'");

            using (var connection = factory.CreateConnection())
            {
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

        public void Dispose()
        {
            textLogging.Commit();
        }
    }
}
