using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using System.Security.Claims;
using System.Text;
using UserService.Collections;
using UserService.Models;

namespace UserService.Controllers
{
    /// <summary>
    /// Help update user account.
    /// </summary>
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AccountsController : ControllerBase, IDisposable
    {
        private readonly ILogger<AccountsController> logger;
        private readonly IMongoDatabase database;
        private readonly UserCollection users;
        private readonly EventCollection events;
        private readonly ConnectionFactory factory;
        private readonly TextLoggingModel model;
        private readonly IConfiguration configuration;

        public AccountsController(
            ILogger<AccountsController> logger,
            MongoClient client,
            IConfiguration configuration,
            ConnectionFactory factory,
            TextLoggingModel model
            )
        {
            this.logger = logger;
            this.factory = factory;
            this.model = model;
            this.configuration = configuration;
            database = client.GetDatabase(configuration["Database"]);
            users = new UserCollection(database);
            events = new EventCollection(database);
        }

        [Route("role")]
        [HttpGet]
        public IActionResult GetRole()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var exp1 = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Expiration);
            if (email == null) return BadRequest(new EmptyEmail());
            Response.Headers.Append("X-Token-Expiration", exp1.Value);
            return Ok(new UserRole()
            {
                Email = email.Value,
                Name = name.Value,
                Role = role.Value
            });
        }

        [Route("{email}")]
        [HttpGet]
        public IActionResult GetAccount(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = users.GetUser(email.Trim().ToLower());
            if (user == null)
            {
                return NotFound(new UserNotExisting(email));
            }

            var result = new UserAccount()
            {
                Name = user.Name ?? "",
                Email = user.Email.ToLower(),
                Role = user.Role,
                Profile = user.Profile,
                Confirmed = user.Confirmed ?? false
            };

            return Ok(result);
        }

        [Route("{email}/name")]
        [HttpPut]
        public IActionResult UpdateName(string email, [FromBody] UserRole body)
        {
            var user = users.GetUser(email);
            var name = user.Name ?? "";

            users.UpdateName(body.Email, body.Name);

            // add log
            events.AppendEventLog(new EventEntity()
            {
                Date = DateTime.UtcNow,
                Name = "Update-Name",
                Email = body.Email,
                UserEmail = body.Email,
                Payload = $"User name updated ({name} => {body.Name})"
            });

            return Ok(new UserNameUpdated(body.Email, body.Name));
        }

        [Route("{email}/role")]
        [HttpPut]
        public IActionResult UpdateRole(string email, [FromBody] UserRole body)
        {
            users.UpdateRole(body.Email, body.Role);

            // add log

            return Ok(new UserRoleUpdated(body.Email, body.Role));
        }

        [Route("{email}/profile")]
        [HttpPut]
        public IActionResult UpdateProfile(string email, [FromBody] ProfileEntity body)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }
            var user = users.GetUser(email);
            if (user == null)
            {
                return NotFound(new UserNotExisting(email));
            }
            var ack = users.UpdateProfile(email, body);
            if (ack)
            {
                return Accepted("/profiles/" + user.Email.ToString(), new UserProfileUpdated(user.Email));
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to update profile"));

        }

        [HttpPut]
        [Route("{email}/password")]
        public IActionResult UpdatePassword(string email, [FromBody] UserPassword body)
        {
            // check user entity
            if (string.IsNullOrEmpty(body.Email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = users.GetUser(email);

            if (user == null)
            {
                return NotFound(new UserNotExisting(email));
            }

            // user needs to input current password, then update new password

            // check password is simple or not

            // check user updated password in minutes
            var hashedPassword = CodeGenerator.HashString(body.Password);

            // add salt to password

            var ack = users.UpdatePassword(body.Email, hashedPassword);

            // add log
            if (ack)
            {
                events.AppendEventLog(new EventEntity()
                {
                    Date = DateTime.UtcNow,
                    Name = "Update-Password",
                    Email = body.Email,
                    UserEmail = body.Email,
                });
                return Ok(new UserPasswordUpdated(body.Email));
            }

            return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to update password"));
        }

        [HttpPost]
        [Route("{email}/verification")]
        public IActionResult IssueVerificationToken(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            // check if user is confirmed
            var user = users.GetUser(email);

            if (user == null)
            {
                return BadRequest(new UserNotExisting(email));
            }

            // user is not confirmed, check if token is generated in several minutes

            // create verification code, add to events
            var token = CodeGenerator.GenerateVerificationCode(email, DateTime.UtcNow);

            // {sso_url}/confirm-email?email=xxx&token=xxx
            var link = $"{configuration["SSO_url"] ?? ""}/confirm-email?email={user.Email}&token={token}";

            logger.LogDebug($"the email confirm link is {link}");
            model.AppendLog($"the email confirm link is {link}");

            SendUserLink(configuration["User_link_queue"] ?? "", new UserLink() { Email = user.Email, Link = link, Name = user.Name, Usage = "email" });

            // send the link to user mail box
            return Ok(new OneTimeTokenCreated(email, "Email Verification"));
        }

        [HttpPost]
        [Route("logout")]
        public IActionResult Logout()
        {
            // get salts from access token, refresh token
            // append history to logout_history
            if (Request.Headers.ContainsKey("x-refresh-token"))
            {
                var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

                StringValues refreshToken;
                Request.Headers.TryGetValue("x-refresh-token", out refreshToken);
                User.Claims.FirstOrDefault(c => c.Type == "salt");
                User.Claims.FirstOrDefault(c => c.Type == "timestamp");
                var desKey = configuration["DES_Key"] ?? "";
                var desIV = configuration["DES_IV"] ?? "";

                var key = Encoding.ASCII.GetBytes(desKey);
                var iv = Encoding.ASCII.GetBytes(desIV);
                var result = new Dictionary<string, string>();
                var data = CodeGenerator.Decrypt(key, iv, refreshToken);

                var parts = data.Split("_");
                result["email"] = parts[0];
                result["salt"] = parts[1];
                result["timestamp"] = parts[2];
                result["expiration"] = parts[3];

                new UserDataModel(email.Value)
                    .SaveLogoutHistory(
                    parts[2],
                    new TokenSalt() { Value = User.Claims.FirstOrDefault(c => c.Type == "salt").Value },
                    new TokenSalt() { Value = parts[1] });

                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        //[HttpPost]
        // issue one-time token for deleting user
        // token expire in several minutes
        // save in redis cache

        [HttpDelete]
        [Route("{email}")]
        public IActionResult Delete(string email)
        {
            // need confirmed token ??
            // get token from headers or query string
            // get token from cache, compare

            var resourceServers = ServiceDataModel.GetSetting("user_resource_servers").Split(",");
            if (resourceServers.Length == 0)
            {
                return BadRequest();
            }
            var pending = System.IO.File.Exists(Path.Combine(ServiceDataModel.Root, "users", email, "user_resource_deleting.txt"));
            if (pending)
            {
                // check if user resource is deleted
                var path = Path.Combine(ServiceDataModel.Root, "users", email, "user_resource_deleted.txt");
                // get the content from user_resource_deleted.txt
                var lines = System.IO.File.ReadAllLines(path);
                var allDeleted = true;
                foreach (var resourceServer in resourceServers)
                {
                    if (!lines.Contains($"{email}_resource_deleted_{resourceServer}"))
                    {
                        allDeleted = false;
                    }
                }

                if (!allDeleted)
                {
                    return BadRequest("deleting user resources");
                }
            }
            else
            {
                var role = new UserRole()
                {
                    Email = email,
                    Name = "",
                    Role = ""
                };
                var message = JsonConvert.SerializeObject(role);
                var body = Encoding.UTF8.GetBytes(message);

                var lines = new List<string>();
                using (var connection = factory.CreateConnection())
                {
                    using (var channel = connection.CreateModel())
                    {
                        var properties = channel.CreateBasicProperties();
                        properties.Persistent = true;

                        foreach (var resourceServer in resourceServers)
                        {
                            channel.QueueDeclare(queue: resourceServer, durable: true, exclusive: false, autoDelete: false, arguments: null);
                            channel.BasicPublish(exchange: "", routingKey: resourceServer, basicProperties: properties, body: body);
                            lines.Add($"{email}_resource_deleting_{resourceServer}");
                        }
                    }
                }

                // add something to user_resource_deleting.txt, means background starts deleting user resources
                System.IO.File.AppendAllLines(Path.Combine(ServiceDataModel.Root, "users", email, "user_resource_deleting.txt"), lines.ToArray());
            }

            // next step
            // remove *.txt
            // remove *.json
            new UserDataModel(email).Remove();

            var date = DateTime.UtcNow;
            // add events
            var log = new EventEntity()
            {
                Name = "Delete-User",
                UserEmail = email,  // TODO get the email from claims
                Email = email,
                Date = date,
            };
            events.AppendEventLog(log);

            logger.LogDebug($"delete user {email} at {date}");

            // users
            users.DeleteUser(email);

            return Ok(new UserDeleted(email));
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
