using Cloud77.Service.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Service
{
    public class UserEmail: IUserResult
    {
        public string Email { get; set; } = "";
        public bool Existing { get; set; } = false;
    }

    public class UserToken: IUserResult
    {
        public string Email { get; set; }
        public string Value { get; set; }
        public string RefreshToken { get; set; }
        public string IssueAt { get; set; }
        public int ExpireInHours { get; set; }
    }

    public class UserRole: IUserResult
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }

    public class UserPassword: IUserResult
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class UserAccount: IUserResult
    {
        public string Role { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Confirmed { get; set; }
        public ProfileEntity Profile { get; set; }
    }

    public class UserProfile : IUserResult
    {
        public string Email { get; set; }
        public ProfileEntity Data { get; set; }
    }

    public class AccountsQueryResult : QueryResults
    {
        public IEnumerable<UserAccount> Data { get; set; }
    }

    public class UserTask
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int State { get; set; }
    }

    public class UserTasks : QueryResults, IUserResult
    {
        public string Email { get; set; }
        public IEnumerable<UserTask> Data { get; set; }
    }

    public class Author : AuthorEntity
    {
        public string Id { get; set; }
    }

    public class AuthorsResult : QueryResults
    {
        public IEnumerable<Author> Data;
    }

    public class EventsQueryResult : QueryResults
    {
        public IEnumerable<EventEntity> Data { get; set; }
    }
    
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

    public class TokenPayload
    {
        public string Usage { get; set; } = "";
        public string Token { get; set; } = "";
        public DateTime Exp { get; set; }
    }
}
