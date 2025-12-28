$ErrorActionPreference = 'Stop'

$toolsDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$packageName = $env:ChocolateyPackageName
$packageVersion = $env:ChocolateyPackageVersion

function Invoke-External {
  param(
    [Parameter(Mandatory = $true)][string]$Exe,
    [Parameter(Mandatory = $true)][string[]]$Arguments
  )

  & $Exe @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed ($LASTEXITCODE): $Exe $($Arguments -join ' ')"
  }
}

function Get-PythonCommand {
  $python = Get-Command -Name 'python.exe' -ErrorAction SilentlyContinue
  if (-not $python) { $python = Get-Command -Name 'python' -ErrorAction SilentlyContinue }
  if (-not $python) { throw "Python was not found on PATH. Install the Chocolatey 'python3' package first." }
  return $python.Source
}

function Assert-PythonVersion {
  param([string]$PythonExe)
  $versionText = & $PythonExe -c "import sys; print(f'{sys.version_info[0]}.{sys.version_info[1]}')" 2>$null
  if (-not $versionText) { throw "Unable to query Python version from: $PythonExe" }
  $parts = $versionText.Trim().Split('.')
  if ($parts.Length -lt 2) { throw "Unexpected Python version output: $versionText" }
  $major = [int]$parts[0]
  $minor = [int]$parts[1]
  if ($major -ne 3 -or $minor -lt 10) { throw "Python 3.10+ is required. Found: $versionText" }
}

function Ensure-Pip {
  param([string]$PythonExe)
  & $PythonExe -m pip --version 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { return }
  Invoke-External -Exe $PythonExe -Arguments @('-m', 'ensurepip', '--upgrade')
}

function Get-VenvPythonPath {
  param([string]$VenvDir)
  return Join-Path $VenvDir 'Scripts\python.exe'
}

$pythonExe = Get-PythonCommand
Assert-PythonVersion -PythonExe $pythonExe

$wheel = Get-ChildItem -Path $toolsDir -Filter 'vlaamscodex-*-py3-none-any.whl' | Select-Object -First 1
if (-not $wheel) {
  throw "Wheel not found in $toolsDir. Build it with: python -m build --wheel --outdir chocolatey/tools"
}

$venvDir = Join-Path $toolsDir 'venv'
$venvPython = Get-VenvPythonPath -VenvDir $venvDir
if (-not (Test-Path $venvPython)) {
  Invoke-External -Exe $pythonExe -Arguments @('-m', 'venv', $venvDir)
}

Ensure-Pip -PythonExe $venvPython
Invoke-External -Exe $venvPython -Arguments @(
  '-m', 'pip', 'install',
  '--no-deps',
  '--disable-pip-version-check',
  '--no-input',
  '--upgrade',
  $wheel.FullName
)

# CLI shims
Install-BinFile -Name 'plats' -Path (Join-Path $toolsDir 'plats.ps1')
Install-BinFile -Name 'vlaamscodex' -Path (Join-Path $toolsDir 'plats.ps1')

Write-Host "$packageName $packageVersion installed. Try: plats version"
