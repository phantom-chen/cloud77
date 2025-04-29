using Cloud77.Service;
using Microsoft.Extensions.Primitives;

namespace GatewayService.Middleware
{
  public class KeyMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    public KeyMiddleware(
        RequestDelegate next,
        IConfiguration configuration,
        ILoggerFactory logFactory)
    {
      _next = next;
      _configuration = configuration;
      _logger = logFactory.CreateLogger("api-key-check");
      _logger.LogInformation("api key check starts!");
    }

    public async Task Invoke(HttpContext context)
    {
      string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "";
      if (string.IsNullOrEmpty(env) || env.ToLower() == "development")
      {
        await _next.Invoke(context);
      }
      else
      {
        var apiKeyIgnore = false;
        if (apiKeyIgnore)
        {
          await _next.Invoke(context);
        }
        else
        {
          bool status = false;
          string errorMsg = "please attach api key in header";

          var whiteList = new List<string>
                    {
                        "/favicon.ico",
                        "/api/gateway",
                        "/sample-api"
                    };

          if (whiteList.ToList().Contains(context.Request.Path))
          {
            status = true;
          }
          else
          {
            if (context.Request.Headers.ContainsKey("x-api-key"))
            {

              StringValues apikey;

              context.Request.Headers.TryGetValue("x-api-key", out apikey);

              if (apikey.Count > 0)
              {
                var key = apikey.FirstOrDefault();
                if (!string.IsNullOrEmpty(key))
                {
                  if (key == _configuration["APIKey"])
                  {
                    status = true;
                  }
                  else
                  {
                    errorMsg = "please attach correct api key in header";
                  }
                }
                else
                {

                }
              }
              else
              {

              }
            }
            else
            {

            }
          }

          if (status)
          {
            await _next.Invoke(context);
          }
          else
          {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";
            var response = new ServiceResponse("empty-api-key", Guid.NewGuid().ToString(), errorMsg);
            var content = Newtonsoft.Json.JsonConvert.SerializeObject(response);
            await context.Response.WriteAsync(content);
          }
        }
      }

    }
  }
}
