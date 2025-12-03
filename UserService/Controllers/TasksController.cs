using Cloud77.Abstractions.Service;
using Microsoft.AspNetCore.Authorization;
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
            collection = new TaskCollection(client, configuration);
        }

        [HttpGet]
        public IActionResult Get()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email).Value;
            var tasks = collection.Get(email)
                .Select(t => new UserTask()
                {
                    Id = t.Id.ToString(),
                    Title = t.Title,
                    Description = t.Description,
                    State = t.State
                });
            if (tasks != null && tasks.Count() > 0)
            {
                return Ok(new UserTasks()
                {
                    Email = email,
                    Index = 0,
                    Size = 10,
                    Total = 999,
                    Query = "",
                    Data = tasks

                });
            }
            return NotFound(new EmptyUserTask(email));
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserTask task)
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email).Value;
            var id = collection.Create(email, task.Title, task.Description);
            return Created($"/api/tasks/{id}", new UserTaskCreated(id));
        }

        [HttpPut]
        public IActionResult Put([FromBody] UserTask task)
        {
            var result = collection.Update(task.Id, task.Title, task.Description, task.State);
            if (result)
            {
                return Ok(new UserTaskUpdated(task.Id));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to update task"));
            }
        }

        /// <summary>
        /// Delete user's one task.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public IActionResult DeleteOne(string id)
        {
            var result = collection.Delete(id);
            if (result)
            {
                return Ok(new UserTaskDeleted(id));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new DatabaseError("fail to delete task"));
            }
        }
    }
}
