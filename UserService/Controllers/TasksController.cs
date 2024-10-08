using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserService.Contexts;
using System.Linq;
using System;
using Microsoft.AspNetCore.Authorization;
using UserService.Models;
using MongoDB.Driver;
using System.Security.Claims;
using Cloud77.Service;
using Cloud77.Service.Entity;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskStoreContext context;

        public TasksController(MongoClient client, IConfiguration configuration)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            context = new TaskStoreMongoContext(client.GetDatabase(dbName));
        }

        [HttpGet]
        [Route("{email}")]
        public IActionResult Get(string email)
        {
            var tasks = context.GetTasks(0, 10).Where(t => t.Email == email).Select(t => new UserTask()
            {
                Id = t.Id.ToString(),
                Title = t.Title,
                Description = t.Description,
                State = t.State
            }).ToArray();
            if (tasks == null || tasks.Length == 0)
            {
                return NotFound(new ServiceResponse("empty-user-task"));
            }
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

        [HttpPost]
        [Route("{email}")]
        public IActionResult Post(string email, [FromBody] TaskEntity task)
        {
            var id = context.NewTask(email, task.Title, task.Description);
            return Created(
                $"http://localhost:5389/api/tasks/{id}",
                new ServiceResponse("user-task-created", id, "Create task"));
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put(string id, [FromBody] TaskEntity task)
        {
            var email = task.Email;
            var result = context.UpdateTask(id, task.Title, task.Description, task.State);

            if (result)
            {
                return Ok(new ServiceResponse("user-task-updated", id, "Update task"));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to update task"));
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(string id)
        {
            var result = context.DeleteTask(id);
            if (result)
            {
                return Ok(new ServiceResponse("user-task-deleted", id, "Delete task"));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to delete task"));
            }
        }

        [HttpDelete]
        [Route("all")]
        public IActionResult DeleteAll()
        {
            return Ok(new ServiceResponse("user-task-clear", "", "todo"));
        }
    }
}
