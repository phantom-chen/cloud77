using FunctionalTests.GRPC.Support;
using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using TestUtility;
using TestUtility.Protos;

namespace FunctionalTests.GRPC.StepDefinitions
{
    [Binding]
    public sealed class UserStepDefinitions
    {
        private readonly GatewayTestClient client;

        public UserStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then("gRPC service returns simple user response")]
        public async Task RPCServiceGetUserAsync()
        {
            var _client = new UserService.UserServiceClient(client.Channel);

            var response = await _client.GetUserAsync(new UserEmail() { Email = "user@example.com" });
            Console.WriteLine(response.Email.ToString());
            Console.WriteLine(response.Existing.ToString());
        }

        public async Task<string> GetUserAsync()
        {
            var _client = new UserService.UserServiceClient(client.Channel);
            var response = await _client.GetUserAsync(new UserEmail() { Email = client.Tester.User.Email.ToLower() });

            return response.Existing.ToString();
        }

        public async Task<string> CreateUserAsync(string name)
        {
            var _client = new UserService.UserServiceClient(client.Channel);
            var response2 = await _client.CreateUserAsync(new UserPassword()
            {
                Email = client.Tester.User.Email.ToLower(),
                Username = name.ToLower(),
                Password = client.Tester.User.Password
            });
            Console.WriteLine(response2.ToString());
            return "";
        }

        public async Task VerifyEmailAsync(string token)
        {
            var _client = new UserService.UserServiceClient(client.Channel);
            var headers = new Metadata();
            headers.Add("X-OneTime-Token", token);
            var response2 = await _client.VerifyUserAsync(new UserEmail() { Email = client.Tester.User.Email.ToLower() }, headers);
            Console.WriteLine(response2.ToString());
            return;
        }

        public async Task<Cloud77.Abstractions.Service.UserToken> GetTokenAsync()
        {
            //throw new Exception("Token can be requested only via HTTP protocol");

            var _client = new UserService.UserServiceClient(client.Channel);
            var response2 = await _client.GetTokenAsync(new UserLogin()
            {
                Email = client.Tester.User.Email.ToLower(),
                Password = client.Tester.User.Password,
                Username = "",
                RefreshToken = ""
            });
            Console.WriteLine(response2.ToString());
            return null;
        }

    }
}
