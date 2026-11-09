function Get-ServiceInfo {
    param (
        [string]$name,
        [int]$port
    )
    Write-Output "Checking service $name is listening on $port"
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction Ignore
    if ($null -eq $connections) {
        Write-Host "  No connections found" -ForegroundColor Yellow
    }
    else {
        $connections | ForEach-Object {
            Write-Output "  $($_.LocalAddress):$($_.LocalPort)"
        }
    }
}

$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:CUSTOM_LOGGING = "txt"
$env:DB_CONNECTION = "mongodb://root:123456@localhost:27017"
$env:REDIS_HOST = "localhost"
$env:REDIS_PASSWORD = "123456"
$env:MQ_HOST = "localhost"
$env:MQ_USERNAME = "admin"
$env:MQ_PASSWORD = "123456"

Start-Process -FilePath .\ResourceService\ResourceService.exe -WorkingDirectory .\ResourceService -ArgumentList '--urls=http://localhost:5096'
Start-Sleep -Seconds 2
Start-Process -FilePath .\SuperService\SuperService.exe -WorkingDirectory .\SuperService -ArgumentList '--urls=http://localhost:7711;https://localhost:7701'
Start-Sleep -Seconds 2
Start-Process -FilePath .\UserService\UserService.exe -WorkingDirectory .\UserService -ArgumentList '--urls=http://localhost:7713'
Start-Sleep -Seconds 2
Start-Process -FilePath .\SampleService\SampleService.exe -WorkingDirectory .\SampleService -ArgumentList '--urls=http://localhost:7712'
Start-Sleep -Seconds 2
Start-Process -FilePath .\GatewayService\GatewayService.exe -WorkingDirectory .\GatewayService -ArgumentList '--urls=http://localhost:7710'

Get-ServiceInfo -port 5096 -name 'Resource'
Get-ServiceInfo -port 7710 -name 'Gateway'
Get-ServiceInfo -port 7711 -name 'Super'
Get-ServiceInfo -port 7712 -name 'Sample'
Get-ServiceInfo -port 7713 -name 'User'