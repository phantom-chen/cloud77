using FunctionalTests.Support;
using Grpc.Core;
using Newtonsoft.Json;
using Reqnroll;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class UserStepDefinitions
    {
        private readonly GatewayTestClient client;

        public UserStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then("Check my account registered")]
        public async Task GetUserAsync(Table table)
        {
            var row = table.Rows[0];
            var uri = $"/api/sso/users?email={client.Tester.User.Email.ToLower()}";
            var request = client.CreateRequest(HttpMethod.Get, uri);
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Cloud77.Abstractions.Service.UserEmail>(content);
            //Assert.AreEqual(row["Existing"].ToLower(), existing.ToLower());
        }

        [When("Create my account")]
        public async Task CreateUserAsync(Table table)
        {
            var row = table.Rows[0];
            var name = row["Name"].ToLower();
            var request = client.CreateRequest(HttpMethod.Post, "/api/sso/users");
            request.Content = JsonContent.Create(new Cloud77.Abstractions.Service.UserPassword()
            {
                Email = client.Tester.User.Email.ToLower(),
                Name = name,
                Password = client.Tester.User.Password,
            });
            var response = await client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
            response.EnsureSuccessStatusCode();
        }

        [Then("Creating my account fails with exception")]
        public async Task CreateUserFailAsync(Table table)
        {
            try
            {
                var row = table.Rows[0];
                row["Name"].ToLower();
            }
            catch (RpcException ex)
            {
                Assert.AreEqual(ex.StatusCode, StatusCode.InvalidArgument);
                Console.WriteLine(ex.Message);
                //Assert.Fail(ex.Message);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [When("Get my access tokens")]
        public async Task GetTokensAsync()
        {
            var uri = $"/api/sso/users/token?email={client.Tester.User.Email}&password={client.Tester.User.Password}";
            var request = client.CreateRequest(HttpMethod.Post, uri);
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            var token = JsonConvert.DeserializeObject<Cloud77.Abstractions.Service.UserToken>(result);
            client.Tester.SaveToken(token);

            Console.WriteLine(token.Value);
            Console.WriteLine(token.RefreshToken);
        }

        [Then("My tokens are valid")]
        public async Task TokenValidAsync()
        {
            var uri = "/api/user/accounts/role";
            var request = client.CreateRequest(HttpMethod.Get, uri);
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();

            Console.WriteLine(result);
        }

        private async Task<Cloud77.Abstractions.Entity.TokenPayload> GetEmailTokenAsync(string usage)
        {
            // token used for verifying email or resetting password
            var uri = $"/api/events/{client.Tester.User.Email.ToLower()}";
            var request = client.CreateRequest(HttpMethod.Get, uri);
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();

            var events = JsonConvert.DeserializeObject<Cloud77.Abstractions.Service.EventsQueryResult>(result).Data.ToList();
            events = events.Where(e => e.Name == "Issue-Email-Token").ToList();
            var payloads = events.Select(e => JsonConvert.DeserializeObject<Cloud77.Abstractions.Entity.TokenPayload>(e.Payload)).ToList();
            var payload = payloads.FirstOrDefault(p => p.Usage == usage); // first is the latest
            return payload;
        }

        [Then(@"I have the email verify token from mailbox \(mock up\)")]
        public async Task VerificationTokenAsync()
        {
            var payload = await GetEmailTokenAsync("verify-email");
            Console.WriteLine(payload.Usage);
            Console.WriteLine(payload.Token);
        }

        [Then(@"I have the password reset token from mailbox \(mock up\)")]
        public async Task PasswordTokenAsync()
        {
            var payload = await GetEmailTokenAsync("reset-password");
            Console.WriteLine(payload.Usage);
            Console.WriteLine(payload.Token);
        }

        [When("Verify my email with the token from email")]
        public async Task VerifyEmailAsync()
        {
            var payload = await GetEmailTokenAsync("verify-email");
            Console.WriteLine(payload.Usage);
            Console.WriteLine(payload.Token);

            var uri = $"/api/sso/users/verification?email={client.Tester.User.Email.ToLower()}";
            var request = client.CreateRequest(HttpMethod.Put, uri);
            request.Headers.Add("X-OneTime-Token", payload.Token);
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }

        [When("Get the email token from email body (mockup)")]
        public async Task GetTokenPayloadsAsync()
        {

        }
    }
}
