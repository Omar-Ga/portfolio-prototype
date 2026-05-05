# Quick Tunnel Script
# Starts a temporary Cloudflare tunnel for the local dev server (port 5173)

Write-Host "Starting Cloudflare Quick Tunnel..." -ForegroundColor Cyan
Write-Host "Make sure your dev server is running (npm run dev)" -ForegroundColor Yellow

.\cloudflared.exe tunnel --url http://localhost:5173
