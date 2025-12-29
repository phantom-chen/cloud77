param(    
    [Parameter(Mandatory = $false)][string]$action
)

if ($action -eq 'delete') {
    Write-Host 'Deleting all environment variables...'

    Remove-Item -Path Env:ASPNETCORE_ENVIRONMENT -ErrorAction Ignore
    Remove-Item -Path Env:DB_CONNECTION -ErrorAction Ignore

    Remove-Item -Path Env:MQ_HOST -ErrorAction Ignore
    Remove-Item -Path Env:MQ_PASSWORD -ErrorAction Ignore
    Remove-Item -Path Env:MQ_USERNAME -ErrorAction Ignore

    Remove-Item -Path Env:REDIS_HOST -ErrorAction Ignore
    Remove-Item -Path Env:REDIS_PASSWORD -ErrorAction Ignore

    Remove-Item -Path Env:CUSTOM_LOGGING -ErrorAction Ignore

    Remove-Item -Path Env:CANTEEN_SERVICE_SOCKET_PATH -ErrorAction Ignore
    Remove-Item -Path Env:CANTEEN_SERVICE_PORT -ErrorAction Ignore

    Remove-Item -Path Env:FACTORY_SERVICE_PORT -ErrorAction Ignore

    Write-Host 'All environment variables deleted.'
    exit 0
}
elseif ($action -eq 'add') {
    Write-Host 'Adding environment variables...'
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
    Write-Host 'All environment variables added.'
    exit 0
} else {
    # Write-Host 'No action specified. Use "add" or "delete" as parameter.'

    Write-Host "`nCurrent environment variables:"
    Get-ChildItem Env: | Where-Object { $_.Name -in @(
        'ASPNETCORE_ENVIRONMENT',
        'DB_CONNECTION',
        'MQ_HOST',
        'MQ_PASSWORD',
        'MQ_USERNAME',
        'REDIS_HOST',
        'REDIS_PASSWORD',
        'CUSTOM_LOGGING',
        'CANTEEN_SERVICE_SOCKET_PATH',
        'CANTEEN_SERVICE_PORT',
        'FACTORY_SERVICE_PORT'
    )} | Format-Table Name, Value -AutoSize

    Write-Host "`nResolving IP address for 'myhost':"
    try {
        $ipAddress = [System.Net.Dns]::GetHostAddresses('myhost') | Select-Object -First 1
        Write-Host "myhost resolves to: $($ipAddress.IPAddressToString)"

        $ping = Test-Connection -ComputerName $ipAddress.IPAddressToString -Count 5 -Quiet
        if ($ping) {
            Write-Host "Successfully pinged $($ipAddress.IPAddressToString)"
        } else {
            Write-Host "Failed to ping $($ipAddress.IPAddressToString)"
        }

    } catch {
        Write-Host "Unable to resolve 'myhost': $_"
    }

    exit 0
}