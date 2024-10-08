using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Consul;
using UserService.Middlewares;
using System.Net.Http;
using UserService.Hubs;
using Microsoft.AspNetCore.Http;
using UserService.Contexts;
using MongoDB.Driver;
using UserService.Filters;
using Cloud77.Service;
using System.IO;
using MassTransit;

namespace UserService
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
            Cloud77Utility.DatabaseName = Configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                Cloud77Utility.DatabaseName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }

            services.AddCors(options =>
            {
                options.AddPolicy("cors-policy", builder =>
                {
                    builder.WithOrigins("http://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            services.AddSingleton<TimerManager>();

            services.AddSingleton<IConsulClient, ConsulClient>(p =>
            {
                return new ConsulClient(config =>
                {
                    var addr = Configuration["Consul_address"] ?? "";
                    config.Address = new Uri(addr);
                });
            });

            services.AddScoped<MongoClient>(p =>
            {
                var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
                if (File.Exists("./cluster.txt"))
                {
                    connection = File.ReadAllText("./cluster.txt");
                }
                return new MongoClient(connection);
            });

            services.AddScoped<CacheContext>();
            services.AddScoped<RequiredQueryAttribute>();
            services.AddSingleton<MessageQueueContext>();

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

            services.AddAuthorization(options =>
            {
                options.AddPolicy("require-admin", policy => policy.RequireAssertion(context =>
                {
                    var roleClaim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
                    if (roleClaim == null) return false;
                    return roleClaim.Value == "Administrator";
                }));
            });

            // todo: add scheduled task

            services.AddMassTransit(x =>
            {
                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(Environment.GetEnvironmentVariable("MQ_HOST") ?? "localhost", "/", h => {
                        h.Username(Environment.GetEnvironmentVariable("MQ_USERNAME") ?? "admin");
                        h.Password(Environment.GetEnvironmentVariable("MQ_PASSWORD") ?? "123456");
                    });

                    cfg.ConfigureEndpoints(context);
                });
            });

            services.AddHealthChecks();

            services.AddControllers().AddNewtonsoftJson();
            services.AddSignalR();
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
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthorization();
            app.UseCors("cors-policy");
            app.UseMiddleware<CacheMiddleware>();
            app.UseMiddleware<ErrorHandlingMiddleware>();

            app.UseHealthChecks("/api/health");

            app.UseConsul(lifetime, Configuration);

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/hubs/chat");
            });
        }
    }
}
