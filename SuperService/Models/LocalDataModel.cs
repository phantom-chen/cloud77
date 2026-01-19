using Cloud77.Abstractions.Entity;
using Newtonsoft.Json;
using System.Reflection;
using System.Runtime.InteropServices;

namespace SuperService.Models
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
