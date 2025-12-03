using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
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
    private readonly AuthorCollection? collection;
    private readonly string database;
    
    public AuthorsController(
        ILogger<AuthorsController> logger,
        MongoClient client,
        IConfiguration configuration)
    {
      this.logger = logger;
      database = configuration["Database"] ?? "";
      if (!string.IsNullOrEmpty(database))
      {
        collection = new AuthorCollection(client, database);
      }
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int index, [FromQuery] int size)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      if (index < 0) index = 0;
      if (size <= 0) size = 3;
      var authors = collection.GetAuthors(index, size);
      if (authors == null)
      {
        return NotFound(new EmptyAuthor());
      }
      var count = collection.Count();
      return Ok(new AuthorsResult()
      {
        Index = index,
        Size = size,
        Total = count,
        Query = "",
        Data = authors.ToArray()
      });
    }

    [HttpPost]
    public IActionResult Post([FromBody] AuthorEntity body)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      var id = collection.CreateAuthor(new AuthorEntity()
      {
        Name = body.Name,
        Title = body.Title,
        Region = body.Region,
        Address = body.Address
      });
      return Created("/authors/" + id, new AuthorCreated(id));
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult Put(string id, [FromBody] AuthorEntity body)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      collection.UpdateAuthor(id, new AuthorEntity()
      {
        Name = body.Name,
        Title = body.Title,
        Region = body.Region,
        Address = body.Address
      });
      return Accepted("/authors/" + id, new AuthorUpdated(id));
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      var result = collection.DeleteAuthor(id);
      if (result)
      {
        return Ok(new AuthorDeleted(id));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to update author"));
      }
    }

    //[HttpDelete]
    //[Route("")]
    //public IActionResult Clear()
    //{
    //  collection.Clear();
    //  return Ok(new ServiceResponse("author-clear"));
    //}
  }
}
