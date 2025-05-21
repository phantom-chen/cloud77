using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [Authorize]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
      return Ok(new string[] { "super service value1", "super service value2" });
    }
  }
}
