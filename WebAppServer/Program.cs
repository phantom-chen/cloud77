namespace WebAppServer
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.

			builder.Services.AddControllers();

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			app.UseDefaultFiles();
			app.UseStaticFiles();
			app.UseAuthorization();

			app.UseMiddleware<APIMiddleware>();

			app.UseCors(x => x
			 .AllowAnyMethod()
			 .AllowAnyHeader()
			 .SetIsOriginAllowed(origin => true)
			 .AllowCredentials());
			app.MapControllers();

			app.Run();
		}
	}

	public class RewriteConfig
	{
		public string Name { get; set; } = string.Empty;
		public string BaseUrl { get; set; } = string.Empty;
		public string Prefix { get; set; } = string.Empty;
	}

	public class APIMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly HttpClient _httpClient;
		private readonly List<RewriteConfig> _rewrites;
		public APIMiddleware(RequestDelegate next, IConfiguration configuration)
		{
			_next = next;
			_httpClient = new HttpClient();
			_rewrites = configuration.GetSection("rewrites").Get<List<RewriteConfig>>() ?? new List<RewriteConfig>();
		}

		public async Task InvokeAsync(HttpContext context)
		{
			var rewriteConfig = _rewrites.Find(r => context.Request.Path.StartsWithSegments("/" + r.Name));
			if (rewriteConfig != null)
			{
				Console.WriteLine($"Rewrite Route: {rewriteConfig.Name}, BaseUrl: {rewriteConfig.BaseUrl}, Prefix: {rewriteConfig.Prefix}");
			}

			// Check if the request path starts with /api
			if (rewriteConfig != null)
			{
				// Build the proxy URL
				var proxyUrl = $"{rewriteConfig.BaseUrl}{context.Request.Path}{context.Request.QueryString}".Replace(rewriteConfig.Name, rewriteConfig.Prefix);

				// Create a new request message
				var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), proxyUrl);

				// Send the request to the proxy server
				var responseMessage = await _httpClient.SendAsync(requestMessage);

				// Copy the response back to the original context
				context.Response.StatusCode = (int)responseMessage.StatusCode;

				var responseContent = await responseMessage.Content.ReadAsByteArrayAsync();
				await context.Response.Body.WriteAsync(responseContent, 0, responseContent.Length);
			}
			else
			{
				// If the path does not start with /api, continue to the next middleware
				await _next(context);
			}
		}
	}
}
