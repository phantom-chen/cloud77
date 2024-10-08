using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Consul;
using Microsoft.AspNetCore.Http;
using SuperService.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using ServiceStack;
using SuperService.Contexts;
using MongoDB.Driver;
using RabbitMQ.Client;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using SuperService.Extensions;
using Cloud77.Service;
using SuperService.HostedServices;
using SuperService.Protos;

namespace SuperService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            services.AddSingleton<IConsulClient, ConsulClient>(p =>
            {
                return new ConsulClient(config =>
                {
                    var addr = Configuration["Consul_address"] ?? "";
                    config.Address = new Uri(addr);
                });
            });
            services.AddSingleton<ConnectionFactory>(o =>
            {
                return new ConnectionFactory()
                {
                    HostName = Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost",
                    UserName = Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin",
                    Password = Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456"
                };
            });

            services.AddTransient<MongoClient>(p =>
            {
                var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
                if (File.Exists("./cluster.txt"))
                {
                    connection = File.ReadAllText("./cluster.txt");
                }
                return new MongoClient(connection);
            });

            //services.AddHostedService<MigrationService>();
            //services.AddHostedService<ClusterService>();
            services.AddHostedService<MessageConsumerService>();
            services.AddHostedService<ConsulService>();
            services.AddHostedService<DatabaseHealthService>();

            services.AddAuthentication(option =>
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
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["SecurityKey"])),
                    ValidIssuer = Configuration["Issuer"],
                    ValidAudience = Configuration["Audience"],
                    ClockSkew = TimeSpan.FromSeconds(30),
                    RequireExpirationTime = true,
                };
            });

            services.AddAuthorization();

            services.AddGrpcHealthChecks().AddCheck("sample", () => HealthCheckResult.Healthy());
            services.AddControllers();
            services.AddGrpc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime lifetime)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();

            app.UseRouting();

            app.UseAuthorization();

            app.UseConsul(lifetime, Configuration);
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<GreeterService>();
                endpoints.MapGrpcService<UserQueryService>();
                endpoints.MapGrpcService<UserTokenService>();
                endpoints.MapGrpcHealthChecksService();
                endpoints.MapControllers();
                endpoints.Map("/api/version", async context =>
                {
                    var version = Assembly.GetEntryAssembly().GetCustomAttribute<AssemblyInformationalVersionAttribute>().InformationalVersion;
                    Assembly assembly = Assembly.GetExecutingAssembly();
                    FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
                    var content = fileVersionInfo.FileVersion;
                    await context.Response.WriteAsync(content);

                });

                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");
                });
            });
        }
    }
}
