using System;

namespace Cloud77.Service.Entity
{
    public class UserEntity
    {
        public string Role { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool? Confirmed { get; set; }
        public ProfileEntity Profile { get; set; }
    }
}
