# ============================================================
#  Nestopia Hotel Skardu - Automated Windows Server Setup
#  Run this as Administrator on the Windows Server
# ============================================================
#  Usage (one command from ANY Windows Server PowerShell Admin):
#  Set-ExecutionPolicy Bypass -Scope Process -Force; iex (iwr 'https://raw.githubusercontent.com/memsa771-hub/Skardu/main/server-setup.ps1').Content
# ============================================================

$ErrorActionPreference = "Stop"
$ProgressPreference    = "SilentlyContinue"

function Log($msg)        { Write-Host "[SETUP] $msg" -ForegroundColor Cyan }
function OK($msg)         { Write-Host "[OK]    $msg" -ForegroundColor Green }
function Die($msg)        { Write-Host "[FAIL]  $msg" -ForegroundColor Red; exit 1 }
function Tail-Output      { process { Write-Host $_ -ForegroundColor DarkGray } }

Log "Starting Nestopia Hotel Skardu server setup..."

# ----------------------------------------------------------
# 1. Install Chocolatey (if not already installed)
# ----------------------------------------------------------
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Log "Installing Chocolatey..."
    [System.Net.ServicePointManager]::SecurityProtocol = `
        [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
                [System.Environment]::GetEnvironmentVariable("Path","User")
    OK "Chocolatey installed"
} else {
    OK "Chocolatey already present"
}

# ----------------------------------------------------------
# 2. Install Git and Node.js LTS
# ----------------------------------------------------------
Log "Installing Git..."
choco install git --yes --no-progress 2>&1 | Out-Null
OK "Git installed"

Log "Installing Node.js LTS..."
choco install nodejs-lts --yes --no-progress 2>&1 | Out-Null
OK "Node.js installed"

# Refresh PATH so git/node are available immediately
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
            [System.Environment]::GetEnvironmentVariable("Path","User")

# ----------------------------------------------------------
# 3. Clone repo and build
# ----------------------------------------------------------
Log "Creating site directory..."
New-Item -ItemType Directory -Force -Path "C:\Sites" | Out-Null

if (Test-Path "C:\Sites\nestopia\.git") {
    Log "Repo already cloned — pulling latest..."
    Set-Location "C:\Sites\nestopia"
    & git pull origin main
} else {
    Log "Cloning repository from GitHub..."
    Set-Location "C:\Sites"
    & git clone https://github.com/memsa771-hub/Skardu.git nestopia
    Set-Location "C:\Sites\nestopia"
}
OK "Repository ready"

Log "Installing npm dependencies (exact versions from lock file)..."
& npm ci 2>&1 | Tail-Output
OK "Dependencies installed"

Log "Building production bundle..."
& npm run build 2>&1 | Tail-Output
if (-not (Test-Path "C:\Sites\nestopia\dist\index.html")) {
    Die "Build failed — dist/index.html not found"
}
OK "Production build complete at C:\Sites\nestopia\dist\"

# ----------------------------------------------------------
# 4. Download Caddy
# ----------------------------------------------------------
Log "Creating Caddy directory..."
New-Item -ItemType Directory -Force -Path "C:\Caddy" | Out-Null

if (-not (Test-Path "C:\Caddy\caddy.exe")) {
    Log "Downloading Caddy (latest stable for Windows amd64)..."
    Invoke-WebRequest `
        -Uri "https://caddyserver.com/api/download?os=windows&arch=amd64" `
        -OutFile "C:\Caddy\caddy.exe"
    OK "Caddy downloaded"
} else {
    OK "Caddy already present"
}

# ----------------------------------------------------------
# 5. Copy Caddyfile from repo
# ----------------------------------------------------------
Log "Copying Caddyfile..."
Copy-Item -Force "C:\Sites\nestopia\Caddyfile" "C:\Caddy\Caddyfile"
OK "Caddyfile in place at C:\Caddy\Caddyfile"

# ----------------------------------------------------------
# 6. Add Caddy to system PATH
# ----------------------------------------------------------
$machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
if ($machinePath -notlike "*C:\Caddy*") {
    [System.Environment]::SetEnvironmentVariable("Path","$machinePath;C:\Caddy","Machine")
}
$env:Path += ";C:\Caddy"
OK "Caddy added to PATH"

# ----------------------------------------------------------
# 7. Open firewall ports 80 and 443
# ----------------------------------------------------------
Log "Opening firewall port 8070..."
netsh advfirewall firewall add rule name="Nestopia Hotel 8070" protocol=TCP dir=in localport=8070 action=allow | Out-Null
OK "Port 8070 open"

# ----------------------------------------------------------
# 8. Install and start Caddy as Windows Service
# ----------------------------------------------------------
Set-Location "C:\Caddy"

$svc = Get-Service -Name "caddy" -ErrorAction SilentlyContinue
if ($svc) {
    Log "Caddy service exists — reloading config..."
    & .\caddy.exe reload --config C:\Caddy\Caddyfile
} else {
    Log "Installing Caddy as Windows Service..."
    & .\caddy.exe service install --config C:\Caddy\Caddyfile
    Start-Service caddy
}

OK "Caddy service is running"

# ----------------------------------------------------------
# Done!
# ----------------------------------------------------------
Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host " SETUP COMPLETE!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host " Site files : C:\Sites\nestopia\dist\" -ForegroundColor White
Write-Host " Caddyfile  : C:\Caddy\Caddyfile" -ForegroundColor White
Write-Host " Live URL   : http://45.156.87.122:8070  (direct IP)" -ForegroundColor White
Write-Host " Domain     : configure reverse proxy in your existing server to" -ForegroundColor White
Write-Host "              forward nestopia-hotel-skardu.com -> http://127.0.0.1:8070" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Yellow
