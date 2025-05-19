using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using RabbitMQ.Client;
using ServiceStack;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using UserService.Hubs;
using UserService.Models;
using UserService.Services;

namespace UserService
{
  public class Program
  {
    public static void Main(string[] args)
    {
      // set up data folder
      var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
      if (!Directory.Exists(Path.Combine(dir, "data")))
      {
        Directory.CreateDirectory(Path.Combine(dir, "data"));
      }

      var builder = WebApplication.CreateBuilder(args);
      IConfiguration configuration = builder.Configuration;

      // Add services to the container.

      builder.Services.AddControllers().AddNewtonsoftJson();
      builder.Services.AddScoped<MongoClient>(p =>
      {
        var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";

        if (File.Exists(Path.Combine(dir, "data", "localhost.txt")))
        {
          connection = connection.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "data", "localhost.txt"))[0]);
        }

        var settings = MongoClientSettings.FromConnectionString(connection);
        settings.ConnectTimeout = TimeSpan.FromSeconds(5);
        settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
        var client = new MongoClient(settings);
        return client;
      });
      builder.Services.AddScoped<ConnectionFactory>(o =>
      {
        var hostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost";
        if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
        {
          hostName = hostName.Replace("localhost", LocalDataModel.IPAddress);
        }

        return new ConnectionFactory()
        {
          HostName = hostName,
          UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
          Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
        };
      });
      builder.Services.AddHostedService<DatabaseService>();

      builder.Services.AddAuthentication(option =>
      {
        option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      }).AddJwtBearer(options =>
      {
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

        options.Events = new JwtBearerEvents
        {
          OnMessageReceived = context =>
                {
                  //var auth = context.Request.Headers["Authorization"].ToString();
                  //var accessToken = auth.Replace("Bearer ", "");
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                          (path.StartsWithSegments("/hubs")))
                {
                  context.Token = accessToken;
                }
                return Task.CompletedTask;
              },
          OnChallenge = context =>
                {
                  //此处代码为终止.Net Core默认的返回类型和数据结果，这个很重要哦，必须
                context.HandleResponse();
                var payload = new { StatusCode = 0, Message = "Authentication failed" };
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.WriteAsync(Convert.ToString(payload));
                return Task.FromResult(0);
              }
        };
      });

      builder.Services.AddAuthorization();
      builder.Services.AddSignalR();
      builder.Services.AddHealthChecks();
      var app = builder.Build();

      // Configure the HTTP request pipeline.

      app.UseAuthentication();
      app.UseAuthorization();
      app.UseHealthChecks("/api/health");
      app.MapControllers();
      app.MapHub<ChatHub>("/hubs/chat");
      app.Run();
    }
  }
}
