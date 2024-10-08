using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using UserService.Contexts;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventStoreContext eventStore;
        public EventsController(MongoClient client, IConfiguration configuration)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            eventStore = new EventStoreMongoContext(client.GetDatabase(dbName));
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string name, [FromQuery] int index, [FromQuery] int size)
        {
            return Ok(new EventsQueryResult()
            {
                Index = index,
                Size = size,
                Total = 999,
                Query = "",
                Data = eventStore.GetEventsByName(name, index, size)
            });
        }

        [HttpGet]
        [Route("{email}")]
        public IActionResult GetByEmail(string email, [FromQuery] int index, [FromQuery] int size)
        {
            return Ok(new EventsQueryResult()
            {
                Index = index,
                Size = size,
                Total = 999,
                Query = "",
                Data = eventStore.GetEventsByEmail(email, index, size)
            });
        }
    }
}
