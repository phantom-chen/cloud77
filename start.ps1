param(
    [Parameter(Mandatory = $false)][string]$action
)

function Invoke-Script {
    param (
        $shell,
        $command
    )
    if (!(Test-Path "$env:TEMP\Cloud77")) {
        mkdir "$env:TEMP\Cloud77"
    }
    
    Remove-Item "$env:TEMP\Cloud77\*.ps1" -ErrorAction Ignore
    Remove-Item "$env:TEMP\Cloud77\*.cmd" -ErrorAction Ignore
    
    $guid = [System.Guid]::NewGuid().ToString("d")
    
    if ($shell -eq 'ps') {
        $command | Out-File "$env:TEMP\Cloud77\$guid.ps1"
        powershell.exe -file "$env:TEMP\Cloud77\$guid.ps1" -Wait 
    }
    
    if ($shell -eq 'cmd') {
        $command | Out-File "$env:TEMP\Cloud77\$guid.cmd" -Encoding ascii
        Start-Process -FilePath "$env:TEMP\Cloud77\$guid.cmd" -WindowStyle Normal
    }
}

function Stop-Service {
    param (
        [Parameter(Mandatory = $false)]
        [string] $name,
        [Parameter(Mandatory = $false)]
        [int] $port
    )
    
    if ($name -ne '')
    {
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

    if ($port -ge 3000) # port >= 3000
    {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction Ignore
        if ($null -eq $connections)
        {
            Write-Host ('Logger: find no proccess running at port {0}' -f $port)
        }
        else
        {
            Get-NetTCPConnection -LocalPort $port -ErrorAction Ignore | Select-Object -Property *
            $processId = 0
            $count = [int]$connections.count
            if ($count -gt 0)
            {
                # array
                foreach ($conn in $connections)
                {
                if ($conn.State -eq 'Listen') # state should be Listen
                {
                    $processId = $conn.OwningProcess
                }
                }
            }
            else
            {
                # object
                if ($connections.State -eq 'Listen') # state should be Listen
                {
                $processId = $connections.OwningProcess                  
                }
            }
    
            if ($processId -gt 4)  # skip system process
            {
                Write-Host ('Logger: find process running at port {0}, PID is {1}' -f $port, $processId)
                taskkill.exe /f /pid $processId
            }
        }
    }
}

if ($action -eq 'start') {
    Invoke-Script -shell cmd -command "cd GatewayService && dotnet run -lp=Development"
    Start-Sleep -Seconds 5
    Invoke-Script -shell cmd -command "cd UserService && dotnet run -lp=Development"
    Start-Sleep -Seconds 5
    Invoke-Script -shell cmd -command "cd SuperService && dotnet run -lp=Development"
    Start-Sleep -Seconds 5
    Invoke-Script -shell cmd -command "cd canteen-service && yarn run node"
    Start-Sleep -Seconds 5
    Invoke-Script -shell cmd -command "cd factory-service && go build -o factory.exe && factory.exe"
}

if ($action -eq 'stop') {
    Stop-Service -name 'GatewayService'
    Stop-Service -name 'UserService'
    Stop-Service -name 'SuperService'
    Stop-Service -port 5648
    Stop-Service -name 'factory'
}
