$ErrorActionPreference = "Stop"

$Git = "C:\Users\study session\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Test-Path -LiteralPath $Git)) {
  throw "Git executable was not found at: $Git"
}

$name = Read-Host "Git user name"
$email = Read-Host "Git email"
$remote = Read-Host "GitHub repo URL, example https://github.com/YOURNAME/clozeit.git"

& $Git -C $Root config user.name $name
& $Git -C $Root config user.email $email

$existingRemote = (& $Git -C $Root remote 2>$null) -contains "origin"
if ($existingRemote) {
  & $Git -C $Root remote set-url origin $remote
} else {
  & $Git -C $Root remote add origin $remote
}

& $Git -C $Root add .
& $Git -C $Root commit -m "Set up Clozeit JSON publishing"
& $Git -C $Root push -u origin main

Write-Host ""
Write-Host "Done. Clozeit is pushed to GitHub."
