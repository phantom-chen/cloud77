using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using Cloud77.Service;

namespace UserService.Controllers
{
    /// <summary>
    /// Help manage database and collections.
    /// It can only be accessible in development or staging.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly ILogger<DatabaseController> logger;
        private readonly MongoClient client;
        private readonly IConfiguration configuration;

        public DatabaseController(
            ILogger<DatabaseController> logger,
            MongoClient client,
            IConfiguration configuration)
        {
            this.logger = logger;
            this.client = client;
            this.configuration = configuration;
        }

        private readonly List<string> defaultDatabases = new List<string>() { "admin", "local", "config" };

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            client.StartSession();
            var pingCommand = new BsonDocument("ping", 1);
            // TODO consider server is down
            var database = client.GetDatabase(configuration["Database"]);
            var pingResult = database.RunCommand<BsonDocument>(pingCommand);
            List<string> databases = new List<string>();

            if (pingResult["ok"].ToString() == "1")
            {
                databases = (await client.ListDatabaseNamesAsync()).ToList();
            }

            return Ok(new
            {
                connection = pingResult["ok"].ToString(),
                databases = databases
            });
        }

        [Route("collections")]
        [HttpGet]
        public async Task<IActionResult> GetCollections()
        {
            var database = client.GetDatabase(configuration["Database"]);
            var names = (await database.ListCollectionNamesAsync()).ToList();
            if (names.Any())
            {
                return Ok(new
                {
                    database = configuration["Database"],
                    collections = names
                });
            }
            else
            {
                return NotFound(new ServiceResponse()
                {
                    Code = "empty-database-collections",
                    Message = $"No collections found for database {configuration["Database"]}",
                    Id = ""
                });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            await client.DropDatabaseAsync(configuration["Database"]);
            return Ok(new ServiceResponse()
            {
                Code = "database-deleted",
                Message = $"Database {configuration["Database"]} has been deleted",
                Id = ""
            });
        }

        [Route("collections/{name}")]
        [HttpDelete]
        public IActionResult DeleteCollection(string name)
        {
            return Ok();
        }
    }
}
