using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using UserService.Models;
using System.Linq;
using System.Security.Claims;
using Cloud77.Service;
using Cloud77.Service.Entity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MongoDB.Driver;
using UserService.Contexts;
using System.Text;
using Amazon.Runtime.Internal.Util;
using Microsoft.Extensions.Primitives;
using System.IO;
using System.Reflection;
using RabbitMQ.Client;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IUserServiceManager service;
        private readonly CacheContext cache;
        public AccountsController(
            MongoClient client,
            IConfiguration configuration)
        {
            this.configuration = configuration;
            
            var database = new UserDatabase(client.GetDatabase(Cloud77Utility.DatabaseName));
            service = new UserServiceManager(database);
            cache = new CacheContext(configuration);
        }

        [HttpGet]
        [Route("{email}")]
        public IActionResult GetAccount(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = service.GetUser(email.Trim().ToLower(), "");
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity", email));
            }

            var result = new UserAccount()
            {
                Name = user.Name ?? "",
                Email = user.Email.ToLower(),
                Role = user.Role,
                Profile = user.Profile
            };

            var events = service.Database.GetEvents(email).Where(e => e.Name == "Verify-Email");
            var confirmed = events.Any(e =>
            {
                var payload = JsonConvert.DeserializeObject<TokenPayload>(e.Payload);
                return payload.Usage == "verify-email" && payload.Exp.Year == 1;
            });
            result.Confirmed = confirmed;

            return Ok(result);
        }

        public class AccountQuery : BaseQuery
        {
            public string Role { get; set; } = "";
            public string Email { get; set; } = "";
        }

        [HttpGet]
        public IActionResult GetAccounts([FromQuery] AccountQuery query)
        {
            if (string.IsNullOrEmpty(query.Role) && string.IsNullOrEmpty(query.Email))
            {
                return BadRequest(new ServiceResponse("empty-email-role", "", "role / email should not be empty"));
            }

            var search = "";
            if (!string.IsNullOrEmpty(query.Email))
            {
                search += $"email={query.Email};";
            }
            if (!string.IsNullOrEmpty(query.Role))
            {
                search += $"role={query.Role};";
            }
            var users = service.Database.GetUsers(query.Index, query.Size, query.Sort);
            var result = new AccountsQueryResult()
            {
                Data = users.Select(user =>
                {
                    return new UserAccount()
                    {
                        Email = user.Email,
                        Name = user.Name,
                        Role = user.Role,
                        Profile = user.Profile
                    };
                }),
                Total = 999,
                Index = query.Index,
                Size = query.Size,
                Query = ""
            };

            return Ok(result);
        }

        [HttpGet]
        [Route("{email}/profile")]
        public IActionResult GetProfile(string email)
        {
            if (string.IsNullOrEmpty(email))
            {   
                return BadRequest(new EmptyEmail());
            }

            var user = service.GetUser(email.Trim().ToLower(), "");
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity"));
            }

            if (user.Profile == null)
            {
                return NotFound(new ServiceResponse("empty-user-profile"));
            }
            return Ok(new UserProfile()
            {
                Email = user.Email,
                Data = user.Profile,
            });
        }

        [HttpDelete]
        [Route("{email}")]
        public IActionResult DeleteAccount(string email)
        {
            // create token, send to user
            // should attach token
            // add event log
            // users
            // tasks
            // posts
            service.Database.DeleteUser(email);
            return Ok(new ServiceResponse("user-entity-deleted", "", "Delete user successfully (todo)"));
        }

        [HttpPost]
        [Route("{email}/profile")]
        public IActionResult PostProfile(string email, [FromBody] UserProfile body)
        {
            if (string.IsNullOrEmpty(body.Email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = service.GetUser(body.Email.Trim().ToLower(), "");
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity"));
            }

            var found = user.Profile != null;
            var profile = body.Data;
            var entity = new ProfileEntity()
            {
                Surname = profile.Surname ?? "",
                GivenName = profile.GivenName ?? "",
                Company = profile.Company ?? "",
                CompanyType = profile.CompanyType ?? "",
                Title = profile.Title ?? "",
                Phone = profile.Phone ?? "",
                City = profile.City ?? "",
                Contact = profile.Contact ?? "",
                Address = profile.Address ?? "",
                Fax = profile.Fax ?? "",
                Post = profile.Post ?? "",
                Supplier = profile.Supplier ?? "",
            };
            if (service.NewProfile(body.Email, entity))
            {
                service.Database.NewEvent(new EventEntity()
                {
                    Name = found ? "Update-Profile" : "Create-Profile",
                    UserEmail = body.Email,
                    Email = body.Email,
                    Payload = JsonConvert.SerializeObject(entity),
                    Date = DateTime.UtcNow,
                });
                if (found)
                {
                    return Accepted("/profiles/" + user.Email.ToString(), new ServiceResponse("user-profile-updated", user.Email.ToString(), "Your profile is updated successfully"));
                }
                else
                {
                    return Created("/profiles/" + user.Email.ToString(), new ServiceResponse("user-license-created", user.Email.ToString(), "Your profile is created successfully"));
                }
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to update profile"));
            }
        }

        [HttpDelete]
        [Route("{email}/profile")]
        public IActionResult DeleteProfile(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = service.GetUser(email.Trim().ToLower(), "");
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity"));
            }

            var date = DateTime.UtcNow;
            if (user.Profile != null)
            {
                if (service.DeleteProfile(email))
                {
                    service.Database.NewEvent(new EventEntity()
                    {
                        Name = "Delete-Profile",
                        UserEmail = email,
                        Email = email,
                        Date = date,
                    });
                    return Ok(new ServiceResponse("user-profile-deleted", "", "Your profile is deleted successfully"));
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to update profile"));
                }
            }
            else
            {
                return NotFound(new ServiceResponse("empty-user-profile"));
            }
        }

        [HttpPut]
        [Route("{email}")]
        public IActionResult UpdateAccount(string email, [FromBody] UserRole body)
        {
            service.UpdateName(body.Email, body.Name);
            return Ok(new ServiceResponse(""));
        }

        [HttpPut]
        [Route("{email}/password")]
        public IActionResult UpdatePassword(string email, [FromBody] UserPassword body)
        {
            if (string.IsNullOrEmpty(body.Email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = service.GetUser(body.Email.Trim().ToLower(), "");
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity"));
            }

            if (user.Password != CodeGenerator.HashString(body.Password))
            {
                return BadRequest(new ServiceResponse("invalid-password"));
            }

            if (service.UpdatePassword(user.Email, CodeGenerator.HashString(body.Password)))
            {
                service.Database.NewEvent(new EventEntity()
                {
                    Date = DateTime.UtcNow,
                    Name = "Reset-Password",
                    Email = user.Email,
                    UserEmail = user.Email,
                });
                return Ok(new ServiceResponse("user-password-updated", user.Email.ToString(), "Update password successfully"));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to update password"));
            }
        }

        //private string QueryString(LicenseQuery query)
        //{
        //    var q = "";
        //    if (!string.IsNullOrEmpty(query.Email)) q += "email:" + (query.Email) + ";";
        //    if (!string.IsNullOrEmpty(query.State)) q += "state:" + (query.State) + ";";
        //    if (!string.IsNullOrEmpty(query.Template)) q += "template:" + (query.Template) + ";";
        //    if (!string.IsNullOrEmpty(query.Region)) q += "region:" + (query.Region) + ";";
        //    if (!string.IsNullOrEmpty(query.Scope)) q += "scope:" + (query.Scope) + ";";

        //    if (query.Option1 > -1) q += "option1:" + (query.Option1.ToString()) + ";";
        //    if (query.Option2 > -1) q += "option2:" + (query.Option2.ToString()) + ";";
        //    if (!string.IsNullOrEmpty(query.Option3)) q += "option3:" + (query.Option3) + ";";

        //    return q;
        //}

        // protected
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
                    return Ok(new ServiceResponse("valid-logout-code", d[2], "logout with the id value (?code=id)"));
                }
                if (code.Length == 6)
                {
                    // pattern {code from user} {code from service}
                    string cachevalue = cache.GetValue<string>(string.Format("refresh-token-{0}-{1}", d[0], d[1])); // 000000
                    if (string.IsNullOrEmpty(cachevalue))
                    {
                        return BadRequest(
                            new ServiceResponse("invalid-logout-code", "", "logout code of refresh token is removed")
                        );
                    }
                    else
                    {
                        // remove cache
                        cache.RemoveValue(string.Format("refresh-token-{0}-{1}", d[0], d[1]));
                        return Ok(
                            new ServiceResponse("logout-code-removed")
                            );
                    }
                }
                return BadRequest(
                    new ServiceResponse("invalid-logout-code", "", "incorrect logout code")
                    );
            }
            else
            {
                return BadRequest(
                    new ServiceResponse("empty-refresh-token")
                );
            }
        }

        // protected
        [HttpPost]
        [Route("verification")]
        public IActionResult CreateVerificationToken([FromQuery] string email)
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

            var usage = "verify-email";
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

            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            var html = System.IO.File.ReadAllText(Path.Combine(dir, "data", "verify-email.html"));
            var link = $"{configuration["HomeApp"]}/verification?email={email}&token={token}";

            var EmailContent = new EmailContentEntity()
            {
                Addresses = new string[] { email },
                Subject = "Email Confirmation",
                Body = html.Replace("{username}", user.Name.ToLower()).Replace("{email}", email).Replace("{link}", link),
                IsBodyHtml = true
            };

            string message = JsonConvert.SerializeObject(EmailContent);
            SendMessageToQueue(configuration["Mail_queue"], message);

            return Ok(new ServiceResponse("verification-email-sent", user.Email.ToString(), "Email is sent to you"));
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

    }
}
