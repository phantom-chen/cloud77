using FunctionalTests.Support;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Reqnroll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class AdministratorStepDefinitions
    {
        private readonly GatewayTestClient client;

        public AdministratorStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then("Gateway uses the database")]
        public async Task DatabaseAsync(Table table)
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/super/database/collections");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
            Console.WriteLine("");
            Console.WriteLine(JObject.Parse(content).GetValue("database"));
        }

        [Then(@"Gateway gets system information$")]
        public async Task GetSystemAsync()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/super/system");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
        }

        [Then("Gateway has some settings")]
        public async Task GetSettingsAsync()
        {

        }

        public async Task GetEventsAsync()
        {
            var uri = $"/api/super/events/{client.Tester.User.Email.ToLower()}";
            var request = client.CreateRequest(HttpMethod.Get, uri);
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();

            var events = JsonConvert.DeserializeObject<Cloud77.Abstractions.Service.EventsQueryResult>(result);
            Console.WriteLine(result);
        }
    }
}
