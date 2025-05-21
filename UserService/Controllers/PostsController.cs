using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using UserService.Collections;

namespace UserService.Controllers
{
  [Route("api/[controller]")]
  [Authorize]
  [ApiController]
  public class PostsController : ControllerBase
  {
    private readonly ILogger<PostsController> logger;
    private readonly PostCollection collection;

    public PostsController(
        ILogger<PostsController> logger,
        MongoClient client,
        IConfiguration configuration
        )
    {
      this.logger = logger;
      collection = new PostCollection(client, configuration);
    }

    [HttpGet]
    public IActionResult Get()
    {
      var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
      var posts = collection.GetPosts(email.Value, 0, 50)
          .Select(t => new UserPost()
          {
            Id = t.Id.ToString(),
            Title = t.Title,
            Description = t.Description,
          });
      if (posts != null && posts.Count() > 0)
      {
        return Ok(new UserPosts()
        {
          Email = email.Value,
          Index = 0,
          Size = 10,
          Total = 999,
          Query = "",
          Data = posts

        });
      }
      return NotFound(new ServiceResponse("empty-user-post"));
    }

    [HttpPost]
    public IActionResult Post()
    {
      // create empty post content
      return Ok();
    }

    [HttpPost]
    public IActionResult Put()
    {
      return Ok();
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetContent(string id)
    {
      // check post id exists
      // check post content exists, if not, create empty
      return Ok();
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult PutContent(string id)
    {
      // check post id exists
      // check post content exists, if not, create empty
      return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      return Ok();
    }
  }
}
