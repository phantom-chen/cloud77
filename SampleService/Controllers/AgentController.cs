using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Reflection;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AgentController : ControllerBase
  {
    private IConfiguration configuration;

    public AgentController(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    [HttpGet]
    public IActionResult Get()
    {
      string hostname = Dns.GetHostName();
      var ip = "";
      var addresses = Dns.GetHostAddresses(hostname);
      if (addresses.Any())
      {
        var addr = addresses.First(a => !a.IsIPv6LinkLocal);
        if (addr != null) ip = addr.ToString();
      }
      Assembly assembly = Assembly.GetExecutingAssembly();
      FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
      return Ok(new
      {
        version = fileVersionInfo.FileVersion,
        hostname,
        machine = Environment.MachineName,
        environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "",
        apikey = configuration["APIKey"] ?? "",
        sso = configuration["SSO_url"] ?? ""
      });
    }
  }
}
