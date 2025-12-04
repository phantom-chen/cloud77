using FunctionalTests.GRPC.Support;
using Grpc.Health.V1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace FunctionalTests.GRPC.StepDefinitions
{
    [Binding]
    public sealed class GatewayStepDefinitions
    {
        private readonly GatewayTestClient client;

        public GatewayStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then("gRPC service is healthy")]
        public async Task RPCServiceHealthyAsync()
        {
            var _client = new Health.HealthClient(client.Channel);
            var response = await _client.CheckAsync(new HealthCheckRequest());
            Console.WriteLine(response.Status.ToString());
        }
    }
}
