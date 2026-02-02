param(
    [Parameter(Mandatory = $false)][string]$href
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
function New-Folder {
    param (
        [string] $path
    )
    if (!(Test-Path $path)) {
        mkdir $path
    }
}

$root = "$env:USERPROFILE\Documents\MyServer\html"
New-Folder $root

Write-Host 'Building Web Html ...'
if ($href.Length -gt 0) {
    Invoke-Script -shell ps -command "cd $PWD\web-apps\angular-apps`npwd`nyarn build-all-href"
} else {
    Invoke-Script -shell ps -command "cd $PWD\web-apps\angular-apps`npwd`nyarn build-all"
}

Invoke-Script -shell ps -command "cd $PWD\web-apps\canteen-app`npwd`nyarn build"
Invoke-Script -shell ps -command "cd $PWD\web-apps\factory-app`npwd`nyarn build"

if ($href.Length -gt 0) {
    Remove-Item "$root\landing" -Recurse -ErrorAction Ignore
    Remove-Item "$root\account" -Recurse -ErrorAction Ignore
    Remove-Item "$PWD\Documentation\Docker\html_apps\bin\landing" -Recurse -ErrorAction Ignore
    Remove-Item "$PWD\Documentation\Docker\html_apps\bin\account" -Recurse -ErrorAction Ignore
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\landing-app\browser" -Destination "$root\landing" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\sample-app\browser" -Destination "$root\landing\angular" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\account-app\browser" -Destination "$root\account" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\dashboard-app\browser" -Destination "$root\account\dashboard" -Recurse
    Copy-Item -Path "$PWD\web-apps\canteen-app\build" -Destination "$root\account\canteen" -Recurse
    Copy-Item -Path "$PWD\web-apps\factory-app\build" -Destination "$root\account\factory" -Recurse
    Copy-Item -Path $root\landing -Destination "$PWD\Documentation\Docker\html_apps\bin\landing" -Recurse -Force
    Copy-Item -Path $root\account -Destination "$PWD\Documentation\Docker\html_apps\bin\account" -Recurse -Force
    "linux" | Out-File "$root\linux.txt"
} else {
    Remove-Item "$root\00-landing" -Recurse -ErrorAction Ignore
    Remove-Item "$root\02-sample" -Recurse -ErrorAction Ignore
    Remove-Item "$root\03-account" -Recurse -ErrorAction Ignore
    Remove-Item "$root\05-canteen" -Recurse -ErrorAction Ignore
    Remove-Item "$root\06-factory" -Recurse -ErrorAction Ignore
    Remove-Item "$root\08-dashboard" -Recurse -ErrorAction Ignore

    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\landing-app\browser" -Destination "$root\00-landing" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\sample-app\browser" -Destination "$root\02-sample" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\account-app\browser" -Destination "$root\03-account" -Recurse
    Copy-Item -Path "$PWD\web-apps\canteen-app\build" -Destination "$root\05-canteen" -Recurse
    Copy-Item -Path "$PWD\web-apps\factory-app\build" -Destination "$root\06-factory" -Recurse
    Copy-Item -Path "$PWD\web-apps\angular-apps\dist\dashboard-app\browser" -Destination "$root\08-dashboard" -Recurse

    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\00-landing\web.config" -Force
    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\02-sample\web.config" -Force
    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\03-account\web.config" -Force
    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\05-canteen\web.config" -Force
    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\06-factory\web.config" -Force
    Copy-Item -Path "$PWD\Documentation\Windows\web.config" -Destination "$root\08-dashboard\web.config" -Force

    "windows" | Out-File "$root\windows.txt"
}