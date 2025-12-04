# $addr = Read-Host 'please input the IP address'
$addr = 'myhost'

# use custom domain name or IP address

Write-Host $addr
setx ASPNETCORE_ENVIRONMENT "Development"
setx DB_CONNECTION ("mongodb://root:123456@{0}:27017" -f $addr)

setx MQ_HOST $addr
setx MQ_PASSWORD "123456"
setx MQ_USERNAME "admin"

setx REDIS_HOST $addr
setx REDIS_PASSWORD "123456"

setx CUSTOM_LOGGING "txt"

setx CANTEEN_SERVICE_SOCKET_PATH "/canteen-ws"
setx CANTEEN_SERVICE_PORT "7715"

setx FACTORY_SERVICE_PORT="7716"