using Cloud77.Abstractions.Entity;
using MongoDB.Driver;
using Newtonsoft.Json;
using SuperService.Collections;
using SuperService.Models;

namespace SuperService.Backgrounds
{
    /// <summary>
    /// Background service creates users index.json that contains all users' emails.
    /// It also sets up daily health check.
    /// </summary>
    public class SimpleBackgroundService : IHostedService
    {
        private readonly ILogger<SimpleBackgroundService> logger;
        //private readonly MongoClient client;
        private readonly IMongoDatabase database;
        //private readonly IMongoCollection<UserMongoEntity> collection;
        //private Timer _timer;

        private Timer _healthCheckTimer;
        private int checkHour = 0;

        public SimpleBackgroundService(ILogger<SimpleBackgroundService> logger, IConfiguration configuration)
        {
            var connection = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? "localhost";
            if (!string.IsNullOrEmpty(LocalDataModel.IPAddress))
            {
                connection = connection.Replace("localhost", LocalDataModel.IPAddress);
            }

            var client = new MongoClient(connection);
            database = client.GetDatabase(configuration["Database"]);
            var model = new LocalDataModel();
            checkHour = Convert.ToInt16(model.GetSetting("health_check_hour_utc") ?? "0");

            this.logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Task.Run(GenerateUserQuery);
            Task.Run(DailyHealthCheck);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("stop service");
            if (_healthCheckTimer != null)
            {
                _healthCheckTimer.Change(Timeout.Infinite, 0);
            }

            return Task.CompletedTask;
        }

        private async Task GenerateUserQuery()
        {
            var index = 0;
            var size = 100;
            var count = 0;
            List<User> userList = new List<User>();
            logger.LogInformation("start loop");
            var collection = database.GetCollection<UserMongoEntity>("Users");

            while (!new LocalDataModel().HasUsers)
            {
                try
                {
                    await Task.Delay(5000);
                    var users = await collection.Find(Builders<UserMongoEntity>.Filter.Empty).Skip(index * size).Limit(size).ToListAsync();
                    if (users.Count > 0)
                    {
                        logger.LogInformation(users.First().Email);
                        count = count + users.Count;
                        logger.LogInformation($"Users Count: {count}");
                        userList.AddRange(users.Select(u => new User() { Id = u.Id.ToString(), Email = u.Email, Name = u.Name }));
                        index++;
                    }
                    else
                    {
                        logger.LogInformation("no more users found");
                        var content = JsonConvert.SerializeObject(userList);
                        File.WriteAllText(Path.Combine(LocalDataModel.Root, "users", "index", "users.json"), content);
                        logger.LogInformation("save users index users.json");
                        break;
                    }
                }
                catch (Exception ex)
                {
                    logger.LogInformation(ex.Message);
                }
            }

            if (new LocalDataModel().HasUsers)
            {
                //var usersJson = File.ReadAllText(Path.Combine(LocalDataModel.Root, "users", "index", "users.json"));
                //var accounts = JsonConvert.DeserializeObject<List<User>>(usersJson);
                //var characters = new string[] { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };

                //foreach (var character in characters)
                //{
                //    var users = accounts.Where(a => a.Email.StartsWith(character));
                //    if (users.Any())
                //    {
                //        Console.WriteLine(users.Count().ToString());
                //        Console.WriteLine($"count {character}");
                //        File.WriteAllText(Path.Combine(LocalDataModel.Root, "users", "index", $"{character}.json"), JsonConvert.SerializeObject(users));
                //        accounts.RemoveAll(u => u.Email.StartsWith(character));
                //    }
                //}

                //if (accounts.Any())
                //{
                //    File.WriteAllText(Path.Combine(LocalDataModel.Root, "users", "index", "users.json"), JsonConvert.SerializeObject(accounts));
                //}
                //else
                //{
                //    File.Delete(Path.Combine(LocalDataModel.Root, "users", "index", "users.json"));
                //}
            }
        }

        private async Task DailyHealthCheck()
        {
            var now = DateTime.Now;

            var desired = new DateTime(now.Year, now.Month, now.Day, checkHour, 0, 0);
            if (now > desired)
            {
                desired = desired.AddDays(1);
            }

            await Task.Delay(desired.Subtract(now));

            //var t = Task.Delay(desired.Subtract(now));
            //t.Wait();

            //Thread.Sleep(desired.Subtract(now));
            //Health(null);

            _healthCheckTimer = new Timer(Health, null, TimeSpan.Zero, TimeSpan.FromDays(1));
        }

        private void Health(object state)
        {
            logger.LogInformation("health checking is running...");
            var model = new LocalDataModel();

            if (Convert.ToBoolean(model.GetSetting("health_check_enable") ?? "true"))
            {
                EmailEntity mail = new EmailEntity()
                {
                    Addresses = new string[] { model.GetSetting("health_check_address") },
                    Subject = model.GetSetting("health_check_subject"),
                    Body = model.GetSetting("health_check_body")
                };
                var client = new MailClient();
                client.Send(mail);
            }
        }
    }
}
