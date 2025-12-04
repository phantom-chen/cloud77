using Cloud77.Abstractions.Entity;
using Microsoft.EntityFrameworkCore;

namespace UserService.MySQL.Collections
{
    public class MessageEntity
    {
        public int Id { get; set; }
        public string Message { get; set; }
    }

    public class UserMySQLEntity : ProfileEntity
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool? Confirmed { get; set; }
    }

    public class EventMySQLEntity : EventEntity
    {
        public int Id { get; set; }
    }

    public class DatabaseModel : DbContext
    {
        public DatabaseModel(DbContextOptions<DatabaseModel> options) : base(options) { }
        public DbSet<MessageEntity> Messages { get; set; }
        public DbSet<UserMySQLEntity> Users { get; set; }
        public DbSet<EventMySQLEntity> Events { get; set; }
    }
}
