using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Entity
{
    public class CacheEntity
    {
        public string Key { get; set; } = "";
        public string Value { get; set; } = "";
        public int ExpireInHour { get; set; } = 1;
    }
}
