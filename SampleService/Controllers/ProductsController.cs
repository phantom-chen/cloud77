﻿using Cloud77.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SampleService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductsController : ControllerBase
  {
    /// <summary>
    /// product get action
    /// </summary>
    /// <remarks>
    /// get api/products
    /// </remarks>
    /// <returns>product array</returns>
    /// <response code="200">ok</response>
    /// <response code="500">internal error</response>
    [HttpGet]
    [ProducesResponseType(typeof(string[]), 200)]
    [ProducesResponseType(500)]
    public IActionResult Get()
    {
      return Ok(new string[] { "product1", "product2", "product3" });
    }

    /// <summary>
    /// product get action
    /// </summary>
    /// <remarks>
    /// get api/products/1
    /// </remarks>
    /// <param name="id">key</param>
    /// <returns>product</returns>
    [HttpGet]
    [Route("{id:int}")]
    public IActionResult GetById(int id)
    {
      return Ok(new ServiceResponse("xx", id.ToString(), "todo-" + id.ToString()));
    }

    /// <summary>
    /// product post action
    /// </summary>
    /// <returns></returns>
    [HttpPost]
    public IActionResult Post()
    {
      return Created("todo", new ServiceResponse("xx", "", "todo for products post"));
    }

    /// <summary>
    /// product put action
    /// </summary>
    /// <returns></returns>
    [HttpPut]
    public IActionResult Put([FromQuery] int code)
    {
      switch (code)
      {
        case 123:
          throw new System.Exception("mock error");
        case 200:
          return Ok(new ServiceResponse("ok", "", "ok"));
        case 201:
          return Created("todo", new ServiceResponse("xxx", "", "created"));
        case 202:
          return Accepted(new ServiceResponse("xxx", "", "accepted"));
        case 204:
          return NoContent();
        case 302:
          return Redirect("info/service");
        case 400:
          return BadRequest(new ServiceResponse("xxx", "", "400"));
        case 401:
          return Unauthorized(new ServiceResponse("xxx", "", "401"));
        case 403:
          return Forbid();
        case 404:
          return NotFound(new ServiceResponse("xxx", "", "404"));
        case 409:
          return Conflict(new ServiceResponse("xxx", "", "409"));
        default:
          return NoContent();
      }
    }

    /// <summary>
    /// product delete action
    /// </summary>
    /// <returns></returns>
    [HttpDelete]
    public IActionResult Delete([FromQuery] string name)
    {
      if (string.IsNullOrEmpty(name))
      {
        return BadRequest(new ServiceResponse("xx", "", "empty name"));
      }
      else
      {
        return Ok(new ServiceResponse("xx", "", "product is deleted"));
      }
    }
  }
}
