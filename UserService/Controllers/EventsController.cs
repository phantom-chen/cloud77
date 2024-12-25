using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    /// <summary>
    /// Help manage event logs.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [Route("{email}")]
        [HttpGet]
        public IActionResult GetByEmail(string email)
        {
            return Ok();
        }
    }
}
