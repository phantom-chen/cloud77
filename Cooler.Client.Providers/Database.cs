using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Common;
using System.Data.Entity;
using System.Data.SQLite;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SQLite.EF6;

namespace Cooler.Client.Providers
{
    public class SQLiteConfig : DbConfiguration
    {
        public SQLiteConfig()
        {
            SetProviderFactory("System.Data.SQLite", SQLiteFactory.Instance);
            SetProviderFactory("System.Data.SQLite.EF6", SQLiteProviderFactory.Instance);
            SetProviderServices("System.Data.SQLite", SQLiteProviderFactory.Instance.GetService(typeof(DbProviderServices)) as DbProviderServices);
        }
    }

    internal class AppDatabase : DbContext
    {
        public AppDatabase(string dataSource) : base(new SQLiteConnection()
        {
            ConnectionString = new SQLiteConnectionStringBuilder()
            {
                DataSource = dataSource,
                ForeignKeys = true
            }.ConnectionString
        },
    true)
        {
            this.Configuration.LazyLoadingEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            //modelBuilder.Entity<Bookmark>().ToTable("Bookmarks");
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Tester> Testers { get; set; }
        public DbSet<Bookmark> Bookmarks { get; set; }
    }


    public class DatabaseProvider : IDatabaseProvider
    {
        public DatabaseProvider(string path)
        {
            database = new AppDatabase(path);
        }

        private AppDatabase database;

        public IEnumerable<Tester> GetTesters()
        {
            var testers = database.Testers;
            return testers;
        }

        public void AddTester(string name)
        {
            database.Testers.Add(new Tester()
            {
                Guid = Guid.NewGuid().ToString(),
                Name = name
            });

            database.SaveChanges();
        }
    }
}
