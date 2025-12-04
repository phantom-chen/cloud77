using Consul;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using Ocelot.Values;

namespace DotnetApp
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var builder = WebApplication.CreateBuilder(args);

      // Add services to the container.
      builder.Configuration.AddJsonFile("ocelot.json");
      builder.Services.AddSingleton<IConsulClient, ConsulClient>(p =>
      {
        return new ConsulClient(config =>
        {
          config.Address = new Uri(builder.Configuration["Consul_address"]);
        });
      });

      builder.Services.AddControllers();
      builder.Services.AddOcelot(builder.Configuration).AddConsul();
      builder.Services.AddHostedService<BackgroundService>();

      var app = builder.Build();

      // Configure the HTTP request pipeline.

      app.UseHttpsRedirection();

      app.UseAuthorization();

      IConfiguration configuration = builder.Configuration;
      var lifetime = builder.Services.BuildServiceProvider().GetRequiredService<IHostApplicationLifetime>();
      var client = builder.Services.BuildServiceProvider().GetRequiredService<IConsulClient>();
      var factory = builder.Services.BuildServiceProvider().GetRequiredService<ILoggerFactory>();
      var logger = factory.CreateLogger<IApplicationBuilder>();

      app.UseConsul(lifetime, client, logger);

      app.MapControllers();

      app.UseOcelot().Wait();
      app.Run();
    }
  }
}
