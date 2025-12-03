namespace GatewayService.Middleware
{
  public class MemoryCacheMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    private Dictionary<string, string> cache = new Dictionary<string, string>();

    public MemoryCacheMiddleware(
    RequestDelegate next,
    IConfiguration configuration,
    ILoggerFactory logFactory)
    {
      _next = next;
      _configuration = configuration;
      _logger = logFactory.CreateLogger<MemoryCacheMiddleware>();
      _logger.LogInformation("cache middleware is running");
    }

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
