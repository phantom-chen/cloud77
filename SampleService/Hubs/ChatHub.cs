using Cloud77.Service.Entity;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SampleService.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task UpdateChartData(string action)
        {
          // start or stop
          if (action == "start")
          {
            await Clients.All.SendAsync("update-chart-data", "start");
          }
          else
          {
            await Clients.All.SendAsync("update-chart-data", "stop");
          }
        }

        [HubMethodName("chartData2all")]
        public async Task BroadcastChartData(List<ChartEntity> data)
        {
          await Clients.All.SendAsync("broadcast-chart-data", data);
        }
    }
}
