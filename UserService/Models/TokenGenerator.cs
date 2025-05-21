using Cloud77.Service;
using Cloud77.Service.Entity;
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

    public string IssueRefreshToken(string email, string timestamp)
    {
      var key = Encoding.ASCII.GetBytes(desKey);
      var iv = Encoding.ASCII.GetBytes(desIV);

      var data = string.Format("{0}_{1}_{2}", email, timestamp, CodeGenerator.GenerateDigitalCode(6));
      string _key = CodeGenerator.Encrypt(key, iv, data);
      return _key;
    }

    public bool ValidateRefreshToken(string email, string token)
    {
      var key = Encoding.ASCII.GetBytes(desKey);
      var iv = Encoding.ASCII.GetBytes(desIV);

      var data = CodeGenerator.Decrypt(key, iv, token);
      return data.Split("_")[0] == email;
    }
  }
}
