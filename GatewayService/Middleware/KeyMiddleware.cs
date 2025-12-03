using GatewayService.Models;
using Microsoft.Extensions.Primitives;

namespace GatewayService.Middleware
{
    public class KeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger logger;
        private readonly string _key;
        private readonly string emptyKeyMessage;
        private readonly string invalidKeyMessage;

        public KeyMiddleware(
            RequestDelegate next,
            IConfiguration configuration,
            ILoggerFactory logFactory)
        {
            _next = next;
            _key = configuration["APIKey"] ?? "";
            emptyKeyMessage = configuration["EmptyKeyMessage"] ?? "";
            invalidKeyMessage = configuration["InvalidKeyMessage"] ?? "";
            logger = logFactory.CreateLogger<KeyMiddleware>();
        }

        public async Task Invoke(HttpContext context)
        {
            if (string.IsNullOrEmpty(_key) || context.Request.Path == "/favicon.ico" || context.Request.Path == "/api/gateway")
            {
                await _next.Invoke(context);
            }
            else
            {
                string errorMessage = emptyKeyMessage;
                var key = GetKey(context.Request.Headers);
                if (key == _key)
                {
                    errorMessage = "";
                }
                else if (string.IsNullOrEmpty(key))
                {
                    errorMessage = invalidKeyMessage;
                }

                if (string.IsNullOrEmpty(errorMessage))
                {
                    await _next(context);
                }
                else
                {
                    logger.LogDebug(errorMessage);

                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    context.Response.ContentType = "application/json";
                    var response = new ServiceResponse()
                    {
                        Code = string.IsNullOrEmpty(key) ? "empty-api-key" : "bad-api-key",
                        Message = errorMessage
                    };
                    var content = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                    await context.Response.WriteAsync(content);
                }
            }
        }

        private string GetKey(IHeaderDictionary headers)
        {
            string key = "";
            if (headers.ContainsKey("x-api-key"))
            {
                StringValues keyHeader;
                headers.TryGetValue("x-api-key", out keyHeader);
                if (keyHeader.Count > 0)
                {
                    key = keyHeader.FirstOrDefault().ToString();
                }
            }
            return key;
        }
    }
}
