function Invoke-Script {
    param (
        $shell,
        $command
    )    
    Remove-Item "$env:TEMP\*.ps1" -ErrorAction Ignore
    Remove-Item "$env:TEMP\*.cmd" -ErrorAction Ignore
    
    $guid = [System.Guid]::NewGuid().ToString("d")
    
    if ($shell -eq 'ps') {
        $command | Out-File "$env:TEMP\$guid.ps1"
        powershell.exe -file "$env:TEMP\$guid.ps1" -Wait
    }
    
    if ($shell -eq 'cmd') {
        $command | Out-File "$env:TEMP\$guid.cmd" -Encoding ascii
        Start-Process -FilePath "$env:TEMP\$guid.cmd" # -WindowStyle Maximized
    }
}
function New-Folder {
    param (
        [string] $path
    )
    if (!(Test-Path $path)) {
        mkdir $path
    }
}

$root = "$env:USERPROFILE\Documents\MyServer\WindowsBuild"
New-Folder $root

Write-Host 'Building Windows binaries ...'
# gateway service
Remove-Item "$root\GatewayService" -Recurse -ErrorAction Ignore
Invoke-Script -shell ps -command "cd $pwd\GatewayService`ndotnet build -c Release"
Copy-Item -Path "$PWD\GatewayService\bin\Release\net8.0" -Destination "$root\GatewayService" -Recurse
Remove-Item "$root\GatewayService\ocelot.json" -ErrorAction Ignore
Remove-Item "$root\GatewayService\appsettings.Development.json" -ErrorAction Ignore
Copy-Item -Path "$PWD\Documentation\Windows\ocelot.json" -Destination "$root\GatewayService\ocelot.json" -Force
Copy-Item -Path "$PWD\Documentation\Windows\appsettings.Gateway.json" -Destination "$root\GatewayService\appsettings.Development.json" -Force

# sample service
Remove-Item "$root\SampleService" -Recurse -ErrorAction Ignore
Invoke-Script -shell ps -command "cd $pwd\SampleService`ndotnet build -c Release"
Copy-Item -Path "$PWD\SampleService\bin\Release\net8.0" -Destination "$root\SampleService" -Recurse
Remove-Item "$root\SampleService\appsettings.Development.json" -ErrorAction Ignore
Copy-Item -Path "$PWD\Documentation\Windows\appsettings.Sample.json" -Destination "$root\SampleService\appsettings.Development.json" -Force

# user service
Remove-Item "$root\UserService" -Recurse -ErrorAction Ignore
Invoke-Script -shell ps -command "cd $pwd\UserService`ndotnet build -c Release"
Copy-Item -Path "$PWD\UserService\bin\Release\net8.0" -Destination "$root\UserService" -Recurse
Remove-Item "$root\UserService\appsettings.Development.json" -ErrorAction Ignore
Copy-Item -Path "$PWD\Documentation\Windows\appsettings.User.json" -Destination "$root\UserService\appsettings.Development.json" -Force

# super service
Remove-Item "$root\SuperService" -Recurse -ErrorAction Ignore
Invoke-Script -shell ps -command "cd $pwd\SuperService`ndotnet build -c Release"
Copy-Item -Path "$PWD\SuperService\bin\Release\net8.0" -Destination "$root\SuperService" -Recurse
Remove-Item "$root\SuperService\appsettings.Development.json" -ErrorAction Ignore
Copy-Item -Path "$PWD\Documentation\Windows\appsettings.Super.json" -Destination "$root\SuperService\appsettings.Development.json" -Force

# canteen service
Remove-Item "$root\CanteenService" -Recurse -ErrorAction Ignore
Invoke-Script -shell ps -command "cd $pwd\canteen-service`nyarn build"
Copy-Item -Path "$PWD\canteen-service\dist" -Destination "$root\CanteenService" -Recurse
Copy-Item -Path "$PWD\canteen-service\package.json" -Destination "$root\CanteenService\package.json"

Copy-Item -Path "$PWD\Documentation\Windows\certificate.ps1" -Destination "$root\certificate.ps1" -Force
Copy-Item -Path "$PWD\Documentation\Windows\variables.ps1" -Destination "$root\variables.ps1" -Force
Copy-Item -Path "$PWD\Documentation\Windows\helper.ps1" -Destination "$root\helper.ps1" -Force

Copy-Item -Path "$PWD\Documentation\Windows\canteen.service.json" -Destination "$root\canteen.service.json" -Force
Copy-Item -Path "$PWD\Documentation\Windows\gateway.service.json" -Destination "$root\gateway.service.json" -Force
Copy-Item -Path "$PWD\Documentation\Windows\sample.service.json" -Destination "$root\sample.service.json" -Force
Copy-Item -Path "$PWD\Documentation\Windows\super.service.json" -Destination "$root\super.service.json" -Force
Copy-Item -Path "$PWD\Documentation\Windows\user.service.json" -Destination "$root\user.service.json" -Force