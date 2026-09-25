$ErrorActionPreference = "Stop"

$BundledGit = "C:\Users\study session\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
$Git = if (Test-Path -LiteralPath $BundledGit) { $BundledGit } else { "git" }
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ExportData = Join-Path $Root "exports\data.json"
$PublicData = Join-Path $Root "public\data.json"
$Stamp = Get-Date -Format "yyMMdd-HHmm"

if (Test-Path -LiteralPath $ExportData) {
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $PublicData) | Out-Null
  Copy-Item -LiteralPath $ExportData -Destination $PublicData -Force
  Write-Host "Synced exports\data.json -> public\data.json"
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
