using Cloud77.Abstractions.Service;
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
      var addresses = Dns.GetHostAddresses(hostname).Where(a => !a.IsIPv6LinkLocal);
      if (addresses.Any())
      {
        var addr = addresses.FirstOrDefault();
        
        if (addr != null) ip = addr.ToString();
      }

      var tag1 = $"ENVIRONMENT={Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? ""}";
      var tag2 = $"CUSTOM_LOGGING={Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? ""}";

      Assembly assembly = Assembly.GetExecutingAssembly();
      FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
      var result = new ServiceAgent()
      {
        Version = fileVersionInfo.FileVersion,
        Hostname = hostname,
        IP = ip,
        Service = "sample_service",
        Tags = new[] { tag1, tag2 },
        Machine = Environment.MachineName,
        Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "",
        Logging = Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? ""
      };
      return Ok(result);
    }
  }
}
