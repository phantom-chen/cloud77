using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
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
