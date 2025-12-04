using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests
{
    [TestClass]
    public sealed class RegistrationTests
    {
        private readonly string email = "";
        private readonly string password = "";
        private readonly HttpClient client;
        private HttpRequestMessage? request;
        private HttpResponseMessage? response;
        private string content => response?.Content?.ReadAsStringAsync().Result ?? "";

        [TestMethod()]
        public void ShouldResetPasswordSuccessfully()
        {
            // issue token
            request = new HttpRequestMessage(HttpMethod.Post, $"users/password-tokens?email={email}");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);

            // get token from events (mock up)
            request = new HttpRequestMessage(HttpMethod.Get, $"events/{email}");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsFalse(string.IsNullOrEmpty(content));
            var events = JsonConvert.DeserializeObject<EventsQueryResult>(content);
            Assert.IsNotNull(events);

            var payloads = events.Data
                .Where(e => e.Name == "Issue-Email-Token")
                .Select(e => JsonConvert.DeserializeObject<TokenPayload>(e.Payload));
            Assert.IsNotNull(payloads);
            Assert.IsTrue(payloads.Count() > 0);
            var payload = payloads.Where(p => p.Usage == "reset-password").LastOrDefault();
            Assert.IsNotNull(payload);
            Assert.IsTrue(!string.IsNullOrEmpty(payload.Token));
            Console.WriteLine(payload.Token);

            // update password with token
            request = new HttpRequestMessage(HttpMethod.Put, "users/password");
            request.Content = JsonContent.Create(new UserPassword()
            {
                Email = email,
                Password = password
            });
            request.Headers.Add("X-Custom-Token", payload.Token);
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            Console.WriteLine(content);
        }
    }
}
