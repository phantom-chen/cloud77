using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserService.Contexts;
using System;
using UserService.Models;
using Microsoft.AspNetCore.Authorization;
using Cloud77.Service.Entity;
using System.Linq;
using System.Security.Claims;
using Cloud77.Service;
using MongoDB.Driver;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorStoreContext context;

        public AuthorsController(MongoClient client, IConfiguration configuration)
        {
            var dbName = configuration["Db_name"];
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("TEST_DATABASE")))
            {
                dbName = Environment.GetEnvironmentVariable("TEST_DATABASE");
            }
            var database = client.GetDatabase(dbName);
            this.context = new AuthorStoreMongoContext(database);
        }

        class AuthorsResult : QueryResults
        {
            public IList<AuthorMongoEntity> Data;
        }

        [HttpGet]
        [Route("")]
        public IActionResult Get()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);
            var authors = context.GetAuthors(0, 10);
            if (authors == null)
            {
                return NotFound(new ServiceResponse("empty-author", "", "empty author"));
            }
            return Ok(new AuthorsResult()
            {
                Index = 0,
                Size = 10,
                Total = 999,
                Query = "",
                Data = authors
            });
        }

        [HttpPost]
        [Route("")]
        public IActionResult Post([FromBody] AuthorEntity body)
        {
            var id = context.NewAuthor(new AuthorEntity()
            {
                Name = body.Name,
                Title = body.Title,
                Region = body.Region,
                Address = body.Address
            });
            return Created("/authors/" + id, new ServiceResponse("author-created"));
        }

        [HttpPut]
        [Route("{id}")]
        public IActionResult Put(string id, [FromBody] AuthorEntity body)
        {
            context.UpdateAuthor(id, new AuthorEntity()
            {
                Name = body.Name,
                Title = body.Title,
                Region = body.Region,
                Address = body.Address
            });
            return Accepted("/authors/" + id, new ServiceResponse("author-created", id, ""));
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(string id)
        {
            var result = context.DeleteAuthor(id);
            if (result)
            {
                return Ok(new ServiceResponse("author-deleted", id, ""));
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ServiceResponse("update-database-error", id, "fail to update author"));
            }
        }

        [HttpDelete]
        [Route("all")]
        public IActionResult Delete()
        {
            context.DeleteAll();
            return Ok(new ServiceResponse("author-clear"));
        }
    }
}
