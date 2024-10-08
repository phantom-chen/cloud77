using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SuperService.Contexts;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using Newtonsoft.Json;

namespace SuperService.HostedServices
{
    public class SimpleUserEntity
    {
        public int Id { get; set; }
        public string Email { get; set; }
    }

    public class MigrationService : IHostedService
    {
        private readonly ILogger<MigrationService> logger;

        public MigrationService(
            ILogger<MigrationService> logger,
            IConfiguration configuration)
        {
            this.logger = logger;

            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            logsDir = Path.Combine(dir, "logs");
            cursorFile = Path.Combine(dir, "logs", "cursor.txt");
            usersFile = Path.Combine(dir, "logs", "users.json");

            if (!Directory.Exists(logsDir))
            {
                Directory.CreateDirectory(logsDir);
            }
            if (!File.Exists(cursorFile))
            {
                File.WriteAllText(cursorFile, "0");
            }

            index = Convert.ToInt32(File.ReadAllText(cursorFile));
        }

        private string cursorFile = "";
        private string usersFile = "";
        private string logsDir = "";

        public Task StartAsync(CancellationToken cancellationToken)
        {
            logger.LogInformation("start migration service asynchronously");
            Task.Run(RunService);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        private int index = 0;
        private List<SimpleUserEntity> users = new List<SimpleUserEntity>();

        private async Task RunService()
        {
            while (true)
            {
                await Task.Delay(200);

                if (!File.Exists(usersFile))
                {
                    //var entities = context.Users.OrderBy(u => u.Id).Where(u => u.Id > index).Take(500);
                    //if (entities != null && entities.Any())
                    //{
                    //    users.AddRange(entities.Select(u => new SimpleUserEntity { Id = u.Id, Email = u.Email }));
                    //    logger.LogInformation(entities.Last().Id.ToString());
                    //    index = entities.Last().Id;
                    //}
                    //else
                    //{
                    //    logger.LogInformation(users.Last().Email);
                    //    File.WriteAllText(usersFile, JsonConvert.SerializeObject(users));
                    //    index = 0;
                    //}
                }
                else
                {
                    //var device = context.Devices.OrderBy(d => d.Id).FirstOrDefault(d => d.Id > index);
                    //if (device != null)
                    //{
                    //    index = device.Id;
                    //    File.WriteAllText(cursorFile, index.ToString());
                    //}
                    //else
                    //{
                    //    logger.LogInformation("migration service completes");
                    //}
                }
            }
        }
    }
}
