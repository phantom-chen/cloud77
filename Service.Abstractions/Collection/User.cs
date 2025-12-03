using System;
using System.Collections.Generic;
using System.Text;
using Cloud77.Abstractions.Entity;

namespace Cloud77.Abstractions.Collection
{
    public interface IUserCollection
    {
        IEnumerable<UserEntity> GetUsers(int index, int size, string sort);
        UserEntity GetUser(string email);
        UserEntity GetUserByName(string name);
        string CreateUser(UserEntity user);

        bool ConfirmUser(string email, bool confirmed);
        bool UpdateProfile(string email, ProfileEntity profile);
        bool UpdatePassword(string email, string password);
        bool UpdateRole(string email, string role);
        bool DeleteUser(string email);
    }
}
