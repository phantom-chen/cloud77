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
        $command | Out-File "$env:TEMP\Cloud77\$guid.cmd"
        Start-Process -FilePath "$env:TEMP\Cloud77\$guid.cmd" -WindowStyle Maximized
    }
}

# Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build-gh-page"
# Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build"
# Invoke-Script -shell ps -command "cd $PWD\canteen-app`npwd`nyarn build"
# Invoke-Script -shell ps -command "cd $PWD\factory-app`npwd`nyarn build"
Invoke-Script -shell ps -command "cd $PWD\product-app`npwd`nyarn build"