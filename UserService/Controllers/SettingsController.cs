using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using UserService.Collections;

namespace UserService.Controllers
{
  /// <summary>
  /// Help manage service settings.
  /// It can only be accessible for admin users.
  /// </summary>
  [Route("api/[controller]")]
  [Authorize]
  [ApiController]
  public class SettingsController : ControllerBase
  {
    private readonly ILogger<SettingsController> logger;
    private readonly MongoClient client;
    private readonly IConfiguration configuration;
    private readonly SettingCollection collection;

    public SettingsController(
        ILogger<SettingsController> logger,
        MongoClient client,
        IConfiguration configuration)
    {
      this.logger = logger;
      this.client = client;
      this.configuration = configuration;
      this.collection = new SettingCollection(client, configuration);
    }

    [HttpGet]
    public IActionResult Get()
    {
      var settings = collection.GetSettings();
      if (settings.Any())
      {
        return Ok(settings);
      }

      return NotFound();
    }

    [HttpGet]
    [Route("{key}")]
    public IActionResult GetOne(string key)
    {
      var setting = collection.GetSetting(key);
      if (setting != null)
      {
        return Ok(new SettingEntity()
        {
          Key = setting.Key,
          Value = setting.Value,
          Description = setting.Description
        });
      }
      else
      {
        return NotFound();
      }
    }

    [HttpPost]
    public IActionResult Post(SettingEntity setting)
    {
      // TODO check key is unique
      var id = collection.CreateSetting(setting);
      return Ok(new ServiceResponse()
      {
        Code = "setting-created",
        Message = "setting-created",
        Id = id
      });
    }

    [HttpDelete]
    [Route("{key}")]
    public IActionResult Delete(string key)
    {
      var result = collection.DeleteSetting(key);
      if (result)
      {
        return Ok();
      }
      else
      {
        return NoContent();
      }
    }

    [HttpPut]
    public IActionResult Put([FromBody] SettingEntity body)
    {
      var result = collection.UpdateSetting(body);
      if (result)
      {
        return Ok();
      }
      else
      {
        return BadRequest();
      }
    }
  }
}
