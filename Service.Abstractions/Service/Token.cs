using System;
using System.Collections.Generic;
using System.Text;

namespace Cloud77.Abstractions.Service
{
    public class TokenNotProvided : ServiceResponse
    {
        public TokenNotProvided()
        {
            Code = "token_not_provided";
            Message = "No token is provided.";
        }
    }

    public class TokenInvalid : ServiceResponse
    {
        public TokenInvalid()
        {
            Code = "token_invalid";
            Message = "The token is invalid.";
        }
    }

    public class NotJWTToken : ServiceResponse
    {
        public NotJWTToken()
        {
            Code = "not_jwt_token";
            Message = "The token is not a valid JWT token.";
        }
    }

    public class TokenExpired : ServiceResponse
    {
        public TokenExpired()
        {
            Code = "token_expired";
            Message = "The token has expired.";
        }
    }

    public class TokenIsValid : ServiceResponse
    {
        public TokenIsValid(DateTime validTo)
        {
            Code = "token_is_valid";
            Message = $"The token is valid until {validTo.ToString("yyyy-MM-dd HH:mm:ss zzz")}";
        }
    }

    public class RefreshTokenUsed : ServiceResponse
    {
        public RefreshTokenUsed()
        {
            Code = "refresh_token_used";
            Message = "The refresh token has been used.";
        }
    }

    public class RefreshTokenExpired : ServiceResponse
    {
        public RefreshTokenExpired()
        {
            Code = "refresh_token_expired";
            Message = "The refresh token has expired.";
        }
    }

    public class RefreshTokenSaltMismatch : ServiceResponse
    {
        public RefreshTokenSaltMismatch()
        {
            Code = "refresh_token_salt_mismatch";
            Message = "The refresh token salt does not match.";
        }
    }

    public class RefreshTokenEmailMismatch : ServiceResponse
    {
        public RefreshTokenEmailMismatch()
        {
            Code = "refresh_token_email_mismatch";
            Message = "The refresh token email does not match.";
        }
    }
}
