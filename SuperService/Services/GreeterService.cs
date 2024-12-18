using Grpc.Core;
using Microsoft.IdentityModel.Tokens;
using SuperService.Protos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SuperService.Services
{
    public class GreeterService : Greeter.GreeterBase
    {
        private readonly ILogger<GreeterService> _logger;
        private readonly IConfiguration configuration;

        public GreeterService(ILogger<GreeterService> logger, IConfiguration configuration)
        {
            _logger = logger;
            this.configuration = configuration;
        }

        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            _logger.LogInformation(request.Name);
            _logger.LogInformation(request.Age.ToString());

            string shuxiang = request.Age > 24 ? "monkey" : "tiger";
            return Task.FromResult(new HelloReply
            {
                Message = $"hello {request.Name}, your shuxiang is {shuxiang} calculated from rpc service",
                Shuxiang = shuxiang,
            });
        }

        private void testing()
        {
            _logger.LogInformation(configuration["SecurityKey"]);
            _logger.LogInformation(configuration["Issuer"]);
            _logger.LogInformation(configuration["Audience"]);
            _logger.LogInformation(configuration["Token_expiration_hour"]);
            var key = Encoding.UTF8.GetBytes(configuration["SecurityKey"]);

            var handler = new JwtSecurityTokenHandler();
            var k = new SymmetricSecurityKey(key);
            var c = new SigningCredentials(k, SecurityAlgorithms.HmacSha256);

            var description = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, "123"),
                    new Claim(ClaimTypes.Role, "456"),
                    new Claim(ClaimTypes.Name, "789"),
                    new Claim(ClaimTypes.Expiration, DateTime.UtcNow.AddHours(10).ToString("yyyyMMddHHmmss"))
                }),
                Issuer = configuration["Issuer"],
                Audience = configuration["Audience"],
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddHours(10),
                SigningCredentials = c
            };
            var token = handler.WriteToken(handler.CreateToken(description));
            _logger.LogInformation(token);
        }
    }
}
