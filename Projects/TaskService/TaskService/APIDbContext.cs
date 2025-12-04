using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace todo_api
{
    public class APIDbContext: DbContext
    {
        public APIDbContext(DbContextOptions options): base(options) { }
        public DbSet<Todo> Todos { get; set; }
    }
}
