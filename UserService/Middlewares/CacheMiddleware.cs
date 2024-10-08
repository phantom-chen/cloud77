using UserService.Contexts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace UserService.Middlewares
{
    public class CacheMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly ILogger _logger;

        private Dictionary<string, string> cache = new Dictionary<string, string>();

        private string GetCache(string endpoint)
        {
            if (cache.ContainsKey(endpoint))
            {
                return cache[endpoint];
            }
            else
            {
                return null;
            }
        }

        private void InsertCache(string endpoint, string payload)
        {
            cache.Add(endpoint, payload);
        }

        public CacheMiddleware(
            RequestDelegate next,
            IConfiguration configuration,
            ILoggerFactory logFactory)
        {
            _next = next;
            _configuration = configuration;
            _logger = logFactory.CreateLogger("cache-middleware");
            _logger.LogInformation("cache middleware is running");
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.Value;
            var cache = GetCache(path);
            if (!string.IsNullOrEmpty(cache))
            {
                context.Response.StatusCode = 200;
                context.Response.ContentType = "application/json";
                context.Response.Headers.Append("X-Response-Data", "Middleware cache");
                await context.Response.WriteAsync(cache);
            }
            else
            {
                await _next.Invoke(context);
                //context.Response.Body.ToString();
                //InsertCache(context.Request.Path.Value, Newtonsoft.Json.JsonConvert.SerializeObject(result));
            }
        }
    }
}
