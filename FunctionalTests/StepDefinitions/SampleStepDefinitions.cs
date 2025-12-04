using Cloud77.Abstractions.Entity;
using FunctionalTests.Support;
using Reqnroll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace FunctionalTests.StepDefinitions
{
    [Binding]
    public sealed class SampleStepDefinitions
    {
        private readonly GatewayTestClient client;

        public SampleStepDefinitions(GatewayTestClient client)
        {
            this.client = client;
        }

        [Then(@"Sample has some authors")]
        public async Task GetAuthors()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/sample/authors");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }

        [Then(@"Sample has some bookmarks")]
        public async Task GetBookmarks()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/sample/bookmarks");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }

        [Then(@"Sample has some files")]
        public async Task GetFiles()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/sample/files");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }

        [Then(@"Sample has some posts")]
        public async Task GetPosts()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/sample/posts");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }

        [When(@"Sample adds the author")]
        public async Task CreateAuthor(Table table)
        {
            var body = new AuthorEntity();
            var row = table.Rows[0];
            body.Address = row["Address"];
            body.Region = row["Region"];
            body.Title = row["Title"];
            body.Name = row["Name"];
            var request = client.CreateRequest(HttpMethod.Post, "/api/sample/authors");
            request.Content = JsonContent.Create(body);
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(response.Headers.Location);
            Console.WriteLine(content);
        }

        [Then(@"Sample gets weather forecast")]
        public async Task GetWeatherForecast()
        {
            var request = client.CreateRequest(HttpMethod.Get, "/api/sample/weatherForecast");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }
    }
}
