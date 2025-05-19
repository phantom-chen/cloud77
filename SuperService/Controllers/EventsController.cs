using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SuperService.Models;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EventsController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
      var content = new LocalDataModel().EventSettings;
      if (string.IsNullOrEmpty(content))
      {
        return NotFound();
      }
      else
      {
        var names = JsonConvert.DeserializeObject<string[]>(content);
        return Ok(names);
      }
    }
  }
}
