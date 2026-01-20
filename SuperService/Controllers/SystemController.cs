using Cloud77.Abstractions;
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
        private readonly TextLoggingModel model;

        public SystemController(IConfiguration configuration)
        {
            database = configuration["Database"] ?? "";
            model = new TextLoggingModel();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var templates = new List<string>();
            if (ServiceDataModel.HasPasswordResetTemplate) templates.Add("password-reset.html");
            if (ServiceDataModel.HasEmailConfirmTemplate) templates.Add("email-confirm.html");

            return Ok(new
            {
                localhost = ServiceDataModel.IPAddress,
                database,
                usersJson = new UserDataModel().HasUsers.ToString(),
                templates = templates.ToArray(),
                settings = ServiceDataModel.Settings.ToArray()
            });
        }

        [HttpGet]
        [Route("mail-body")]
        public IActionResult GetMailBody()
        {
            string body = ServiceDataModel.GetLatestMailBody();
            if (string.IsNullOrEmpty(body))
            {
                return NotFound("Mail body file not found.");
            }

            return Content(body, "text/html");
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

            var content = model.GetLog(name, date);
            if (!string.IsNullOrEmpty(content))
            {
                return Content(content, "text/plain");
            }

            return BadRequest("Not find the log file");
        }

        [HttpGet]
        [Route("histories/{date}")]
        public IActionResult GetHistory(string date)
        {
            var content = model.GetHistory(date);
            if (!string.IsNullOrEmpty(content))
            {
                return Content(content, "text/plain");
            }
            return BadRequest("Not find the log file");
        }

        [HttpGet]
        [Route("errors/{id}")]
        public IActionResult GetError(string id)
        {
            var content = model.GetError(id);
            if (!string.IsNullOrEmpty(content))
            {
                Content(content, "text/plain");
            }
            return BadRequest("Not find the log file");
        }
    }
}
