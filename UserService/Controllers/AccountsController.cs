using Cloud77.Service;
using Consul;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using System.Xml.Linq;

namespace UserService.Controllers
{
    /// <summary>
    /// Help update user account.
    /// </summary>
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly ILogger<AccountsController> logger;
        private readonly IConfiguration configuration;
        private readonly MongoClient client;
        private readonly string defaultRole;
        private readonly UserCollection collection;

        public AccountsController(
            ILogger<AccountsController> logger,
            MongoClient client,
            IConfiguration configuration
            )
        {
            this.logger = logger;
            this.client = client;
            this.configuration = configuration;
            collection = new UserCollection(client, configuration);
        }

        [Route("role")]
        [HttpGet]
        public IActionResult GetRole()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var exp1 = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Expiration);
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
        public IActionResult Get()
        {
            return Ok();
        }

        [Route("{email}")]
        [HttpGet]
        public IActionResult GetAccount(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new EmptyEmail());
            }

            var user = collection.GetUser(email.Trim().ToLower());
            if (user == null)
            {
                return NotFound(new ServiceResponse("empty-user-entity", email));
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

        [Route("{email}/profile")]
        [HttpGet]
        public IActionResult GetProfile(string email)
        {
            return Ok();
        }
    }
}
