using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;

namespace GatewayService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GatewayController : ControllerBase
    {
        private IConfiguration configuration;

        public GatewayController(IConfiguration configuration)
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
                apikey = configuration["APIKey"],
                home = configuration["HomeApp"] ?? "http://localhost",
                user = configuration["UserApp"] ?? "http://localhost",
                super = configuration["SuperApp"] ?? "http://localhost",
                canteen = configuration["CanteenApp"] ?? "http://localhost",
                factory = configuration["FactoryApp"] ?? "http://localhost",
                product = configuration["ProductApp"] ?? "http://localhost",
            });
        }
    }
}
