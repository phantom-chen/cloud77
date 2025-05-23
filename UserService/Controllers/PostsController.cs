using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using UserService.Collections;
using UserService.Models;

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

    [HttpPut]
    public IActionResult Put()
    {
      return Ok();
    }

    [HttpGet]
    [Route("{id}")]
    public IActionResult GetContent(string id)
    {
      var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
      var posts = collection.GetPosts(email.Value, 0, 50);

      // check post id exists
      // check post content exists, if not, create empty

      if (posts.Any(p => p.Id.ToString() == id))
      {
        return Content(new LocalUserDataModel(email.Value).GetPost(id), "text/plain");
      }

      return NotFound();      
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> PutContent(string id)
    {
      var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
      var posts = collection.GetPosts(email.Value, 0, 50);

      // check post id exists
      // check post content exists, if not, create empty

      if (posts.Any(p => p.Id.ToString() == id))
      {
        using (var reader = new StreamReader(Request.Body))
        {
          var content = await reader.ReadToEndAsync();
          new LocalUserDataModel(email.Value).UpdatePost(id, content);
        }
        return Ok();
      }

      return NotFound();
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      return Ok();
    }
  }
}
