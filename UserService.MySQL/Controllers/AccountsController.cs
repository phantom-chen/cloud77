using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.MySQL.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        [Route("role")]
        [HttpGet]
        public IActionResult GetRole()
        {
            return Ok();
        }

        [Route("{email}")]
        [HttpGet]
        public IActionResult GetAccount(string email)
        {
            return Ok();
        }
    }
}
