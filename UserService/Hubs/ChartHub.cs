using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using Cloud77.Service.Entity;

namespace UserService.Hubs
{
    [Authorize]
    public class ChartHub: Hub
    {
        [HubMethodName("chartData2all")]
        public async Task BroadcastChartData(List<ChartEntity> data)
        {
            await Clients.All.SendAsync("broadcast-chart-data", data);
        }
    }
}
