# API Design

## Message Code

- empty-email
- empty-password
- empty-account (email or username)
- empty-user-entity
- internal-server-error

## Http Service

- Service
    [Get] /api/service    return service description
- User Service
    [Get] /api/users?email=xxx&username=xxx

    ```json
    {
        "email": "xxx",
        "existing": true
    }
    ```

    [Post] /api/users
    [Put] /api/users/verification
    [Get] /api/users/tokens?email=xxx&password=xxx

    ```json
    {"email":"xxx","value":"xxx","refreshToken":"xxx","issueAt":"xxx","expireInHours":"xxx"}
    ```

    [Post] /api/users/password-tokens?email=xxx
    [Put] /api/users/password

- Account Service
    [Get] /api/accounts/role
    {"email":"xxx","name":"xxx","role":"xxx"}
    [Get] /api/accounts/xxx
    [Put] /api/accounts/xxx update user name or role
    [Delete] /api/accounts/xxx
    [Get] /api/accounts/xxx/profile
    [Post] /api/accounts/xxx/profile
    [Delete] /api/accounts/xxx/profile
    [Post] /api/accounts/verification   send token to email
    [Put] /api/accounts/password update password
    [Get] /api/accounts only internal users
- Author Service
- Bookmark Service
- User Resource Service
  - Task
  - Post
- Setting Service
- Cache Service
- Queue Service
- Database Service
- Event Service
- Product Service

## RPC Service

- User Service
- Account Service
