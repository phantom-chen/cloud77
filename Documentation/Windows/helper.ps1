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

function Get-ServiceInfo {
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

$action = Read-Host 'press the action for services'

$files = Get-ChildItem "*.service.json"
foreach ($file in $files) {
    $service = Get-Content $file.FullName | ConvertFrom-Json
    $name = $service.name
    $port = $service.ports

    if ($action -eq 'start') {
        Write-Host "$action service $name"
        if ($service.file -ne '' -and $service.file -ne $null) {
            $res = Get-Process -Name $service.name -ErrorAction Ignore
            if ($res -eq $null) {
                Start-Process -FilePath $service.file -WorkingDirectory $service.directory -WindowStyle Minimized
            }
        }
        elseif ($service.shellCommand -ne '' -and $service.shellCommand -ne $null) {
            $connections = Get-NetTCPConnection -LocalPort $service.ports -ErrorAction Ignore
            if ($null -eq $connections) {
                Invoke-Script -shell cmd -command $service.shellCommand
            }
        }
    }

    if ($action -eq 'stop') {
        Write-Host "$action service $name"
        if ($service.processName -ne '' -and $service.processName -ne $null) {
            Stop-Service -name $service.processName
        }
        elseif ($service.ports -ne '') {
            $port = [int]($service.ports)
            Stop-Service -port $port
        }
    }
}

Start-Sleep -Seconds 1

foreach ($file in $files) {
    $service = Get-Content $file.FullName | ConvertFrom-Json
    $name = $service.name
    $ports = $service.ports -split ','
    foreach ($port in $ports) {
        Get-ServiceInfo -name $service.name -port $port
    }
}

Write-Host 'exit in 1 seconds'
Start-Sleep -Seconds 1