$ErrorActionPreference = "Stop"

$Git = "C:\Users\study session\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Stamp = Get-Date -Format "yyMMdd-HHmm"

if (-not (Test-Path -LiteralPath $Git)) {
  throw "Git executable was not found at: $Git"
}

& $Git -C $Root add .

$changes = & $Git -C $Root status --porcelain
if (-not $changes) {
  Write-Host "No changes to publish."
  exit 0
}

& $Git -C $Root commit -m "Publish Clozeit data $Stamp"
& $Git -C $Root push

Write-Host ""
Write-Host "Published Clozeit changes."
