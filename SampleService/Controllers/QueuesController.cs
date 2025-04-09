using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class QueuesController : ControllerBase
  {
    [HttpPost]
    [Route("{name}")]
    public async Task<IActionResult> Post(string name)
    {
      using (var reader = new StreamReader(Request.Body))
      {
        var content = await reader.ReadToEndAsync();
        Console.WriteLine(content);
        return Ok(new { Message = "receive your queue message" });
      }
    }
  }
}
