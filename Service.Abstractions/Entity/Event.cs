using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Entity
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

    public class TokenPayload
    {
        public string Usage { get; set; } = "";
        public string Token { get; set; } = "";
        public DateTime Exp { get; set; }
    }
}
