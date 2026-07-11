$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$resultsDir = Join-Path $root "allure-results"
$reportsRoot = Join-Path $root "allure-reports"

$today = Get-Date -Format "yyyyMMdd"
$dayDir = Join-Path $reportsRoot $today

if (-not (Test-Path $dayDir)) {
  New-Item -ItemType Directory -Path $dayDir -Force | Out-Null
}

$seq = 1
$dirs = Get-ChildItem -Path $dayDir -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "^\d+$" }
if ($dirs) {
  $maxSeq = ($dirs | ForEach-Object { [int]$_.Name } | Measure-Object -Maximum).Maximum
  $seq = $maxSeq + 1
}

$seq = [int]$seq
$seqText = $seq.ToString("000")
$outputDir = Join-Path $dayDir $seqText

if (-not (Test-Path $resultsDir)) {
  throw "allure-results not found. Please run npm test first."
}

$executor = @{
  name = "Gemmicro Tech Auto"
  type = "local"
  buildName = "$(Get-Date -Format 'yyyy/MM/dd') #$seqText"
  buildOrder = $seq
  reportName = "Allure Report $(Get-Date -Format 'yyyy/MM/dd') #$seqText"
}

$executor | ConvertTo-Json | Set-Content -Path (Join-Path $resultsDir "executor.json") -Encoding UTF8

npx.cmd allure generate $resultsDir --clean -o $outputDir
if ($LASTEXITCODE -ne 0) {
  throw "Allure generate failed with code $LASTEXITCODE"
}

$latestFile = Join-Path $root ".allure-latest"
Set-Content -Path $latestFile -Value $outputDir -Encoding UTF8

Write-Output "Allure report generated: $outputDir"
