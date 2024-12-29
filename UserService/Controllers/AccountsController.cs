using Cloud77.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace UserService.Controllers
{
    /// <summary>
    /// Help update user account.
    /// </summary>
    [Route("api/[controller]")]
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
            return Ok();
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
