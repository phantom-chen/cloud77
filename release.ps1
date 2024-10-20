# build docker image
# build desktop exe / installer
# build update package (nupkg/RELEASE)

# Documents\Cloud77Server

param(
    [Parameter(Mandatory = $false)][string]$id
)

function New-Folder {
    param (
        [string] $path
    )
    if (!(Test-Path $path))
    {
        mkdir $path
    }
}
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server"
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server\resources"
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server\resources\releases"
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server\resources\releases\installers"
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server\resources\releases\hex-calculator5"
New-Folder -path "$env:USERPROFILE\Documents\Cloud77Server\resources\releases\cooler-plus"

$releasePath = "$env:USERPROFILE\Documents\Cloud77Server\resources\releases"

$version = '1.0.0'

if ($id -eq 'cooler-plus-installer') {
    Remove-Item "Artifact/build/*.pdb" -Recurse -ErrorAction Ignore
    Remove-Item "Artifact/build/*.xml" -Recurse -ErrorAction Ignore
    'https://www.cloud77.top/resources/releases/cooler-plus' | Out-File "Artifact\build\squirrel.txt" 
    Artifact\NuGet.exe pack Artifact\Cooler.Plus.Installer.nuspec -Version $version -Properties Configuration=Release -OutputDirectory Artifact
    Start-Process Artifact\squirrel\Squirrel.exe -ArgumentList "
    --releasify=Artifact\cooler_plus.$version.nupkg 
    --releaseDir=Artifact\release 
    --framework-version=net472
    --icon=Artifact\Cooler.ico
    --setupIcon=Artifact\Cooler.ico" -Wait

    Remove-Item Artifact\release\Setup.msi -ErrorAction Ignore
    Rename-Item -NewName "Cooler-Plus-Installer-$($version).exe" -Path Artifact\release\Setup.exe
    Write-Host (Get-Item "Artifact\build\Cooler.Plus.exe").VersionInfo.FileVersion

    Copy-Item -Path "Artifact\release\Cooler-Plus-Installer-$version.exe" -Destination "$($releasePath)\installers\Cooler-Plus-Installer-$version.exe"
    Copy-Item -Path "Artifact\release\RELEASES" -Destination "$($releasePath)\installers\CoolerPlus"
}

if ($id -eq 'cooler-plus') {
    Remove-Item "Artifact/build/*.pdb" -Recurse -ErrorAction Ignore
    Remove-Item "Artifact/build/*.xml" -Recurse -ErrorAction Ignore

    'https://www.cloud77.top/resources/releases/cooler-plus' | Out-File "Artifact\build\squirrel.txt" 
    Artifact\NuGet.exe pack Artifact\Cooler.Plus.nuspec -Version $version -Properties Configuration=Release -OutputDirectory Artifact
    Start-Process Artifact\squirrel\Squirrel.exe -ArgumentList "
    --releasify=Artifact\cooler_plus.$version.nupkg 
    --releaseDir=Artifact\release 
    --framework-version=net472
    --icon=Artifact\Cooler.ico
    --setupIcon=Artifact\Cooler.ico" -Wait
    Remove-Item Artifact\release\Setup.msi -ErrorAction Ignore
    Remove-Item Artifact\release\Setup.exe -ErrorAction Ignore
    Write-Host (Get-Item "Artifact\build\Cooler.Plus.exe").VersionInfo

    Remove-Item "$($releasePath)\cooler-plus\RELEASES" -ErrorAction Ignore
    Remove-Item "$($releasePath)\cooler-plus\*.nupkg" -ErrorAction Ignore

    Copy-Item -Path "Artifact\release\cooler_plus-$version-full.nupkg" -Destination "$($releasePath)\cooler-plus\cooler_plus-$version-full.nupkg"
    Copy-Item -Path "Artifact\release\RELEASES" -Destination "$($releasePath)\cooler-plus\RELEASES"
}

if ($id -eq 'gateway-service') {
    Invoke-Script -shell ps -command "docker rmi tester/gateway-service"
    Invoke-Script -shell ps -command "cd GatewayService`npwd`ndocker build -t tester/gateway-service ."
}

if ($id -eq 'user-service') {
    Invoke-Script -shell ps -command "docker rmi tester/user-service"
    Invoke-Script -shell ps -command "cd UserService`npwd`ndocker build -t tester/user-service ."
}

if ($id -eq 'super-service') {
    Invoke-Script -shell ps -command "docker rmi tester/super-service"
    Invoke-Script -shell ps -command "cd SuperService`npwd`ndocker build -t tester/super-service ."
}

if ($id -eq 'canteen-service') {
    Invoke-Script -shell ps -command "docker rmi tester/canteen-service"
    Invoke-Script -shell ps -command "cd canteen-service`npwd`ndocker build -t tester/canteen-service ."
}

if ($id -eq 'factory-service') {
    Invoke-Script -shell ps -command "docker rmi tester/factory-service"
    Invoke-Script -shell ps -command "cd factory-service`npwd`ndocker build -t tester/factory-service ."
}

if ($id -eq 'web-apps-image') {
    '1.0.1-alpha.53' | Out-File 'Artifact\web-apps\build\version.txt'
    Invoke-Script -shell ps -command "docker rmi tester/web-apps"
    Invoke-Script -shell ps -command "cd Artifact`ncd web-apps`npwd`ndocker build -t tester/web-apps ."
    Set-Clipboard -Value "docker push registry.cn-hangzhou.aliyuncs.com/cloud_77/web-apps:$version"

    docker tag tester/web-apps web-apps:v1 
}