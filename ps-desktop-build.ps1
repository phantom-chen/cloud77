param(
    [Parameter(Mandatory = $true)][string]$version,
    [Parameter(Mandatory = $false)][string]$endpoint
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

# msbuild path
msbuild --version
$initial = '1.0.0.0'

# set version
powershell.exe .\version.ps1 -dir "CoolerApps/Cooler.Plus" -version $version

# restore
.\NuGet.exe restore CoolerApps\Cooler.Plus.sln

# build
msbuild CoolerApps\Cooler.Plus\Cooler.Plus.csproj /p:Configuration=Release /p:Platform=x64 /p:OutputPath=build

# move build files
Remove-Item CoolerApps\build -Recurse -ErrorAction Ignore
Move-Item -path CoolerApps\Cooler.Plus\build -Destination CoolerApps

# reset version
powershell.exe .\version.ps1 -dir "CoolerApps/Cooler.Plus" -version $initial

# remove package xml
Remove-Item CoolerApps\build\*.xml -ErrorAction Ignore

# remove pdb files
Remove-Item CoolerApps\build\*.pdb -ErrorAction Ignore

Remove-Item CoolerApps\nupkg -Recurse -ErrorAction Ignore

Remove-Item CoolerApps\release -Recurse -ErrorAction Ignore

# update endpoint
if (-not $endpoint) {
    $endpoint = Read-Host "Enter the Squirrel endpoint (e.g., http://localhost/squirrel)"
    if (-not $endpoint) {
        Write-Host "No endpoint provided, using default." -ForegroundColor Yellow
        $endpoint = "http://localhost/squirrel"
    }
}
Write-Host $endpoint -ForegroundColor Green
$endpoint | Out-File "CoolerApps\build\squirrel.txt"

# nuget pack
.\NuGet.exe pack CoolerApps/Cooler.Plus.nuspec -Version $version -OutputDirectory CoolerApps/nupkg -Properties Configuration=Release

# squirrel release
Write-Host (Get-Item "CoolerApps/squirrel/Squirrel.exe").VersionInfo.FileVersion -ForegroundColor Green
Start-Process -FilePath "CoolerApps\squirrel\Squirrel.exe" -ArgumentList "--releasify=CoolerApps\nupkg\Cooler_plus.$version.nupkg --framework-version=net472 --icon=CoolerApps\Cooler.ico --setupIcon=CoolerApps\Cooler.ico --releaseDir=CoolerApps\release --no-msi" -Wait

# remove exe and msi
Remove-Item CoolerApps\release\Setup.exe -ErrorAction Ignore
Remove-Item CoolerApps\release\Setup.msi -ErrorAction Ignore

# check the output
Write-Host (Get-Item .\CoolerApps\build\Cooler.Plus.exe).VersionInfo.FileVersion -ForegroundColor Green
Get-Content "CoolerApps\build\squirrel.txt"
Get-ChildItem CoolerApps/nupkg
Get-ChildItem CoolerApps/release

New-Folder -path "$env:USERPROFILE\Documents\MyServer\desktop-installers"
New-Folder -path "$env:USERPROFILE\Documents\MyServer\desktop-releases"
New-Folder -path "$env:USERPROFILE\Documents\MyServer\desktop-releases\cooler-plus"
$releasePath = "$env:USERPROFILE\Documents\MyServer\desktop-releases\cooler-plus"

# clean release folder
Remove-Item "$($releasePath)\RELEASES" -ErrorAction Ignore
Remove-Item "$($releasePath)\*.nupkg" -ErrorAction Ignore

# move files to release folder
Copy-Item -Path "CoolerApps\release\cooler_plus-$version-full.nupkg" -Destination "$($releasePath)\cooler_plus-$version-full.nupkg"
Copy-Item -Path "CoolerApps\release\RELEASES" -Destination "$($releasePath)\RELEASES"