using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace UserService.Hubs
{
    [Authorize]
    public class ChatHub: Hub
    {
        private readonly ILogger<ChatHub> logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            this.logger = logger;
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        [AllowAnonymous]
        [HubMethodName("ping")]
        public async Task Ping(string message)
        {
            await Clients.Caller.SendAsync("hub2client", $"received your message: {message}");
        }

        [HubMethodName("chat")]
        public async Task NewMessage(string message)
        {
            this.logger.LogInformation(message);
            await Clients.All.SendAsync("chathub", $"received your message: {message}");
        }

        [HubMethodName("client2all")]
        public async Task Hello2All(string message)
        {
            await Clients.All.SendAsync("hub2all", $"hello using hub, message: {message}");
        }
    }
}
