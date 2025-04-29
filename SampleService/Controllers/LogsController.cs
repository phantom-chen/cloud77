using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class LogsController : ControllerBase
  {
    // data/logs/YYYY-MM-DD.txt
    // data/logs/errors/xxx.txt

    /// <summary>
    /// Provide the log today
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult Get()
    {
      return Ok();
    }

    /// <summary>
    /// Provide the log for specific date
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("{date}")]
    public IActionResult Get(string date)
    {
      return Ok();
    }

    [HttpGet]
    [Route("history")]
    public IActionResult GetHistory()
    {
      return Ok();
    }

    [HttpGet]
    [Route("error/{id}")]
    public IActionResult GetError(string id)
    {
      return Ok();
    }
  }
}
