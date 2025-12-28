$ErrorActionPreference = 'Stop'

$toolsDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Uninstall-BinFile -Name 'plats'
Uninstall-BinFile -Name 'vlaamscodex'

$venvDir = Join-Path $toolsDir 'venv'
if (Test-Path $venvDir) {
  Remove-Item -Recurse -Force $venvDir
}

