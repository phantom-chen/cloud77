using Cloud77.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using UserService.Collections;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ILogger<TasksController> logger;
        private readonly TaskCollection collection;
        public TasksController(
            ILogger<TasksController> logger,
            MongoClient client,
            IConfiguration configuration
            )
        {
            this.logger = logger;
            collection = new TaskCollection( client, configuration );
        }

        [HttpGet]
        public IActionResult Get()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var tasks = collection.GetTasks(email.Value, 0, 50)
                .Select(t => new UserTask() {
                    Id = t.Id.ToString(),
                    Title = t.Title,
                    Description = t.Description,
                    State = t.State
                });
            if (tasks != null && tasks.Count() > 0)
            {
                return Ok(new UserTasks()
                {
                    Email = email.Value,
                    Index = 0,
                    Size = 10,
                    Total = 999,
                    Query = "",
                    Data = tasks

                });
            }
            return NotFound(new ServiceResponse("empty-user-task"));
        }
    }
}
