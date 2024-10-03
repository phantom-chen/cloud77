using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Service.Bus
{
    public class SimpleMessage
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
