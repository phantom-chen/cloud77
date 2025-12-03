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
        private readonly TextLoggingModel model;
        private readonly string defaultRole;
        private readonly UserCollection users;
        private readonly EventCollection events;
        private readonly string ssoURL;
        private readonly string userLinkQueue;

        public UsersController(
            ILogger<UsersController> logger,
            IConfiguration configuration,
            MongoClient client,
            ConnectionFactory factory,
            TextLoggingModel model
            )
        {
            defaultRole = configuration["Default_role"] ?? "";
            this.logger = logger;
            this.factory = factory;
            this.model = model;
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
                logger.LogDebug($"cannot find user entity for user {email}");
                model.AppendLog($"cannot find user entity for user {email}");
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

            logger.LogDebug($"{user.Email} is in correct email format: {ValidateEmail(user.Email).ToString()}");
            model.AppendLog($"{user.Email} is in correct email format: {ValidateEmail(user.Email).ToString()}");

            var role = defaultRole;
            if (user.Name == "admin")
            {
                role = "Administrator";
            }

            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Name))
            {
                return BadRequest(new EmptyAccount());
            }

            if (string.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new EmptyPassword());
            }

            var entity = users.GetUser(user.Email);
            if (entity != null)
            {
                logger.LogWarning($"user {user.Email} already exists");
                model.AppendLog($"user {user.Email} already exists");
                return BadRequest(new UserExisting(user.Email, ""));
            }
            entity = users.GetUserByName(user.Name);
            if (entity != null)
            {
                logger.LogWarning($"user {user.Email} already exists");
                model.AppendLog($"user {user.Email} already exists");
                return BadRequest(new UserExisting("", user.Name));
            }

            if (user.Password.Length < 6)
            {
                logger.LogWarning("password is a bit short");
                model.AppendLog("password is a bit short");
            }

            logger.LogDebug("check password complexity");
            model.AppendLog("check password complexity");

            var id = users.CreateUser(new UserEntity()
            {
                Email = user.Email.ToLower(),
                Name = user.Name.ToLower(),
                Password = CodeGenerator.HashString(user.Password),
                Role = role,
            });

            logger.LogDebug($"user entity {user.Email} is created with id {id}");
            model.AppendLog($"user entity {user.Email} is created with id {id}");

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

            var token = events.CreateVerificationCode(user.Email);
            // {sso_url}/confirm-email?email=xxx&token=xxx
            var link = $"{ssoURL}/confirm-email?email={user.Email}&token={token}";  

            logger.LogDebug($"the email confirm link is {link}");
            model.AppendLog($"the email confirm link is {link}");

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
            logger.LogDebug($"one time token in request is {token}");
            model.AppendLog($"one time token in request is {token}");

            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new EmptyOneTimeToken());
            }
            if (string.IsNullOrEmpty(body.Password))
            {
                return BadRequest(new EmptyPassword());
            }
            if (string.IsNullOrEmpty(body.Email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = users.GetUser(body.Email);
            if (user == null)
            {
                logger.LogDebug($"cannot find user entity for user {body.Email}");
                model.AppendLog($"cannot find user entity for user {body.Email}");
                return BadRequest(new UserNotExisting(body.Email));
            }

            var payloads = events.GetTokenPayloads(body.Email.Trim().ToLower());
            if (payloads == null || !payloads.Any())
            {
                logger.LogDebug("no one time token found for user " + body.Email);
                model.AppendLog("no one time token found for user " + body.Email);
                return BadRequest(new OneTimeTokenNotFound("Password Reset"));
            }

            payloads = payloads.Where(p => p.Token == token && p.Usage == "reset-password");
            if (payloads == null || !payloads.Any())
            {
                logger.LogDebug("no one time token found for user " + body.Email + " with token " + token);
                model.AppendLog("no one time token found for user " + body.Email + " with token " + token);
                return BadRequest(new OneTimeTokenNotFound("Password Reset"));
            }

            var payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year > 1);
            if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
            {
                // expired
                logger.LogDebug("one time token expired for user " + body.Email + " with token " + token);
                model.AppendLog("one time token expired for user " + body.Email + " with token " + token);
                return BadRequest(new OneTimeTokenExpired("Password Reset"));
            }

            payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year == 1);
            if (payload != null)
            {
                logger.LogDebug("one time token used for user " + body.Email + " with token " + token);
                model.AppendLog("one time token used for user " + body.Email + " with token " + token);
                return BadRequest(new OneTimeTokenUsed("Password Reset"));
            }
            var state = users.UpdatePassword(body.Email, CodeGenerator.HashString(body.Password));
            if (state)
            {
                logger.LogDebug("password reset for user " + body.Email);
                model.AppendLog("password reset for user " + body.Email);
                events.AppendEventLog(new EventEntity()
                {
                    Name = "Reset-Password",
                    UserEmail = body.Email,
                    Email = body.Email,
                    Payload = JsonConvert.SerializeObject(new TokenPayload()
                    {
                        Token = token,
                        Usage = "reset-password",
                    }),
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
            logger.LogDebug($"one time token in request is {token}");
            model.AppendLog($"one time token in request is {token}");

            var payloads = events.GetTokenPayloads(email);
            if (payloads == null || !payloads.Any())
            {
                logger.LogDebug($"cannot find user entity for user {email}");
                model.AppendLog($"cannot find user entity for user {email}");
                return BadRequest(new OneTimeTokenNotFound("Email Verification"));
            }

            payloads = payloads.Where(p => p.Token == token && p.Usage == "verify-email");
            if (payloads == null || !payloads.Any())
            {
                logger.LogDebug("no one time token found for user " + email + " with token " + token);
                model.AppendLog("no one time token found for user " + email + " with token " + token);
                return BadRequest(new OneTimeTokenNotFound("Email Verification"));
            }

            var payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year > 1);

            if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
            {
                // expired
                logger.LogDebug("one time token expired for user " + email + " with token " + token);
                model.AppendLog("one time token expired for user " + email + " with token " + token);
                return BadRequest(new OneTimeTokenExpired("Email Verification"));
            }

            payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year == 1);
            if (payload != null)
            {
                logger.LogDebug("one time token used for user " + email + " with token " + token);
                model.AppendLog("one time token used for user " + email + " with token " + token);
                return BadRequest(new OneTimeTokenUsed("Email Verification"));
            }

            // update user confirmed
            var ack = users.ConfirmUser(email, true);

            if (ack)
            {
                logger.LogDebug("email verified for user " + email);
                model.AppendLog("email verified for user " + email);
                events.AppendEventLog(new EventEntity()
                {
                    Name = "Verify-Email",
                    UserEmail = email,
                    Email = email,
                    Payload = JsonConvert.SerializeObject(new TokenPayload()
                    {
                        Token = token,
                        Usage = "verify-email",
                    }),
                    Date = DateTime.UtcNow
                });
            }

            return Ok(new UserConfirmed(email));
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

        public void Dispose()
        {
            model.Commit();
        }
    }
}
