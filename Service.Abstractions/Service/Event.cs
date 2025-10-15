using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class EventsQueryResult : QueryResults
    {
        public IEnumerable<EventEntity> Data { get; set; }
    }
}
