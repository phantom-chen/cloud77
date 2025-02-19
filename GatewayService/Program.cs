using Ocelot.Middleware;
using Ocelot.DependencyInjection;

namespace GatewayService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            IConfiguration configuration = builder.Configuration;
            // Add services to the container.

            // Add JWT authentication
            builder.Services.AddControllers();
            builder.Services.AddHealthChecks();
            builder.Services.AddOcelot(configuration);

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthorization();

            app.UseHealthChecks("/api/health");
            app.MapControllers();
            app.UseOcelot();
            app.Run();
        }
    }
}
