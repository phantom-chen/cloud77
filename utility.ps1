param(
    [Parameter(Mandatory = $false)][string]$usage
)

function Invoke-Script {
    param (
        $shell,
        $command
    )
    if (!(Test-Path "$env:TEMP\cloud77")) {
        mkdir "$env:TEMP\cloud77"
    }
    
    Remove-Item "$env:TEMP\cloud77\*.ps1" -ErrorAction Ignore
    Remove-Item "$env:TEMP\cloud77\*.cmd" -ErrorAction Ignore
    
    $guid = [System.Guid]::NewGuid().ToString("d")
    
    if ($shell -eq 'ps') {
        $command | Out-File "$env:TEMP\cloud77\$guid.ps1"
        powershell.exe -file "$env:TEMP\cloud77\$guid.ps1" -Wait
    }
    
    if ($shell -eq 'cmd') {
        $command | Out-File "$env:TEMP\cloud77\$guid.cmd" -Encoding ascii
        Start-Process -FilePath "$env:TEMP\cloud77\$guid.cmd" # -WindowStyle Maximized
    }
}

function New-Folder {
    param (
        [string] $path
    )
    if (!(Test-Path $path))
    {
        mkdir $path
    }
}

function Get-ServiceIno {
    param (
        [string]$name,
        [int]$port
    )
    Write-Output "Checking service $name is listening on $port"
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction Ignore
    if ($null -eq $connections) {
        Write-Host "  No connections found" -ForegroundColor Yellow
    } else {
        $connections | ForEach-Object {
            Write-Output "  $($_.LocalAddress):$($_.LocalPort)"
        }
    }
}

function Stop-Service {
    param (
        [string]$name,
        [int]$port
    )

    if ($name -ne '') {
        $serviceCheck = Get-Process -Name $name -ErrorAction Ignore
        if ($null -eq $serviceCheck)
        {
            Write-Host ('Logger: find no {0}.exe' -f $name)
        }
        else
        {
            taskkill.exe -f -im ('{0}.exe' -f $name)
            Write-Host ('Logger: kill {0}.exe' -f $name)
        }
    }
    
    if ($port -ge 3000) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction Ignore
        if ($null -eq $connections) {
            Write-Host "  No connections found" -ForegroundColor Yellow
        }
        else {
            $processId = 0
            $count = [int]$connections.count
            if ($count -gt 0) {
                # array
                foreach ($conn in $connections) {
                    if ($conn.State -eq 'Listen') {
                        # state should be Listen
                        $processId = $conn.OwningProcess
                    }
                }
            }
            else {
                # object
                if ($connections.State -eq 'Listen') {
                    # state should be Listen
                    $processId = $connections.OwningProcess                  
                }
            }

            if ($processId -gt 4) {
                # skip system process
                Write-Host ('Logger: find process running at port {0}, PID is {1}' -f $port, $processId)
                taskkill.exe /f /pid $processId
            }
        }
    }
}

# $env:USERPROFILE
Write-Output  "Cloud77 utility script starts"
Write-Output "Usage:"
New-Folder "Documentation\Staging"

if ($usage) {
    # Write-Output "  -usage: Show usage ($usage)"
    if ($usage -eq 'start-services') {
        Invoke-Script -shell cmd -command "cd $pwd\SampleService`ndotnet run -lp=http"
        Start-Sleep -Seconds 1
        Invoke-Script -shell cmd -command "cd $pwd\GatewayService`ndotnet run -lp=http"
        Start-Sleep -Seconds 1
        Invoke-Script -shell cmd -command "cd $pwd\SuperService`ndotnet run -lp=http"
        # Start-Sleep -Seconds 1
        # Invoke-Script -shell cmd -command "cd canteen-service && yarn run node"
        # Start-Sleep -Seconds 1
        # Invoke-Script -shell cmd -command "cd factory-service && go build -o factory.exe && factory.exe"
    }
    if ($usage -eq 'stop-services') {
        Stop-Service -name GatewayService # -port 4359
        Stop-Service -name SampleService # -port 5294
        Stop-Service -name UserService # -port 5389
        Stop-Service -name SuperService # -port 7845
        Stop-Service -port 7846
        Stop-Service -port 5648
        #Stop-Service -name factory
    }
    if ($usage -eq 'list-services') {
        Get-ServiceIno -name gateway -port 4359
        Get-ServiceIno -name sample -port 5294
        Get-ServiceIno -name user 5389
        Get-ServiceIno -name super -port 7845
        Get-ServiceIno -name super-https -port 7846
        Get-ServiceIno -name canteen -port 5648
    }
    if ($usage -eq 'build-apps') {
        Invoke-Script -shell ps -command "cd $PWD\web-apps\angular-apps`npwd`nyarn build-all"
        Invoke-Script -shell ps -command "cd $PWD\web-apps\canteen-app`npwd`nyarn build"
        Invoke-Script -shell ps -command "cd $PWD\web-apps\factory-app`npwd`nyarn build"
    }
    if ($usage -eq 'build-services') {
        Invoke-Script -shell ps -command "cd $pwd\GatewayService`ndotnet build -c Release"
        Invoke-Script -shell ps -command "cd $pwd\SampleService`ndotnet build -c Release"
        Invoke-Script -shell ps -command "cd $pwd\UserService`ndotnet build -c Release"
        Invoke-Script -shell ps -command "cd $pwd\SuperService`ndotnet build -c Release"
    }
    if ($usage -eq 'copy') {
        Remove-Item "Documentation\Staging\build" -Recurse -ErrorAction Ignore
        Copy-Item -Path "$PWD\web-apps\angular-apps\dist\landing-app\browser" -Destination "Documentation\Staging\build\landing-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\angular-apps\dist\sample-app\browser" -Destination "Documentation\Staging\build\sample-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\angular-apps\dist\account-app\browser" -Destination "Documentation\Staging\build\account-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\angular-apps\dist\dashboard-app\browser" -Destination "Documentation\Staging\build\dashboard-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\angular-apps\dist\internal-app\browser" -Destination "Documentation\Staging\build\internal-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\canteen-app\build" -Destination "Documentation\Staging\build\canteen-app" -Recurse
        Copy-Item -Path "$PWD\web-apps\factory-app\build" -Destination "Documentation\Staging\build\factory-app" -Recurse
        Copy-Item -Path "$PWD\GatewayService\bin\Release\net8.0" -Destination "Documentation\Staging\build\gateway-service" -Recurse
        Copy-Item -Path "$PWD\SampleService\bin\Release\net8.0" -Destination "Documentation\Staging\build\sample-service" -Recurse
        Copy-Item -Path "$PWD\UserService\bin\Release\net8.0" -Destination "Documentation\Staging\build\user-service" -Recurse
        Copy-Item -Path "$PWD\SuperService\bin\Release\net8.0" -Destination "Documentation\Staging\build\super-service" -Recurse
    }
} else {
    Write-Output "  -usage: Show usage"
    Write-Output "  -shell: ps or cmd"
    Write-Output "  -command: Command to execute"
    Write-Output "  start-services: Start services"
    write-output "  stop-services: Stop services"
    Write-Output "  list-services: List services"
    write-output "  build-apps: Build web apps"
    write-output "  build-services: Build web services"
}
