using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cloud77.Service
{
    public enum ResponseFrom
    {
        Middleware = 0,
        Controller = 1,
    }
    public enum DataSource
    {
        MemoryCache = 0,
        RedisCache = 1,
        MySql = 2,
        Mongodb = 3,
    }
    public enum PasswordErrorType
    {
        InitialValue = -1,
        None = 0,
        EmptyEmail = 11,
        EmptyToken = 12,
        EmptyPassword = 13,
        EmptyNewPassword = 14,
        InvalidToken = 15,
        UsedToken = 16,
        ExpiredToken = 17,
        InvalidPassword = 18,
        EmptyAccountEntity = 21,
        EmptyPasswordEntity = 22,
        InvalidPasswordEntity = 23,
        SaveChangesFailure = 31
    }
    public enum EmailTokenErrorType
    {
        InitialValue = -1,
        None = 0,
        EmptyEmail = 1,
        AccountExisting = 2,
        TokenIsSentButNotUsed = 3,
        TokenIsUsed = 4,
        SaveChangesFailure = 5,
        AccountNotExisting = 6
    }
}
