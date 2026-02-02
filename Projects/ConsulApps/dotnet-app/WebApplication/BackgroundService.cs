using Consul;

namespace DotnetApp
{
  public class BackgroundService: IHostedService
  {
    private readonly IConsulClient client;
    private readonly ILogger<BackgroundService> logger;
    private Timer timer;

    public BackgroundService(IConsulClient client, ILogger<BackgroundService> logger)
    {
      this.client = client;
      this.logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
      Task.Run(() =>
      {
        timer = new Timer(HealthCheck, null, TimeSpan.FromMinutes(1), TimeSpan.FromMinutes(1));
      });
      return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
      if (timer != null)
      {
        timer.Change(Timeout.Infinite, 0);
        timer.Dispose();
      }
      return Task.CompletedTask;
    }

    private void HealthCheck(object state)
    {
      try
      {
        var result = client.Agent.Checks().Result;
        var checks = result.Response;

        var bad = checks.FirstOrDefault(c => c.Value.Status == HealthStatus.Critical);
        if (string.IsNullOrEmpty(bad.Key))
        {

        }
        else
        {
          logger.LogInformation($"find critical service {bad.Value.ServiceID}, deregister");
          client.Agent.ServiceDeregister(bad.Value.ServiceID).Wait();
        }
      }
      catch (Exception ex)
      {
        logger.LogInformation(ex.Message);
      }
    }
  }
}
