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
                var indexhtml = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "server", "wwwroot", "hello", "index.html");
                var demo = File.ReadAllText(indexhtml);
                await context.Response.WriteAsync(demo);
            }
            else
            {
                await next(context);
            }
        }
    }
}
