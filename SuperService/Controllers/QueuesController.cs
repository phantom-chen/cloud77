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

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [Authorize]
  [ApiController]
  public class QueuesController : ControllerBase
  {
    private readonly ILogger<QueuesController> logger;
    private readonly IConfiguration configuration;
    private readonly ConnectionFactory factory;
    private readonly IBus bus;

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
    }

    [HttpPost]
    public IActionResult Get([FromQuery] string message)
    {
      if (Request.HasFormContentType)
      {
        logger.LogInformation("receive form data");
      }
      else
      {
        logger.LogInformation("not receive form data");
      }

      new LocalDataModel().AppendLog($"send message '{message}' to the queue 'my_services_default_queue'");
      Send("my_services_default_queue", message);
      return Ok("message is sent to the queue");
    }

    // send daily health check email

    [HttpPost]
    [Route("health")]
    public IActionResult Post()
    {
            throw new NotImplementedException();
    }
    
    // send link to user

    [HttpPost]
    [Route("links/{usage}")]
    public IActionResult PostQueueMessages(string usage, [FromBody] UserRole body)
    {

            //Send(body.Queue, body.Message);
            throw new NotImplementedException();
    }

    // send email to user
    [HttpPost]
    [Route("mails")]
    public IActionResult PostMail([FromBody] EmailEntity body)
    {
      EmailEntity content = new EmailEntity()
      {
        Addresses = new string[] { body.Addresses.FirstOrDefault() },
        Subject = body.Subject,
        Body = body.Body
      };
      Send(configuration["Mail_queue"], Newtonsoft.Json.JsonConvert.SerializeObject(content));
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
