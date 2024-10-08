using Cloud77.Service;
using SuperService.Contexts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace SuperService.HostedServices
{
    public class ClusterService : IHostedService
    {
        private readonly ILogger<ClusterService> logger;
        private IMongoDatabase database;

        public ClusterService(
            ILogger<ClusterService> logger,
            MongoClient client,
            IConfiguration configuration)
        {
            this.logger = logger;

            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            database = client.GetDatabase(dbName);

            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            emailsPath = Path.Combine(dir, "data", "emails");
            if (!Directory.Exists(emailsPath))
            {
                Directory.CreateDirectory(emailsPath);
            }

            index = 0;
            while (File.Exists(Path.Combine(emailsPath, $"_{index + 1}.txt")))
            {
                index++;
            }
        }

        private string emailsPath = "";

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(RunService);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private Tuple<int, int, string> IntToOptions(int value)
        {
            switch (value)
            {
                case 1:
                    return new Tuple<int, int, string>(1, 1, "global");
                case 2:
                    return new Tuple<int, int, string>(1, 0, "global");
                case 3:
                    return new Tuple<int, int, string>(0, 1, "global");
                case 4:
                    return new Tuple<int, int, string>(0, 0, "global");
                case 5:
                    return new Tuple<int, int, string>(1, 1, "usa");
                case 6:
                    return new Tuple<int, int, string>(1, 0, "usa");
                case 7:
                    return new Tuple<int, int, string>(0, 1, "usa");
                case 8:
                    return new Tuple<int, int, string>(0, 0, "usa");
                default:
                    return null;
            }
        }

        private async Task RunService()
        {
            try
            {
                while (true)
                {
                    await Task.Delay(30000);

                    //PrintEvents("Update-License");

                    //FixVerifyEmailEvents();

                    CollectUsers();
                }
            }
            catch (Exception ex)
            {
                logger.LogInformation(ex.Message);
            }
        }

        private void PrintEvents(string name)
        {
            var collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
            var builder = Builders<EventMongoEntity>.Filter;
            builder.Eq("Name", name);
            //var filter2 = builder.Exists("Option1", exists: false);

            var entities = collection.Find(builder.Eq("Name", name)).Limit(10).ToList();
            foreach (var entity in entities)
            {
                logger.LogInformation(entity.ToBsonDocument().ToString());
            }
        }

        private void FixVerifyEmailEvents()
        {
            string name = "Verify-Email";
            var collection = database.GetCollection<EventMongoEntity>(Cloud77Utility.Events);
            var filter1 = Builders<EventMongoEntity>.Filter.Eq("Name", name);
            var filter2 = Builders<EventMongoEntity>.Filter.Where(x => string.IsNullOrEmpty(x.Payload));
            var entity = collection.Find(Builders<EventMongoEntity>.Filter.And(filter1, filter2)).FirstOrDefault();
            if (entity != null)
            {
                logger.LogInformation(entity.ToBsonDocument().ToString());

                // find tokens

                var payloads = collection.Find(Builders<EventMongoEntity>.Filter.And(
                    Builders<EventMongoEntity>.Filter.Eq("Name", "Issue-Email-Token"),
                    Builders<EventMongoEntity>.Filter.Eq("Email", entity.Email))).ToList();

                var tokens = payloads.Select(p =>
                {
                    var obj = Newtonsoft.Json.JsonConvert.DeserializeObject<TokenPayload>(p.Payload);
                    if (obj.Usage == "verify-email")
                    {
                        return obj.Token;
                    }
                    else
                    {
                        return "";
                    }
                }).Distinct().Where(x => !string.IsNullOrEmpty(x)).ToList();

                if (tokens.Count < 3)
                {
                    logger.LogInformation(tokens.FirstOrDefault());

                    var filter = Builders<EventMongoEntity>.Filter.Eq("_id", entity.Id);

                    var update = Builders<EventMongoEntity>.Update
                        .Set("Payload", Newtonsoft.Json.JsonConvert.SerializeObject(new TokenPayload()
                        {
                            Usage = "verify-email",
                            Token = tokens.Count == 1 ? tokens.FirstOrDefault() : tokens[1],
                        }));

                    var result = collection.UpdateOne(filter, update).IsAcknowledged;
                    logger.LogInformation(result.ToString());
                }
            }
            else
            {
                logger.LogInformation("no empty payload for verify email event");
            }
        }

        private int index = 0;

        private void CollectUsers()
        {
            // 25 per 30s
            // 100 per 2s
            // 100 * 100
            var size = 100;
            var collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
            var entities = collection.Find(Builders<UserMongoEntity>.Filter.Empty).Skip(index * size).Limit(size).ToList();

            if (entities.Count > 0)
            {
                index++;
                var emails = entities.Select(e => e.Email);
                File.WriteAllLines(Path.Combine(emailsPath, $"_{index}.txt"), emails);
                logger.LogInformation((index * size).ToString());
            }
            else
            {
                ReadTexts();
            }
        }

        private void ReadTexts()
        {
            // 100 lines
            // _1.txt
            // _2.txt

            // 500 lines
            // 1.txt 1-5
            // 2.txt 6-10

            if (File.Exists(Path.Combine(emailsPath, "1.txt")))
            {
                return;
            }

            var i = 1;
            var j = 0;
            var totalUsers = new List<string>();
            var users = new List<string>();
            while (File.Exists(Path.Combine(emailsPath, $"_{i}.txt")))
            {
                var lines = File.ReadAllLines(Path.Combine(emailsPath, $"_{i}.txt"));
                totalUsers.AddRange(lines);
                users.AddRange(lines);

                if (users.Count >= 500)
                {
                    j++;
                    File.WriteAllLines(Path.Combine(emailsPath, $"{j}.txt"), users);
                    users.Clear();
                }

                i++;
            }

            if (users.Count > 0)
            {
                j++;
                File.WriteAllLines(Path.Combine(emailsPath, $"{j}.txt"), users);
                users.Clear();
            }

            logger.LogInformation($"{totalUsers.Count} users");
            logger.LogInformation($"{totalUsers.Where(u => u.Substring(0, 1) == "a").Count()}");
            logger.LogInformation($"{totalUsers.Where(u => u.Substring(0, 1) == "b").Count()}");
            logger.LogInformation($"{totalUsers.Where(u => u.Substring(0, 1) == "0").Count()}");
            logger.LogInformation($"{totalUsers.Where(u => u.Substring(0, 1) == "1").Count()}");
        }
    }

    class TokenPayload
    {
        public string Usage { get; set; }
        public string Token { get; set; }
        public DateTime Exp { get; set; }
    }
}
