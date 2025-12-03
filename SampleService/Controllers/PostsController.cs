using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SampleService.Models;

namespace SampleService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase, IDisposable
    {
        private readonly TextLoggingModel model;

        public PostsController(TextLoggingModel model)
        {
            this.model = model;
        }

        [HttpGet]
        public IActionResult Get()
        {
            model.PushLog("before getting posts");
            model.PushLog("check something");
            model.PushLog("check something again");
            model.PushLog("ready to return correct response");
            return Ok(new LocalDataModel().GetPosts());
        }

        [HttpGet("{name}")]
        public IActionResult GetContent(string name)
        {
            string content = "Sample text content";
            new LocalDataModel().GetPost(name);
            return Content(content, "text/plain");
        }

        [HttpPost("{name}")]
        public async Task<IActionResult> Post(string name)
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var content = await reader.ReadToEndAsync();
                new LocalDataModel().SavePost(name, content);
                return Ok(new { Content = content });
            }
        }

        [HttpDelete("{name}")]
        public IActionResult Delete(string name)
        {
            new LocalDataModel().DeletePost(name);
            return Ok();
        }

        public void Dispose()
        {
            model.Commit();
        }
    }
}
