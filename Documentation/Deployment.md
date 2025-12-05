# Deployment

This document describes how to deploy the application.

+ Local (development, localhost)
+ Windows IIS (development, example.dev)
+ Docker (development, example.dev)

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

## Development Windows IIS

example.dev (pfx)

https

+ 7700 landing
+ 7701 super
+ 7702 sample
+ 7703 account
+ 7705 canteen
+ 7706 factory
+ 7708 dashboard

http

+ 7710 gateway
+ 7711 super
+ 7712 sample
+ 7713 user
+ 7715 canteen

## Staging Docker Desktop

example.dev (pem/key)

## Staging Linux

## Server

Directories

+ /cloud77/resources
+ /cloud77/apps
+ /cloud77/apps/certs
+ /cloud77/apps/data
+ /cloud77/apps/uploads
