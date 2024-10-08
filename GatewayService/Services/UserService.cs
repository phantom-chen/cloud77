//using Cloud77.Abstractions;
//using Cloud77.Abstractions.Entity;
//using System;
//using System.IO;
//using System.Linq;
//using System.Reflection;
//using System.Xml.Linq;
//using GatewayService;
//using MongoDB.Bson.IO;
//using Newtonsoft.Json;

//namespace GatewayService.Services
//{
//    public class UserService
//    {
//        private string message;

//        private EmailTokenErrorType _error = EmailTokenErrorType.InitialValue;

//        private PasswordErrorType _passwordError = PasswordErrorType.InitialValue;

//        public bool PutAccount(string email, string name)
//        {
//            if (string.IsNullOrEmpty(email))
//            {
//                message = "empty email";
//                return false;
//            }

//            email = email.ToLower().Trim();

//            if (string.IsNullOrEmpty(name))
//            {
//                message = "empty name";
//                return false;
//            }

//            name = name.ToLower().Trim();

//            UserEntity user = new UserEntity();
//            if (user == null)
//            {
//                message = $"find no existing account for {email}";
//                return false;
//            }
//            else
//            {
//                if (name == user.Name)
//                {
//                    message = $"name is not changed for {email}";
//                    return true;
//                }
//                else
//                {
//                    UserEntity _user = new UserEntity();
//                    if (_user != null && _user.Email != user.Email)
//                    {
//                        message = $"{name} is used";
//                        return false;
//                    }
//                    else
//                    {
//                        message = $"succeed to update name {name} for {email}";
//                        return true;
//                    }
//                }
//            }
//        }

//        public void IssueEmailToken(string email, string usage)
//        {
//            email = email.ToLower().Trim();
//            UserEntity user = new UserEntity();
//            if (user == null)
//            {
//                message = $"find account for {email}";
//                _error = EmailTokenErrorType.AccountExisting;
//            }

//            message = $"Token is expired, already create new email token for {email}";
//            _error = EmailTokenErrorType.None;
//            message = $"Token is used for {email}";
//            _error = EmailTokenErrorType.TokenIsUsed;
//            message = $"fail to create new email token for {email}";
//            _error = EmailTokenErrorType.SaveChangesFailure;

//            message = $"Token is sent but not used, not expired for {email}";
//            _error = EmailTokenErrorType.TokenIsSentButNotUsed;
//            message = $"already create email token for {email}";
//            _error = EmailTokenErrorType.None;

//            message = $"fail to create email token for {email}";
//            _error = EmailTokenErrorType.SaveChangesFailure;
//        }
//    }
//}
