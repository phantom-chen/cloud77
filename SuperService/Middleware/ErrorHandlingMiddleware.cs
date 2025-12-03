using Cloud77.Abstractions.Service;
using SuperService.Models;

namespace SuperService.Middleware
{
  public class ErrorHandlingMiddleware
  {
    private readonly RequestDelegate next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
      this.next = next;
    }

    public async Task Invoke(HttpContext context)
    {
      try
      {
        await next(context);
      }
      catch (Exception ex)
      {
        var id = Guid.NewGuid().ToString();
        if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("CUSTOM_LOGGING")))
        {
          File.WriteAllText(Path.Combine(LocalDataModel.Root, "errors", $"{id}.txt"), ex.Message);
        }

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
                var response = new InternalError(ex.Message);
        var content = Newtonsoft.Json.JsonConvert.SerializeObject(response);
        await context.Response.WriteAsync(content);
      }
    }
  }
}
