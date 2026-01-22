using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserService.Collections;
using UserService.Models;
using Cloud77.Abstractions;

namespace UserService.Controllers
{
    [Route("sso/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase, IDisposable
    {
        private readonly ILogger<TokensController> logger;
        private readonly IConfiguration configuration;
        private readonly TextLoggingModel textLogging = new TextLoggingModel();
        private readonly ConnectionFactory factory;
        private readonly UserCollection users;
        private readonly EventCollection events;
        private readonly TokenGenerator generator;
        private readonly string ssoURL;
        private readonly string userLinkQueue;

        public TokensController(
            ILogger<TokensController> logger,
            IConfiguration configuration,
            MongoClient client,
            ConnectionFactory factory
            )
        {
            this.logger = logger;
            this.configuration = configuration;
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
                textLogging.PushLog($"find refresh token in request for user {email}");

                return BadRequest(new NotImplementedException("refresh token flow is not implemented yet"));
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
                textLogging.PushLog($"cannot find user entity for user {email}");
                return BadRequest(new UserNotExisting(body.Email));
            }

            if (!string.IsNullOrEmpty(refresh_token))
            {
                // validate refresh token
                // get the timestamp, salt from refresh token
                // check the token validity

                if (string.IsNullOrEmpty(email))
                {
                    return BadRequest();
                }

                var d = generator.ValidateRefreshToken(email, refresh_token);
                //d["timestamp"];
                //d["expiration"];
            }
            else
            {
                if (CodeGenerator.HashString(password) != user.Password)
                {
                    logger.LogDebug($"password incorrect for user {email}");
                    textLogging.PushLog($"password incorrect for user {email}");
                    return BadRequest(new InCorrectPassword(user.Email));
                }
            }

            // password or refresh token is valid
            var date = DateTime.UtcNow;
            var timestamp = date.ToString("yyyyMMddHHmmss");
            var expiration = date.AddDays(14).ToString("yyyyMMddHHmmss");

            // salt length is 16

            // access token valid for several minutes
            // user entity (email, role, name, confirmed), salt, timestamp, expiration (10 minutes)

            // refresh token salt
            // refresh token valid for several days

            // email, salt, timestamp, expiration (7 days)

            // user folder
            // lock.json (prevent user requests), who locked and when, reason, unlock code, expiration
            // {"manager":"xxx@example.com","timestamp":"xxx","reason":"too many requests","expiration":""} empty means permantent lock
            // input wrong password too many times

            // how to lock the user, disable user request via tokens?
            // check token salts are enabled

            var salt = new TokenSalt() { Value = CodeGenerator.GenerateCode(16), Expiration = expiration };
            var token = generator.IssueToken(user);
            var refreshToken = generator.IssueRefreshToken(user.Email, timestamp, expiration, salt.Value);

            // save salt to user folder
            // 20260101120030.json {timestamp}.json
            // salt value=xxx expiration=xxx

            logger.LogDebug($"issue token for user {email}");
            textLogging.PushLog($"issue token for user {email}");

            return Ok(new UserToken()
            {
                Email = email,
                Value = token,
                RefreshToken = refreshToken,
                IssueAt = timestamp,
                ExpireInHours = generator.ExpirationInHour
            });
        }

        [HttpGet]
        [Route("validation")]
        public IActionResult ValidateToken()
        {
            string? authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader is null || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new TokenNotProvided());
            }

            string token = authHeader.Substring("Bearer ".Length).Trim();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Issuer"],
                ValidAudience = configuration["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecurityKey"] ?? ""))
            };

            var handler = new JwtSecurityTokenHandler();

            try
            {
                ClaimsPrincipal principal = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                // exception throws for invalid token

                // Check expiration explicitly (optional, as ValidateToken does this by default)
                if (validatedToken is JwtSecurityToken jwtToken
                  && jwtToken.ValidTo < DateTime.UtcNow)
                {
                    // expired token
                }

                return Ok(new TokenIsValid(((JwtSecurityToken)validatedToken).ValidTo));
            }
            catch (Exception ex)
            {
                logger.LogInformation(ex.Message);
                if (ex is SecurityTokenExpiredException)
                {
                    textLogging.PushLog(ex.Message);
                    return BadRequest(new TokenExpired());
                }

                return BadRequest(new NotJWTToken());
            }
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
                textLogging.PushLog($"cannot find user entity for user {email}");
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
            textLogging.PushLog($"issue password reset token for user {email}");

            // {sso_url}/reset-password?email=xxx&token=xxx
            var link = $"{ssoURL}/reset-password?email={user.Email}&token={token}";
            logger.LogDebug($"the password reset link is {link}");
            textLogging.PushLog($"the password reset link is {link}");

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
            textLogging.Commit();
        }
    }
}
