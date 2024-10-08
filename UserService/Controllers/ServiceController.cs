using Cloud77.Service;
using CSharpVitamins;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using MongoDB.Bson;
using MongoDB.Driver;
using UserService.Models;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ServiceController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        [Route("")]
        public IActionResult Get()
        {
            var guid = ShortGuid.NewGuid();

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
                Name = configuration["Service_name"] ?? "",
                Tags = configuration["Service_tags"].Split(",") ?? new[] {"xxx"} 
            };

            Response.Headers.Append("X-Response-Data", "Controller");
            return Ok(result);
        }
    }
}
