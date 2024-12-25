using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Controllers
{
    /// <summary>
    /// Help manage database and collections.
    /// It can only be accessible in development or staging.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        [Route("collections")]
        [HttpGet]
        public IActionResult GetCollections()
        {
            return Ok();
        }

        [Route("collections/{name}")]
        [HttpDelete]
        public IActionResult DeleteCollection(string name)
        {
            return Ok();
        }
    }
}
