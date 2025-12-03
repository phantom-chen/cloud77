using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperService.Models;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SystemController : ControllerBase
  {
    private readonly string database;
    public SystemController(IConfiguration configuration)
    {
      database = configuration["Database"] ?? "";
    }

    [HttpGet]
    public IActionResult Get()
    {
      var data = new LocalDataModel();
      var templates = new List<string>();
      if (data.HasPasswordResetTemplate) templates.Add("password-reset.html");
      if (data.HasEmailConfirmTemplate) templates.Add("email-confirm.html");

      return Ok(new
      {
        localhost = LocalDataModel.IPAddress,
        database,
        usersJson = data.HasUsers.ToString(),
        templates = templates.ToArray(),
        settings = data.GetSettings()
      });
    }

    [HttpGet]
    [Route("mail-body")]
    public IActionResult GetMailBody()
    {
      string filePath = "mail-body.txt";
      if (!System.IO.File.Exists(Path.Combine(LocalDataModel.Root, filePath)))
      {
        return NotFound("Mail body file not found.");
      }

      string mailBody = System.IO.File.ReadAllText(Path.Combine(LocalDataModel.Root, filePath));
      return Content(mailBody, "text/html");
    }

    /// <summary>
    /// Provide the log today
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("logs")]
    public IActionResult GetLogs()
    {
      DateTime.Now.ToString("yyyyMMdd");
      return Ok();
    }

    /// <summary>
    /// Provide the log for specific date
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("logs/{name}/{date}")]
    public IActionResult Get(string name, string date)
    {
      if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(date))
      {
        return BadRequest("Name and date parameters are required.");
      }
      
      name = char.ToUpper(name[0]) + name.Substring(1).ToLower();

      if (System.IO.File.Exists(Path.Combine(LocalDataModel.Root, "logs", $"{name}-{date}.txt")))
      {
        return Content(System.IO.File.ReadAllText(Path.Combine(LocalDataModel.Root, "logs", $"{name}-{date}.txt")), "text/plain");
      }

      return BadRequest("Not find the log file");
    }

    [HttpGet]
    [Route("history")]
    public IActionResult GetHistory()
    {
      return Ok();
    }

    [HttpGet]
    [Route("error/{id}")]
    public IActionResult GetError(string id)
    {
      return Ok();
    }
  }
}
