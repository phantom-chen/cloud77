﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ValuesController : ControllerBase
  {
    [HttpGet]
    public IActionResult Get()
    {
      return Ok(new string[] { "value1", "value2" });
    }
  }
}
