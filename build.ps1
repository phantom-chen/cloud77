param(
    [Parameter(Mandatory = $true)][string]$id,
    [Parameter(Mandatory = $true)][string]$version
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
    Remove-Item "$PWD\landing-app\dist\gh-page-app" -Recurse -ErrorAction Ignore
    Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build-gh-page"    
}

if (@('web-apps', 'landing-app') -contains $id) {
    Remove-Item "$PWD\landing-app\dist\landing-app" -Recurse -ErrorAction Ignore
    Invoke-Script -shell ps -command "cd $PWD\landing-app`npwd`nyarn build"
}

if (@('web-apps', 'canteen-app') -contains $id) {
    Remove-Item "$PWD\canteen-app\build" -Recurse -ErrorAction Ignore
    Invoke-Script -shell ps -command "cd $PWD\canteen-app`npwd`nyarn build"
}

if (@('web-apps', 'factory-app') -contains $id) {
    Remove-Item "$PWD\factory-app\build" -Recurse -ErrorAction Ignore
    Invoke-Script -shell ps -command "cd $PWD\factory-app`npwd`nyarn build"
}

if (@('web-apps', 'product-app') -contains $id) {
    Remove-Item "$PWD\product-app\build" -Recurse -ErrorAction Ignore
    Invoke-Script -shell ps -command "cd $PWD\product-app`npwd`nyarn build"
}

if ($id -eq 'web-apps') {
    Remove-Item Artifact\web-apps\build -Recurse -ErrorAction Ignore
    Copy-Item -Path "$PWD\landing-app\dist\gh-page-app\browser" -Destination Artifact\web-apps\build\gh-page -Recurse
    Copy-Item -Path "$PWD\landing-app\dist\landing-app\browser" -Destination Artifact\web-apps\build\landing -Recurse
    Copy-Item -Path "$PWD\canteen-app\build" -Destination Artifact\web-apps\build\canteen -Recurse
    Copy-Item -Path "$PWD\factory-app\build" -Destination Artifact\web-apps\build\factory -Recurse
    Copy-Item -Path "$PWD\product-app\build" -Destination Artifact\web-apps\build\product -Recurse
}

msbuild --version
$initial = '1.0.0.0'

Remove-Item Artifact\build -Recurse -ErrorAction Ignore
Remove-Item Artifact\release -Recurse -ErrorAction Ignore
Remove-Item Artifact\**.nupkg

if ($id -eq 'cooler-plus-installer') {
    powershell.exe .\version.ps1 -dir "Cooler.Plus.Installer" -version $version
    msbuild Cooler.Plus.Installer\Cooler.Plus.Installer.csproj /p:Configuration=Release /p:Platform=x64 /p:OutputPath=bin\publish
    Move-Item -Path Cooler.Plus.Installer\bin\publish -Destination Artifact\build
    powershell.exe .\version.ps1 -dir "Cooler.Plus.Installer" -version $initial
}

if ($id -eq 'cooler-plus') {
    powershell.exe .\version.ps1 -dir "Cooler.Plus" -version $version
    msbuild Cooler.Plus.sln /p:Configuration=Release /p:Platform=x64 /p:OutputPath=bin\publish
    Move-Item -Path Cooler.Plus\bin\publish -Destination Artifact\build
    powershell.exe .\version.ps1 -dir "Cooler.Plus" -version $initial
}

Remove-Item "Artifact/build/*.pdb" -Recurse -ErrorAction Ignore
Remove-Item "Artifact/build/*.xml" -Recurse -ErrorAction Ignore

if ($id -eq 'cc') {
    Remove-Item Artifact\**.nupkg
    Remove-Item Artifact\build -Recurse -ErrorAction Ignore
    Remove-Item Artifact\release -Recurse -ErrorAction Ignore
}