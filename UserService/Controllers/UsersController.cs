using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Reflection;
using System;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Text;
using MongoDB.Driver;
using UserService.Contexts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserServiceManager service;
        private readonly IConfiguration configuration;
        private readonly ILogger<UsersController> logger;
        private readonly CacheContext cache;
        public UsersController(MongoClient client, IConfiguration configuration, ILogger<UsersController> logger)
        {
            var database = new UserDatabase(client.GetDatabase(Cloud77Utility.DatabaseName));
            service = new UserServiceManager(database);
            this.configuration = configuration;
            this.logger = logger;
            cache = new CacheContext(configuration);
        }

        [HttpGet]
        [Route("roles")]
        public IActionResult GetUserEmail()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var exp1 = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Expiration);
            var name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            if (email == null) return BadRequest();
            Response.Headers.Append("X-Token-Expiration", exp1.Value);
            return Ok(new UserRole()
            {
                Email = email.Value,
                Name = name.Value,
                Role = role.Value
            });
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string email, [FromQuery] string username)
        {
            if (string.IsNullOrEmpty(email) && string.IsNullOrEmpty(username))
            {
                return BadRequest(new ServiceResponse(
                    "empty-account"));
            }

            UserEntity user = service.GetUser(email, username);
            if (user == null)
            {
                return Ok(new UserEmail()
                {
                    Email = email,
                    Existing = false
                });
            }
            else
            {
                return Ok(new UserEmail()
                {
                    Email = email,
                    Existing = true,
                });
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserPassword body)
        {
            var role = configuration["Role_default"];

            if (string.IsNullOrEmpty(body.Email) || string.IsNullOrEmpty(body.Name))
            {
                return BadRequest(new ServiceResponse("empty-account"));
            }

            if (string.IsNullOrEmpty(body.Password))
            {
                return BadRequest(new ServiceResponse("empty-password"));
            }

            var email = body.Email.ToLower();
            var user = service.GetUser(email, "");
            if (user != null)
            {
                return BadRequest(new ServiceResponse("existing-user-entity", email));
            }

            if (body.Name == "admin")
            {
                role = "Administrator";
            }

            var id = service.NewUser(email, body.Name.Trim().ToLower(), CodeGenerator.HashString(body.Password), role);
            if (!string.IsNullOrEmpty(id))
            {
                var date = DateTime.UtcNow;
                service.Database.NewEvent(new EventEntity()
                {
                    Name = "Create-User",
                    UserEmail = email,
                    Email = email,
                    Date = date,
                });

                string token = CodeGenerator.HashString(body.Email.ToLower() + date.Millisecond.ToString());
                var usage = "verify-email";
                var payload = new TokenPayload()
                {
                    Usage = usage,
                    Token = token,
                    Exp = date.AddHours(1)
                };
                service.Database.NewEvent(new EventEntity()
                {
                    Name = "Issue-Email-Token",
                    UserEmail = email,
                    Email = email,
                    Payload = JsonConvert.SerializeObject(payload),
                    Date = date,
                });


                var link = $"{configuration["HomeApp"]}/verification?email={email}&token={token}";
                logger.LogDebug(token);
                logger.LogDebug(link);
                var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
                if (System.IO.File.Exists(Path.Combine(dir, "data", "verify-email.html")))
                {
                    var html = System.IO.File.ReadAllText(Path.Combine(dir, "data", "verify-email.html"));
                    var EmailContent = new EmailContentEntity()
                    {
                        Addresses = new string[] { email },
                        Subject = "Email Confirmation",
                        Body = html.Replace("{username}", body.Name.ToLower()).Replace("{email}", email).Replace("{link}", link),
                        IsBodyHtml = true
                    };
                    string message = JsonConvert.SerializeObject(EmailContent);

                    SendMessageToQueue(configuration["Mail_queue"], message);
                }
                else
                {
                    logger.LogDebug("not found html template locally");
                }

                return Ok(new ServiceResponse("user-entity-created", id, "Your account is created successfully"));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to create user"));
            }
        }

        [HttpPut]
        [Route("verification")]
        public IActionResult VerifyUser([FromBody] EmailVerification body)
        {
            // existing, expired, used
            var events = service.Database.GetEvents(body.Email.Trim().ToLower());
            if (events == null || !events.Any())
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "verification token not exists"));
            }

            var payloads = events.Select(e => JsonConvert.DeserializeObject<TokenPayload>(e.Payload)).Where(p => p.Token == body.Token && p.Usage == "verify-email");
            if (payloads == null || !payloads.Any())
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "verification token not exists"));
            }

            var payload = payloads.FirstOrDefault(x => x.Token == body.Token && x.Exp.Year > 1);
            if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
            {
                // expired
                return BadRequest(new ServiceResponse("invalid-token", "", "verification token expires"));
            }

            payload = payloads.FirstOrDefault(x => x.Token == body.Token && x.Exp.Year == 1);
            if (payload != null)
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "verification token is used, You are already confirmed"));
            }

            service.Database.NewEvent(new EventEntity()
            {
                Name = "Verify-Email",
                UserEmail = body.Email,
                Email = body.Email,
                Payload = JsonConvert.SerializeObject(new TokenPayload()
                {
                    Token = body.Token,
                    Usage = "verify-email",
                }),
                Date = DateTime.UtcNow
            });
            // update user confirmed
            // New Event
            return Ok(new ServiceResponse("user-email-verified", "", "Your account is confirmed"));
        }

        [HttpGet]
        [Route("tokens")]
        public IActionResult CreateLoginToken()
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
            UserEntity user = service.GetUser(email, username);
            if (user == null)
            {
                return BadRequest(new ServiceResponse("empty-user-entity"));
            }
            bool isValid = CodeGenerator.HashString(password) == user.Password;
            if (!isValid)
            {
                return BadRequest(new ServiceResponse("invalid-password", user.Email));
            }
            // token keys
            var key = Encoding.UTF8.GetBytes(configuration["SecurityKey"]);
            var expirationInHour = Convert.ToInt16(configuration["Token_expiration_hour"] ?? "24");
            
            bool accountIsAuthenticated;
            if (!string.IsNullOrEmpty(refresh_token))
            {
                accountIsAuthenticated = ValidateRefreshToken(email, refresh_token);
                if (!accountIsAuthenticated)
                {
                    return BadRequest(new ServiceResponse("invalid-password", user.Email));
                }
            }

            // issue token
            var token = IssueToken(key, configuration["Issuer"], configuration["Audience"], expirationInHour, user);
            return Ok(token);
        }

        [HttpPost]
        [Route("password-tokens")]
        public IActionResult CreatePasswordToken([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new ServiceResponse("empty-email"));
            }

            var user = service.GetUser(email, "");
            if (user == null)
            {
                return BadRequest(new ServiceResponse("empty-user-entity", email));
            }

            var usage = "reset-password";
            var date = DateTime.UtcNow;
            string token = CodeGenerator.HashString(email.ToLower() + date.Millisecond.ToString());
            var payload = new TokenPayload()
            {
                Usage = usage,
                Token = token,
                Exp = date.AddHours(1)
            };
            service.Database.NewEvent(new EventEntity()
            {
                Name = "Issue-Email-Token",
                UserEmail = email,
                Email = email,
                Payload = JsonConvert.SerializeObject(payload),
                Date = date,
            });

            var link = $"{configuration["HomeApp"]}/password?email={email}&token={token}";
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            if (System.IO.File.Exists(Path.Combine(dir, "data", "reset-pwd.html")))
            {
                var html = System.IO.File.ReadAllText(Path.Combine(dir, "data", "reset-pwd.html"));
                var EmailContent = new EmailContentEntity()
                {
                    Addresses = new string[] { email },
                    Subject = "Reset Password",
                    Body = html.Replace("{link}", link),
                    IsBodyHtml = true
                };
                string message = JsonConvert.SerializeObject(EmailContent);
                SendMessageToQueue(configuration["Mail_queue"], message);
            }

            return Ok(new ServiceResponse("password-reset-email-sent", user.Email.ToString(), "Email is sent to you"));
        }

        [HttpPut]
        [Route("password")]
        public IActionResult ResetPassword([FromBody] UserPassword body)
        {
            var token = "";
            if (Request.Headers.TryGetValue("X-Custom-Token", out var tokenValue))
            {
                token = tokenValue.ToString();
            }

            if (string.IsNullOrEmpty(body.Password))
            {
                return BadRequest(new ServiceResponse("empty-password"));
            }
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "empty password reset token"));
            }
            if (string.IsNullOrEmpty(body.Email))
            {
                return BadRequest(new ServiceResponse("empty-email"));
            }
            var user = service.GetUser(body.Email.ToLower(), "");
            if (user == null)
            {
                return BadRequest(new ServiceResponse("empty-user-entity"));
            }
            var events = service.Database.GetEvents(body.Email.Trim().ToLower());
            if (events == null || !events.Any())
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "password reset not exists"));
            }

            var payloads = events.Select(e => string.IsNullOrEmpty(e.Payload) ? new TokenPayload() : JsonConvert.DeserializeObject<TokenPayload>(e.Payload))
                .Where(p => p.Token == token && p.Usage == "reset-password");
            if (payloads == null || !payloads.Any())
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "password reset not exists"));
            }

            var payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year > 1);
            if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
            {
                // expired
                return BadRequest(new ServiceResponse("invalid-token", "", "password reset expires"));
            }

            payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year == 1);
            if (payload != null)
            {
                return BadRequest(new ServiceResponse("invalid-token", "", "password reset is used"));
            }

            if (service.UpdatePassword(body.Email.ToLower(), CodeGenerator.HashString(body.Password)))
            {
                service.Database.NewEvent(new EventEntity()
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

                return Ok(new ServiceResponse("user-password-updated", "", "password is reset"));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to reset password"));
            }
        }

        private void SendMessageToQueue(string queue, string message)
        {
            if (string.IsNullOrEmpty(queue))
            {
                var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
                System.IO.File.WriteAllText(Path.Combine(dir, "data", "body.html"), JsonConvert.DeserializeObject<EmailContentEntity>(message).Body);
            }
            else
            {
                var factory = new ConnectionFactory()
                {
                    HostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost",
                    UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
                    Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
                };

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

        private bool ValidateRefreshToken(string email, string refreshToken)
        {
            var des_key = configuration["DES_Key"];
            var des_iv = configuration["DES_IV"];

            var key = ASCIIEncoding.ASCII.GetBytes(des_key);
            var iv = ASCIIEncoding.ASCII.GetBytes(des_iv);

            string data = CodeGenerator.Decrypt(key, iv, refreshToken); // email_xxx_000
            var d = data.Split("_");
            if (d.Length != 3)
            {
                return false;
            }

            if (email != d[0])
            {
                return false;
            }

            string token = cache.GetValue<string>(string.Format("refresh-token-{0}-{1}", email, d[1])); // 000000    
            if (!string.IsNullOrEmpty(token))
            {
                return d[2] == token;
            }
            return false;
        }

        private UserToken IssueToken(byte[] key, string issuer, string audience, int expirationInHour, UserEntity user)
        {
            var accessToken = IssueAccessToken(key, issuer, audience, expirationInHour, user);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            return new UserToken()
            {
                IssueAt = timestamp,
                ExpireInHours = expirationInHour,
                Value = accessToken,
                RefreshToken = IssueRefreshToken(user.Email, timestamp),
                Email = user.Email
            };
        }

        private string IssueAccessToken(byte[] key, string issuer, string audience, int expirationInHour, UserEntity user)
        {
            var handler = new JwtSecurityTokenHandler();
            var k = new SymmetricSecurityKey(key);
            var c = new SigningCredentials(k, SecurityAlgorithms.HmacSha256);

            var description = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim(ClaimTypes.Expiration, DateTime.UtcNow.AddHours(expirationInHour).ToString("yyyyMMddHHmmss"))
                }),
                Issuer = issuer,
                Audience = audience,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddHours(expirationInHour),
                SigningCredentials = c
            };
            var token = handler.WriteToken(handler.CreateToken(description));
            return token;
        }

        private string IssueRefreshToken(string email, string timestamp)
        {
            var des_key = configuration["DES_Key"];
            var des_iv = configuration["DES_IV"];

            var key = ASCIIEncoding.ASCII.GetBytes(des_key);
            var iv = ASCIIEncoding.ASCII.GetBytes(des_iv);

            var data = string.Format("{0}_{1}_{2}", email, timestamp, CodeGenerator.GenerateDigitalCode(6));
            string _key = CodeGenerator.Encrypt(key, iv, data);

            cache.RemoveValue(string.Format("refresh-token-{0}-{1}", email, timestamp));
            cache.SetValue<string>(string.Format("refresh-token-{0}-{1}", email, timestamp), data, TimeSpan.FromDays(14));

            return _key;
        }
    }
}
