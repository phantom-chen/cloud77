using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace SingleSignOnService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var location = Assembly.GetExecutingAssembly().Location;
            var root = Directory.GetParent(location)?.ToString() ?? "";
            var connection = "server=localhost;database=dev_db;user=root;password=123456";
            if (File.Exists(Path.Combine(root, "localhost.txt")))
            {
                var ip = File.ReadAllText(Path.Combine(root, "localhost.txt")).Trim();
                connection = $"server={ip};database=dev_db;user=root;password=123456";
            }

            // Add services to the container.
            builder.Services.AddDbContext<DatabaseModel>(option =>
            {
                option.UseMySQL(connection);
            });
            builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;

                options.User.AllowedUserNameCharacters = "qwertyuiopasdfghjklzxcvbnm";
                options.User.RequireUniqueEmail = false;
            }).AddEntityFrameworkStores<DatabaseModel>()
            .AddDefaultTokenProviders();

            builder.Services.Configure<CookiePolicyOptions>(options =>
            {
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            builder.Services.ConfigureApplicationCookie(options =>
            {

            });
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("admin-only", builder =>
                {
                    builder.RequireRole("admin");
                });
            });

            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthorization();

            InitializeDatabase(app);

            app.MapControllers();

            app.Run();
        }

        private static void InitializeDatabase(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DatabaseModel>();

                if (!context.Users.Any())
                {
                    var user = new IdentityUser()
                    {
                        Email = "demo@demo.com",
                        NormalizedEmail = "demo@demo.com".ToUpper(),
                        UserName = "demo",
                        NormalizedUserName = "demo".ToUpper(),
                        EmailConfirmed = true,
                        PasswordHash = "123456",
                        PhoneNumber = "123456789",
                        PhoneNumberConfirmed = true,
                        TwoFactorEnabled = false,
                        LockoutEnabled = true,
                        LockoutEnd = DateTime.Now.AddHours(1),
                        AccessFailedCount = 0
                    };

                    context.Add<IdentityUser>(user);
                    context.SaveChanges();
                }
            }
        }
    }
}
