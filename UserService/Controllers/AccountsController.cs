using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Entity;
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

        // check if user's token is valid
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
            var token = events.CreateVerificationCode(email);

            // {sso_url}/confirm-email?email=xxx&token=xxx
            var link = $"{configuration["SSO_url"] ?? ""}/confirm-email?email={user.Email}&token={token}";

            logger.LogDebug($"the email confirm link is {link}");
            model.AppendLog($"the email confirm link is {link}");

            SendUserLink(configuration["User_link_queue"] ?? "", new UserLink() { Email = user.Email, Link = link, Name = user.Name, Usage = "email" });

            // send the link to user mail box
            return Ok(new OneTimeTokenCreated(email, "Email Verification"));
        }

        [HttpGet]
        [Route("logout")]
        public IActionResult Logout([FromQuery] string code)
        {
            if (Request.Headers.ContainsKey("x-refresh-token"))
            {
                StringValues token;
                Request.Headers.TryGetValue("x-refresh-token", out token);

                var des_key = configuration["DES_Key"];
                var des_iv = configuration["DES_IV"];

                var key = ASCIIEncoding.ASCII.GetBytes(des_key);
                var iv = ASCIIEncoding.ASCII.GetBytes(des_iv);

                string data = CodeGenerator.Decrypt(key, iv, token); // email_xxx_000000
                var d = data.Split("_");

                if (string.IsNullOrEmpty(code))
                {
                    //return Ok(new ServiceResponse("valid-logout-code", d[2], "logout with the id value (?code=id)"));
                }
                if (code.Length == 6)
                {
                    // pattern {code from user} {code from service}
                    //string cachevalue = cache.GetValue<string>(string.Format("refresh-token-{0}-{1}", d[0], d[1])); // 000000
                    string cachevalue = "xxx";
                    if (string.IsNullOrEmpty(cachevalue))
                    {
                        return BadRequest(
                        //new ServiceResponse("invalid-logout-code", "", "logout code of refresh token is removed")
                        );
                    }
                    else
                    {
                        // remove cache
                        //cache.RemoveValue(string.Format("refresh-token-{0}-{1}", d[0], d[1]));
                        //return Ok(
                        //    new ServiceResponse("logout-code-removed")
                        //    );
                    }
                }
                return BadRequest(
                    //new ServiceResponse("invalid-logout-code", "", "incorrect logout code")
                    );
            }
            else
            {
                return BadRequest(
                //new ServiceResponse("empty-refresh-token")
                );
            }
            throw new NotImplementedException();
        }

        [HttpDelete]
        [Route("{email}")]
        public IActionResult Delete(string email)
        {
            // need confirmed token ??

            // posts
            var posts = new PostCollection(database);
            posts.DeleteSome(email);

            logger.LogDebug($"delete posts for user {email}");

            // tasks
            var tasks = new TaskCollection(database);
            tasks.DeleteSome(email);

            logger.LogDebug($"delete tasks for user {email}");

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

            var role = new UserRole()
            {
                Email = email,
                Name = "",
                Role = ""
            };
            var message = JsonConvert.SerializeObject(role);

            // my_services_user_deleted
            var queue = configuration["User_deleted_queue"] ?? "";

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;
                channel.QueueDeclare(queue: queue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: "", routingKey: queue, basicProperties: properties, body: body);
            }

            logger.LogDebug("send user deleted message to queue " + queue);

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
