using Cloud77.Abstractions.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SuperService.Collections;
using SuperService.Models;

namespace SuperService.Controllers
{
    [Route("api/[controller]")]
    [Authorize] // role must be admin
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ILogger<EventsController> logger;
        private readonly MongoClient client;
        private readonly IConfiguration configuration;
        private readonly EventCollection collection;

        public EventsController(
            ILogger<EventsController> logger,
            MongoClient client,
            IConfiguration configuration)
        {
            this.logger = logger;
            this.client = client;
            this.configuration = configuration;
            collection = new EventCollection(client, configuration);
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
                Data = collection.GetEventLogs(name, index, size)
            });
        }

        [HttpGet]
        [Route("names")]
        public IActionResult Get()
        {
            var content = new LocalDataModel().GetSetting("event_names");
            if (string.IsNullOrEmpty(content))
            {
                return NotFound();
            }
            else
            {
                var names = content.Split(" ");
                return Ok(names);
            }
        }

        [Route("{email}")]
        [HttpGet]
        public IActionResult GetByEmail(string email)
        {
            var index = 1;
            var size = 10;
            var events = collection.GetEventLogs(email);
            return Ok(new EventsQueryResult()
            {
                Index = index,
                Size = size,
                Total = 999,
                Query = "",
                Data = events
            });
        }

        [HttpDelete]
        [Route("{email}")]
        public IActionResult Delete(string email)
        {
            collection.DeleteSome(email);
            return Ok(new AuthorDeleted("abc"));
        }
    }
}
