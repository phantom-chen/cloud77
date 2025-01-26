# UI Design

## Storage

1. Localstorage

+ cloud77_home
+ cloud77_api_key
+ cloud77_amap_value
+ cloud77_user_emails
+ cloud77_access_token_xxx
+ cloud77_refresh_token_xxx

2. Sessionstorage

+ cloud77_debug
+ cloud77_mockup
+ cloud77_user_access_token
+ cloud77_user_refresh_token
+ cloud77_user_email
+ cloud77_user_token_expiration

## Window Message

Post message

{
    request: 'user-login-success',
    message: 'User logins successfully',
    app_url: 'http://localhost:3000'
}

## Message at url

/message?access_token=xxx&refresh_token=xxx

