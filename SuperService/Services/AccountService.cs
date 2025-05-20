using Cloud77.Service.Entity;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using SuperService.Collections;
using SuperService.Models;
using SuperService.Protos;
using System.Security.Claims;

namespace SuperService.Services
{
  [Authorize]
    public class AccountService : Protos.AccountService.AccountServiceBase
    {
        private readonly ILogger<AccountService> logger;
        private readonly TokenGenerator generator;
        private readonly UserCollection database;
        public AccountService(
            IConfiguration configuration,
            MongoClient client,
            ILogger<AccountService> logger)
        {
            this.logger = logger;
            this.database = new UserCollection(client, configuration);
        }

        public override Task<UserRole> GetRole(UserEmail request, ServerCallContext context)
        {
            var user = context.GetHttpContext().User;
            var email = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var role = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var exp1 = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Expiration);
            var name = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            return Task.FromResult(new UserRole
            {
                Email = request.Email,
            });
        }

        public override Task<UserAccount> GetAccount(UserEmail request, ServerCallContext context)
        {
            var user = context.GetHttpContext().User;
            var email = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var role = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            var exp1 = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Expiration);
            var name = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

            return Task.FromResult(new UserAccount()
            {
                Email = email.Value ?? "",
                Username = name.Value ?? "",
                Role = role.Value ?? ""
            });
        }

        public override Task<ServiceReply> CreateVerificationCode(UserEmail request, ServerCallContext context)
        {
            // send email
            var token = database.CreateVerificationCode(request.Email);
            logger.LogInformation(token);
            return Task.FromResult(new ServiceReply()
            {
                Code = "aa",
                Message = "aa",
                Id = "aa"
            });
        }

        public override Task<ServiceReply> UpdateProfile(UserProfile request, ServerCallContext context)
        {
            var p = new ProfileEntity()
            {
                Surname = request.Profile.Surname,
                GivenName = request.Profile.GivenName,
                Company = request.Profile.Company,
                CompanyType = request.Profile.CompanyType,
                Title = request.Profile.Title,
                Phone = request.Profile.Phone,
                Fax = request.Profile.Fax,
                City = request.Profile.City,
                Address = request.Profile.Address,
                Post = request.Profile.Post,
                Supplier = request.Profile.Supplier,
                Contact = request.Profile.Contact,
            };
            database.UpdateUser(request.Email, p);
            return Task.FromResult(new ServiceReply()
            {

            });
        }
    }
}
