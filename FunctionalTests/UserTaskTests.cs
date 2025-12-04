using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests
{
    [TestClass]
    public sealed class UserTaskTests
    {
        private readonly string email = "";
        private readonly string password = "";
        private readonly HttpClient client;
        private HttpRequestMessage? request;
        private HttpResponseMessage? response;

        private string content => response?.Content?.ReadAsStringAsync().Result ?? "";

        public UserTaskTests()
        {
            client = new HttpClient()
            {
                BaseAddress = new Uri(Environment.GetEnvironmentVariable("USERBASEURL") ?? "")
            };
        }

        [TestMethod()]
        public void ShouldUpdateUserNameSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Put, $"accounts/{email}");
            request.Content = JsonContent.Create(new UserRole()
            {
                Email = email,
                Name = "tester001"
            });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);

            request = new HttpRequestMessage(HttpMethod.Get, $"accounts/{email}");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            var result = JsonConvert.DeserializeObject<UserAccount>(content);
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Name == "tester001");
        }

        [TestMethod()]
        public void ShouldCreateTaskSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Post, $"tasks/{email}");
            request.Content = JsonContent.Create(new TaskEntity()
            {
                Email = email,
                Title = "a",
                Description = "b",
            });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod()]
        public void ShouldUpdateTaskSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Get, $"tasks/{email}");
            response = client.Send(request);
            Console.WriteLine(response.StatusCode);

            var result = JsonConvert.DeserializeObject<UserTasks>(content);
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Data.Count() == 1);
            Console.WriteLine(result.Data.First().Id);

            var t = result.Data.FirstOrDefault();
            Assert.IsNotNull(t);

            request = new HttpRequestMessage(HttpMethod.Put, $"tasks/{t.Id}");
            request.Content = JsonContent.Create(new TaskEntity()
            {
                Email = email,
                Title = t.Title,
                Description = t.Description,
                State = 1
            });
            response = client.Send(request);
            Console.WriteLine(response.StatusCode);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);
        }

        [TestMethod()]
        public void ShouldDeleteTaskSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Get, $"tasks/{email}");
            response = client.Send(request);
            Console.WriteLine(response.StatusCode);

            var result = JsonConvert.DeserializeObject<UserTasks>(content);
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Data.Count() == 1);
            Console.WriteLine(result.Data.First().Id);

            var t = result.Data.FirstOrDefault();
            Assert.IsNotNull(t);

            request = new HttpRequestMessage(HttpMethod.Delete, $"tasks/{t.Id}");
            response = client.Send(request);
            Console.WriteLine(response.StatusCode);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);
        }
    }
}
