using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace todo_api
{
    public class Todo
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public int Completed { get; set; }
    }

    public class TodoDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public bool Completed { get; set; }
    }
}
