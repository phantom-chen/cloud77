using Grpc.Core;
using SuperService.Protos;

namespace SuperService.Services
{
    public class UserService : Protos.UserService.UserServiceBase
    {
        private readonly ILogger<UserService> logger;
        private readonly TokenGenerator generator;

        public UserService(
            ILogger<UserService> logger,
            TokenGenerator generator)
        {
            this.logger = logger;
            this.generator = generator;
        }

        public override Task<UserEmailResult> GetUser(UserEmail request, ServerCallContext context)
        {
            logger.LogInformation(request.Email);
            return Task.FromResult(new UserEmailResult()
            {
                Email = request.Email,
                Existing = false
            });
        }
    }
}
