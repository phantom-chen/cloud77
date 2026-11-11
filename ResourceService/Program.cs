using Microsoft.Extensions.FileProviders;

namespace ResourceService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Configuration.AddJsonFile("appsettings.sample.json");

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddHttpClient("JsonPlaceholder", client =>
            {
                client.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/");
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseDefaultFiles();

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "server", "wwwroot"))
            });

            app.UseAuthorization();

            app.UseMiddleware<DemoRouteMiddleware>();

            app.MapControllers();

            app.Run();
        }
    }
}
