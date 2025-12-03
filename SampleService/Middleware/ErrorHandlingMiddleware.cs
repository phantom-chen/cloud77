using Cloud77.Abstractions.Service;
using SampleService.Models;

namespace SampleService.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly TextLoggingModel model = new TextLoggingModel();

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;

        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                model.AppendLog("before processing request");
                await next(context);
                model.AppendLog("after processing request");
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
            finally
            {
                model.AppendLog("after error handling");
            }
        }
    }
}
