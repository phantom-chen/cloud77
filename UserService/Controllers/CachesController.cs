using Cloud77.Service;
using Cloud77.Service.Entity;
using DnsClient.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using UserService.Contexts;
using System;
using System.Linq;
using System.IO;
using System.Reflection;
using System.Net;
using System.Threading.Tasks;
using System.Diagnostics;
using UserService.Filters;
using Microsoft.Extensions.Primitives;
using MongoDB.Driver;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CachesController : ControllerBase
    {
        private readonly ILogger<CachesController> logger;
        private readonly CacheContext cache;

        public CachesController(
            ILogger<CachesController> logger,
            CacheContext cache)
        {
            this.logger = logger;
            this.cache = cache;
        }

        [HttpGet]
        [Route("{key}")]
        public IActionResult Get(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                return BadRequest(new ServiceResponse("empty-cache-key"));
            }
            else
            {
                var value = cache.GetValue<string>(key);
                if (string.IsNullOrEmpty(value))
                {
                    return NotFound(new ServiceResponse("invalid-cache-key"));
                }
                else
                {
                    return Ok(new CacheItem
                    {
                        Key = key,
                        Value = value,
                        ExpireInHour = 0
                    });
                }
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] CacheItem ch)
        {
            if (ch == null) return BadRequest(new ServiceResponse("empty-cache-key-value"));
            if (string.IsNullOrEmpty(ch.Key) || string.IsNullOrEmpty(ch.Value)) return BadRequest(new ServiceResponse("empty-cache-key-value"));

            if (ch.ExpireInHour > 0)
            {
                cache.SetValue<string>(ch.Key, ch.Value, TimeSpan.FromHours(ch.ExpireInHour));
            }
            else
            {
                cache.SetValue<string>(ch.Key, ch.Value, TimeSpan.Zero);
            }

            return Created("demo", new ServiceResponse("cache-value-created", "", "xx"));
        }

        [HttpDelete]
        [Route("{key}")]
        public IActionResult Delete(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                return BadRequest(new ServiceResponse("empty-cache-key"));
            }
            else
            {
                cache.RemoveValue(key);
                return Ok(new ServiceResponse("cache-value-deleted", "", "xxx"));
            }
        }

        [HttpGet]
        [Route("lists")]
        public IActionResult GetCacheValue([FromQuery] string list)
        {
            var results = cache.GetList(list);
            if (results != null && results.Count > 0)
            {
                return Ok(results);
            }
            else
            {
                return NotFound(new ServiceResponse("empty-cache-list", "", "xxx"));
            }
        }

        [HttpDelete]
        [Route("lists")]
        public IActionResult DeleteAllCacheValue([FromQuery] string list)
        {
            cache.ClearList(list);
            return Ok(new ServiceResponse("cache-list-deleted", "", "xxx"));
        }

        [HttpPost]
        [Route("cache-list-item")]
        public IActionResult PostCacheValue([FromQuery] string list, [FromQuery] string value)
        {
            cache.AddToList(list, value);
            return Ok(new ServiceResponse("cache-list-updated", "", "xxx"));
        }

        [HttpDelete]
        [Route("cache-list-item")]
        public IActionResult DeleteCacheValue([FromQuery] string list, [FromQuery] string value)
        {
            var result = cache.RemoveFromList(list, value);
            return Ok(new ServiceResponse("cache-list-updated", "", "delete cache list"));
        }
    }
}
