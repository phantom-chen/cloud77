using Cloud77.Abstractions.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class UserEmail : IUserResult
    {
        public string Email { get; set; } = "";
        public bool Existing { get; set; } = false;
    }

    public class UserToken : IUserResult
    {
        public string Email { get; set; }
        public string Value { get; set; }
        public string RefreshToken { get; set; }
        public string IssueAt { get; set; }
        public int ExpireInHours { get; set; }
    }

    public class UserRole : IUserResult
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }

    public class UserPassword : IUserResult
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public class EmptyEmail : ServiceResponse
    {
        public EmptyEmail()
        {
            Code = "empty-email";
            Message = "your email is empty, please put that in the request";
        }
    }

    public class EmptyAccount : ServiceResponse
    {
        public EmptyAccount()
        {
            Code = "empty-account";
            Message = "your email or username is empty, please that in the request";
        }
    }

    public class EmptyPassword : ServiceResponse
    {
        public EmptyPassword()
        {
            Code = "empty-password";
            Message = "your password is empty, please put that in the request";
        }
    }

    public class InCorrectPassword : ServiceResponse
    {
        public InCorrectPassword(string email)
        {
            Code = "invalid-password";
            Message = $"incorrect password for {email}";
        }
    }

    public class UserNotExisting : ServiceResponse
    {
        public UserNotExisting(string email)
        {
            Code = "empty-user-object";
            Message = $"find no existing account for {email}";
        }
    }

    public class UserExisting : ServiceResponse
    {
        public UserExisting(string email, string name)
        {
            Code = "existing-user-object";
            if (!string.IsNullOrEmpty(email))
            {
                Message = $"find existing account for email {email}";
            }
            if (!string.IsNullOrEmpty(name))
            {
                Message = $"find existing account for name {name}";
            }
        }
    }

    public class UserCreated : ServiceResponse
    {
        public UserCreated(string id, string email)
        {
            Id = id;
            Code = "user-object-created";
            Message = $"Your account {email} is created successfully";
        }
    }

    public class OneTimeTokenCreated : ServiceResponse
    {
        public OneTimeTokenCreated(string email, string usage)
        {
            Code = "one-time-token-created";
            Message = $"Your one time token ({usage}) is created successfully for {email}, token is sent to you via email";
        }
    }

    public class EmptyOneTimeToken : ServiceResponse
    {
        public EmptyOneTimeToken()
        {
            Code = "empty-one-time-token";
            Message = "your one time token is empty, please put that in the request";
        }
    }

    public class OneTimeTokenNotFound : ServiceResponse
    {
        public OneTimeTokenNotFound(string usage)
        {
            Code = "one-time-token-not-found";
            Message = $"The one time token you are using is not found for {usage}";
        }
    }

    public class OneTimeTokenExpired : ServiceResponse
    {
        public OneTimeTokenExpired(string usage)
        {
            Code = "one-time-token-expired";
            Message = $"The one time token you are using is expired for {usage}";
        }
    }

    public class OneTimeTokenUsed : ServiceResponse
    {
        public OneTimeTokenUsed(string usage)
        {
            Code = "one-time-token-used";
            Message = $"The one time token you are using is already used for {usage}";
        }
    }

    public class UserPasswordReset : ServiceResponse
    {
        public UserPasswordReset(string email)
        {
            Code = "user-password-reset";
            Message = $"Your password is reset successfully for {email}";
        }
    }

    public class UserConfirmed : ServiceResponse
    {
        public UserConfirmed(string email)
        {
            Code = "user-confirmed";
            Message = $"Your account is confirmed successfully for {email}";
        }
    }

    public class UserNameUpdated : ServiceResponse
    {
        public UserNameUpdated(string email, string name)
        {
            Code = "user-name-updated";
            Message = $"Your account name is updated successfully (new name {name}) for {email}";
        }
    }

    public class UserRoleUpdated : ServiceResponse
    {
        public UserRoleUpdated(string email, string role)
        {
            Code = "user-role-updated";
            Message = $"Your account role is updated successfully (new role {role}) for {email}";
        }
    }

    public class UserProfileUpdated : ServiceResponse
    {
        public UserProfileUpdated(string email)
        {
            Code = "user-profile-updated";
            Message = $"Your account profile is updated successfully for {email}";
        }
    }

    public class UserPasswordUpdated : ServiceResponse
    {
        public UserPasswordUpdated(string email)
        {
            Code = "user-password-updated";
            Message = $"Your account password is updated successfully for {email}";
        }
    }

    public class UserDeleted : ServiceResponse
    {
        public UserDeleted(string email)
        {
            Code = "user-deleted";
            Message = $"Your account is deleted successfully for {email}";
        }
    }

    public class UserAccount : IUserResult
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

    public class EmptyUserTask : ServiceResponse
    {
        public EmptyUserTask(string email)
        {
            Code = "empty-user-task";
            Message = $"find no tasks for account {email}";
        }
    }

    public class UserTaskCreated : ServiceResponse
    {
        public UserTaskCreated(string id)
        {
            Id = id;
            Code = "user-task-created";
            Message = $"Your task is created successfully with id {id}";
        }
    }

    public class UserTaskUpdated : ServiceResponse
    {
        public UserTaskUpdated(string id)
        {
            Id = id;
            Code = "user-task-updated";
            Message = $"Your task is updated successfully with id {id}";
        }
    }

    public class UserTaskDeleted : ServiceResponse
    {
        public UserTaskDeleted(string id)
        {
            Id = id;
            Code = "user-task-deleted";
            Message = $"Your task is deleted successfully with id {id}";
        }
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

    public class EmptyUserPost : ServiceResponse
    {
        public EmptyUserPost(string email)
        {
            Code = "empty-user-post";
            Message = $"find no posts for account {email}";

        }
    }

    public class UserPost
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }

    public class UserPosts : QueryResults, IUserResult
    {
        public string Email { get; set; }
        public IEnumerable<UserPost> Data { get; set; }
    }

    public class UserFiles : QueryResults, IUserResult
    {
        public string Email { get; set; }
        public string[] Data { get; set; }
    }

    public class AccountQuery : BaseQuery
    {
        public string Role { get; set; } = "";
        public string Email { get; set; } = "";
    }

    public class EmptyAccountQuery : ServiceResponse
    {
        public EmptyAccountQuery()
        {
            Code = "empty-account-query";
            Message = "role / email should not be empty";
        }
    }

    public class AccountsQueryResult : QueryResults
    {
        public IEnumerable<UserAccount> Data { get; set; }
    }
}
