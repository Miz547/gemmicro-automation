$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$latestFile = Join-Path $root ".allure-latest"

if (-not (Test-Path $latestFile)) {
  throw "No generated report found. Run: npm run allure:generate"
}

$reportDir = (Get-Content $latestFile -Raw).Trim()
if (-not $reportDir) {
  throw "Latest report path is empty. Run: npm run allure:generate"
}

if (-not (Test-Path $reportDir)) {
  throw "Report folder not found at: $reportDir"
}

# Open via HTTP server to avoid file:// routing/resource issues.
# Do not open Allure reports through file://.../index.html.
$hostName = "127.0.0.1"
$port = "8888"
$url = "http://${hostName}:${port}"

Write-Host "Opening latest Allure report:"
Write-Host $reportDir
Write-Host "URL: $url"

npx.cmd allure open $reportDir --host $hostName --port $port
