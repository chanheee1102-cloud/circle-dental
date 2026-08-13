# 실제 사이트 이미지를 내려받는다.
# 병원이 자기 홈페이지에 올린 자산을, 같은 병원의 새 홈페이지로 옮기는 목적이다.
$src = "C:\Users\FORYOUCOM\AppData\Local\Temp\claude\cd-assets\assets.txt"
$dst = "C:\Users\FORYOUCOM\Desktop\circle-dental\public\img"
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
$urls = Get-Content $src | Where-Object { $_ -match '^https?://' } | Select-Object -Unique

$ok = 0; $fail = 0; $manifest = @()
foreach ($u in $urls) {
  try {
    $clean = ($u -split '\?')[0]
    $ext = [System.IO.Path]::GetExtension($clean)
    if (-not $ext) { $ext = ".jpg" }
    # imweb CDN 은 파일명이 해시라 그대로 쓰면 충돌이 없다. 경로 일부를 붙여 유일성 보강.
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($clean)
    $dir  = ($clean -split '/')[-2]
    $name = "$dir`_$stem$ext" -replace '[^A-Za-z0-9._-]', ''
    $out  = Join-Path $dst $name
    if (Test-Path $out) { $ok++; continue }
    Invoke-WebRequest -Uri $u -OutFile $out -UserAgent $ua -TimeoutSec 45 -ErrorAction Stop
    $size = (Get-Item $out).Length
    if ($size -lt 300) { Remove-Item $out -Force; $fail++; continue }
    $manifest += [PSCustomObject]@{ file = $name; bytes = $size; src = $u }
    $ok++
  } catch { $fail++ }
}

$manifest | Sort-Object -Property bytes -Descending |
  Export-Csv -Path "C:\Users\FORYOUCOM\AppData\Local\Temp\claude\cd-assets\manifest.csv" -NoTypeInformation -Encoding UTF8

Write-Output "DOWNLOADED=$ok FAILED=$fail"
Write-Output "--- 큰 이미지 상위 20 (히어로/배경 후보) ---"
$manifest | Sort-Object -Property bytes -Descending | Select-Object -First 20 |
  ForEach-Object { "{0,9:N0}  {1}" -f $_.bytes, $_.file }
