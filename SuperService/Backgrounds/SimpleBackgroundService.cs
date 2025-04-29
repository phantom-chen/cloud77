
using Cloud77.Service;
using Cloud77.Service.Entity;
using MongoDB.Driver;
using Newtonsoft.Json;
using ServiceStack;
using SuperService.Models;
using SuperService.Services;

namespace SuperService.Backgrounds
{
  public class SimpleBackgroundService : IHostedService
  {
    private readonly ILogger<SimpleBackgroundService> logger;
    //private readonly MongoClient client;
    private readonly IMongoDatabase database;
    //private readonly IMongoCollection<UserMongoEntity> collection;
    private readonly List<User> userList = new List<User>();
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
      
      checkHour = Convert.ToInt16(configuration["Health_check_hour_utc"] ?? "0");

      this.logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
      logger.LogInformation("start service");
      Task.Run(FirstRun);
      Task.Run(SecondRun);

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

    private async Task FirstRun()
    {
      var index = 0;
      var size = 100;
      var count = 0;
      logger.LogInformation("start loop");
      var collection = database.GetCollection<UserMongoEntity>(Cloud77Utility.Users);
      while (true && !File.Exists(Path.Combine(LocalDataModel.Root, "users.json")))
      {
        try
        {
          await Task.Delay(2000);
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
            File.WriteAllText(Path.Combine(LocalDataModel.Root, "users.json"), content);
            logger.LogInformation("save users.json");
            break;
          }
        }
        catch (Exception ex)
        {
          logger.LogInformation(ex.Message);
        }
      }
    }

    private async Task SecondRun()
    {
      var now = DateTime.Now;
      
      var desired = new DateTime(now.Year, now.Month, now.Day, checkHour, 0, 0);
      if (now > desired)
      {
        desired = desired.AddDays(1);
      }

      var t = Task.Delay(desired.Subtract(now));
      t.Wait();

      //Thread.Sleep(desired.Subtract(now));
      //Health(null);
      _healthCheckTimer = new Timer(Health, null, TimeSpan.Zero, TimeSpan.FromDays(1));
    }

    private void Health(object state)
    {
      logger.LogInformation("health checking is running...");
      var collection = database.GetCollection<SettingMongoEntity>(Cloud77Utility.Settings);
      var settings = collection.Find(Builders<SettingMongoEntity>.Filter.Empty).ToList();

      // save setting in Redis
      if (Convert.ToBoolean(settings.FirstOrDefault(s => s.Key == "health_check_enable").Value ?? "true"))
      {
        EmailContentEntity content = new EmailContentEntity()
        {
          Addresses = new string[] { settings.FirstOrDefault(s => s.Key == "health_check_address").Value ?? "" },
          Subject = settings.FirstOrDefault(s => s.Key == "health_check_subject").Value ?? "",
          Body = settings.FirstOrDefault(s => s.Key == "health_check_body").Value ?? ""
        };
        var mail = new MailClient(settings);
        mail.Send(content);
      }
    }
  }
}
