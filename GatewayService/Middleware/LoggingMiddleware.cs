using Microsoft.Extensions.Primitives;
using System.Reflection;
using System.Text;

namespace GatewayService.Middleware
{
  public class LoggingMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly ILogger logger;

    public LoggingMiddleware(RequestDelegate next, ILoggerFactory factory)
    {
      _next = next;
      logger = factory.CreateLogger<LoggingMiddleware>();
    }

    public async Task Invoke(HttpContext context)
    {
      // handle logging after request is done
      var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
      if (!Directory.Exists(Path.Combine(dir, "data", "logs")))
      {
        Directory.CreateDirectory(Path.Combine(dir, "data", "logs"));
      }
      var date = DateTime.Now.ToString("yyyyMMdd");
      //File.WriteAllText(Path.Combine(dir, "data", "logs", "gateway", $"{date}.txt"), "123");

      string[] whiteList = new string[] { "/favicon.ico", "/api/health", "/api/service-info" };

      if (whiteList.Contains(context.Request.Path.Value))
      {
        await _next(context);
      }
      else
      {
        string log;
        // for put / post / delete
        // 500 code

        if (context.Request.Method.ToLower() != "get")
        {
          logger.LogInformation("to log (put/post/delete)");

          //Copy a pointer to the original response body stream
          var originalBodyStream = context.Response.Body;

          //Create a new memory stream...
          using (var responseBody = new MemoryStream())
          {
            //...and use that for the temporary response body
            context.Response.Body = responseBody;

            //Continue down the Middleware pipeline, eventually returning to this class
            await _next(context);

            //Format the response from the server
            var response = await FormatResponse(context.Response);

            if (context.Response.StatusCode == StatusCodes.Status500InternalServerError)
            {
              logger.LogInformation("to log (error)");
              logger.LogInformation(response);
            }

            //TODO: Save log to chosen datastore
            //await File.AppendAllTextAsync($"logs.txt", log = log + "\n" + response + "\n\n");
            //logger.LogInformation(log + "\n" + response + "\n\n");

            //Copy the contents of the new memory stream (which contains the response) to the original stream, which is then returned to the client.
            await responseBody.CopyToAsync(originalBodyStream);
          }


        }
        else
        {
          await _next(context);

          if (context.Response.StatusCode == StatusCodes.Status500InternalServerError)
          {
            logger.LogInformation("to log (error)");
          }
        }


        //First, get the incoming request
        //var request = await FormatRequest(context.Request);

        //log = request;


      }
    }

    private async Task<string> FormatRequest(HttpRequest request)
    {
      var body = request.Body;

      //This line allows us to set the reader for the request back at the beginning of its stream.
      request.EnableBuffering();

      //We now need to read the request stream.  First, we create a new byte[] with the same length as the request stream...
      var buffer = new byte[Convert.ToInt32(request.ContentLength)];

      //...Then we copy the entire request stream into the new buffer.
      await request.Body.ReadAsync(buffer, 0, buffer.Length);

      //We convert the byte[] into a string using UTF8 encoding...
      var bodyAsText = Encoding.UTF8.GetString(buffer);

      //..and finally, assign the read body back to the request body, which is allowed because of EnableRewind()
      request.Body = body;

      StringValues version = new StringValues("N/A");
      StringValues email = new StringValues("N/A");
      request.Headers.TryGetValue("x-api-version", out version);
      request.Headers.TryGetValue("x-user-email", out email);

      return $"Scheme: {request.Scheme}\nHost: {request.Host}\nMethod: {request.Method}\nPath: {request.Path}\nQuery: {request.QueryString}\nPayload: {bodyAsText}\nX-API-Version: {version.FirstOrDefault()}\nX-User-Email: {email.FirstOrDefault()}\nTimestamp: {DateTime.UtcNow}";
    }

    private async Task<string> FormatResponse(HttpResponse response)
    {
      //We need to read the response stream from the beginning...
      response.Body.Seek(0, SeekOrigin.Begin);

      //...and copy it into a string
      string text = await new StreamReader(response.Body).ReadToEndAsync();

      //We need to reset the reader for the response so that the client can read it.
      response.Body.Seek(0, SeekOrigin.Begin);

      //Return the string for the response, including the status code (e.g. 200, 404, 401, etc.)
      return $"Status: {response.StatusCode}\nResponse: {text}";
    }
  }
}
