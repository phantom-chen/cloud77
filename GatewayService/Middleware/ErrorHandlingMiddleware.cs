using Cloud77.Service;
using System.Reflection;

namespace GatewayService.Middleware
{
  public class ErrorHandlingMiddleware
  {
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(
        RequestDelegate next)
    {
      _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
      try
      {
        await _next.Invoke(context);
      }
      catch (Exception ex)
      {
        var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
        if (!Directory.Exists(Path.Combine(dir, "data", "errors")))
        {
          Directory.CreateDirectory(Path.Combine(dir, "data", "errors"));
        }
        var id = Guid.NewGuid().ToString();
        File.WriteAllText(Path.Combine(dir, "data", "errors", $"{id}.txt"), ex.Message);
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        var response = new ServiceResponse("internal-server-error", id, ex.Message);
        var content = Newtonsoft.Json.JsonConvert.SerializeObject(response);
        await context.Response.WriteAsync(content);
      }
    }
  }
}
