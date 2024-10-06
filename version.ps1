# SetVersion.ps1
#
# Set the version in all the AssemblyInfo.cs or AssemblyInfo.vb files in any subdirectory.
#
# usage:  
#  from cmd.exe: 
#     powershell.exe SetVersion.ps1  2.8.3.0
# 
#  from powershell.exe prompt: 
#     .\SetVersion.ps1  2.8.3.0
#
# last saved Time-stamp: <Wednesday, April 23, 2008  11:52:15  (by dinoch)>
# modified by dannevesdantas on 03-11-2021
#

param (
    [Parameter(Mandatory = $true)][string]$dir,
    [Parameter(Mandatory = $true)][string]$version
)

Write-Host $dir
Write-Host $version

function Usage {
    Write-Host "Usage: ";
    Write-Host "  from cmd.exe: ";
    Write-Host "     powershell.exe SetVersion.ps1  2.8.3.0";
    Write-Host " ";
    Write-Host "  from powershell.exe prompt: ";
    Write-Host "     .\SetVersion.ps1  2.8.3.0";
    Write-Host " ";
}

function Update-SourceVersion {
    Param ([string]$Version)
    $NewVersion = 'AssemblyVersion("' + $Version + '")';
    $NewFileVersion = 'AssemblyFileVersion("' + $Version + '")';

    foreach ($o in $input) {
        Write-output $o.FullName
        $TmpFile = $o.FullName + ".tmp"

        Get-Content $o.FullName -encoding utf8 |
        % { $_ -replace 'AssemblyVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', $NewVersion } |
        % { $_ -replace 'AssemblyFileVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', $NewFileVersion }  |
        Set-Content $TmpFile -encoding utf8
    
        move-item $TmpFile $o.FullName -force
    }
}

function Update-AllAssemblyInfoFiles ( $version ) {
    foreach ($file in "AssemblyInfo.cs", "AssemblyInfo.vb" ) {
        get-childitem -Path $dir -recurse | ? { $_.Name -eq $file } | Update-SourceVersion $version ;
    }
}

function Update-CSharp-Project {
    param (
        [Parameter(Mandatory = $true)][string]$dir,
        [Parameter(Mandatory = $true)][string]$version
    )
    $prop = Get-ChildItem -Recurse -Path "$dir/*.csproj" | Select-Object -Property FullName
    $content = Get-Content $prop.FullName
    ForEach-Object {$content} | ForEach-Object { 
        $_ -replace '<Version>.*</Version>', "<Version>$version</Version>"
    } | Set-Content $prop.FullName
}

# validate arguments 
$r = [System.Text.RegularExpressions.Regex]::Match($version, "^[0-9]+(\.[0-9]+){1,3}$");

if ($r.Success) {
    Update-AllAssemblyInfoFiles $version;
}
else {
    Write-Error -Message "Bad Input! From powershell.exe prompt: .\SetVersion.ps1 2.8.3.0" -Category InvalidArgument -ErrorAction Stop
    #Usage ;
}
