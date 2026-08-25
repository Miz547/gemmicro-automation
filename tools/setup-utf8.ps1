$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

[Console]::InputEncoding = $utf8NoBom
[Console]::OutputEncoding = $utf8NoBom
$OutputEncoding = $utf8NoBom

chcp 65001 | Out-Null

Write-Host "PowerShell console encoding is now UTF-8 for this session."
Write-Host "Current code page:"
cmd /c chcp
