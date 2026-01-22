using Cloud77.Abstractions.Utility;
using Cloud77.Abstractions.Entity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace UserService.Models
{
    public class TokenGenerator
    {
        private readonly string issuer;
        private readonly string audience;
        private readonly byte[] key;
        public readonly int ExpirationInHour;
        private readonly string desKey;
        private readonly string desIV;

        public TokenGenerator(IConfiguration configuration)
        {
            issuer = configuration["Issuer"] ?? "";
            audience = configuration["Audience"] ?? "";
            key = Encoding.UTF8.GetBytes(configuration["SecurityKey"] ?? "");
            ExpirationInHour = Convert.ToInt16(configuration["Token_expiration_hour"] ?? "24");
            desKey = configuration["DES_Key"] ?? "";
            desIV = configuration["DES_IV"] ?? "";
        }

        public string IssueToken(UserEntity user)
        {
            var handler = new JwtSecurityTokenHandler();
            var k = new SymmetricSecurityKey(key);
            var c = new SigningCredentials(k, SecurityAlgorithms.HmacSha256);

            // add salt, timestamp, expiration

            var description = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Name, user.Name ?? ""),
                    new Claim(ClaimTypes.Expiration, DateTime.UtcNow.AddHours(ExpirationInHour).ToString("yyyyMMddHHmmss")),
                    new Claim("confirmed", (user.Confirmed ?? false).ToString())
                }),
                Issuer = issuer,
                Audience = audience,
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddHours(ExpirationInHour),
                SigningCredentials = c
            };
            var token = handler.WriteToken(handler.CreateToken(description));

            return token;
        }

        // refresh token format: {email}_{salt value}_{timestamp}_{salt expiration}

        public string IssueRefreshToken(string email, string timestamp, string expiration, string salt)
        {
            var key = Encoding.ASCII.GetBytes(desKey);
            var iv = Encoding.ASCII.GetBytes(desIV);

            var data = string.Join("_", new string[] { email, salt, timestamp, expiration });
            string _key = CodeGenerator.Encrypt(key, iv, data);
            return _key;
        }

        public Dictionary<string, string> ValidateRefreshToken(string email, string token)
        {
            var key = Encoding.ASCII.GetBytes(desKey);
            var iv = Encoding.ASCII.GetBytes(desIV);
            var result = new Dictionary<string, string>();

            try
            {
                var data = CodeGenerator.Decrypt(key, iv, token);
                var parts = data.Split("_");

                if (parts.Length == 4 && parts[0] == email)
                {
                    result["email"] = parts[0];
                    result["salt"] = parts[1];
                    result["timestamp"] = parts[2];
                    result["expiration"] = parts[3];
                }

                return result;
            }
            catch (Exception)
            {
                return result;
            }
        }
    }
}
