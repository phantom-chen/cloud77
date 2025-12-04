using Grpc.Net.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using TestUtility;

namespace FunctionalTests
{
    [TestClass]
    public sealed class MessageTests
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
        public void ShouldUpdateCacheWhenSendingQueueMessage()
        {
            var queue = "my_services_default_queue";
            var message = "hello" + DateTime.Now.ToString();
            request = new HttpRequestMessage(HttpMethod.Post, "queue/messages");
            request.Content = JsonContent.Create(new QueueMessage()
            {
                Queue = queue,
                Message = message
            });

            response = client.Send(request);
            Assert.IsTrue(response.IsSuccessStatusCode);

            Console.WriteLine(content);
            Thread.Sleep(3000);

            request = new HttpRequestMessage(HttpMethod.Get, $"caches/{queue}");
            response = client.Send(request);
            response.EnsureSuccessStatusCode();
            Console.WriteLine(content);
        }

        [TestMethod()]
        public void ShouldUpdateCacheWhenSendingBusMessage()
        {
            request = new HttpRequestMessage(HttpMethod.Post, "bus/messages");
            response = client.Send(request);
            Console.WriteLine(response.StatusCode);
            response.EnsureSuccessStatusCode();
            Assert.IsTrue(response.IsSuccessStatusCode);
            Console.WriteLine(content);
        }

        [TestMethod]
        public async Task PublishMessage()
        {
            var channel = CreateChannel();
            //var client = new Protos.MessageService.MessageServiceClient(channel);
            //var response = await client.SendSimpleMessageAsync(new Protos.SimpleQueueMessage()
            //{
            //    Queue = "my_services_default_message",
            //    Message = "first message sent to the queue"
            //});
            //Console.WriteLine(response.ToString());
        }

        [TestMethod]
        public async Task ServiceShouldReturnCorrectStatus()
        {
            //var client2 = new Greeter.GreeterClient(channel);
            //var response2 = await client2.SayHelloAsync(new HelloRequest() { Name = "xx", Age = 10 }, headers);
            //Console.WriteLine(response2.Message.ToString());

            //var client3 = new UserQuery.UserQueryClient(channel);
            //var response3 = await client3.QueryAsync(new UserRequest() { Email = "" }, headers);
            //Console.WriteLine(response3.Id.ToString());
            //Console.WriteLine(response3.Name.ToString());
            //Console.WriteLine(response3.Role.ToString());

            //var response4 = client3.GetEmails(new EmailSearch() { Keywords = "a", Size = 10 }, headers);
            //var emails = response4.Results.ToList();
            //Assert.IsTrue(emails.Count == 10);
        }
    }
}
