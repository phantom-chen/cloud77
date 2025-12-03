using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;
using UserService.Collections;
using UserService.Models;

namespace UserService.Controllers
{
    [Route("sso/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase, IDisposable
    {
        private readonly ILogger<TokensController> logger;
        private readonly TextLoggingModel model;
        private readonly ConnectionFactory factory;
        private readonly UserCollection users;
        private readonly EventCollection events;
        private readonly TokenGenerator generator;
        private readonly string ssoURL;
        private readonly string userLinkQueue;

        public TokensController(
            ILogger<TokensController> logger,
            TextLoggingModel model,
            IConfiguration configuration,
            MongoClient client,
            ConnectionFactory factory
            )
        {
            this.logger = logger;
            this.model = model;
            this.factory = factory;
            users = new UserCollection(client, configuration);
            events = new EventCollection(client, configuration);
            generator = new TokenGenerator(configuration);
            ssoURL = configuration["SSO_url"] ?? "";
            userLinkQueue = configuration["User_link_queue"] ?? "";
        }

        [HttpPost]
        public IActionResult IssueToken([FromBody] UserPassword body)
        {
            string email = body.Email;
            string username = body.Name;
            string password = body.Password;

            Request.Headers.TryGetValue("x-refresh-token", out var refreshTokenHeader);
            string refresh_token = refreshTokenHeader.ToString();
            if (!string.IsNullOrEmpty(refresh_token))
            {
                logger.LogDebug($"find refresh token in request for user {email}");
                model.AppendLog($"find refresh token in request for user {email}");
            }

            if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(username))
            {
                return BadRequest(new EmptyAccount());
            }

            if (string.IsNullOrEmpty(password) &&
                string.IsNullOrEmpty(refresh_token))
            {
                return BadRequest(new EmptyPassword());
            }

            UserEntity user = users.GetUser(email);
            if (user == null)
            {
                logger.LogDebug($"cannot find user entity for user {email}");
                model.AppendLog($"cannot find user entity for user {email}");
                return BadRequest(new UserNotExisting(body.Email));
            }

            if (CodeGenerator.HashString(password) != user.Password)
            {
                logger.LogDebug($"password incorrect for user {email}");
                model.AppendLog($"password incorrect for user {email}");
                return BadRequest(new InCorrectPassword(user.Email));
            }

            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var token = generator.IssueToken(user);
            var refreshToken = generator.IssueRefreshToken(user.Email, timestamp);

            logger.LogDebug($"issue token for user {email}");
            model.AppendLog($"issue token for user {email}");

            return Ok(new UserToken()
            {
                Email = email,
                Value = token,
                RefreshToken = refreshToken,
                IssueAt = timestamp,
                ExpireInHours = generator.ExpirationInHour
            });
        }

        [HttpPost]
        [Route("password")]
        public IActionResult IssuePasswordToken([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = users.GetUser(email);
            if (user == null)
            {
                logger.LogDebug($"cannot find user entity for user {email}");
                model.AppendLog($"cannot find user entity for user {email}");
                return BadRequest(new UserNotExisting(email));
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

            events.AppendEventLog(new EventEntity()
            {
                Name = "Issue-Email-Token",
                UserEmail = email,
                Email = email,
                Payload = JsonConvert.SerializeObject(payload),
                Date = date,
            });

            logger.LogDebug($"issue password reset token for user {email}");
            model.AppendLog($"issue password reset token for user {email}");

            // {sso_url}/reset-password?email=xxx&token=xxx
            var link = $"{ssoURL}/reset-password?email={user.Email}&token={token}";
            logger.LogDebug($"the password reset link is {link}");
            model.AppendLog($"the password reset link is {link}");

            SendUserLink(userLinkQueue, new UserLink() { Email = email, Link = link, Name = "", Usage = "password" });
            return Ok(new OneTimeTokenCreated(email, "Password Reset"));
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

        public void Dispose()
        {
            model.Commit();
        }
    }
}
