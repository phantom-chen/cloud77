using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using UserService.Collections;
using UserService.Models;

namespace UserService.Controllers
{
  /// <summary>
  /// Help create user account, user login, reset password, verify email.
  /// </summary>
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly ILogger<UsersController> logger;
    private readonly IConfiguration configuration;
    private readonly MongoClient client;
    private readonly ConnectionFactory factory;
    private readonly string defaultRole;
    private readonly UserCollection collection;
    private readonly TokenGenerator generator;

    public UsersController(
        ILogger<UsersController> logger,
        IConfiguration configuration,
        MongoClient client,
        ConnectionFactory factory
        )
    {
      this.defaultRole = configuration["Role_default"] ?? "";
      this.logger = logger;
      this.configuration = configuration;
      this.client = client;
      this.factory = factory;
      this.collection = new UserCollection(client, configuration);
      this.generator = new TokenGenerator(configuration);
    }

    /// <summary>
    /// Get user, user existing or not.
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult Get()
    {
      var email = Request.Query["email"].ToString() ?? "";
      var username = Request.Query["username"].ToString() ?? "";
      if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(username))
      {
        return BadRequest(new ServiceResponse(
            "empty-account"));
      }
      UserEntity user = collection.GetUser(email, username);
      if (user == null)
      {
        return Ok(new UserEmail()
        {
          Email = "",
          Existing = false
        });
      }
      else
      {
        return Ok(new UserEmail()
        {
          Email = user.Email,
          Existing = true,
        });
      }
    }

    /// <summary>
    /// Create user.
    /// </summary>
    /// <returns></returns>
    [HttpPost]
    public IActionResult Post(UserPassword user)
    {
      var role = defaultRole;
      if (user.Name == "admin")
      {
        role = "Administrator";
      }

      if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Name))
      {
        return BadRequest(new ServiceResponse("empty-account"));
      }

      if (string.IsNullOrEmpty(user.Password))
      {
        return BadRequest(new ServiceResponse("empty-password"));
      }

      logger.LogInformation("check password length");

      logger.LogInformation("check user is not registered yet");

      var id = collection.CreateUser(new UserEntity()
      {
        Email = user.Email.ToLower(),
        Name = user.Name.ToLower(),
        Password = CodeGenerator.HashString(user.Password),
        Role = role,
      });
      var token = collection.CreateVerificationCode(user.Email);

      logger.LogInformation(token);
      logger.LogInformation("TODO send token via email");

      var link = configuration["Home_url"] ?? "";
      SendUserLink(configuration["User_link_queue"], new UserLink() { Email = "xxx@example.com", Link = link, Name = "xxx", Usage = "email" });
      return Ok(new ServiceResponse()
      {
        Code = "user-entity-created",
        Message = "Your account is created successfully",
        Id = id
      });
    }

    /// <summary>
    /// Issue login token.
    /// </summary>
    /// <returns></returns>
    [Route("token")]
    [HttpPost]
    public IActionResult IssueToken()
    {
      string email = Request.Query["email"];
      string username = Request.Query["username"];
      string password = Request.Query["password"];
      string refresh_token = Request.Query["refresh_token"];

      if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(username))
      {
        return BadRequest(new ServiceResponse("empty-account"));
      }

      if (string.IsNullOrEmpty(password) &&
          string.IsNullOrEmpty(refresh_token))
      {
        return BadRequest(new ServiceResponse("empty-password"));
      }

      UserEntity user = collection.GetUser(email);
      if (user == null)
      {
        return BadRequest(new ServiceResponse("empty-user-entity"));
      }

      if (CodeGenerator.HashString(password) != user.Password)
      {
        return BadRequest(new ServiceResponse("invalid-password", user.Email));
      }

      var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
      var token = generator.IssueToken(user);
      var refreshToken = generator.IssueRefreshToken(user.Email, timestamp);

      return Ok(new UserToken()
      {
        Email = email,
        Value = token,
        RefreshToken = refreshToken,
        IssueAt = timestamp,
        ExpireInHours = generator.ExpirationInHour
      });
    }

    /// <summary>
    /// Issue password reset token.
    /// </summary>
    /// <returns></returns>
    [Route("password-token")]
    [HttpPost]
    public IActionResult IssuePasswordToken([FromQuery] string email)
    {
      if (string.IsNullOrEmpty(email))
      {
        return BadRequest(new ServiceResponse("empty-email"));
      }

      var user = collection.GetUser(email);
      if (user == null)
      {
        return BadRequest(new ServiceResponse("empty-user-entity", email));
      }

      var usage = "reset-password";
      var date = DateTime.UtcNow;
      string token = CodeGenerator.HashString(email.ToLower() + date.Millisecond.ToString() + CodeGenerator.GenerateDigitalCode(6));
      var payload = new TokenPayload()
      {
        Usage = usage,
        Token = token,
        Exp = date.AddHours(1)
      };
      new EventCollection(client, configuration).AppendEventLog(new EventEntity()
      {
        Name = "Issue-Email-Token",
        UserEmail = email,
        Email = email,
        Payload = JsonConvert.SerializeObject(payload),
        Date = date,
      });
      logger.LogInformation(token);

      var link = configuration["Home_url"] ?? "";
      SendUserLink(configuration["User_link_queue"], new UserLink() { Link = link, Usage = "password" });

      return Ok(new ServiceResponse("password-reset-email-sent", user.Email.ToString(), "Email is sent to you"));
    }

    /// <summary>
    /// Update password with reset token.
    /// </summary>
    /// <returns></returns>
    [Route("password")]
    [HttpPut]
    public IActionResult UpdatePassword([FromBody] UserPassword body)
    {
      Request.Headers.TryGetValue("x-cloud77-onetime-token", out var token);

      if (string.IsNullOrEmpty(token))
      {
        return BadRequest();
      }

      var state = collection.UpdateUser(body.Email, CodeGenerator.HashString(body.Password), token);
      if (state)
      {
        return Ok(new ServiceResponse("user-password-updated", "", "password is reset"));
      }

      return BadRequest();
    }

    /// <summary>
    /// Verify user email with token.
    /// </summary>
    /// <returns></returns>
    [Route("verification")]
    [HttpPut]
    public IActionResult VerifyEmail([FromQuery] string email)
    {
      logger.LogInformation(ValidateEmail(email).ToString());
      Request.Headers.TryGetValue("x-cloud77-onetime-token", out var token);
      if (!string.IsNullOrEmpty(token))
      {
        logger.LogInformation(token.ToString());
      }

      var payloads = collection.GetTokenPayloads(email);
      if (payloads == null || !payloads.Any())
      {
        return BadRequest(new ServiceResponse("invalid-token", "", "verification token not exists"));
      }

      var payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year > 1);
      if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
      {
        // expired
        return BadRequest(new ServiceResponse("invalid-token", "", "verification token expires"));
      }

      payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year == 1);
      if (payload != null)
      {
        return BadRequest(new ServiceResponse("invalid-token", "", "verification token is used, You are already confirmed"));
      }

      // update user confirmed
      collection.UpdateUser(email, true, token);

      return Ok(new ServiceResponse("user-email-verified", "", "Your account is confirmed"));
    }

    private bool ValidateEmail(string email)
    {
      string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
      return Regex.IsMatch(email, pattern);
    }

    private void SendUserLink(string queue, UserLink link)
    {
      var message = JsonConvert.SerializeObject(link);
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
