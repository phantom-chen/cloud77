using Cloud77.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Reflection;

namespace UserService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AgentController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
      Assembly assembly = Assembly.GetExecutingAssembly();
      FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);

      string hostname = Dns.GetHostName();

      var ip = "";
      var addresses = Dns.GetHostAddresses(hostname);
      if (addresses.Any())
      {
        var addr = addresses.First(a => !a.IsIPv6LinkLocal);
        if (addr != null) ip = addr.ToString();
      }

      var result = new ServiceApp()
      {
        Version = fileVersionInfo.FileVersion,
        Hostname = hostname,
        IP = ip,
        Name = "service_name",
        Tags = new[] { "service_tag1", "service_tag2", "service_tag3" }
      };

      Response.Headers.Append("X-Response-Data", "Controller");
      return Ok(result);
    }
  }
}
