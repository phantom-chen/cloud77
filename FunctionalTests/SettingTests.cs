using Grpc.Net.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests
{
    [TestClass]
    public sealed class SettingTests
    {
        private readonly HttpClient client;
        private HttpRequestMessage? request;
        private HttpResponseMessage? response;

        private string content => response?.Content?.ReadAsStringAsync().Result ?? "";

        private GrpcChannel CreateChannel()
        {
            var channel = GrpcChannel.ForAddress(Environment.GetEnvironmentVariable("GRPCURL") ?? "");
            return channel;
        }

        [TestMethod()]
        public void ShouldGetSettingsSuccessfully()
        {
            request = new HttpRequestMessage(HttpMethod.Get, "settings");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);
        }

        [TestMethod]
        public void ShouldGetSettings()
        {
            request = new HttpRequestMessage(HttpMethod.Get, "settings");
            request.Headers.Add("x-api-key", "");
            request.Headers.Add("Authorization", "Bearer " + "");
            response = client.Send(request);
            Assert.IsTrue(response.IsSuccessStatusCode);
            Console.WriteLine(content);
        }

        [TestMethod()]
        public async Task GetSettings()
        {
            var channel = CreateChannel();
            //var client = new Protos.SettingService.SettingServiceClient(channel);
            //var response = await client.GetSettingsAsync(new Google.Protobuf.WellKnownTypes.Empty());
            //Console.WriteLine(response.ToString());
        }

        [TestMethod()]
        public async Task CreateSetting()
        {
            var channel = CreateChannel();
            //var client = new Protos.SettingService.SettingServiceClient(channel);
            //var response = await client.CreateSettingAsync(new Protos.ServiceSetting()
            //{
            //    Key = "xxx",
            //    Value = "xxx",
            //    Description = ""
            //});
            //Console.WriteLine(response.ToString());
        }

    }
}
