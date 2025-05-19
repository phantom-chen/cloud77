using Cloud77.Service;
using MongoDB.Driver;
using SampleService.Hubs;
using System.Reflection;

namespace SampleService
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
      if (!Directory.Exists(Path.Combine(dir, "data")))
      {
        Directory.CreateDirectory(Path.Combine(dir, "data"));
      }

      var builder = WebApplication.CreateBuilder(args);

      // Add services to the container.
      builder.Services.AddSingleton<TimerManager>();
      builder.Services.AddScoped<MongoClient>(p =>
      {
        var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";

        if (File.Exists(Path.Combine(dir, "data", "localhost.txt")))
        {
          connection = connection.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "data", "localhost.txt"))[0]);
        }

        var settings = MongoClientSettings.FromConnectionString(connection);
        settings.ConnectTimeout = TimeSpan.FromSeconds(5);
        settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
        var client = new MongoClient(settings);
        return client;
      });
      builder.Services.AddHealthChecks();
      builder.Services.AddControllers().AddNewtonsoftJson();
      builder.Services.AddSignalR();

      var app = builder.Build();

      // Configure the HTTP request pipeline.
      app.UseRouting();
      app.UseAuthorization();
      app.UseHealthChecks("/api/health");
      app.MapControllers();
      app.MapHub<ChatHub>("/hubs/chat");
      app.Run();
    }
  }
}
