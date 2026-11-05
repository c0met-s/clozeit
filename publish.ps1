$ErrorActionPreference = "Stop"

$BundledGit = "C:\Users\study session\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
$Git = if (Test-Path -LiteralPath $BundledGit) { $BundledGit } else { "git" }
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ExportData = Join-Path $Root "exports\data.json"
$PublicData = Join-Path $Root "public\data.json"
$Stamp = Get-Date -Format "yyMMdd-HHmm"

if (-not (Test-Path -LiteralPath $ExportData)) {
  throw "No exported study data was found at exports\data.json. Open Clozeit and use Publish JSON first."
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $PublicData) | Out-Null
Copy-Item -LiteralPath $ExportData -Destination $PublicData -Force
$exportedAt = (Get-Item -LiteralPath $ExportData).LastWriteTime.ToString("yyyy-MM-dd HH:mm")
Write-Host "Synced exports\data.json -> public\data.json (export file modified: $exportedAt)"

$publicChanges = & $Git -C $Root status --porcelain -- public
if ($publicChanges) {
  Write-Host "Public site files changed. Netlify will receive new site content."
} else {
  Write-Warning "No file in public changed. Netlify can deploy, but the website will look the same. Open Clozeit and use Publish JSON before running this publisher."
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
if ($publicChanges) {
  Write-Host "Published Clozeit changes. Netlify should update from the new public files shortly."
} else {
  Write-Host "Published local editor changes only. The shared website did not receive new study data."
}