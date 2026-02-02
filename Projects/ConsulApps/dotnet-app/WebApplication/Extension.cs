using Consul;
using Ocelot.Values;
using System.Net;

namespace DotnetApp
{
  public static class Extension
  {
    public static WebApplication UseConsul(this WebApplication app, IHostApplicationLifetime lifetime, IConsulClient client, ILogger<IApplicationBuilder> logger)
    {
      var hostname = Dns.GetHostName();
      var address = GetAddress();
      logger.LogInformation("start registering service in consul");

      var id = Guid.NewGuid().ToString();
      var registration = new AgentServiceRegistration()
      {
        ID = id,
        Name = "dotnet-app",
        Address = address,
        Port = 80,
        Tags = new string[] { "tag1", "tag2", "tag3" },
        Check = new AgentServiceCheck()
        {
          HTTP = $"http://{address}/api/health",
          Timeout = TimeSpan.FromSeconds(5),
          Interval = TimeSpan.FromSeconds(20),
          DeregisterCriticalServiceAfter = TimeSpan.FromSeconds(30)
        },
        Checks = new AgentServiceCheck[]
            {
                        new AgentServiceCheck()
                        {
                            Name = "GRPC service check",
                            GRPC = address + ":443",
                            GRPCUseTLS = true,
                            TLSSkipVerify = true,
                            Timeout = TimeSpan.FromSeconds(3),
                            Interval = TimeSpan.FromSeconds(10),
                        },
                        new AgentServiceCheck()
                        {
                            TCP = address + ":80",
                            Timeout = TimeSpan.FromSeconds(3),
                            Interval = TimeSpan.FromSeconds(10),
                        }
            }
      };

      client.Agent.ServiceDeregister(id).Wait();
      client.Agent.ServiceRegister(registration).Wait();

      lifetime.ApplicationStopped.Register(() =>
      {
        logger.LogInformation("deregister service");
        client.Agent.ServiceDeregister(id).Wait();
      });

      return app;
    }

    private static string GetAddress()
    {
      string hostname = Dns.GetHostName();
      var addresses = Dns.GetHostAddresses(hostname);

      var address = "";

      if (addresses.Any())
      {
        var addr = addresses.First(a => !a.IsIPv6LinkLocal);
        if (addr != null) address = addr.ToString();
      }

      return address;
    }
  }
}
