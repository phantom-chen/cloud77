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
            var settings = collection.Get();
            if (settings.Any())
            {
                return Ok(settings);
            }

            return NotFound();
        }

        [HttpPost]
        public IActionResult Post(SettingEntity setting)
        {
            // TODO check key is unique
            var id = collection.Create(setting);
            return Ok(new ServiceResponse()
            {
                Code = "setting-created",
                Message = "setting-created",
                Id = id
            });
        }
    }
}
