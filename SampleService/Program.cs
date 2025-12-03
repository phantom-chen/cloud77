using Cloud77.Abstractions.Utility;
using MongoDB.Driver;
using SampleService.Hubs;
using SampleService.Middleware;
using SampleService.Models;

namespace SampleService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            new TextLoggingModel().AppendLog("Sample service starts");
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddSingleton<TimerManager>();
            builder.Services.AddScoped<TextLoggingModel>();

            builder.Services.AddScoped<MongoClient>(p =>
            {
                var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
                if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
                {
                    connection = connection.Replace("localhost", LocalDataModel.IPAddress);
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
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseHealthChecks("/api/health");
            app.MapControllers();
            app.MapHub<ChatHub>("/hubs/chat");
            app.Run();
        }
    }
}
