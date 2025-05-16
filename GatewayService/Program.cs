using Ocelot.Middleware;
using Ocelot.DependencyInjection;
using GatewayService.Middleware;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace GatewayService
{
  public class Program
  {
    public static void Main(string[] args)
    {
      var builder = WebApplication.CreateBuilder(args);
      IConfiguration configuration = builder.Configuration;
      builder.Configuration.AddJsonFile("ocelot.json");

      Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
      var AuthenticationProviderKey = "MyKey";

      // Add services to the container.

      builder.Services.AddAuthentication()
        .AddJwtBearer(AuthenticationProviderKey,options =>
      {
        // Add JWT authentication
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters()
        {
          NameClaimType = ClaimTypes.Name,
          RoleClaimType = ClaimTypes.Role,
          ValidateIssuerSigningKey = true,
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateLifetime = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecurityKey"])),
          ValidIssuer = configuration["Issuer"],
          ValidAudience = configuration["Audience"],
          ClockSkew = TimeSpan.FromSeconds(30),
          RequireExpirationTime = true,
        };
      });

      //builder.Services.AddAuthorization();
      //builder.Services.AddScoped<EmailFilter>();
      //builder.Services.AddScoped<RequiredQueryAttribute>();


      builder.Services.AddHealthChecks();
      builder.Services.AddOcelot(builder.Configuration);

      var app = builder.Build();

      // Configure the HTTP request pipeline.
      //app.UseAuthentication();
      app.UseRouting();
      //app.UseAuthorization();

      // Add a default route for "/"
      //app.MapGet("/", () => "Welcome to the default route!");

      // Add other routes if needed
      //app.MapGet("/about", () => "About Page");

      app.UseMiddleware<KeyMiddleware>();
      app.UseMiddleware<LoggingMiddleware>();
      app.UseMiddleware<ErrorHandlingMiddleware>();
      app.UseHealthChecks("/api/health");
      app.UseOcelot().Wait();

      app.Run();
    }
  }
}
