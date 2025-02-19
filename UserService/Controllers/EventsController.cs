using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Drawing;
using UserService.Collections;

namespace UserService.Controllers
{
    /// <summary>
    /// Help manage event logs.
    /// </summary>
    [Route("api/[controller]")]
    [Authorize]
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
        public IActionResult Get()
        {
            return Ok();
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
    }
}
