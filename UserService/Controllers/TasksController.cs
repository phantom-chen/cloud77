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
      collection = new TaskCollection(client, configuration);
    }

    [HttpGet]
    [Route("{email}")]
    public IActionResult Get(string email)
    {
      User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
      var tasks = collection.GetTasks(email, 0, 50)
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
      return NotFound(new ServiceResponse("empty-user-task"));
    }

    [HttpPost]
    [Route("{email}")]
    public IActionResult Post(string email, [FromBody] UserTask task)
    {
      var id = collection.CreateTask(email, task.Title, task.Description);
      return Created($"/api/tasks/{id}", new ServiceResponse("user-task-created", id, "Create task"));
    }

    [HttpPut]
    public IActionResult Put([FromBody] UserTask task)
    {
      var result = collection.UpdateTask(task.Id, task.Title, task.Description, task.State);
      if (result)
      {
        return Ok(new ServiceResponse("user-task-updated", task.Id, "Update task"));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to update task"));
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
      var result = collection.DeleteTask(id);
      if (result)
      {
        return Ok(new ServiceResponse("user-task-deleted", id, "Delete task"));
      }
      else
      {
        return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", "", "fail to delete task"));
      }
    }

    /// <summary>
    /// Delete user's tasks.
    /// </summary>
    /// <returns></returns>
    [HttpDelete]
    public IActionResult Delete()
    {
      return Ok(new ServiceResponse("user-task-clear", "", "todo"));
    }
  }
}
