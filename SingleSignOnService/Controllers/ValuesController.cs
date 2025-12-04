using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SingleSignOnService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            //return new string[] { "value1", "value2" };
            return Ok(new { Value = "Hello from SingleSignOnService!" });
        }

        [HttpPost()]
        //[Authorize(AuthenticationSchemes = "Bearer", Policy = "", Roles = "tester")]
        //[Authorize(AuthenticationSchemes = "JWT", Policy = "role-policy", Roles = "admin")]
        //[Authorize(Policy = "test")]
        public IActionResult Post([FromBody] string value)
        {
            if (User.HasClaim("Role", "admin"))
            {
                return Ok(new { ReceivedValue = value });
            }

            return Unauthorized();
        }
    }
}
