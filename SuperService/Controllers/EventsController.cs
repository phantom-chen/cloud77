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
      if (System.IO.File.Exists(Path.Combine(LocalDataModel.Root, "events.json")))
      {
        var content = System.IO.File.ReadAllText(Path.Combine(LocalDataModel.Root, "events.json"));
        var names = JsonConvert.DeserializeObject<string[]>(content);
        return Ok(names);
      }
      return NotFound();
    }
  }
}
