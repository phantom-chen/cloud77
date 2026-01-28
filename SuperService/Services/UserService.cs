using Grpc.Core;
using MongoDB.Driver;
using SuperService.Protos;
using Cloud77.Abstractions.Utility;
using Cloud77.Abstractions.Entity;
using UserEmail = SuperService.Protos.UserEmail;
using UserPassword = SuperService.Protos.UserPassword;
using SuperService.Models;
using SuperService.Collections;
using Newtonsoft.Json;

namespace SuperService.Services
{
  public class UserService : Protos.UserService.UserServiceBase
    {
        private readonly ILogger<UserService> logger;
        private readonly TokenGenerator generator;
        private readonly UserCollection database;
        private EventCollection events;
        private readonly string defaultRole;

        public UserService(
            IConfiguration configuration,
            MongoClient client,
            ILogger<UserService> logger,
            TokenGenerator generator)
        {
            this.defaultRole = configuration["Default_role"] ?? "";
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

            var date = DateTime.UtcNow;
            var log = new EventEntity()
            {
                Name = "Create-User",
                UserEmail = request.Email.ToLower(),
                Email = request.Email.ToLower(),
                Date = date,
            };
            events.AppendEventLog(log);

            string token = CodeGenerator.GenerateVerificationCode(request.Email, date);
            var payload = new TokenPayload()
            {
                Token = token,
                Expiration = date.AddHours(1)
            };
            var tokenId = events.AppendEventLog(new EventEntity()
            {
                Name = "Email-Token",
                UserEmail = request.Email.ToLower(),
                Email = request.Email.ToLower(),
                Payload = JsonConvert.SerializeObject(payload),
                Date = date,
            });
            logger.LogInformation(tokenId);
            logger.LogInformation(token);
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
            var header = context.GetHttpContext().Request.Headers["x-onetime-token"];
            var token = header.ToString().Trim();

            var header2 = context.GetHttpContext().Request.Headers["x-onetime-token-id"];
            var id= header2.ToString().Trim();

            logger.LogInformation(token);

            var eventLog = events.GetEventLog(id);
            if (eventLog == null)
            {
                throw new RpcException(new Status());
            }

            var payload = JsonConvert.DeserializeObject<TokenPayload>(eventLog.Payload);
            if (payload.Token != token)
            {
                throw new RpcException(new Status());
            }

            if (!string.IsNullOrEmpty(payload.Consumed))
            {
                throw new RpcException(new Status());
            }

            if (DateTime.Compare((DateTime)payload.Expiration, DateTime.UtcNow) < 0)
            {
                throw new RpcException(new Status());
            }
            
            var result = database.UpdateUser(request.Email, true, token);
            if (result)
            {
                // update token consumed
                payload.Consumed = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                events.UpdateEventLog(id, JsonConvert.SerializeObject(payload));
                events.AppendEventLog(new EventEntity()
                {
                    Name = "Verify-Email",
                    UserEmail = request.Email.ToLower(),
                    Email = request.Email.ToLower(),
                    Payload = token,
                    Date = DateTime.UtcNow
                });
            }

            return Task.FromResult(new ServiceReply()
            {
                Code = "user-email-verified",
                Message = "Your account is confirmed",
                Id = ""
            });
        }
    }
}
