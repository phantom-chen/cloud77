using MongoDB.Driver;
using System.Reflection;
using UserService.Services;

namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddScoped<MongoClient>(p =>
            {
                var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
                var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
                if (File.Exists(Path.Combine(dir, "localhost.txt")))
                {
                    connection = connection.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "localhost.txt"))[0]);
                }

                var settings = MongoClientSettings.FromConnectionString(connection);
                settings.ConnectTimeout = TimeSpan.FromSeconds(5);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
                var client = new MongoClient(settings);
                return client;
            });
            builder.Services.AddHostedService<DatabaseService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
