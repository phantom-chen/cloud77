using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using System.Reflection;
using System.Text.RegularExpressions;
using UserService.Collections;

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
        private readonly string defaultRole;
        private readonly UserCollection collection;
        private readonly TokenGenerator generator;

        public UsersController(
            ILogger<UsersController> logger,
            IConfiguration configuration,
            MongoClient client
            )
        {
            this.defaultRole = configuration["Role_default"] ?? "";
            this.logger = logger;
            this.configuration = configuration;
            this.client = client;
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

        [Route("ping")]
        [HttpGet]
        public IActionResult TestEmail([FromQuery] string usage)
        {
            var _collection = new SettingCollection(client, configuration);
            var settings = _collection.Get();
            var link = configuration["Home_url"];
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            var content = new EmailContentEntity()
            {
                Addresses = new string[] {},
                Body = "hello",
                Subject = "hello",
                IsBodyHtml = false
            };
            if (usage == "email" && System.IO.File.Exists(Path.Combine(dir, "data", "email-confirm.html")))
            {
                var html = System.IO.File.ReadAllText(Path.Combine(dir, "data", "email-confirm.html"));
                content = new EmailContentEntity()
                {
                    Addresses = new string[] { },
                    Subject = "Confirm user email",
                    Body = html.Replace("{username}", "xxx").Replace("{email}", "xxx").Replace("{link}", link),
                    IsBodyHtml = true
                };

            }
            if (usage == "password" && System.IO.File.Exists(Path.Combine(dir, "data", "password-reset.html")))
            {
                var html = System.IO.File.ReadAllText(Path.Combine(dir, "data", "password-reset.html"));
                content = new EmailContentEntity()
                {
                    Addresses = new string[] { },
                    Subject = "Reset user password",
                    Body = html.Replace("{link}", link),
                    IsBodyHtml = true
                };

            }
            
            if (content.Addresses.Count() > 0)
            {
                Task.Factory.StartNew(() =>
                {
                    try
                    {
                        var client = new MailClient(settings, !string.IsNullOrEmpty(configuration["Smtp_client_enable"]));
                        client.Send(content);
                    }
                    catch (Exception exception)
                    {
                        logger.LogError("fail to send mail by AliCloud");
                        logger.LogError(exception.ToString());
                    }
                });
            }

            return Ok();
        }
    }
}
