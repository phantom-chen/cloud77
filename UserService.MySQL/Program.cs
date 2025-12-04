using Microsoft.EntityFrameworkCore;
using System.Reflection;
using UserService.MySQL.Collections;

namespace UserService.MySQL
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var location = Assembly.GetExecutingAssembly().Location;
            var root = Directory.GetParent(location)?.ToString() ?? "";
            var connection = "server=localhost;database=dev_db;user=root;password=123456";
            if (File.Exists(Path.Combine(root, "localhost.txt")))
            {
                var ip = File.ReadAllText(Path.Combine(root, "localhost.txt")).Trim();
                connection = $"server={ip};database=dev_db;user=root;password=123456";
            }
            // Add services to the container.
            builder.Services.AddDbContext<DatabaseModel>(option =>
            {
                option.UseMySQL(connection);
            });
            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
