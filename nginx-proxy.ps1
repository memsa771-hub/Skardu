# ============================================================
#  Nestopia - Add nginx reverse proxy for nestopia-hotel-skardu.com
#  Run as Administrator on the Windows Server
# ============================================================
#  Usage:
#  Set-ExecutionPolicy Bypass -Scope Process -Force; iex (iwr 'https://raw.githubusercontent.com/memsa771-hub/Skardu/main/nginx-proxy.ps1').Content
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference    = "SilentlyContinue"
$DOMAIN = "nestopia-hotel-skardu.com"
$UPSTREAM = "http://127.0.0.1:8070"

function Log($msg) { Write-Host "[NGINX] $msg" -ForegroundColor Cyan }
function OK($msg)  { Write-Host "[OK]    $msg" -ForegroundColor Green }
function Die($msg) { Write-Host "[FAIL]  $msg" -ForegroundColor Red; exit 1 }

# ----------------------------------------------------------
# 1. Find nginx installation path
# ----------------------------------------------------------
$nginxPaths = @(
    "C:\nginx",
    "C:\Program Files\nginx",
    "C:\tools\nginx"
)
$nginxDir = $null
foreach ($p in $nginxPaths) {
    if (Test-Path "$p\nginx.exe") { $nginxDir = $p; break }
}
if (-not $nginxDir) {
    # Try finding via process
    $proc = Get-Process -Name nginx -ErrorAction SilentlyContinue
    if ($proc) {
        $nginxDir = Split-Path $proc[0].Path
    }
}
if (-not $nginxDir) {
    Die "Cannot find nginx.exe. Check common paths: C:\nginx, C:\Program Files\nginx"
}
Log "Found nginx at: $nginxDir"
$nginxConf = "$nginxDir\conf\nginx.conf"
$nginxSites = "$nginxDir\conf\sites"

# ----------------------------------------------------------
# 2. Create sites directory if not exists
# ----------------------------------------------------------
New-Item -ItemType Directory -Force -Path $nginxSites | Out-Null

# ----------------------------------------------------------
# 3. Ensure nginx.conf includes the sites folder
# ----------------------------------------------------------
$mainConf = Get-Content $nginxConf -Raw
$includeDir = "include sites/*.conf;"
if ($mainConf -notlike "*$includeDir*") {
    Log "Adding 'include sites/*.conf' to nginx.conf..."
    # Insert before the last closing brace of the http block
    $mainConf = $mainConf -replace '(\s*)(# *include.*?;?\s*)(}[\s]*$)', "`$1$includeDir`n`$3"
    if ($mainConf -notlike "*$includeDir*") {
        # Fallback: insert before the final closing brace
        $mainConf = $mainConf -replace '(}[\s]*)$', "    $includeDir`n}"
    }
    [System.IO.File]::WriteAllText($nginxConf, $mainConf, [System.Text.Encoding]::UTF8)
    OK "Include directive added to nginx.conf"
} else {
    OK "Include directive already present in nginx.conf"
}

# ----------------------------------------------------------
# 4. Write the Nestopia proxy config (HTTP first)
# ----------------------------------------------------------
Log "Writing $nginxSites\nestopia.conf ..."
$confContent = @"
# Nestopia Hotel Skardu — reverse proxy to Caddy on port 8070
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Let's Encrypt / certbot webroot challenge path
    location /.well-known/acme-challenge/ {
        root C:/certbot/webroot;
    }

    location / {
        proxy_pass          $UPSTREAM;
        proxy_http_version  1.1;
        proxy_set_header    Host              `$host;
        proxy_set_header    X-Real-IP         `$remote_addr;
        proxy_set_header    X-Forwarded-For   `$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto `$scheme;
        proxy_read_timeout  60s;
    }
}
"@
[System.IO.File]::WriteAllText("$nginxSites\nestopia.conf", $confContent, [System.Text.Encoding]::UTF8)
OK "nestopia.conf written"

# ----------------------------------------------------------
# 5. Test nginx config
# ----------------------------------------------------------
Log "Testing nginx configuration..."
$test = & "$nginxDir\nginx.exe" -p "$nginxDir" -t 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host $test
    Die "nginx config test failed — check the output above"
}
OK "nginx config OK"

# ----------------------------------------------------------
# 6. Reload nginx (zero-downtime)
# ----------------------------------------------------------
Log "Reloading nginx..."
& "$nginxDir\nginx.exe" -p "$nginxDir" -s reload
OK "nginx reloaded — site live on http://$DOMAIN"

# ----------------------------------------------------------
# 7. Get SSL cert with certbot (win-acme/certbot)
# ----------------------------------------------------------
Log "Checking for certbot..."
if (-not (Get-Command certbot -ErrorAction SilentlyContinue)) {
    Log "Installing certbot via Chocolatey..."
    choco install certbot --yes --no-progress 2>&1 | Out-Null
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
                [System.Environment]::GetEnvironmentVariable("Path","User")
}

# Create webroot directory for ACME challenge
New-Item -ItemType Directory -Force -Path "C:\certbot\webroot" | Out-Null

Log "Requesting SSL certificate from Let's Encrypt..."
Log "(DNS must already point $DOMAIN -> this server)"

certbot certonly `
    --webroot `
    --webroot-path "C:\certbot\webroot" `
    --non-interactive `
    --agree-tos `
    --email "admin@$DOMAIN" `
    --domains "$DOMAIN,www.$DOMAIN"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[WARN] certbot failed — DNS may not be propagated yet." -ForegroundColor Yellow
    Write-Host "       Site is running on HTTP for now." -ForegroundColor Yellow
    Write-Host "       Once DNS propagates, re-run: certbot certonly --webroot ..." -ForegroundColor Yellow
} else {
    OK "SSL certificate obtained!"

    # ----------------------------------------------------------
    # 8. Update config with HTTPS
    # ----------------------------------------------------------
    Log "Updating nginx config for HTTPS..."
    $certDir = "C:/certbot/live/$DOMAIN"
    $httpsConf = @"
# Nestopia Hotel Skardu — HTTPS + reverse proxy to Caddy on port 8070
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    # Redirect all HTTP -> HTTPS
    return 301 https://`$host`$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate     $certDir/fullchain.pem;
    ssl_certificate_key $certDir/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_session_cache   shared:SSL:10m;

    location / {
        proxy_pass          $UPSTREAM;
        proxy_http_version  1.1;
        proxy_set_header    Host              `$host;
        proxy_set_header    X-Real-IP         `$remote_addr;
        proxy_set_header    X-Forwarded-For   `$proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto https;
        proxy_read_timeout  60s;
    }
}
"@
    [System.IO.File]::WriteAllText("$nginxSites\nestopia.conf", $httpsConf, [System.Text.Encoding]::UTF8)
    & "$nginxDir\nginx.exe" -p "$nginxDir" -s reload
    OK "HTTPS live at https://$DOMAIN"
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host " DONE" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host " Caddy   : http://127.0.0.1:8070 (internal only)" -ForegroundColor White
Write-Host " nginx   : proxies nestopia-hotel-skardu.com -> :8070" -ForegroundColor White
Write-Host " Cert    : C:\certbot\live\$DOMAIN\" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Yellow
