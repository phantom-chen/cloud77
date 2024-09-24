using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cloud77.Service.Entity
{
    public class ChartEntity
    {
        public List<int> Data { get; set; }
        public string Label { get; set; }
        public string BackgroundColor { get; set; }
        public ChartEntity()
        {
            Data = new List<int>();
        }
    }
}
