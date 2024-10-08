using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using UserService.Contexts;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QueueController : ControllerBase
    {
        private readonly ILogger<QueueController> logger;
        private readonly MessageQueueContext queue;
        private readonly IConfiguration configuration;

        public QueueController(
            ILogger<QueueController> logger,
            MessageQueueContext queue,
            IConfiguration configuration
            )
        {
            this.logger = logger;
            this.queue = queue;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("messages")]
        public IActionResult PostQueueMessages([FromBody] Cloud77.Service.Queue.QueueMessage body)
        {
            if (Request.HasFormContentType)
            {
                logger.LogInformation("receive form data");
            }
            else
            {
                logger.LogInformation("not receive form data");
            }

            var result = new
            {
                id = Guid.NewGuid().ToString(),
                message = body.Message,
                timestamp = DateTime.Now,
                queue = body.Queue
            };
            string message = Newtonsoft.Json.JsonConvert.SerializeObject(result);
            queue.Send(body.Queue, body.Message);
            return Ok(new ServiceResponse("message-sent", "", "xxx"));
        }

        [HttpPost]
        [Route("mails")]
        public IActionResult PostMail([FromBody] EmailContentEntity body)
        {
            EmailContentEntity content = new EmailContentEntity()
            {
                Addresses = new string[] { body.Addresses.FirstOrDefault() },
                Subject = body.Subject,
                Body = body.Body
            };
            queue.Send(configuration["Mail_queue"], Newtonsoft.Json.JsonConvert.SerializeObject(content));
            return Ok(new ServiceResponse("mail-sent", "", "xxx"));
        }
    }
}
