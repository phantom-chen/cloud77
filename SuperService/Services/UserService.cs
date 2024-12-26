using Grpc.Core;
using MongoDB.Driver;
using SuperService.Protos;
using Cloud77.Service;
using Cloud77.Service.Entity;
using UserEmail = SuperService.Protos.UserEmail;
using UserPassword = SuperService.Protos.UserPassword;

namespace SuperService.Services
{
    public class UserService : Protos.UserService.UserServiceBase
    {
        private readonly ILogger<UserService> logger;
        private readonly TokenGenerator generator;
        private readonly UserCollection database;
        private readonly string defaultRole;

        public UserService(
            IConfiguration configuration,
            MongoClient client,
            ILogger<UserService> logger,
            TokenGenerator generator)
        {
            this.defaultRole = configuration["Role_default"] ?? "";
            this.logger = logger;
            this.generator = generator;
            this.database = new UserCollection(client, configuration);
        }

        public override Task<UserEmailResult> GetUser(UserEmail request, ServerCallContext context)
        {
            logger.LogInformation(request.Email);

            if (request.Email.Length < 5)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, "email is short"));
            }

            var user = database.GetUser(request.Email);
            
            return Task.FromResult(new UserEmailResult()
            {
                Email = request.Email,
                Existing = user != null
            });
        }

        public override Task<ServiceReply> CreateUser(UserPassword request, ServerCallContext context)
        {
            var role = defaultRole;
            if (request.Username == "admin")
            {
                role = "Administrator";
            }
            var id = database.CreateUser(new UserEntity()
            {
                Email = request.Email.ToLower(),
                Name = request.Username.ToLower(),
                Password = CodeGenerator.HashString(request.Password),
                Role = role,
            });
            var token = database.CreateVerificationCode(request.Email);
            // TODO send code via email
            return Task.FromResult(new ServiceReply()
            {
                Code = "user-entity-created",
                Message = "Your account is created successfully",
                Id = id
            });
        }

        public override Task<UserLoginResult> GetToken(UserLogin request, ServerCallContext context)
        {
            var user = database.GetUser(request.Email);
            if (CodeGenerator.HashString(request.Password) != user.Password)
            {
                throw new RpcException(new Status());   //"invalid password"
            }
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var token = generator.IssueToken(user);
            var refreshToken = generator.IssueRefreshToken(user.Email, timestamp);

            return Task.FromResult(new UserLoginResult()
            {
                Email = request.Email,
                Value = token,
                RefreshToken = refreshToken,
                IssueAt = timestamp,
                ExpireInHours = generator.ExpirationInHour
            });
        }

        public override Task<ServiceReply> VerifyUser(UserEmail request, ServerCallContext context)
        {
            var header = context.GetHttpContext().Request.Headers["x-cloud77-onetime-token"];
            var token = header.ToString().Trim();
            logger.LogInformation(token);
            
            var payloads = database.GetTokenPayloads(request.Email);

            payloads = payloads.Where(p => p.Token == token && p.Usage == "verify-email");
            if (payloads == null || !payloads.Any())
            {
                throw new RpcException(new Status());
            }
            var payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year > 1);
            if (DateTime.Compare((DateTime)payload.Exp, DateTime.UtcNow) < 0)
            {
                throw new RpcException(new Status());
            }
            payload = payloads.FirstOrDefault(x => x.Token == token && x.Exp.Year == 1);
            if (payload != null)
            {
                throw new RpcException(new Status());
            }
            database.UpdateUser(request.Email, true, token);
            
            return Task.FromResult(new ServiceReply()
            {
                Code = "user-email-verified",
                Message = "Your account is confirmed",
                Id = ""
            });
        }
    }
}
