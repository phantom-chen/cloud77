using FunctionalTests.Support;
using Reqnroll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class GatewayStepDefinitions
    {
        private readonly GatewayTestClient client;

        public GatewayStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Given(@"(.*) is health$")]
        public async Task ServiceHealthAsync(string service)
        {
            if (service == "gateway")
            {
                await client.GetGatewayHealth();
            }
            else
            {
                await client.GetHealth(service);
            }
        }

        [Given("Gateway is running")]
        public async Task GatewayKeyAsync()
        {
            await client.GetGateway();
        }

        [Then(@"Gateway gets the service agent (.*)$")]
        public async Task GetAgentAsync(string service)
        {
            Console.WriteLine(service);
            var request = client.CreateRequest(HttpMethod.Get, $"/api/{service}/agent");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
        }

        [Then(@"Gateway gets values from service agent (.*)$")]
        public async Task GetValuesAsync(string service)
        {
            Console.WriteLine(service);
            var request = client.CreateRequest(HttpMethod.Get, $"/api/{service}/values");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
        }
    }
}
