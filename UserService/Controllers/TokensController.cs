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

            if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(username))
            {
                textLogging.PushLog($"Tokens: no email or user name provided in request");
                return BadRequest(new EmptyAccount());
            }

            if (string.IsNullOrEmpty(password) &&
                string.IsNullOrEmpty(refresh_token))
            {
                textLogging.PushLog($"Tokens: no password or refresh token provided in request");
                return BadRequest(new EmptyPassword());
            }

            UserEntity user;
            if (string.IsNullOrEmpty(email))
            {
                user = users.GetUserByName(username);
                if (user != null)
                {
                    email = user.Email;
                }
            }
            else
            {
                user = users.GetUser(email);
            }

            if (user == null)
            {
                textLogging.PushLog($"Tokens: user entity not found for email '{email}' or name '{username}'", true);
                return BadRequest(new UserNotExisting(body.Email));
            }

            var method = "";
            var userData = new UserDataModel(email);
            TokenSalt? previousSalt = null;
            if (!string.IsNullOrEmpty(refresh_token))
            {
                var d = generator.ValidateRefreshToken(email, refresh_token);
                previousSalt = userData.GetRefreshTokenSalt(d["timestamp"] ?? "");
                if (previousSalt.Value != d["salt"])
                {
                    return BadRequest(new RefreshTokenSaltMismatch());
                }
                if (email != d["email"])
                {
                    return BadRequest(new RefreshTokenEmailMismatch());
                }

                if (userData.RefreshTokenSaltIsExpired(previousSalt))
                {
                    return BadRequest(new RefreshTokenExpired());
                }

                if (userData.RefreshTokenSaltIsUsed(previousSalt))
                {
                    return BadRequest(new RefreshTokenUsed());
                }

                method = "refresh token";
                textLogging.PushLog($"Tokens: refresh token is valid for user {email}");
            }
            else
            {
                if (CodeGenerator.HashString(password) != user.Password)
                {
                    textLogging.PushLog($"Tokens: password is incorrect for user {email}");
                    return BadRequest(new InCorrectPassword(user.Email));
                }

                method = "password";
                textLogging.PushLog($"Tokens: password is correct for user {email}");
            }

            textLogging.PushLog($"Tokens: user {email} logins successfully via {method}");

            var saltLength = Convert.ToInt16(configuration["Token_salt_length"] ?? "8");
            var date = DateTime.UtcNow;
            var timestamp = date.ToString("yyyyMMddHHmmss");

            var accessSaltExpiredDate = date.AddMinutes(Convert.ToInt16(configuration["Token_expiration_minute"] ?? "10"));
            var accessSalt = new TokenSalt() { Value = CodeGenerator.GenerateCode(saltLength), Expiration = accessSaltExpiredDate.ToString("yyyyMMddHHmmss") };

            var refreshSaltExpiredDate = date.AddMinutes(Convert.ToInt16(configuration["Token_expiration_day"] ?? "3"));
            var refreshSalt = new TokenSalt() { Value = CodeGenerator.GenerateCode(saltLength), Expiration = refreshSaltExpiredDate.ToString("yyyyMMddHHmmss") };

            var token = generator.IssueToken(user, accessSalt.Value, date, accessSaltExpiredDate);
            var refreshToken = generator.IssueRefreshToken(user.Email, refreshSalt.Value, date, refreshSaltExpiredDate);

            textLogging.PushLog($"Tokens: issue access token and refresh token for user {email}");

            var loginMethod = string.IsNullOrEmpty(password) ? LoginMethod.RefreshToken : LoginMethod.Password;
            userData.SaveAccessTokenHistory(timestamp, accessSalt);
            userData.SaveRefreshTokenHistory(timestamp, loginMethod, refreshSalt, previousSalt);

            textLogging.PushLog($"Tokens: save access token salt and refresh token salt for user {email}");

            return Ok(new UserToken()
            {
                Email = email,
                Value = token,
                RefreshToken = refreshToken,
                IssueAt = timestamp,
                ExpireInHours = 0
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
                textLogging.PushLog($"Tokens: user entity not found for email '{email}'", true);
                return BadRequest(new UserNotExisting(email));
            }

            // get all events for email token and reset password
            // get payloads
            // check is payload is created in minutes

            var logs = events.GetEventLogs(email);
            logs = logs.Where(l => l.Name == "Issue-Email-Token");
            logs = logs.Where(l => l.Payload.Contains("reset-password"));

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

            var urlPath = $"reset-password?email={user.Email}&token={token}";
            var link = $"{ssoURL}/{urlPath}";

            logger.LogDebug($"the path to reset password is ‘{urlPath}‘");
            textLogging.PushLog($"Tokens: password reset link for user {email} is {link}");

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
