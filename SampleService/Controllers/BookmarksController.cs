using Cloud77.Service;
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
        return NotFound(new ServiceResponse("database-not-found", "", "database not found"));
      }
      if (index < 0) index = 0;
      if (size <= 0) size = 3;
      var bookmarks = collection.GetBookmarks(index, size);
      if (bookmarks == null)
      {
        return NotFound(new ServiceResponse("empty-bookmark", "", "empty bookmark"));
      }
      var count = collection.Count();
      return Ok(new Collections.BookmarksResult()
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
        return NotFound(new ServiceResponse("database-not-found", "", "database not found"));
      }
      var id = collection.CreateBookmark(body);
      return Created($"/bookmarks/{id}", new ServiceResponse("bookmark-created"));
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult Put(string id, [FromBody] BookmarkEntity body)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new ServiceResponse("database-not-found", "", "database not found"));
      }
      collection.UpdateBookmark(id, body);
      return Accepted($"/bookmarks/{id}", new ServiceResponse("bookmark-updated", id, ""));
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
      if (string.IsNullOrEmpty(database))
      {
        return NotFound(new ServiceResponse("database-not-found", "", "database not found"));
      }
      var result = collection.DeleteBookmark(id);
      if (result)
      {
        return Ok(new ServiceResponse("bookmark-deleted", id, ""));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", id, "fail to update author"));
      }
    }
  }
}
