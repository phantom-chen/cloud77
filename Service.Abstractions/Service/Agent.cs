using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class ServiceGateway
    {
        public string Environment { get; set; }
        public string Key { get; set; }
        public string Home { get; set; }
        public string SingleSignOn { get; set; }
    }

    public class ServiceAgent
    {
        public string Service { get; set; }
        public string Version { get; set; }
        public string[] Tags { get; set; }
        public string Machine { get; set; }
        public string Hostname { get; set; }
        public string IP { get; set; }
        public string Environment { get; set; }
        public string Logging { get; set; }
    }
}
