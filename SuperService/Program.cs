using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Newtonsoft.Json;
using RabbitMQ.Client;
using SuperService.Backgrounds;
using SuperService.Middleware;
using SuperService.Models;
using SuperService.Services;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;

namespace SuperService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Initialize();

            new TextLoggingModel().AppendLog("Super service starts");
            var builder = WebApplication.CreateBuilder(args);

            // Accessing IConfiguration and IWebHostEnvironment from the builder
            IConfiguration configuration = builder.Configuration;
            IWebHostEnvironment environment = builder.Environment;

            // Add services to the container.
            builder.Services.AddScoped<TokenGenerator>();
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

            builder.Services.AddMassTransit(x =>
            {
                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(ServiceDataModel.GetVariable("MQ_HOST"), "/", h =>
                  {
                     h.Username(ServiceDataModel.GetVariable("MQ_USERNAME"));
                     h.Password(ServiceDataModel.GetVariable("MQ_PASSWORD"));
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
            builder.Services.AddHostedService<QueueBackgroundService>();
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

        private static void Initialize()
        {
            ServiceDataModel.ServiceName = "Super";

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
