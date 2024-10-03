using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cloud77.Service.Entity
{
    public class TaskEntity
    {
        public string Email { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int State { get; set; }
    }
}
