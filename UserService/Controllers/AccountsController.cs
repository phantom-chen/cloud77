using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    /// <summary>
    /// Help update user account.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
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
            return Ok();
        }

        [Route("{email}/profile")]
        [HttpGet]
        public IActionResult GetProfile(string email)
        {
            return Ok();
        }
    }
}
