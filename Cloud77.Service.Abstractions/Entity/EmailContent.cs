using System;
using System.Collections.Generic;

namespace Cloud77.Service.Entity
{
    public class EmailContentEntity
    {
        public IEnumerable<string> Addresses { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsBodyHtml { get; set; }
    }
}
