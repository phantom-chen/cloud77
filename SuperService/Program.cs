using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using RabbitMQ.Client;
using SuperService.Backgrounds;
using SuperService.Models;
using SuperService.Services;
using System.Security.Claims;
using System.Text;
using MassTransit;
using System.Diagnostics;
using System.Reflection;
using SuperService.Middleware;
using Cloud77.Abstractions;
using System.Runtime.InteropServices;

namespace SuperService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            ServiceDataModel.ServiceName = "Super";
            var location = Assembly.GetExecutingAssembly().Location;
            var root = Directory.GetParent(location)?.ToString() ?? "";
            ServiceDataModel.LogFileExtension = Environment.GetEnvironmentVariable("CUSTOM_LOGGING") ?? "";
            var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
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

            new ServiceDataModel().AppendLog("Super service starts");
            var builder = WebApplication.CreateBuilder(args);

            // Accessing IConfiguration and IWebHostEnvironment from the builder
            IConfiguration configuration = builder.Configuration;
            IWebHostEnvironment environment = builder.Environment;

            // Add services to the container.
            builder.Services.AddScoped<TokenGenerator>();
            builder.Services.AddScoped<MongoClient>(p =>
            {
                var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
                if (!string.IsNullOrEmpty(ServiceDataModel.IPAddress))
                {
                    connection = connection.Replace("localhost", ServiceDataModel.IPAddress);
                }

                return new MongoClient(connection);
            });
            builder.Services.AddScoped<ConnectionFactory>(o =>
            {
                var hostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost";
                if (!string.IsNullOrEmpty(ServiceDataModel.IPAddress))
                {
                    hostName = hostName.Replace("localhost", ServiceDataModel.IPAddress);
                }

                return new ConnectionFactory()
                {
                    HostName = hostName,
                    UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
                    Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
                };
            });

            builder.Services.AddMassTransit(x =>
           {
               x.UsingRabbitMq((context, cfg) =>
         {
                 var hostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost";
                 if (!string.IsNullOrEmpty(ServiceDataModel.IPAddress))
                 {
                     hostName = hostName.Replace("localhost", ServiceDataModel.IPAddress);
                 }

                 cfg.Host(hostName, "/", h =>
           {
                   h.Username(Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin");
                   h.Password(Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456");
               });

                 cfg.ConfigureEndpoints(context);
             });
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["SecurityKey"] ?? "")),
                    ValidIssuer = configuration["Issuer"],
                    ValidAudience = configuration["Audience"],
                    ClockSkew = TimeSpan.FromSeconds(30),
                    RequireExpirationTime = true,
                };
            });

            builder.Services.AddAuthorization();
            builder.Services.AddHealthChecks();
            builder.Services.AddControllers();

            builder.Services.AddGrpcHealthChecks().AddCheck("rpc-service-health", () => HealthCheckResult.Healthy());
            builder.Services.AddGrpc();
            builder.Services.AddHostedService<MessageQueueBackgroundService>();
            builder.Services.AddHostedService<SimpleBackgroundService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Configure the HTTP request pipeline.
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<ErrorHandlingMiddleware>();
            app.UseHealthChecks("/api/health");
            app.MapControllers();

            //app.UseEndpoints(endpoints =>
            //{
            //  endpoints.Map("/api/version", async context =>
            //  {
            //    var version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;
            //    Assembly assembly = Assembly.GetExecutingAssembly();
            //    FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
            //    var content = fileVersionInfo.FileVersion;
            //    await context.Response.WriteAsync(content);
            //  });

            //  endpoints.MapGet("/", async context =>
            //  {
            //    await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");
            //  });
            //});

            // rpc services
            app.MapGrpcHealthChecksService();
            app.MapGrpcService<UserService>();
            app.MapGrpcService<MessageService>();
            app.MapGrpcService<SettingService>();
            app.MapGrpcService<AccountService>();

            app.Run();
        }
    }
}
