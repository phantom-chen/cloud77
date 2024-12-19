using Cloud77.Service.Entity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SuperService.Services
{
    public class TokenGenerator
    {
        private readonly string issuer;
        private readonly string audience;
        private readonly byte[] key;
        private readonly int expirationInHour;
        public TokenGenerator(IConfiguration configuration)
        {
            issuer = configuration["Issuer"] ?? "";
            audience = configuration["Audience"] ?? "";
            key = Encoding.UTF8.GetBytes(configuration["SecurityKey"] ?? "");
            expirationInHour = Convert.ToInt16(configuration["Token_expiration_hour"] ?? "24");
        }

        public string IssueToken(UserEntity user)
        {
            var handler = new JwtSecurityTokenHandler();
            var k = new SymmetricSecurityKey(key);
            var c = new SigningCredentials(k, SecurityAlgorithms.HmacSha256);

            var description = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim(ClaimTypes.Expiration, DateTime.UtcNow.AddHours(expirationInHour).ToString("yyyyMMddHHmmss"))
                }),
                Issuer = issuer,
                Audience = audience,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddHours(expirationInHour),
                SigningCredentials = c
            };
            var token = handler.WriteToken(handler.CreateToken(description));

            return token;
        }
    
        public string IssueRefreshToken()
        {
            return "";
        }
    }
}
