# Deployment

This document describes how to deploy the application.

+ test for local deployment
+ test for production deployment

{app}/data

+ emails
+ errors
+ logs
+ posts (sample)
+ uploads (sample)
+ reset-password.html (user)
+ confirm-email.html (user)
+ canteen (canteen)
+ canteen/rooms.json (canteen)
+ users.json (super)
+ localhost.txt (all)
+ users/{user_email}/{token_expiration}.json (user)
+ users/{user_email}/posts (user)
+ users/{user_email}/files (user)

resources

+ site.json
+ installers
+ releases
+ posts (md)
+ images
+ samples (json placeholder, html files)

## Development

Listening ports:

+ 4000 (landing app)
+ 4200 (canteen app)
+ 4200 (factory app)
+ 4359 (gateway service)
+ 5389 (user service)
+ 7845 (super service)
+ 7846 (super service, https)
+ 5648 (canteen service)
+ 27017 (mongodb)
+ 6379 (redis)
+ 5672 (rabbit mq)

Execution

```shell
dotnet run --launch-profile "http"
```

## Server

Directories

+ /cloud77/resources
+ /cloud77/apps
+ /cloud77/apps/certs
+ /cloud77/apps/data
+ /cloud77/apps/uploads
