# ==========================================================================
# E-Setu Local Development Server (PowerShell HTTP Listener)
# Zero external dependencies - Native Windows PowerShell
# ==========================================================================
param([int]$port = 5050)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host ""
    Write-Host "[E-SETU] Server is LIVE at $prefix" -ForegroundColor Green
    Write-Host "[E-SETU] Health Check: ${prefix}health" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
    Write-Host ""

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        $localPath = $request.Url.LocalPath

        # Health endpoints
        if ($localPath -eq "/health" -or $localPath -eq "/api/health") {
            $json = '{"status":"ok","service":"e-setu-platform","version":"2026.1.0","cpcb_compliance":"E-Waste Rules 2022"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # Status endpoint
        if ($localPath -eq "/api/status") {
            $json = '{"server":"online","timestamp":"' + (Get-Date -Format o) + '","platform":"E-Setu SIH 2026"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # CEIR verify mock endpoint
        if ($localPath -eq "/api/verify-ceir") {
            $imei = $request.QueryString["imei"]
            if ([string]::IsNullOrEmpty($imei)) { $imei = "IMEI-863920048192014" }
            $isClean = (-not $imei.Contains("STOLEN"))
            $status = if ($isClean) { "CLEAN_VERIFIED" } else { "BLACKLISTED_STOLEN" }
            $json = '{"imei":"' + $imei + '","ceir_status":"' + $status + '","safe_to_recycle":' + ($isClean.ToString().ToLower()) + ',"certificate_clause":"E-Waste Rules 2022 - Section 4(3) Safe Transport Exemption"}'
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # Dataset fallback rewrites (e.g. /api/materials -> /datasets/materials.json)
        if ($localPath.StartsWith("/api/")) {
            $datasetName = $localPath.Substring(5)
            $datasetFile = Join-Path $PSScriptRoot ("datasets\" + $datasetName + ".json")
            if (Test-Path $datasetFile -PathType Leaf) {
                $response.ContentType = "application/json; charset=utf-8"
                $bytes = [System.IO.File]::ReadAllBytes($datasetFile)
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }
        }

        if ($localPath -eq "/" -or [string]::IsNullOrEmpty($localPath)) {
            $localPath = "/index.html"
        }

        $parentFrontend = Join-Path (Split-Path $PSScriptRoot -Parent) "frontend"
        $baseDir = if (Test-Path $parentFrontend) { $parentFrontend } else { $PSScriptRoot }
        $filePath = Join-Path $baseDir ($localPath.TrimStart("/").Replace("/", "\"))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".mjs"  { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".webmanifest" { "application/manifest+json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found: ' + $localPath)
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} finally {
    if ($null -ne $listener -and $listener.IsListening) {
        $listener.Stop()
    }
}
