using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using ServiceStack;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using UserService.Hubs;
using UserService.Middleware;
using UserService.Models;

namespace UserService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Initialize();

            new TextLoggingModel().AppendLog("User service starts");
            var builder = WebApplication.CreateBuilder(args);
            IConfiguration configuration = builder.Configuration;

            // Add services to the container.

            builder.Services.AddControllers().AddNewtonsoftJson();
            builder.Services.AddScoped<TextLoggingModel>();
            builder.Services.AddScoped<MongoClient>(p =>
            {
                var settings = MongoClientSettings.FromConnectionString(ServiceDataModel.GetVariable("DB_CONNECTION"));
                settings.ConnectTimeout = TimeSpan.FromSeconds(5);
                settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
                var client = new MongoClient(settings);
                return client;
            });
            builder.Services.AddScoped<ConnectionFactory>(o =>
            {
                return new ConnectionFactory()
                {
                    HostName = ServiceDataModel.GetVariable("MQ_HOST"),
                    UserName = ServiceDataModel.GetVariable("MQ_USERNAME"),
                    Password = ServiceDataModel.GetVariable("MQ_PASSWORD")
                };
            });


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

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("cors-policy", builder =>
          {
              builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
              //builder.AllowCredentials();
          });
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("require-admin", policy => policy.RequireAssertion(context =>
          {
              var roleClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
              if (roleClaim == null) return false;
              return roleClaim.Value == "Administrator";
          }));
            });

            builder.Services.AddAuthorization();
            builder.Services.AddSignalR();
            builder.Services.AddHealthChecks();
            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("cors-policy");
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseHealthChecks("/api/health");
            app.MapControllers();
            app.MapHub<ChatHub>("/hubs/chat");
            app.Run();
        }
        
        private static void Initialize()
        {
            ServiceDataModel.ServiceName = "User";
            
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
            ServiceDataModel.UpdateVariable("REDIS_HOST", Environment.GetEnvironmentVariable("REDIS_HOST") ?? "localhost");
            ServiceDataModel.UpdateVariable("REDIS_PASSWORD", Environment.GetEnvironmentVariable("REDIS_PASSWORD") ?? "123456");
            ServiceDataModel.UpdateVariable("MQ_HOST", Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost");
            ServiceDataModel.UpdateVariable("MQ_USERNAME", Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin");
            ServiceDataModel.UpdateVariable("MQ_PASSWORD", Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456");
        }
    }
}
