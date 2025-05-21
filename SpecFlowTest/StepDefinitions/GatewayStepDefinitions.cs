using Grpc.Health.V1;
using Grpc.Net.Client;
using ServiceTest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpecFlowTest.StepDefinitions
{
  [Binding]
  public sealed class GatewayStepDefinitions
  {
    private GrpcChannel CreateChannel()
    {
      var address = "https://localhost:7846";
      var channel = GrpcChannel.ForAddress(
          address,
          new GrpcChannelOptions()
          {
            HttpHandler = new HttpClientHandler { ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator }
          }
          );

      return channel;
    }

    [Then("gRPC service is healthy")]
    public async Task RPCServiceHealthyAsync()
    {
      var channel = CreateChannel();
      var client = new Health.HealthClient(channel);
      var response = await client.CheckAsync(new HealthCheckRequest());
      Console.WriteLine(response.Status.ToString());
    }

    [Then("gRPC service returns simple user response")]
    public async Task RPCServiceGetUserAsync()
    {
      var channel = CreateChannel();
      var client = new UserService.UserServiceClient(channel);

      var response = await client.GetUserAsync(new UserEmail() { Email = "user@example.com" });
      Console.WriteLine(response.Email.ToString());
      Console.WriteLine(response.Existing.ToString());
    }
  }
}
