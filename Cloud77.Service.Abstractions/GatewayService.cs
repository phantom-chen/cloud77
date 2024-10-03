using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Service
{
    public class ServiceApp
    {
        public string Name { get; set; }
        public string Version { get; set; }
        public string[] Tags { get; set; }
        public string Hostname { get; set; }
        public string IP { get; set; }
    }

    public interface IUserResult
    {
        string Email { get; set; }
    }

    public class QueryResults
    {
        public int Total { get; set; }
        public string Query { get; set; }
        public int Index { get; set; }
        public int Size { get; set; }
    }

    public class CacheItem
    {
        public string Key { get; set; } = "";
        public string Value { get; set; } = "";
        public int ExpireInHour { get; set; } = 1;
    }

    public class EmailVerification
    {
        public string Email { get; set; }
        public string Token { get; set; }
    }

    public class ServiceResponse
    {
        public ServiceResponse() { }
        public ServiceResponse(string code)
        {
            switch (code)
            {
                case "empty-account":
                    Message = "empty email and username";
                    break;
                case "empty-password":
                    Message = "empty password or refresh token";
                    break;
                case "empty-refresh-token":
                    Message = "empty refresh token";
                    break;
                case "logout-code-removed":
                    Message = "logout code is removed";
                    break;
                case "empty-user-profile":
                    Message = "empty user profile";
                    break;
                case "empty-user-license":
                    Message = "empty user license";
                    break;
                case "empty-user-device":
                    Message = "empty user device";
                    break;
                case "empty-algorithm":
                    Message = "empty algorithm";
                    break;
                case "invalid-algorithm":
                    Message = "invalid algorithm";
                    break;
                default:
                    break;
            }
        }

        public ServiceResponse(string code, string email)
        {
            switch (code)
            {
                case "empty-user-entity":
                    Message = $"find no existing account for {email}";
                    break;
                case "existing-user-entity":
                    Message = $"find existing account for {email}";
                    break;
                case "invalid-password":
                    Message = $"incorrect password / refresh token for {email}";
                    break;
                default:
                    break;
            }
        }

        public ServiceResponse(string code, string id, string message)
        {
            Code = code;
            Message = message;
            Id = id;
        }

        public string Code { get; set; } = "";
        public string Message { get; set; } = "";
        public string Id { get; set; } = "";
    }
}
