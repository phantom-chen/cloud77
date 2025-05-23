﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SampleService.Models;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PostsController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
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
  }
}
