using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SingleSignOnService
{
    public class DatabaseModel : IdentityDbContext
    {
        public DatabaseModel(DbContextOptions<DatabaseModel> options) : base(options) { }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    base.OnModelCreating(builder);
        //    //builder.Entity<IdentityUser>().ToTable("Users");
        //    //builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogins");
        //    //builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaims");
        //    //builder.Entity<IdentityUserToken<string>>().ToTable("UserTokens");
        //    //builder.Entity<IdentityRole>().ToTable("Roles");
        //    //builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
        //    //builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
        //}
    }
}
