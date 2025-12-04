param(
    [Parameter(Mandatory = $false)][string]$action,
    [Parameter(Mandatory = $false)][string]$services,
    [Parameter(Mandatory = $false)][string]$apps
)

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

function Stop-Service {
    param (
        [string]$name,
        [int]$port
    )

    if ($name -ne '') {
        $serviceCheck = Get-Process -Name $name -ErrorAction Ignore
        if ($null -eq $serviceCheck) {
            Write-Host ('Logger: find no {0}.exe' -f $name)
        }
        else {
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

switch ($action) {
    'start-services' {
        foreach ($service in $services.Split(',')) {
            <# $service is the current item #>
            Write-Host $service
            switch ($service) {
                'gateway' {
                    dotnet build GatewayService\GatewayService.csproj -c Debug
                    Invoke-Script -shell cmd -command "cd $pwd\GatewayService`ndotnet run -lp=http"
                    Start-Sleep -Seconds 1
                    break;
                }
                'sample' {
                    dotnet build SampleService\SampleService.csproj -c Debug
                    Invoke-Script -shell cmd -command "cd $pwd\SampleService`ndotnet run -lp=http"
                    Start-Sleep -Seconds 1
                    break;
                }
                'user' {
                    dotnet build UserService\UserService.csproj -c Debug
                    Invoke-Script -shell cmd -command "cd $pwd\UserService`ndotnet run -lp=http"
                    Start-Sleep -Seconds 1
                    break;
                }
                'super' {
                    dotnet build SuperService\SuperService.csproj -c Debug
                    Invoke-Script -shell cmd -command "cd $pwd\SuperService`ndotnet run -lp=http"
                    Start-Sleep -Seconds 1
                    break;
                }
                'canteen' {
                    Invoke-Script -shell cmd -command "cd $pwd\canteen-service`nyarn start"
                    Start-Sleep -Seconds 1
                    break;
                }
                'factory' {
                    # Invoke-Script -shell cmd -command "cd factory-service && go build -o factory.exe && factory.exe"
                    break;
                }
                Default {}
            }
        }
        Write-Host $apps
        break;
    }
    'stop-services' {
        Stop-Service -port 7711
        Stop-Service -port 7712
        Stop-Service -port 7713
        Stop-Service -port 7715
        Stop-Service -port 7710
        break;
    }
    'start-sso' {
        Invoke-Script -shell cmd -command "cd $pwd\web-apps\angular-apps`nyarn start"
        Start-Sleep -Seconds 1
        break;
    }
    'start-apps' {
        foreach ($app in $apps.Split(',')) {
            switch ($app) {
                'sso' { 
                    Invoke-Script -shell cmd -command "cd $pwd\web-apps\angular-apps`nyarn start"
                    Start-Sleep -Seconds 1
                    break;
                }
                Default {}
            }
        }

        break;
    }
    'info' {
        Get-ServiceInfo -port 7710
        Get-ServiceInfo -port 7711
        Get-ServiceInfo -port 7712
        Get-ServiceInfo -port 7713
        Get-ServiceInfo -port 7715
        break;
    }
    '' {
        Write-Host "Supported commands" -ForegroundColor Green
        Write-Host "  start-services -services gateway,sample,user,super,canteen" -ForegroundColor Green
        Write-Host "  stop-services" -ForegroundColor Green
        Write-Host "  start-sso" -ForegroundColor Green
        Write-Host "  info" -ForegroundColor Green
        break;
    }
    Default {
        Write-Host "Action '$action' is not supported." -ForegroundColor Red
        exit 1
    }
}