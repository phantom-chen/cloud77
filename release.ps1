param(
    [Parameter(Mandatory = $false)][string]$id
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
        $command | Out-File "$env:TEMP\Cloud77\$guid.cmd"
        Start-Process -FilePath "$env:TEMP\Cloud77\$guid.cmd" -WindowStyle Maximized
    }
}

if (@('web-apps', 'gh-page-page') -contains $id) {
    Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build-gh-page"    
}

if (@('web-apps', 'landing-app') -contains $id) {
    Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build"
}

if (@('web-apps', 'canteen-app') -contains $id) {
    Invoke-Script -shell ps -command "cd $PWD\canteen-app`npwd`nyarn build"
}

if (@('web-apps', 'factory-app') -contains $id) {
    Invoke-Script -shell ps -command "cd $PWD\factory-app`npwd`nyarn build"
}

if (@('web-apps', 'product-app') -contains $id) {
    Invoke-Script -shell ps -command "cd $PWD\product-app`npwd`nyarn build"
}

if ($id -eq 'cooler-plus') {
    Start-Process -FilePath './squirrel/squirrel.exe' -ArgumentList "--releasify=Cooler_plus.1.0.1.nupkg --releaseDir=./ --framework-version=net472 --no-msi --icon=Cooler.ico --setupIcon=Cooler.ico" -Wait
}

if ($id -eq 'web-apps') {
    Remove-Item Artifacts\web-apps\build -Recurse -ErrorAction Ignore
    Copy-Item -Path "$PWD\landing-app\dist\gh-page-app\browser" -Destination Artifacts\web-apps\build\gh-page -Recurse
    Copy-Item -Path "$PWD\landing-app\dist\landing-app\browser" -Destination Artifacts\web-apps\build\landing -Recurse
    Copy-Item -Path "$PWD\canteen-app\build" -Destination Artifacts\web-apps\build\canteen -Recurse
    Copy-Item -Path "$PWD\factory-app\build" -Destination Artifacts\web-apps\build\factory -Recurse
    Copy-Item -Path "$PWD\product-app\build" -Destination Artifacts\web-apps\build\product -Recurse
}