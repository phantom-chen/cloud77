# get current working directory
# get all folders defined in the current working directory
$currentDir = Get-Location
$folders = Get-ChildItem -Path $currentDir -Directory
# iterate through each folder and perform cleanup
foreach ($folder in $folders) {
    # perform cleanup actions here
    # print folder name and absolute path
    # Write-Output "Folder: $($folder.Name), Path: $($folder.FullName)"
    # skip folder name starts with '.'
    if ($folder.Name.StartsWith('.')) {
        continue
    }

    # get all files of the current folder, print file if extension is csproj
    $files = Get-ChildItem -Path $folder.FullName -File
    foreach ($file in $files) {
        if ($file.Extension -eq ".csproj") {
            # Write-Output "File: $($file.Name), Path: $($file.FullName)"

            # this is c# project, it has bin and obj folders
            # child path array
            $childPaths = @("bin\Debug\net8.0", "bin\Release\net8.0")
            foreach ($childPath in $childPaths) {
                $binFolder = Join-Path -Path $folder.FullName -ChildPath $childPath
                if (Test-Path -Path $binFolder) {
                    Write-Output "Bin folder exists: $binFolder"
                }
            }
        }
    }
}