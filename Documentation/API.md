# API Design

## Message Code

- empty-email
- empty-password
- empty-account (email or username)
- empty-user-entity
- internal-server-error

## Gateway Service

- Provide entry for services.
- API key protection (skip in development)
- Use JWT token
- Logging for PUT/POST/DELETE, status code (50x, internal error)

## Sample Service

Error handling middleware (catch exception, save in data/errors)

Controllers:

- /gateway
- /agent
- /authors
- /bookmarks
- /posts
- /files
- /charts (live chart data)
- /products
- /weather forecast

Hubs:

- chat (send back message, start or stop chart data updating, broadcast chart data)

## User Service

Controllers

- /agent
- /users
  - /users (GET/POST)
  - /users/token
  - /users/password-token
  - /users/password
  - /users/verification
- /accounts
  - /accounts/role
  - /accounts/xxx (GET/DELETE)
  - /accounts/xxx/name
  - /accounts/xxx/role
  - /accounts/xxx/profile
- /posts
- /tasks
  - /tasks/xxx (GET/POST)
  - /tasks (PUT)
  - /tasks/xxx (DELETE)
- /settings
  - /settings (GET/POST/PUT)
  - /settings/{key} (GET/DELETE)
- /events
  - /events (GET)
  - /events/{email} (GET)
- /database
  - /database (GET)
  - /database/collections (GET)

Hubs:

- chat (ping, send back message, broadcast message)

## Super Service

Controllers:

- /agent
- /accounts
  - /accounts
  - /accounts/emails
- /logs
- /events
- /queues
  - /queues/messages
  - /queues/mails
- /values
- /caches
- /caches/xxx

Queues:

- demo
- mail

## Canteen Service

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
