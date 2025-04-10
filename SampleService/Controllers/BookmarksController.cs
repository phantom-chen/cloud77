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
    public BookmarksController(
        ILogger<BookmarksController> logger,
        MongoClient client,
        IConfiguration configuration)
    {
      this.logger = logger;
      collection = new BookmarkCollection(client, configuration);
    }

    [HttpGet]
    public IActionResult Get([FromQuery] int index, [FromQuery] int size)
    {
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
      var id = collection.CreateBookmark(body);
      return Created($"/bookmarks/{id}", new ServiceResponse("bookmark-created"));
    }

    [HttpPut]
    [Route("{id}")]
    public IActionResult Put(string id, [FromBody] BookmarkEntity body)
    {
      collection.UpdateBookmark(id, body);
      return Accepted($"/bookmarks/{id}", new ServiceResponse("bookmark-updated", id, ""));
    }

    [HttpDelete]
    [Route("{id}")]
    public IActionResult Delete(string id)
    {
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
