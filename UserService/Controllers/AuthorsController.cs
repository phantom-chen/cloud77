using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserService.Collections;

namespace UserService.Controllers
{
    public class AuthorsResult : QueryResults
    {
        public AuthorMongoEntity[] Data = Array.Empty<AuthorMongoEntity>();
    }

    [Route("api/[controller]")]
    [Authorize]
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

            return Ok(new AuthorsResult()
            {
                Index = 0,
                Size = 10,
                Total = 999,
                Query = "",
                Data = authors.ToArray()
            });
        }
    }
}
