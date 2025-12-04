using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserService.MySQL.Collections;

namespace UserService.MySQL.Controllers
{
    //[Authorize(Roles = "role1,role2,role3")]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly DatabaseModel database;

        public MessagesController(DatabaseModel database)
        {
            this.database = database;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var messages = database.Messages.ToList();
            var headers = new Dictionary<string, string>();
            headers.Add("Content-Type", "application/json");
            if (messages.Any())
            {
                return Ok(messages);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
