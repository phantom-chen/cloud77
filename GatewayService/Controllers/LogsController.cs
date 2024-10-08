using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GatewayService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        // data/logs/20201212.txt
        // data/errors/xxx.txt
        [HttpGet]
        public IActionResult Get()
        {
            return Ok();
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult GetLog(string id)
        {
            // id = 20201212
            return Ok();
        }

        [HttpGet]
        [Route("history")]
        public IActionResult GetHistory()
        {
            return Ok();
        }

        [Route("errors/{id}")]
        [HttpGet]
        public IActionResult GetError(string id)
        {
            return Ok();
        }
    }
}
