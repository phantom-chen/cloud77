using Cloud77.Abstractions.Service;
using Cloud77.Abstractions.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SampleService.Collections;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BookmarksController : ControllerBase
  {
    private readonly ILogger<BookmarksController> logger;
    private readonly BookmarkCollection collection;
    private readonly string database;

    public BookmarksController(
        ILogger<BookmarksController> logger,
        MongoClient client,
        IConfiguration configuration)
    {
      this.logger = logger;
      database = configuration["Database"] ?? "";
      if (!string.IsNullOrEmpty(database))
      {
        collection = new BookmarkCollection(client, database);
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
      var bookmarks = collection.GetBookmarks(index, size);
      if (bookmarks == null)
      {
        return NotFound(new EmptyBookmark());
      }
      var count = collection.Count();
      return Ok(new BookmarksResult()
      {
        Index = index,
        Size = size,
        Total = count,
        Query = "",
        Data = bookmarks.ToArray()
      });
    }

    [HttpPost]
    public IActionResult Post([FromBody] BookmarkEntity body)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      var id = collection.CreateBookmark(body);
      return Created($"/bookmarks/{id}", new BookmarkCreated(id));
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult Put(string id, [FromBody] BookmarkEntity body)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      collection.UpdateBookmark(id, body);
      return Accepted($"/bookmarks/{id}", new BookmarkUpdated(id));
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new NotFoundDatabase());
      }
      var result = collection.DeleteBookmark(id);
      if (result)
      {
        return Ok(new BookmarkDeleted(id));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to update bookmark"));
      }
    }
  }
}
