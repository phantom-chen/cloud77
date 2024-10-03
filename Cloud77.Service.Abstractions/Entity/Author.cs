using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cloud77.Service.Entity
{
    public class AuthorEntity
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string Region { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
