using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Message
{
  public class Greeting
  {
    public string Sender { get; set; }
    public string Content { get; set; }
    public DateTime Timestamp { get; set; }
  }
}
