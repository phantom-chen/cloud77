using Cloud77.Service;
using Cloud77.Service.Entity;
using SuperService.Contexts;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.IO;

namespace SuperService.HostedServices
{
    public class DailyHealthService : IHostedService
    {
        ILogger<DailyHealthService> _logger;
        IConfiguration configuration;
        MongoClient client;
        public DailyHealthService(
            ILogger<DailyHealthService> logger,
            IConfiguration configuration,
            MongoClient client)
        {
            _logger = logger;
            this.configuration = configuration;
            this.client = client;
        }

        //private Timer _timer;

        private Timer _healthCheckTimer;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("health check hosted service start");
            //_timer = new Timer(Log, null, TimeSpan.Zero, TimeSpan.FromSeconds(5));

            Task.Run(() =>
            {
                var now = DateTime.Now;
                var hour = Convert.ToInt16(configuration["Health_check_hour_utc"] ?? "0");
                var desired = new DateTime(now.Year, now.Month, now.Day, hour, 0, 0);
                if (now > desired)
                {
                    desired = desired.AddDays(1);
                }

                var t = Task.Delay(desired.Subtract(now));
                t.Wait();

                //Thread.Sleep(desired.Subtract(now));
                //Health(null);
                _healthCheckTimer = new Timer(Health, null, TimeSpan.Zero, TimeSpan.FromDays(1));
            });

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            //_timer.Dispose();
            if (_healthCheckTimer != null)
            {
                _healthCheckTimer.Change(Timeout.Infinite, 0);
            }

            _logger.LogInformation("hosted test service end");
            return Task.CompletedTask;
        }

        private void Health(object state)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }

            _logger.LogInformation("health checking is running...");
            var collection = client.GetDatabase(dbName).GetCollection<SettingMongoEntity>(Cloud77Utility.Settings);
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
                var mail = new MailContext(settings);
                mail.Send(content);
            }
        }
    }
}
