using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests.Support
{
    public class GatewayTestClient
    {
        private TesterModel tester;

        private readonly HttpClient client;

        private string key = "";

        private string Key
        {
            get
            {
                if (string.IsNullOrEmpty(key))
                {
                    key = File.ReadAllText(Path.Combine(tester.Root, "key.txt"));
                }
                return key;
            }
        }

        public GatewayTestClient(TesterModel tester)
        {
            Gateway = Environment.GetEnvironmentVariable("GATEWAYURL") ?? "http://localhost:4359";
            this.tester = tester;
            client = new HttpClient()
            {
                BaseAddress = new Uri(Gateway)
            };

            if (!File.Exists(Path.Combine(tester.Root, "key.txt")))
            {
                File.WriteAllText(Path.Combine(tester.Root, "key.txt"), "");
            }
        }

        public string Gateway { get; private set; }

        public TesterModel Tester => tester;

        public HttpRequestMessage CreateRequest(HttpMethod method, string uri)
        {
            var request = new HttpRequestMessage(method, uri);
            request.Headers.Add("x-api-key", Key);
            if (!string.IsNullOrEmpty(tester.User.AccessToken))
            {
                request.Headers.Add("Authorization", $"Bearer {tester.User.AccessToken}");
            }
            return request;
        }

        public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            return await client.SendAsync(request);
        }

        public async Task<string> GetGateway()
        {
            var response = await client.SendAsync(CreateRequest(HttpMethod.Get, "/api/gateway"));
            if (response == null || !response.IsSuccessStatusCode)
            {
                throw new Exception();
            }

            var result = response.Content.ReadAsStringAsync().Result;
            Console.WriteLine(result);
            var obj = JObject.Parse(result);
            Console.WriteLine(obj.GetValue("key"));
            File.WriteAllText(Path.Combine(tester.Root, "key.txt"), obj.GetValue("key").ToString());

            return Key;
        }

        public async Task GetGatewayHealth()
        {
            var request = CreateRequest(HttpMethod.Get, "/api/health");
            var response = await client.SendAsync(request);
            if (response == null || !response.IsSuccessStatusCode)
            {
                throw new Exception();
            }
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }

        public async Task GetHealth(string service)
        {
            if (string.IsNullOrEmpty(service)) return;
            var request = CreateRequest(HttpMethod.Get, $"/api/{service}/health");
            var response = await client.SendAsync(request);
            if (response == null || !response.IsSuccessStatusCode)
            {
                throw new Exception();
            }
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
        }
    }
}
