using GatewayService.Models;
using System.Net;
using System.Text;
using System.Text.Json;

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
      string[] whiteList = new string[] { "/favicon.ico", "/api/health", "/gateway-api" };
      
      var history = true;
      if (whiteList.Contains(context.Request.Path.Value))
      {
        history = false;
      }

      if (context.Request.Method == HttpMethod.Get.ToString()
        && context.Response.StatusCode == StatusCodes.Status200OK)
      {
        history = false;
      }

      if (context.Response.StatusCode == StatusCodes.Status500InternalServerError)
      {
        logger.LogInformation("to log (error)");
      }

      //First, get the incoming request
      //var request = await FormatRequest(context.Request);
      //using (StringReader reader = new StringReader(context.Request.Body))
      //{

      //}
      //var a = await new StreamReader(context.Request.Body).ReadToEndAsync();
      context.Request.EnableBuffering();

      var request = "";
      var body = "";
      // Read the request body
      using (var reader = new StreamReader(
          context.Request.Body,
          encoding: Encoding.UTF8,
          detectEncodingFromByteOrderMarks: false,
          bufferSize: 1024,
          leaveOpen: true))
      {
        body = await reader.ReadToEndAsync();

        if (IsJson(body))
        {
          body = MinifyJson(body);
        }

        request = $"Method: {context.Request.Method}\nPath: {context.Request.Path}\nQuery: {context.Request.QueryString}\nPayload: {body}\nTimestamp: {DateTime.UtcNow}";
        // Reset the request body stream position for the next middleware
        context.Request.Body.Position = 0;
      }
      
      // Get the IP address of the request
      //var ipAddress = context.Connection.RemoteIpAddress?.ToString();
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

        //$"IP: {ipAddress}";
        if (history)
        {
          new LocalDataModel().AppendHistory($"{request}\n{response}");
        }

        //Copy the contents of the new memory stream (which contains the response) to the original stream, which is then returned to the client.
        await responseBody.CopyToAsync(originalBodyStream);
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

      //StringValues version = new StringValues("N/A");
      //StringValues email = new StringValues("N/A");
      //request.Headers.TryGetValue("x-api-version", out version);
      //request.Headers.TryGetValue("x-user-email", out email);
      //$"Scheme: {request.Scheme}\nHost: {request.Host}\n";

      return $"Method: {request.Method}\nPath: {request.Path}\nQuery: {request.QueryString}\nPayload: {bodyAsText}\nTimestamp: {DateTime.UtcNow}";
    }

    private async Task<string> FormatResponse(HttpResponse response)
    {
      //We need to read the response stream from the beginning...
      response.Body.Seek(0, SeekOrigin.Begin);

      //...and copy it into a string
      string text = await new StreamReader(response.Body).ReadToEndAsync();

      //We need to reset the reader for the response so that the client can read it.
      response.Body.Seek(0, SeekOrigin.Begin);

      if (IsJson(text))
      {
        text = MinifyJson(text);
      }

      //Return the string for the response, including the status code (e.g. 200, 404, 401, etc.)
      return $"Status: {response.StatusCode}\nResponse: {text}";
    }

    private bool IsJson(string input)
    {
      try
      {
        JsonDocument.Parse(input);
        return true;
      }
      catch
      {
        return false;
      }
    }

    private string MinifyJson(string json)
    {
      using var document = JsonDocument.Parse(json);
      return JsonSerializer.Serialize(document, new JsonSerializerOptions
      {
        WriteIndented = false
      });
    }
  }
}
