using Ocelot.Middleware;
using Ocelot.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

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

      // Add services to the container.
      //builder.Services.AddAuthentication(option =>
      //{
      //  option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
      //  option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      //}).AddJwtBearer(options =>
      //{
      //  options.RequireHttpsMetadata = false;
      //  options.SaveToken = true;

      //  options.TokenValidationParameters = new TokenValidationParameters()
      //  {
      //    NameClaimType = ClaimTypes.Name,
      //    RoleClaimType = ClaimTypes.Role,
      //    ValidateIssuerSigningKey = true,
      //    ValidateIssuer = true,
      //    ValidateAudience = true,
      //    ValidateLifetime = true,
      //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecurityKey"])),
      //    ValidIssuer = configuration["Issuer"],
      //    ValidAudience = configuration["Audience"],
      //    ClockSkew = TimeSpan.FromSeconds(30),
      //    RequireExpirationTime = true,
      //  };
      //});
      //builder.Services.AddAuthorization();
      //builder.Services.AddScoped<EmailFilter>();
      //builder.Services.AddScoped<RequiredQueryAttribute>();

      // Add JWT authentication
      builder.Services.AddControllers().AddNewtonsoftJson();
      builder.Services.AddHealthChecks();
      builder.Services.AddOcelot();

      var app = builder.Build();

      // Configure the HTTP request pipeline.
      //app.UseAuthentication();
      app.UseRouting();
      //app.UseAuthorization();

      // Add a default route for "/"
      //app.MapGet("/", () => "Welcome to the default route!");

      // Add other routes if needed
      //app.MapGet("/about", () => "About Page");

      app.UseHealthChecks("/api/health");
      app.UseOcelot().Wait();
      //app.MapControllers();
      //app.UseMiddleware<KeyMiddleware>();
      //app.UseMiddleware<LoggingMiddleware>();
      //app.UseMiddleware<ErrorHandlingMiddleware>();
      app.Run();
    }
  }
}
