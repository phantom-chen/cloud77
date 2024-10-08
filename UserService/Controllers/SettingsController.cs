using Cloud77.Service;
using Cloud77.Service.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using UserService.Models;
using System.Linq;
using System;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IMongoCollection<SettingMongoEntity> collection;
        public SettingsController(IConfiguration configuration, MongoClient client)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            collection = client.GetDatabase(dbName).GetCollection<SettingMongoEntity>(Cloud77Utility.Settings);
        }

        [HttpGet]
        [Route("")]
        public IActionResult Get()
        {
            var filter = Builders<SettingMongoEntity>.Filter.Empty;
            var settings = collection.Find(filter).ToList();
            if (settings != null)
            {
                return Ok(settings.Select(setting => new SettingEntity()
                {
                    Key = setting.Key,
                    Value = setting.Value,
                    Description = setting.Description
                }));
            }
            else
            {
                return NotFound();
            }

        }

        [HttpGet]
        [Route("{key}")]
        public IActionResult Get(string key)
        {
            var filter = Builders<SettingMongoEntity>.Filter.Eq("Key", key);
            var setting = collection.Find(filter).FirstOrDefault();
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
        public IActionResult Post([FromBody] SettingEntity body)
        {
            // check if key has space
            // check if key exists
            var doc = new SettingMongoEntity()
            {
                Key = body.Key,
                Value = body.Value,
                Description = body.Description
            };
            collection.InsertOne(doc);
            return Ok(doc.Id.ToString());
        }

        [HttpPut]
        public IActionResult Put([FromBody] SettingEntity body)
        {
            var filter = Builders<SettingMongoEntity>.Filter.Eq("Key", body.Key);
            var update = Builders<SettingMongoEntity>.Update
                .Set("Value", body.Value)
                .Set("Description", body.Description);
            if (collection.UpdateOne(filter, update).IsAcknowledged)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("{key}")]
        public IActionResult Delete(string key)
        {
            var filter = Builders<SettingMongoEntity>.Filter.Eq("Key", key);
            if (collection.DeleteOne(filter).IsAcknowledged)
            {
                return Ok();
            }
            else
            {
                return NoContent();
            }
        }
    }
}
