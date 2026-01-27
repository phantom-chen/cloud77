using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Utility;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;
using System.Text.RegularExpressions;
using UserService.Collections;
using UserService.Models;
using Cloud77.Abstractions;
using ServiceStack.Script;

namespace UserService.Controllers
{
    /// <summary>
    /// Help create user account, user login, reset password, verify email.
    /// </summary>
    [Route("sso/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase, IDisposable
    {
        private readonly ILogger<UsersController> logger;
        private readonly ConnectionFactory factory;
        private readonly TextLoggingModel textLogging;
        private readonly string defaultRole;
        private readonly UserCollection users;
        private readonly EventCollection events;
        private readonly string ssoURL;
        private readonly string userLinkQueue;

        public UsersController(
            ILogger<UsersController> logger,
            IConfiguration configuration,
            MongoClient client,
            ConnectionFactory factory
            )
        {
            defaultRole = configuration["Default_role"] ?? "";
            this.logger = logger;
            this.factory = factory;
            textLogging = new TextLoggingModel();
            users = new UserCollection(client, configuration);
            events = new EventCollection(client, configuration);
            ssoURL = configuration["SSO_url"] ?? "";
            userLinkQueue = configuration["User_link_queue"] ?? "";
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

            UserEntity user;
            if (!string.IsNullOrEmpty(email))
            {
                user = users.GetUser(email);
            } else if (!string.IsNullOrEmpty(username))
            {
                user = users.GetUserByName(username);
            }
            else
            {
                return BadRequest(new EmptyAccount());
            }

            if (user == null)
            {
                textLogging.PushLog($"Users: user entity not found for email '{email}' or name '{username}'", true);
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
            user.Email = user.Email.ToLower().Trim();
            user.Name = user.Name.ToLower().Trim();

            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Name))
            {
                textLogging.PushLog("Users: empty email or username in create user request");
                return BadRequest(new EmptyAccount());
            }

            if (string.IsNullOrEmpty(user.Password))
            {
                textLogging.PushLog("Users: empty password in create user request");
                return BadRequest(new EmptyPassword());
            }

            if (!UserUtility.IsEmailFormat(user.Email))
            {
                textLogging.PushLog($"Users: {user.Email} is not in correct email format");
                return BadRequest(new BadEmailFormat(user.Email));
            }

            var minLength = 10;
            if (!UserUtility.PasswordIsComplex(user.Password, minLength))
            {
                logger.LogWarning("password is a bit short");
                logger.LogDebug("check password complexity");
                textLogging.PushLog($"Users: password is not complex enough");
                return BadRequest(new WeakPassword($"it should be longer than {minLength} characters and contain upper case, lower case, digit and special character"));
            }

            var role = defaultRole;
            if (user.Name == "admin")
            {
                role = "Administrator";
                textLogging.PushLog($"Users: grant the administrator role to the user {user.Name}", true);
            }

            var entity = users.GetUser(user.Email);
            if (entity != null)
            {
                textLogging.PushLog($"Users: user entity not found for email '{user.Email}'", true);
                return BadRequest(new UserExisting(user.Email, ""));
            }
            entity = users.GetUserByName(user.Name);
            if (entity != null)
            {
                textLogging.PushLog($"Users: user entity not found for name '{user.Name}'", true);
                return BadRequest(new UserExisting("", user.Name));
            }

            var id = users.CreateUser(new UserEntity()
            {
                Email = user.Email.ToLower(),
                Name = user.Name.ToLower(),
                Password = CodeGenerator.HashString(user.Password),
                Role = role,
            });

            textLogging.PushLog($"Users: user entity {user.Email} is created with id {id}");
 
            if (string.IsNullOrEmpty(id))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError($"fail to create user for email {user.Email.ToLower()}"));
            }

            var date = DateTime.UtcNow;
            var log = new EventEntity()
            {
                Name = "Create-User",
                UserEmail = user.Email,
                Email = user.Email,
                Date = date,
            };
            events.AppendEventLog(log);

            var token = CodeGenerator.GenerateVerificationCode(user.Email, date);

            var urlPath = $"confirm-email?email={user.Email}&token={token}";
            var link = $"{ssoURL}/{urlPath}";  

            logger.LogDebug($"the path to confirm email is '{urlPath}'");
            textLogging.PushLog($"Users: email verification link for user {user.Email} is {link}");

            SendUserLink(userLinkQueue, new UserLink() { Email = user.Email, Link = link, Name = user.Name, Usage = "email" });

            return Created("", new UserCreated(id, user.Email));
        }

        /// <summary>
        /// Update password with reset token.
        /// </summary>
        /// <returns></returns>
        [Route("password")]
        [HttpPut]
        public IActionResult UpdatePassword([FromBody] UserPassword body)
        {
            Request.Headers.TryGetValue("x-onetime-token", out var token);
            Request.Headers.TryGetValue("x-onetime-token-id", out var tokenId);

            if (string.IsNullOrEmpty(tokenId))
            {
                return BadRequest("token id is empty");
            }

            if (string.IsNullOrEmpty(token))
            {
                textLogging.PushLog("Users: empty one time token in reset password request");
                return BadRequest(new EmptyOneTimeToken());
            }
            if (string.IsNullOrEmpty(body.Password))
            {
                textLogging.PushLog("Users: empty password in reset password request");
                return BadRequest(new EmptyPassword());
            }
            if (string.IsNullOrEmpty(body.Email))
            {
                textLogging.PushLog("Users: empty email in reset password request");
                return BadRequest(new EmptyEmail());
            }

            // get the event by token id (event id)
            var eventEntity = events.GetEventLog(tokenId.ToString());
            if (eventEntity == null)
            {
                return BadRequest("token is not found by the id");
            }

            var user = users.GetUser(body.Email);
            if (user == null)
            {
                textLogging.PushLog("Users: user entity not found for email '" + body.Email + "'", true);
                return BadRequest(new UserNotExisting(body.Email));
            }

            if (!UserUtility.PasswordIsComplex(body.Password, minLength: 10))
            {
                textLogging.PushLog("Users: password is not complex enough in reset password request");
                return BadRequest(new WeakPassword("it should be longer than 10 characters and contain upper case, lower case, digit and special character"));
            }

            var payload = JsonConvert.DeserializeObject<TokenPayload>(eventEntity.Payload);
            if (payload.Token != token.ToString())
            {
                textLogging.PushLog("Users: no one time token found for user '" + body.Email + "'", true);
                return BadRequest(new OneTimeTokenNotFound("Password Reset"));
            }

            if (!string.IsNullOrEmpty(payload.Consumed))
            {
                textLogging.PushLog("Users: one time token used for user '" + body.Email + "' with token '" + token + "'", true);
                return BadRequest(new OneTimeTokenUsed("Password Reset"));
            }

            if (payload != null && DateTime.Compare((DateTime)payload.Expiration, DateTime.UtcNow) < 0)
            {
                textLogging.PushLog("Users: one time token expired for user '" + body.Email + "' with token '" + token + "'", true);
                return BadRequest(new OneTimeTokenExpired("Password Reset"));
            }

            var state = users.UpdatePassword(body.Email, CodeGenerator.HashString(body.Password));
            if (state)
            {
                // update token consumed
                payload.Consumed = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                events.UpdateEventLog(tokenId, JsonConvert.SerializeObject(payload));
                textLogging.PushLog("Users: successfully reset password for user '" + body.Email + "'");
                events.AppendEventLog(new EventEntity()
                {
                    Name = "Reset-Password",
                    UserEmail = body.Email,
                    Email = body.Email,
                    Payload = token,
                    Date = DateTime.UtcNow
                });
                return Ok(new UserPasswordReset(body.Email));
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to reset password"));
        }

        /// <summary>
        /// Verify user email with token.
        /// </summary>
        /// <returns></returns>
        [Route("verification")]
        [HttpPut]
        public IActionResult VerifyEmail([FromQuery] string email)
        {
            Request.Headers.TryGetValue("x-onetime-token", out var token);
            Request.Headers.TryGetValue("x-onetime-token-id", out var tokenId);

            if (string.IsNullOrEmpty(tokenId) || string.IsNullOrEmpty(token))
            {
                return BadRequest("token id or token is empty");
            }

            var eventEntity = events.GetEventLog(tokenId.ToString());
            if (eventEntity == null)
            {
                return BadRequest("token is not found by the id");
            }

            var payload = JsonConvert.DeserializeObject<TokenPayload>(eventEntity.Payload);
            if (payload == null)
            {
                textLogging.PushLog($"Users: no one time token found for user {email}", true);
                return BadRequest(new OneTimeTokenNotFound("Email Verification"));
            }

            if (payload.Token != token.ToString())
            {
                return BadRequest("token mismatch");
            }

            if (!string.IsNullOrEmpty(payload.Consumed))
            {
                return BadRequest("token is used");
            }

            if (payload != null && DateTime.Compare((DateTime)payload.Expiration, DateTime.UtcNow) < 0)
            {
                textLogging.PushLog("Users: one time token expired for user " + email + " with token " + token, true);
                return BadRequest(new OneTimeTokenExpired("Email Verification"));
            }

            var user = users.GetUser(email);
            if (user == null)
            {
                textLogging.PushLog("Users: user entity not found for email " + email, true);
                return BadRequest(new UserNotExisting(email));
            }

            if (user.Confirmed != null && (bool)user.Confirmed)
            {
                textLogging.PushLog("Users: user email " + email + " is already verified", true);
                return BadRequest(new UserHasConfirmed(email));
            }

            var ack = users.ConfirmUser(email, true);

            if (ack)
            {
                payload.Consumed = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                events.UpdateEventLog(tokenId, JsonConvert.SerializeObject(payload));
                textLogging.PushLog("Users: successfully verify email for user " + email);
                events.AppendEventLog(new EventEntity()
                {
                    Name = "Verify-Email",
                    UserEmail = email,
                    Email = email,
                    Payload = token,
                    Date = DateTime.UtcNow
                });
            }

            return Ok(new UserConfirmed(email));
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
