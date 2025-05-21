using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SuperService.Collections;
using SuperService.Models;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [Authorize]
  [ApiController]
  public class AccountsController : ControllerBase
  {
    private readonly UserCollection collection;
    
    public AccountsController(
      MongoClient client,
      IConfiguration configuration)
    {
      collection = new UserCollection(client, configuration);
    }

    [HttpGet]
    public IActionResult Get([FromQuery] AccountQuery query)
    {
      if (string.IsNullOrEmpty(query.Role) && string.IsNullOrEmpty(query.Email))
      {
        return BadRequest(new ServiceResponse("empty-email-role", "", "role / email should not be empty"));
      }

      var search = "";
      if (!string.IsNullOrEmpty(query.Email))
      {
        search += $"email={query.Email};";
      }
      if (!string.IsNullOrEmpty(query.Role))
      {
        search += $"role={query.Role};";
      }

      var users = collection.GetUsers(query.Index, query.Size, query.Sort);
      var result = new AccountsQueryResult()
      {
        Data = users.Select(user =>
        {
          return new UserAccount()
          {
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Profile = user.Profile
          };
        }),
        Total = 999,
        Index = query.Index,
        Size = query.Size,
        Query = ""
      };

      return Ok(result);
    }

    [HttpGet]
    [Route("emails")]
    public IActionResult GetEmails([FromQuery] string search)
    {
      if (!System.IO.File.Exists(Path.Combine(LocalDataModel.Root, "users.json")))
      {
        return NotFound();
      }
      var content = System.IO.File.ReadAllText(Path.Combine(LocalDataModel.Root, "users.json"));
      var users = JsonConvert.DeserializeObject<List<User>>(content);
      var results = users.Where(u => u.Email.Contains(search)).Take(50).Select(u => u.Email);
      return Ok(results);
    }
  }

  public class AccountQuery : BaseQuery
  {
    public string Role { get; set; } = "";
    public string Email { get; set; } = "";
  }
}
