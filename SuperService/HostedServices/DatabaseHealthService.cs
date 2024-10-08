using Cloud77.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Newtonsoft.Json;
using SuperService.Contexts;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SuperService.HostedServices
{
    public class DatabaseHealthService : IHostedService
    {
        private readonly ILogger<DatabaseHealthService> logger;
        private IMongoDatabase database;
        public DatabaseHealthService(ILogger<DatabaseHealthService> logger, IConfiguration configuration)
        {
            this.logger = logger;
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
            if (File.Exists("./cluster.txt"))
            {
                connection = File.ReadAllText("./cluster.txt");
            }
            var client = new MongoClient(connection);
            database = client.GetDatabase(dbName);
        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(LoopData);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task LoopData()
        {
            while (true)
            {
                await Task.Delay(5000);
                var collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
                var filter = Builders<UserMongoEntity>.Filter.Exists("Confirmed", false);
                var result = collection.Find(filter).FirstOrDefault();
                if (result != null)
                {
                    logger.LogInformation(result.Email);
                    var _collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
                    var _filter = Builders<EventMongoEntity>.Filter.And(
                        Builders<EventMongoEntity>.Filter.Eq("Email", result.Email),
                        Builders<EventMongoEntity>.Filter.Eq("Name", "Verify-Email"));
                    var results = _collection.Find(_filter).ToList();

                    var confirmed = results.Any(e =>
                    {
                        var payload = JsonConvert.DeserializeObject<TokenPayload>(e.Payload);
                        return payload.Usage == "verify-email" && payload.Exp.Year == 1;
                    });

                    logger.LogInformation(confirmed.ToString());
                    var __filter = Builders<UserMongoEntity>.Filter.Eq("Email", result.Email);
                    var update = Builders<UserMongoEntity>.Update.Set("Confirmed", confirmed);
                    var ad = collection.UpdateOne(__filter, update).IsAcknowledged;
                    logger.LogInformation(ad.ToString());
                }
            }
        }
    }
}
