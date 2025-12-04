using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests
{
    [TestClass]
    public sealed class CacheTests
    {
        private readonly HttpClient client;
        private HttpRequestMessage? request;
        private HttpResponseMessage? response;
        private string? content => response?.Content.ReadAsStringAsync().Result;

        [TestMethod()]
        public void TestMethod2()
        {
            request = new HttpRequestMessage(HttpMethod.Post, "caches");
            request.Content = JsonContent.Create(new CacheItem()
            {
                Key = "hello",
                Value = "world"
            });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);

            request = new HttpRequestMessage(HttpMethod.Get, "caches/hello");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
        }

        [TestMethod()]
        public void ShouldGetEmptyCache()
        {
            request = new HttpRequestMessage(HttpMethod.Get, "caches/hello");
            response = client.Send(request);
            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);
        }

        [TestMethod()]
        public void ShouldCreateCacheSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Post, "caches");
            request.Content = JsonContent.Create(new CacheItem()
            {
                Key = "hello",
                Value = "world"
            });
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            Console.WriteLine(content);

            request = new HttpRequestMessage(HttpMethod.Get, "caches/hello");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);
        }

    }
}
