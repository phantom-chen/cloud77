using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Service.Entity
{
    public class EventEntity
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Payload { get; set; }
    }
}
