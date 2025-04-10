using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SampleService.Collections;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthorsController : ControllerBase
  {
    private readonly ILogger<AuthorsController> logger;
    private readonly AuthorCollection collection;
    public AuthorsController(
        ILogger<AuthorsController> logger,
        MongoClient client,
        IConfiguration configuration)
    {
      this.logger = logger;
      collection = new AuthorCollection(client, configuration);
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int index, [FromQuery] int size)
    {
      var authors = collection.GetAuthors(index, size);
      if (authors == null)
      {
        return NotFound(new ServiceResponse("empty-author", "", "empty author"));
      }

      return Ok(new Collections.AuthorsResult()
      {
        Index = 0,
        Size = 10,
        Total = 999,
        Query = "",
        Data = authors.ToArray()
      });
    }

    [HttpPost]
    public IActionResult Post([FromBody] AuthorEntity body)
    {
      var id = collection.CreateAuthor(new AuthorEntity()
      {
        Name = body.Name,
        Title = body.Title,
        Region = body.Region,
        Address = body.Address
      });
      return Created("/authors/" + id, new ServiceResponse("author-created"));
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult Put(string id, [FromBody] AuthorEntity body)
    {
      collection.UpdateAuthor(id, new AuthorEntity()
      {
        Name = body.Name,
        Title = body.Title,
        Region = body.Region,
        Address = body.Address
      });
      return Accepted("/authors/" + id, new ServiceResponse("author-created", id, ""));
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      var result = collection.DeleteAuthor(id);
      if (result)
      {
        return Ok(new ServiceResponse("author-deleted", id, ""));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", id, "fail to update author"));
      }
    }

    [HttpDelete]
    [Route("")]
    public IActionResult Clear()
    {
      collection.Clear();
      return Ok(new ServiceResponse("author-clear"));
    }
  }
}
