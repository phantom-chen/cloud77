using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using todo_api;

namespace todo_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {

        private APIDbContext _context;
        public TodosController(APIDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var todos = _context.Todos;

            if (todos != null) return Ok(todos);

            return BadRequest();
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            var todos = _context.Todos.Where(a => a.UserId == id);

            if (todos != null) return Ok(todos);

            return BadRequest();
        }

        [HttpPost]
        public IActionResult Post([FromBody] Todo todo)
        {
            try
            {
                _context.Add(new Todo() { UserId = todo.UserId, Title = todo.Title, Completed = todo.Completed });

                _context.SaveChanges();

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult Put(int id, [FromBody] Todo todo)
        {
            try
            {
                var t = _context.Todos.FirstOrDefault(a => a.Id == id);
                if (t != null)
                {
                    t.UserId = todo.UserId;
                    t.Title = todo.Title;
                    t.Completed = todo.Completed;

                    _context.SaveChanges();

                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult Delete(int id)
        {
            try
            {
                var t = _context.Todos.FirstOrDefault(a => a.Id == id);
                if (t != null)
                {
                    _context.Remove(t);
                    _context.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        private IEnumerable<TodoDto> readfromjson()
        {
            IEnumerable<TodoDto> todos;
            try
            {
                using (Stream stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("todo_api.todos.json"))
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        string j = reader.ReadToEnd();
                        todos = JsonConvert.DeserializeObject<IEnumerable<TodoDto>>(j);
                    }

                    //var a = todos.Select(t => new Todo() { Id = t.Id, UserId = t.UserId, Title = t.Title, Completed = t.Completed ? 1 : 0 });
                    //_context.AddRange(a);
                    //_context.SaveChanges();

                    return todos;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
