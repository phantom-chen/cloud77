param(
    [Parameter(Mandatory = $true)][string]$service,    
    [Parameter(Mandatory = $false)][string]$prefix,    
    [Parameter(Mandatory = $false)][string]$tag
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

Write-Host 'Building Docker image...'

$folderName = ''
$imageName = ''
switch ($service) {
    'gateway' {
        $folderName = 'GatewayService'
        $imageName = 'gateway-service'
    }
    'sample' {
        $folderName = 'SampleService'
        $imageName = 'sample-service'
    }
    'user' {
        $folderName = 'UserService'
        $imageName = 'user-service'
    }
    'super' {
        $folderName = 'SuperService'
        $imageName = 'super-service'
    }
    'canteen' {
        $folderName = 'canteen-service'
        $imageName = 'canteen-service'
    }
    Default {}
}

Invoke-Script -shell ps -command ("cd $folderName`npwd`ndocker build -t dev-" + $imageName + " .")
Invoke-Script -shell ps -command ("cd $folderName`npwd`ndocker build -t staging-" + $imageName + " .")
if ($prefix -ne '' -and $prefix -ne $null) {
    Invoke-Script -shell ps -command ("cd $folderName`npwd`ndocker build -t $prefix/" + $imageName + ":$tag .")
}