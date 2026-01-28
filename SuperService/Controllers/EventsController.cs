using Cloud77.Abstractions;
using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SuperService.Collections;

namespace SuperService.Controllers
{
    [Route("super/[controller]")]
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

        private string MaskString()
        {
            return "********";
        }

        private IEnumerable<EventEntity> MaskPaylods(IEnumerable<EventEntity> events)
        {
            return events.Select(e =>
            {
                if (e.Name == "Email-Token" || e.Name == "Password-Token")
                {
                    var payload = JsonConvert.DeserializeObject<TokenPayload>(e.Payload);
                    payload.Token = MaskString();
                    e.Payload = JsonConvert.SerializeObject(payload);
                }
                else if (e.Name == "Verify-Email" || e.Name == "Reset-Password")
                {
                    e.Payload = MaskString();
                }
                return e;
            });
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
                Data = MaskPaylods(collection.GetEventLogs(name, index, size))
            });
        }

        [HttpGet]
        [Route("names")]
        public IActionResult Get()
        {
            var content = ServiceDataModel.GetSetting("event_names");
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
            var events = collection.GetEventLogs(email, "");
            return Ok(new EventsQueryResult()
            {
                Index = index,
                Size = size,
                Total = 999,
                Query = "",
                Data = MaskPaylods(events)
            });
        }

        [HttpDelete]
        [Route("{email}")]
        public IActionResult DeleteUserLogs(string email)
        {
            collection.DeleteEventLogs(email, "");
            return Ok(new AuthorDeleted("abc"));
        }

        [HttpDelete]
        [Route("")]
        public IActionResult Delete([FromQuery] string id)
        {
            collection.DeleteEventLog(id);
            return Ok(new AuthorDeleted("abc"));
        }
    }
}
