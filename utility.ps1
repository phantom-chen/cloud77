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
        $command | Out-File "$env:TEMP\cloud77\$guid.cmd"
        Start-Process -FilePath "$env:TEMP\cloud77\$guid.cmd" -WindowStyle Maximized
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

function  Stop-Service {
    param (
        [string]$name,
        [int]$port
    )
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

Write-Output  "Cloud77 utility script starts"
Write-Output "Usage:"

if ($usage) {
    Write-Output "  -usage: Show usage ($usage)"
    if ($usage -eq 'start-services') {

    }
    if ($usage -eq 'stop-services') {
        Stop-Service -name  sample -port 5294
    }
    if ($usage -eq 'list-services') {
        Get-NetTCPConnection -LocalPort 4359 -ErrorAction Ignore
        Get-NetTCPConnection -LocalPort 5294 -ErrorAction Ignore
        Get-NetTCPConnection -LocalPort 5389 -ErrorAction Ignore
        Get-NetTCPConnection -LocalPort 7845 -ErrorAction Ignore
        Get-ServiceIno -name super -port 7846
        Get-ServiceIno -name super -port 7847
    }
} else {
    Write-Output "  -usage: Show usage"
    Write-Output "  -shell: ps or cmd"
    Write-Output "  -command: Command to execute"
    Write-Output "  start-services: Start services"
    write-output "  stop-services: Stop services"
    Write-Output "  list-services: List services"
}
