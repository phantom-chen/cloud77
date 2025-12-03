using Cloud77.Abstractions.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Net;
using System.Reflection;

namespace SuperService.Controllers
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

            var tag1 = $"ENVIRONMENT={Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? ""}";
            var tag2 = $"CUSTOM_LOGGING={Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? ""}";

            var result = new ServiceAgent()
            {
                Version = fileVersionInfo.FileVersion,
                Hostname = hostname,
                Machine = Environment.MachineName,
                IP = ip,
                Service = "super_service",
                Tags = new[] { tag1, tag2 },
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "",
                Logging = Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? ""
            };

            Response.Headers.Append("X-Response-Data", "Controller");
            return Ok(result);
        }
    }
}
