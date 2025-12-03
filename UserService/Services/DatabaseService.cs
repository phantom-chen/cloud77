
using Cloud77.Abstractions.Entity;
using MongoDB.Bson;
using MongoDB.Driver;
using UserService.Collections;
using UserService.Models;
using Cloud77.Abstractions.Service;

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
            if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
            {
                connection = connection.Replace("localhost", LocalDataModel.IPAddress);
            }

            var settings = MongoClientSettings.FromConnectionString(connection);
            settings.ConnectTimeout = TimeSpan.FromSeconds(5);
            settings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
            var client = new MongoClient(settings);
            database = client.GetDatabase(configuration["Database"]);
        }

        private IMongoDatabase database;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(Execute);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private async Task Execute()
        {
            int index = -1;

            while (true)
            {
                await Task.Delay(5000);
                switch (index)
                {
                    case 0:
                        // remove field name
                        logger.LogInformation("Checking for field to unset...");
                        await UnsetFieldAsync();
                        break;
                    case 1:
                        logger.LogInformation("fix event create user");
                        break;
                    case 2:
                        logger.LogInformation("fix event verify email");
                        await FixVerifyEmailAsync();
                        break;
                    case 3:
                        logger.LogInformation("fix event reset password");
                        break;
                    default:
                        index = -1;
                        break;
                }
                index++;
            }
        }

        private async Task UnsetFieldAsync()
        {
            var field = Environment.GetEnvironmentVariable("DB_UNSET_FIELD") ?? "";

            if (string.IsNullOrEmpty(field))
            {
                return;
            }

            logger.LogInformation($"Unsetting field: {field}");
            var collection = database.GetCollection<BsonDocument>("Users");
            var filter = Builders<BsonDocument>.Filter.Exists(field, true);
            var update = Builders<BsonDocument>.Update.Unset(field);

            var result = await collection.UpdateOneAsync(filter, update);

            if (result.MatchedCount > 0)
            {
                logger.LogInformation($"{result.ModifiedCount} documents updated.");
            }
            else
            {
                logger.LogInformation("No documents updated.");
            }
        }

        private int skippedEvent = 0;

        private async Task FixVerifyEmailAsync()
        {
            var collection = database.GetCollection<EventMongoEntity>("Events");
            var filter = Builders<EventMongoEntity>.Filter.Eq("Name", "Verify-Email");
            var events = await collection.Find(filter).Skip(skippedEvent).Limit(1).ToListAsync();
            if (events.Any())
            {
                try
                {
                    if (events[0].Payload.Contains("Email"))
                    {
                        // not updated
                        var payload = Newtonsoft.Json.JsonConvert.DeserializeObject<TokenPayload>(events[0].Payload);
                        var newPayload = new TokenPayloadBase() { Token = payload.Token };
                        var update = Builders<EventMongoEntity>.Update.Set("Payload", Newtonsoft.Json.JsonConvert.SerializeObject(newPayload));
                        var eventFilter = Builders<EventMongoEntity>.Filter.Eq("_id", events[0].Id);
                        var ack = await collection.UpdateOneAsync(eventFilter, update);
                        if (ack.IsAcknowledged)
                        {
                            logger.LogInformation($"Event ID {events[0].Id} updated. index {skippedEvent}");
                        }
                        await Task.Delay(5000);
                    }
                    else
                    {
                        // already updated
                    }
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error processing event ID");
                }
                skippedEvent++;
            }
            else
            {
                logger.LogInformation("No more events to process.");
                return;
            }
        }
    }
}
