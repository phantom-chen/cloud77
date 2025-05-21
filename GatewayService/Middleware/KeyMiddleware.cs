using Microsoft.Extensions.Primitives;

namespace GatewayService.Middleware
{
  public class ServiceResponse
  {
    public string Code { get; set; } = "";


    public string Message { get; set; } = "";


    public string Id { get; set; } = "";

    public ServiceResponse(string code)
    {
      if (code == null)
      {
        return;
      }

      switch (code.Length)
      {
        case 19:
          switch (code[0])
          {
            case 'e':
              if (code == "empty-refresh-token")
              {
                Message = "empty refresh token";
              }

              break;
            case 'l':
              if (code == "logout-code-removed")
              {
                Message = "logout code is removed";
              }

              break;
          }

          break;
        case 18:
          switch (code[11])
          {
            case 'p':
              if (code == "empty-user-profile")
              {
                Message = "empty user profile";
              }

              break;
            case 'l':
              if (code == "empty-user-license")
              {
                Message = "empty user license";
              }

              break;
          }

          break;
        case 17:
          switch (code[0])
          {
            case 'e':
              if (code == "empty-user-device")
              {
                Message = "empty user device";
              }

              break;
            case 'i':
              if (code == "invalid-algorithm")
              {
                Message = "invalid algorithm";
              }

              break;
          }

          break;
        case 13:
          if (code == "empty-account")
          {
            Message = "empty email and username";
          }

          break;
        case 14:
          if (code == "empty-password")
          {
            Message = "empty password or refresh token";
          }

          break;
        case 15:
          if (code == "empty-algorithm")
          {
            Message = "empty algorithm";
          }

          break;
        case 16:
          break;
      }
    }

    public ServiceResponse(string code, string email)
    {
      switch (code)
      {
        case "empty-user-entity":
          Message = "find no existing account for " + email;
          break;
        case "existing-user-entity":
          Message = "find existing account for " + email;
          break;
        case "invalid-password":
          Message = "incorrect password / refresh token for " + email;
          break;
      }
    }

    public ServiceResponse(string code, string id, string message)
    {
      Code = code;
      Message = message;
      Id = id;
    }
  }
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
                        "/gateway-api"
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
