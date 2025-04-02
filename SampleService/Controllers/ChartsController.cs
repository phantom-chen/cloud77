using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SampleService.Hubs;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ChartsController : ControllerBase
  {
    private readonly IHubContext<ChatHub> hub;
    private readonly TimerManager manager;

    public ChartsController(
        IHubContext<ChatHub> hub,
        TimerManager manager)
    {
      this.hub = hub;
      this.manager = manager;
    }

    [HttpPost]
    public IActionResult Post()
    {
      if (!manager.IsTimerStarted)
      {
        manager.StartTimer(
            () =>
            {
              hub.Clients.All.SendAsync("live-chart-data", GetCharts());
            },
            () =>
            {
              hub.Clients.All.SendAsync("live-chart-status", "live chart stops");
            });
        hub.Clients.All.SendAsync("live-chart-status", "live chart starts");
      }
      return Ok(new ServiceResponse("chart-data-updated", "", "Start live chart data"));
    }

    [HttpDelete]
    public IActionResult Delete()
    {
      if (manager.IsTimerStarted)
      {
        manager.StopTimer();
      }
      hub.Clients.All.SendAsync("live-chart-status", "live chart stops");
      return Ok(new ServiceResponse("chart-data-updated", "", "Stop live chart data"));
    }

    private List<ChartEntity> GetCharts()
    {
      var r = new Random();
      return new List<ChartEntity>()
            {
                new ChartEntity()
                {
                    Data = new List<int>(){ r.Next(1, 40)},
                    Label = "Data1",
                    BackgroundColor = "#5491DA"
                },
                new ChartEntity()
                {
                    Data = new List<int>(){ r.Next(1, 40)},
                    Label = "Data2",
                    BackgroundColor = "#E74C3C"
                },
                new ChartEntity()
                {
                    Data = new List<int>(){ r.Next(1, 40)},
                    Label = "Data3",
                    BackgroundColor = "#82E0AA"
                },
                new ChartEntity()
                {
                    Data = new List<int>(){ r.Next(1, 40)},
                    Label = "Data4",
                    BackgroundColor = "#E5E7E9"
                }
            };
    }
  }
}
