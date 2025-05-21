using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace UserService.Hubs
{
  [Authorize]
  public class ChatHub : Hub
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
      await Clients.Caller.SendAsync("server2client-ping", $"received your message: {message}");
    }

    [HubMethodName("send2server")]
    public async Task NewMessage(string message)
    {
      this.logger.LogInformation(message);
      await Clients.Caller.SendAsync("server2client", $"received your message: {message}");
    }

    [HubMethodName("send2clients")]
    public async Task Hello2All(string message)
    {
      await Clients.All.SendAsync("server2clients", $"hello using hub, message: {message}");
    }
  }
}
