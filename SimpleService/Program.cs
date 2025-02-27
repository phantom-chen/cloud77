using SimpleService.Hubs;

namespace SimpleService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSignalR();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();
            app.MapHub<ChatHub>("/chathub");
            app.Run();
        }
    }
}
