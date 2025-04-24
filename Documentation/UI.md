# UI Design

## Apps

- Landing App: home page / home site
- Sample App: no token required

  - `/`
  - `/posts`
  - `/files`
  - `/diagram`
  - `/orders`
  - `/chart`
  - `/authors`
  - `/bookmarks`

- Account App: view user self stuffs

  - `/`: login and get token, one browser can only have one user login
  - `/logout`: remove tokens, inform other apps
  - `/dashboard`: user information detail
  - `/history`: user action events
  - `/sign-up`: register a user
  - `/reset-password`: forget password and reset it
  - `/confirm-email`: verify user's email is able to receive
  - `/tasks`: create user tasks

- Dashboard App: manage user stuffs

  - `/accounts`

- Internal App: view the whole systems
  
  - `/users`

## Storage

1. Local storage

- cloud77_home
- cloud77_api_key
- cloud77_amap_value
- cloud77_user_emails
- cloud77_access_token_xxx
- cloud77_refresh_token_xxx

2. Session storage

- debug_mode
- cloud77_user_access_token
- cloud77_user_refresh_token
- cloud77_user_email
- cloud77_user_token_expiration

## Window Message

Post message

```json
{
    request: 'user-login-success',
    message: 'User logins successfully',
    app_url: 'http://localhost:3000'
}
```

## Message at url

/message?access_token=xxx&refresh_token=xxx
