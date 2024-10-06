using System;
using System.Collections.Generic;
using System.Text;

namespace Cooler.Client
{
    public class Bookmark
    {
        public long Id { get; set; }
        public string Guid { get; set; }
        public string Title { get; set; }
        public string Href { get; set; }
        public string Tags { get; set; }
        public string Collection { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public interface IBookmarkProvider
    {
    }
}
