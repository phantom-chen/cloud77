using Grpc.Core;
using SuperService.Protos;
using System.Threading.Tasks;

namespace SuperService.Services
{
    public class UserTokenService: TokenCreator.TokenCreatorBase
    {
        public UserTokenService() { }

        public override Task<TokenReply> IssueToken(TokenRequest request, ServerCallContext context)
        {
            return Task.FromResult(new TokenReply()
            {
                Value = "token works"
            });
        }
    }
}
