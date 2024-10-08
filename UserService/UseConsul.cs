using Consul;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;

namespace UserService
{
    public static class ConsulExtension
    {
        public static IApplicationBuilder UseConsul(this IApplicationBuilder app, IHostApplicationLifetime lifetime, IConfiguration configuration)
        {
            var client = app.ApplicationServices.GetRequiredService<IConsulClient>();
            var factory = app.ApplicationServices.GetRequiredService<ILoggerFactory>();
            var logger = factory.CreateLogger<IConsulClient>();

            var service = configuration["Service_name"] ?? "";
            var tagsStr = configuration["Service_tags"] ?? "";

            var tags = tagsStr.Split(",");

            var id = Guid.NewGuid().ToString();

            string hostname = Dns.GetHostName();
            var addresses = Dns.GetHostAddresses(hostname);

            var ip = "";

            if (addresses.Any())
            {
                var addr = addresses.First(a => !a.IsIPv6LinkLocal);
                if (addr != null) ip = addr.ToString();
            }



            var tag = "1.0.0";
            Assembly assembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
            tag = fileVersionInfo.FileVersion;

            tags = tags.Append(tag.Trim()).ToArray();
            tags = tags.Append(hostname).ToArray();

            if (Convert.ToBoolean(configuration["Consul_enable"] ?? "false")
                && !string.IsNullOrEmpty(ip))
            {
                logger.LogInformation("consul enabled");

                var registration = new AgentServiceRegistration()
                {
                    ID = id,
                    Name = service,
                    Address = ip,
                    Port = 80,
                    Tags = tags,
                    Check = new AgentServiceCheck()
                    {
                        HTTP = $"http://{ip}/api/health",
                        Timeout = TimeSpan.FromSeconds(5),
                        Interval = TimeSpan.FromSeconds(20),
                        DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(30)
                    }
                };

                try
                {
                    client.Agent.ServiceDeregister(id).Wait();
                    client.Agent.ServiceRegister(registration).Wait();
                }
                catch (Exception ex)
                {
                    logger.LogInformation(ex.Message);
                }


                lifetime.ApplicationStopped.Register(() =>
                {
                    logger.LogInformation("deregister service");
                    try
                    {
                        client.Agent.ServiceDeregister(id).Wait();
                    }
                    catch (Exception ex)
                    {
                        logger.LogInformation(ex.Message);
                    }
                });
            }

            return app;
        }
    }
}
