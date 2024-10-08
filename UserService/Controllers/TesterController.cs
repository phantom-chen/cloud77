using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TesterController : ControllerBase
    {
        [HttpGet]
        [Route("")]
        public IActionResult Get()
        {
            var connection = "mongodb://root:123456@192.168.69.51:27017";
            var client = new MongoClient(connection);
            var names = new List<string>() { "hello" };
            try
            {
                var database = client.GetDatabase("Cloud77");
                client.StartSession();
                var pingCommand = new BsonDocument("ping", 1);
                var pingResult = database.RunCommand<BsonDocument>(pingCommand);
                if (pingResult["ok"] == 1)
                {
                    Console.WriteLine("database connection ok");
                    names = database.ListCollectionNames().ToList();
                }
                else
                {
                    Console.WriteLine("fail to connect with database");
                }
            }
            catch
            {

            }

            return Ok(names);
        }
    }
}
