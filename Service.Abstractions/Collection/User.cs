using System;
using System.Collections.Generic;
using System.Text;
using Cloud77.Abstractions.Entity;

namespace Cloud77.Abstractions.Collection
{
    public interface IUserDatabase
    {
        IEnumerable<UserEntity> GetUsers(int index, int size, string sort);
        UserEntity GetUser(string email);
        UserEntity GetUserByName(string name);
        string CreateUser(UserEntity user);
        bool UpdateUser(UserEntity user);
        bool DeleteUser(string email);
        IEnumerable<EventEntity> GetEvents(string email);
        string NewEvent(EventEntity entity);
    }
}
