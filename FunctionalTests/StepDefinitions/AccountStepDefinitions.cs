using Cloud77.Abstractions.Entity;
using FunctionalTests.Support;
using Newtonsoft.Json;
using Reqnroll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class AccountStepDefinitions
    {
        private readonly GatewayTestClient client;

        public AccountStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then("Get my account information")]
        public async Task AccountAsync(Table table)
        {
            var uri = $"/api/user/accounts/{client.Tester.User.Email.ToLower()}";
            var request = client.CreateRequest(HttpMethod.Get, uri);
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
            var account = JsonConvert.DeserializeObject<Cloud77.Abstractions.Service.UserAccount>(result);
        }

        [Then("Get my account profile")]
        public async Task ProfileAsync(Table table)
        {

        }

        [When("Update my account profile")]
        public async Task UpdateProfileAsync(Table table)
        {
            var row = table.Rows[0];
            var profile = new ProfileEntity()
            {
                Surname = row["Surname"],
                GivenName = row["GivenName"],
                Address = row["Address"],
                City = row["City"],
                Company = row["Company"],
                CompanyType = row["CompanyType"],
                Contact = row["Contact"],
                Fax = row["Fax"],
                Phone = row["Phone"],
                Post = row["Post"],
                Supplier = row["Supplier"],
                Title = row["Title"],
            };
            var email = client.Tester.User.Email;
            var request = client.CreateRequest(HttpMethod.Put, $"/api/user/accounts/{email}/profile");
            request.Content = JsonContent.Create(profile);
            var response = await client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
            response.EnsureSuccessStatusCode();
        }

        [Then(@"^I have (.*) tasks$")]
        public async Task TasksAsync(string count)
        {
            try
            {
                var uri = "/api/user/posts";
                var request = client.CreateRequest(HttpMethod.Get, uri);
                var response = await client.SendAsync(request);

                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();

                Console.WriteLine(result);
            }
            catch (Exception)
            {

            }
        }

        [Then(@"^I have (.*) posts$")]
        public async Task PostsAsync(string count)
        {
            try
            {
                var uri = "/api/user/posts";
                var request = client.CreateRequest(HttpMethod.Get, uri);
                var response = await client.SendAsync(request);

                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadAsStringAsync();

                Console.WriteLine(result);
            }
            catch (Exception)
            {

            }
        }
    }
}
