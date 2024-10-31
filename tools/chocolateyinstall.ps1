$ErrorActionPreference = 'Stop';
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"
$url        = 'https://github.com/yourusername/git-setup-cli/releases/download/v1.0.0/git-setup.exe'

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url           = $url
  softwareName  = 'git-setup-cli*'
  checksum      = 'd19f1e91e2ab007ba36c3ec8431926ca1991ea681f91065646fde8cc1508f31c'
  checksumType  = 'sha256'
}

Install-ChocolateyPackage @packageArgs 