# Define the certificate details
$certName = "CN=example"
$pfxPassword = ConvertTo-SecureString -String "welcome123#" -Force -AsPlainText
$outputPfxPath = "example.pfx"

# Generate a self-signed certificate
$selfSignedCert = New-SelfSignedCertificate -Subject $certName -DnsName "example.dev" -CertStoreLocation "Cert:\CurrentUser\My" -FriendlyName "Self-Signed for example.dev"

# Export the certificate to a PFX file
Export-PfxCertificate -Cert $selfSignedCert -FilePath $outputPfxPath -Password $pfxPassword

Write-Host "PFX certificate generated at: $outputPfxPath"