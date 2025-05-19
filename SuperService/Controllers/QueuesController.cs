using Cloud77.Service;
using Cloud77.Service.Entity;
using Cloud77.Service.Queue;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using SuperService.Models;
using System.Text;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QueuesController : ControllerBase
  {
    private readonly ILogger<QueuesController> logger;
    private readonly IConfiguration configuration;
    private readonly ConnectionFactory factory;

    public QueuesController(
        ILogger<QueuesController> logger,
        IConfiguration configuration,
        ConnectionFactory factory
        )
    {
      this.logger = logger;
      this.configuration = configuration;
      this.factory = factory;
    }

    [HttpGet]
    public IActionResult Get([FromQuery] string message)
    {
      new LocalDataModel().AppendLog($"send message '{message}' to the queue 'my_services_default_queue'");
      Send("my_services_default_queue", message);
      return Ok("message is sent to the queue");
    }

    [HttpPost]
    [Route("health")]
    public IActionResult Post()
    {
      return Ok();
    }

    [HttpPost]
    [Route("messages")]
    public IActionResult PostQueueMessages([FromBody] QueueMessage body)
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
      Send(body.Queue, body.Message);
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
      Send(configuration["Mail_queue"], Newtonsoft.Json.JsonConvert.SerializeObject(content));
      return Ok(new ServiceResponse("mail-sent", "", "xxx"));
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
