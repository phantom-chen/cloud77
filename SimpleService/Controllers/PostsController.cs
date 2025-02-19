using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SimpleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PostsController : ControllerBase
  {
    [HttpPost("")]
    public async Task<IActionResult> Post()
    {
      using (var reader = new StreamReader(Request.Body))
      {
        var content = await reader.ReadToEndAsync();
        return Ok(new { Content = content });
      }
    }
  }
}
