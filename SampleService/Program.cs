using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Utility;
using MongoDB.Driver;
using Newtonsoft.Json;
using SampleService.Hubs;
using SampleService.Middleware;
using SampleService.Models;
using System.Reflection;
using System.Runtime.InteropServices;

namespace SampleService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Initialize();

            new TextLoggingModel().AppendLog("Sample service starts");
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddSingleton<TimerManager>();
            builder.Services.AddScoped<TextLoggingModel>();

            builder.Services.AddScoped<MongoClient>(p =>
            {
                var settings = MongoClientSettings.FromConnectionString(ServiceDataModel.GetVariable("DB_CONNECTION"));
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

        private static void Initialize()
        {
            ServiceDataModel.ServiceName = "Sample";

            ServiceDataModel.LogFileExtension = Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? "";

            var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
            var location = Assembly.GetExecutingAssembly().Location;
            var root = Directory.GetParent(location)?.ToString() ?? "";
            ServiceDataModel.Platform = isWindows ? "Windows" : "Linux";

            if (isWindows)
            {
                string programDataPath = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
                ServiceDataModel.Root = Path.Combine(programDataPath, "MyServices");
            }
            else
            {
                // for Linux system
                ServiceDataModel.Root = Path.Combine(root, "data");
            }

            ServiceDataModel.Initialize();

            var content = ServiceDataModel.GetContent("settings.json");
            if (!string.IsNullOrEmpty(content))
            {
                ServiceDataModel.Settings = JsonConvert.DeserializeObject<List<SettingEntity>>(content);
            }

            ServiceDataModel.UpdateVariable("ENVIRONMENT", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development");
            ServiceDataModel.UpdateVariable("DB_CONNECTION", Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost");
        }
    }
}
