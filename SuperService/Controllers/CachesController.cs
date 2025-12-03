using Cloud77.Abstractions.Entity;
using Cloud77.Abstractions.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SuperService.Collections;

namespace SuperService.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CachesController : ControllerBase
  {
    private readonly CacheCollection caches;

    public CachesController()
    {
      caches = new CacheCollection();
    }

    [HttpGet]
    public IActionResult Get()
    {
      return Ok(caches.Ping());
    }

    [HttpGet]
    [Route("{key}")]
    public IActionResult Get(string key)
    {
      if (string.IsNullOrEmpty(key))
      {
        return BadRequest(new CacheResponse("empty-cache-key", "", ""));
      }
      else
      {
        var value = caches.GetValue<string>(key);
        if (string.IsNullOrEmpty(value))
        {
          return NotFound(new CacheResponse("invalid-cache-key", "", ""));
        }
        else
        {
          return Ok(new CacheEntity
          {
            Key = key,
            Value = value,
            ExpireInHour = 0
          });
        }
      }
    }

    [HttpPost]
    public IActionResult Post([FromBody] CacheEntity ch)
    {
      if (ch == null) return BadRequest(new CacheResponse("empty-cache-key-value", "", ""));
      if (string.IsNullOrEmpty(ch.Key) || string.IsNullOrEmpty(ch.Value)) return BadRequest(new CacheResponse("empty-cache-key-value", "", ""));

      if (ch.ExpireInHour > 0)
      {
        caches.SetValue<string>(ch.Key, ch.Value, TimeSpan.FromHours(ch.ExpireInHour));
      }
      else
      {
        caches.SetValue<string>(ch.Key, ch.Value, TimeSpan.Zero);
      }

      return Created("demo", new CacheResponse("cache-value-created", "", "xx"));
    }

    [HttpDelete]
    [Route("{key}")]
    public IActionResult Delete(string key)
    {
      if (string.IsNullOrEmpty(key))
      {
        return BadRequest(new CacheResponse("empty-cache-key", "", ""));
      }
      else
      {
        caches.RemoveValue(key);
        return Ok(new CacheResponse("cache-value-deleted", "", "xxx"));
      }
    }

    [HttpGet]
    [Route("lists/{list}")]
    public IActionResult GetList(string list)
    {
      var results = caches.GetList(list);
      if (results != null && results.Count > 0)
      {
        return Ok(results);
      }
      else
      {
        return NotFound(new CacheResponse("empty-cache-list", "", "xxx"));
      }
    }

    [HttpDelete]
    [Route("lists/{list}")]
    public IActionResult DeleteList(string list)
    {
      caches.ClearList(list);
      return Ok(new CacheResponse("cache-list-deleted", "", "xxx"));
    }

    [HttpPost]
    [Route("list-items")]
    public IActionResult AddItem([FromQuery] string list, [FromQuery] string value)
    {
      caches.AddToList(list, value);
      return Ok(new CacheResponse("cache-list-updated", "", "xxx"));
    }

    [HttpDelete]
    [Route("list-items")]
    public IActionResult DeleteItem([FromQuery] string list, [FromQuery] string value)
    {
      var result = caches.RemoveFromList(list, value);
      return Ok(new CacheResponse("cache-list-updated", "", "delete cache list"));
    }
  }
}
