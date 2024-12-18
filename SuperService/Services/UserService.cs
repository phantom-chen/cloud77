using Grpc.Core;
using SuperService.Protos;

namespace SuperService.Services
{
    public class UserService : Protos.UserService.UserServiceBase
    {
        private readonly ILogger<UserService> logger;
        private readonly IConfiguration configuration;

        public UserService(
            ILogger<UserService> logger,
            IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        public override Task<UserEmailResult> QueryEmail(UserEmail request, ServerCallContext context)
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
