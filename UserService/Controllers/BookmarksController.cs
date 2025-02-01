using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserService.Collections;

namespace UserService.Controllers
{
    public class BookmarksResult : QueryResults
    {
        public BookmarkMongoEntity[] Data = Array.Empty<BookmarkMongoEntity>();
    }

    [Route("api/[controller]")]
    [Authorize]
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
            var bookmarks = collection.GetBookmarks(index, size);
            if (bookmarks == null)
            {
                return NotFound(new ServiceResponse("empty-bookmark", "", "empty bookmark"));
            }

            return Ok(new BookmarksResult()
            {
                Index = 0,
                Size = 10,
                Total = 999,
                Query = "",
                Data = bookmarks.ToArray()
            });
        }
    }
}
