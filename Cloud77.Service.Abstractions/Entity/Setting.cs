using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cloud77.Service.Entity
{
    public class MessageEntity
    {
        public string Email { get; set; }
        public string Message { get; set; }
    }

    public class SettingEntity
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Description { get; set; }
    }
}
