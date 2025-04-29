
using Cloud77.Service;
using MongoDB.Bson;
using MongoDB.Driver;
using ServiceStack;
using System.Reflection;
using UserService.Controllers;

namespace UserService.Services
{
    public class DatabaseService : IHostedService
    {
        private readonly ILogger<DatabaseService> logger;

        public DatabaseService(
            ILogger<DatabaseService> logger,
            IConfiguration configuration)
        {
            this.logger = logger;

            var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            if (File.Exists(Path.Combine(dir, "data", "localhost.txt")))
            {
                connection = connection.Replace("localhost", File.ReadAllLines(Path.Combine(dir, "data", "localhost.txt"))[0]);
            }
            logger.LogInformation($"Connecting to: {connection}");
            var settings = MongoClientSettings.FromConnectionString(connection);
            settings.ConnectTimeout = TimeSpan.FromSeconds(5);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
            var client = new MongoClient(settings);
            database = client.GetDatabase(configuration["Database"]);
            logger.LogInformation($"Database: {configuration["Database"]}");

        }

        private IMongoDatabase database;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("Database service started.");
            Task.Run(Execute);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task Execute()
        {
            var field = Environment.GetEnvironmentVariable("DB_UNSET_FIELD") ?? "";
            
            if (string.IsNullOrEmpty(field))
            {
                return;
            }
            logger.LogInformation($"Unsetting field: {field}");
            var collection = database.GetCollection<BsonDocument>(Cloud77Utility.Users);
            long count = 1;

            // remove field name
            while (count > 0)
            {
                var filter = Builders<BsonDocument>.Filter.Exists(field, true);
                var update = Builders<BsonDocument>.Update.Unset(field);

                var result = await collection.UpdateOneAsync(filter, update);
                count = result.ModifiedCount;
                if (result.MatchedCount > 0)
                {
                    logger.LogInformation($"{result.ModifiedCount} documents updated.");
                }
                else
                {
                    logger.LogInformation("No documents updated.");
                }
                await Task.Delay(2000);
            }
        }
    }
}
