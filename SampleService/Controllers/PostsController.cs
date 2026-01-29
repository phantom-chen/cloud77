using Cloud77.Abstractions;
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
        private readonly SampleDataModel sampleData;

        public PostsController(TextLoggingModel model)
        {
            this.model = model;
            sampleData = new SampleDataModel();
        }

        [HttpGet]
        public IActionResult Get()
        {
            model.PushLog("before getting posts");
            model.PushLog("check something");
            model.PushLog("check something again");
            model.PushLog("ready to return correct response");
            return Ok(sampleData.GetPosts());
        }

        [HttpGet("{name}")]
        public IActionResult GetContent(string name)
        {
            string content = "Sample text content";
            sampleData.GetPost(name);
            return Content(content, "text/plain");
        }

        [HttpPost("{name}")]
        public async Task<IActionResult> Post(string name)
        {
            using (var reader = new StreamReader(Request.Body))
            {
                var content = await reader.ReadToEndAsync();
                sampleData.SavePost(name, content);
                return Ok(new { Content = content });
            }
        }

        [HttpDelete("{name}")]
        public IActionResult Delete(string name)
        {
            sampleData.DeletePost(name);
            return Ok();
        }

        public void Dispose()
        {
            model.Commit();
        }
    }
}
