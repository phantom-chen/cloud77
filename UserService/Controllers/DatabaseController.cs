using Cloud77.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using static ServiceStack.Diagnostics.Events;
using System;
using Microsoft.Extensions.Configuration;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private readonly IMongoDatabase database;

        public DatabaseController(IConfiguration configuration, MongoClient client)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            database = client.GetDatabase(dbName);
        }

        [HttpGet]
        [Route("collections")]
        public IActionResult GetCollections()
        {
            var results = database.ListCollectionNames().ToList();
            return Ok(results);
        }

        [HttpDelete]
        [Route("collections")]
        public IActionResult DeleteCollection([FromQuery] string name)
        {
            database.DropCollection(name);
            return Ok(new ServiceResponse("collection-deleted", name, "Delete collection"));
        }
    }
}
