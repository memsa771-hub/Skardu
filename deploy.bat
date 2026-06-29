@echo off
echo === Nestopia Hotel Skardu - Deploy Script ===

cd C:\Sites\nestopia

echo [1/3] Pulling latest from GitHub...
git pull origin main

echo [2/3] Installing dependencies...
npm install --omit=dev

echo [3/3] Building production bundle...
npm run build

echo === Build complete! Restart Caddy if needed ===
echo Run: caddy reload --config C:\Caddy\Caddyfile
