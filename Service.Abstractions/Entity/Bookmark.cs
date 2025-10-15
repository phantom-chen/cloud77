using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Entity
{
  public class BookmarkEntity
  {
    public string Title { get; set; }
    public string Href { get; set; }
    public string Tags { get; set; }
    public string Collection { get; set; }
  }
}
