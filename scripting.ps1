Write-Output 'script works'

# sample service
# user service
# super service

# test path bin/Debug/net8.0

$addr = Read-Host 'Press IP address saved to localhost.txt, press Enter key to continue'
Write-Output $addr

if ((Test-Path "UserService\bin\Debug\net8.0")) {
    $addr | Out-File "UserService\bin\Debug\net8.0\localhost.txt"
}

if ((Test-Path "SuperService\bin\Debug\net8.0")) {
    $addr | Out-File "SuperService\bin\Debug\net8.0\localhost.txt"
}

if ((Test-Path "SampleService\bin\Debug\net8.0")) {
    $addr | Out-File "SampleService\bin\Debug\net8.0\localhost.txt"
}