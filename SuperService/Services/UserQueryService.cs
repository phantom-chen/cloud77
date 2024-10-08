using SuperService.Protos;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using SuperService.Contexts;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Reflection;
using System.Collections.Generic;
using Google.Protobuf.Collections;
using System;

namespace SuperService.Services
{
    [Authorize]
    public class UserQueryService: UserQuery.UserQueryBase
    {
        private readonly UserMongoContext users;
        public UserQueryService
        (
            MongoClient client,
            IConfiguration configuration
        )
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            var database = client.GetDatabase(dbName);
            users = new UserMongoContext(database);
        }

        public override Task<UserReply> Query(UserRequest request, ServerCallContext context)
        {
            var user = users.GetUser(request.Email.ToLower());

            return Task.FromResult(new UserReply()
            {
                Id = user == null ? 0 : 1,
                Name = user == null ? "" : user.Email,
                Role = user == null ? "" : user.Role
            });
        }

        public override Task<EmailSearchResult> GetEmails(EmailSearch request, ServerCallContext context)
        {
            var dir = Directory.GetParent(Assembly.GetExecutingAssembly().Location).ToString();
            var emailsPath = Path.Combine(dir, "data", "emails");
            var emails = new RepeatedField<string>();
            if (File.Exists(Path.Combine(emailsPath, "1.txt")))
            {
                emails.AddRange(File.ReadAllLines(Path.Combine(emailsPath, "1.txt")));
            }
            if (emails.Count == 0)
            {
                emails.Add("wip");
            }
            var result = new EmailSearchResult();
            result.Results.AddRange(emails.Take(10));
            return Task.FromResult(result);
        }
    }
}
