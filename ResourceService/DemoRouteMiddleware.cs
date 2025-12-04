namespace ResourceService
{
    public class DemoRouteMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<DemoRouteMiddleware> logger;

        public DemoRouteMiddleware(RequestDelegate next, ILogger<DemoRouteMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.ToString();
            logger.LogInformation(path);

            if (path.StartsWith("/demo/"))
            {
                var demo = File.ReadAllText(@"./wwwroot/hello/index.html");
                await context.Response.WriteAsync(demo);
            }
            else
            {
                await next(context);
            }
        }
    }
}
