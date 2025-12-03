using Ocelot.Middleware;
using Ocelot.DependencyInjection;
using GatewayService.Middleware;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using GatewayService.Models;

namespace GatewayService
{
  public class Program
  {
    public static void Main(string[] args)
    {
      new LocalDataModel().AppendLog("Gateway service starts");
      var builder = WebApplication.CreateBuilder(args);
      IConfiguration configuration = builder.Configuration;

      var path = "ocelot.json";
      if (File.Exists(Path.Combine(LocalDataModel.Root, "ocelot.json")))
      {
        path = Path.Combine(LocalDataModel.Root, "ocelot.json");
      }

      builder.Configuration.AddJsonFile(path);


      var AuthenticationProviderKey = configuration["AuthenticationScheme"] ?? "SomeKey";

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
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecurityKey"] ?? "abcdefghijklmnopqrstuvwzxyabcdefgh")),
          ValidIssuer = configuration["Issuer"] ?? "issuer",
          ValidAudience = configuration["Audience"] ?? "audience",
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

      app.UseHealthChecks("/api/health");
      app.UseOcelot().Wait();

      app.Run();
    }
  }
}
