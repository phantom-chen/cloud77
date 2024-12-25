using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    /// <summary>
    /// Help create user account, user login, reset password, verify email.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [HttpPost]
        public IActionResult Post()
        {
            return Ok();
        }

        [Route("token")]
        [HttpGet]
        public IActionResult GetToken()
        {
            return Ok();
        }

        [Route("password-token")]
        public IActionResult GetPasswordToken()
        {
            return Ok();
        }

        [Route("password")]
        [HttpPut]
        public IActionResult UpdatePassword()
        {
            return Ok();
        }

        [Route("verification")]
        [HttpPut]
        public IActionResult VerifyEmail()
        {
            return Ok();
        }
    }
}
