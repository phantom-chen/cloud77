using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class GatewayController : ControllerBase
  {
    private readonly IConfiguration configuration;

    public GatewayController(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    [HttpGet]
    public IActionResult Get()
    {
      return Ok(new
      {
        environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "",
        key = configuration["APIKey"] ?? "",
        home = configuration["Home_url"] ?? "",
        sso = configuration["SSO_url"] ?? "",
      });
    }
  }
}
