using Cloud77.Service;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SpecFlowProject.Drivers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace SpecFlowProject.StepDefinitions
{
    [Binding]
    public sealed class TesterStepDefinitions
    {
        private HttpClient client;
        private HttpResponseMessage response;
        private HttpRequestMessage request;
        private string content;
        private readonly BrowserDriver driver;

        public TesterStepDefinitions(BrowserDriver driver)
        {
            this.driver = driver;
        }

        [Given(@"Wait (.*) seconds")]
        public void Wait(int seconds)
        {
            Thread.Sleep(seconds * 1000);
        }

        [Given(@"I want to open browser (msedge|chrome)")]
        public async Task GivenIWantToOpenBrowser(string name)
        {
            await driver.CreateAsync(name);
            await driver.Page.GotoAsync("https://www.cloud77.top/");
            await driver.Page.SetViewportSizeAsync(1600, 900);
        }

        [Given(@"I close the browser")]
        public async Task CloseBrowserAsync()
        {
            await driver.CloseAsync();
        }

        [Given(@"Create user service client")]
        public void CreateClient()
        {
            client = new HttpClient()
            {
                BaseAddress = new Uri("http://localhost:5389/api/")
            };
        }

        [Then(@"Get database and collections")]
        public void GetCollections()
        {
            request = new HttpRequestMessage(HttpMethod.Get, "database/collections");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
            Console.WriteLine("");
            Assert.AreEqual("Tester", JObject.Parse(content).GetValue("database"));
        }

        [Then(@"User admin should be not existing")]
        public void UserExisting()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"users?email=admin@example.com");
            var response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            content = response.Content.ReadAsStringAsync().Result;
            Assert.IsFalse(string.IsNullOrEmpty(content));

            Console.WriteLine(content);
            var result = JsonConvert.DeserializeObject<UserEmail>(content);
            Assert.IsNotNull(result);
            Assert.IsFalse(result.Existing);
        }

        [When(@"Create user admin")]
        public void CreateUser()
        {
            request = new HttpRequestMessage(HttpMethod.Post, $"users");
            request.Content = JsonContent.Create(new UserPassword()
            {
                Email = "admin@example.com",
                Name = "admin",
                Password = "123456",
            });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            content = response.Content.ReadAsStringAsync().Result;
            Assert.IsFalse(string.IsNullOrEmpty(content));
            Console.WriteLine(content);
        }

        [When(@"Verify user with token (.*)")]
        public void VerifyUser(string token)
        {
            Assert.IsTrue(!string.IsNullOrEmpty(token));

            request = new HttpRequestMessage(HttpMethod.Put, "users/verification");
            request.Content = JsonContent.Create(new EmailVerification { Email = "admin@example.com", Token = token });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            content = response.Content.ReadAsStringAsync().Result;
            Assert.IsFalse(string.IsNullOrEmpty(content));
            Console.WriteLine(content);
        }

        [Then(@"User admin should be confirmed")]
        public void UserConfirmed()
        {
            request = new HttpRequestMessage(HttpMethod.Get, $"accounts/admin@example.com");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            content = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(content);
            var result = JsonConvert.DeserializeObject<UserAccount>(content);
            Assert.IsNotNull(result);
            Assert.AreEqual("administrator", result.Role.ToLower());
            Assert.IsTrue(result.Confirmed);
            Assert.IsNull(result.Profile);

        }

        [Then(@"User admin has some logs")]
        public void UserLogs()
        {
            request = new HttpRequestMessage(HttpMethod.Get, $"events/admin@example.com");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);

            content = response.Content.ReadAsStringAsync().Result;
            Assert.IsFalse(string.IsNullOrEmpty(content));
            Console.WriteLine(content);
            var events = JsonConvert.DeserializeObject<EventsQueryResult>(content);
            Assert.IsNotNull(events);
            Assert.IsTrue(events.Data.Count() > 0);
            var ev = events.Data.First(e => e.Name == "Issue-Email-Token");
            Assert.IsNotNull(ev);
            Assert.IsTrue(!string.IsNullOrEmpty(ev.Payload));
            Console.WriteLine(ev);
            var payload = JsonConvert.DeserializeObject<TokenPayload>(ev.Payload);
            Assert.IsNotNull(payload);
            Assert.AreEqual("verify-email", payload.Usage);
            Assert.IsTrue(!string.IsNullOrEmpty(payload.Token));
            Console.WriteLine(payload.Token);
        }
    }
}
