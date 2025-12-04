using FunctionalTests.GRPC.Support;
using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Channels;
using System.Threading.Tasks;
using TestUtility.Protos;

namespace FunctionalTests.GRPC.StepDefinitions
{
    [Binding]
    public sealed class AccountStepDefinitions
    {
        private readonly GatewayTestClient client;

        public AccountStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        public async Task<UserAccount> GetAccountAsync()
        {
            var headers = new Metadata();
            headers.Add("Authorization", $"Bearer {client.Tester.User.AccessToken}");
            var _client = new AccountService.AccountServiceClient(client.Channel);
            var response2 = await _client.GetAccountAsync(new UserEmail() { Email = client.Tester.User.Email.ToLower() }, headers);
            Console.WriteLine(response2.ToString());

            return null;
        }

        public async Task UpdateProfileAsync(Profile profile)
        {
            var headers = new Metadata();
            headers.Add("Authorization", $"Bearer {client.Tester.User.AccessToken}");
            var _client = new AccountService.AccountServiceClient(client.Channel);
            var response = await _client.UpdateProfileAsync(new UserProfile()
            {
                Email = client.Tester.User.Email.ToLower(),
                Profile = profile
            }, headers);
            Console.WriteLine(response.ToString());
        }

        public async Task CreateVerificationAsync()
        {
            var headers = new Metadata();
            headers.Add("Authorization", $"Bearer {client.Tester.User.AccessToken}");
            var _client = new AccountService.AccountServiceClient(client.Channel);
            var response = await _client.CreateVerificationCodeAsync(new UserEmail() { Email = client.Tester.User.Email.ToLower() }, headers);
            Console.WriteLine(response.ToString());
        }
    }
}
