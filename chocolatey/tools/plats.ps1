param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$RemainingArgs
)

$ErrorActionPreference = 'Stop'

$toolsDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pythonExe = Join-Path $toolsDir 'venv\Scripts\python.exe'

if (-not (Test-Path $pythonExe)) {
  throw "vlaamscodex venv missing. Reinstall the Chocolatey package."
}

& $pythonExe -m vlaamscodex.cli @RemainingArgs
exit $LASTEXITCODE
