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

Stop-Service -port 7709
Start-Sleep -Seconds 1
Stop-Service -port 7710
Start-Sleep -Seconds 1
Stop-Service -port 7712
Start-Sleep -Seconds 1
Stop-Service -port 7713
Start-Sleep -Seconds 1
Stop-Service -port 7711