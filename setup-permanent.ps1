# Permanent Tunnel Setup Script
# This script guides you through creating a permanent Cloudflare tunnel.

$TunnelName = "portfolio-prototype"

Write-Host "--- Cloudflare Permanent Tunnel Setup ---" -ForegroundColor Cyan

# 1. Login
Write-Host "`nStep 1: Logging in..." -ForegroundColor Green
.\cloudflared.exe tunnel login

# 2. Create Tunnel
Write-Host "`nStep 2: Creating tunnel '$TunnelName'..." -ForegroundColor Green
$TunnelOutput = .\cloudflared.exe tunnel create $TunnelName
Write-Host $TunnelOutput

# Extract Tunnel ID (simplified)
if ($TunnelOutput -match "Created tunnel $TunnelName with id ([\w-]+)") {
    $TunnelID = $Matches[1]
    Write-Host "Tunnel ID: $TunnelID" -ForegroundColor Yellow
    
    # 3. Create Config
    $ConfigContent = @"
tunnel: $TunnelID
credentials-file: $($HOME)\.cloudflared\$TunnelID.json

ingress:
  - hostname: prototype.yourdomain.com
    service: http://localhost:5173
  - service: http_status:404
"@
    $ConfigContent | Out-File -FilePath "config.yml" -Encoding utf8
    Write-Host "`nStep 3: created 'config.yml'. Please edit the 'hostname' in it." -ForegroundColor Yellow
    
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "1. Update 'hostname' in config.yml with your Cloudflare-managed domain."
    Write-Host "2. Run: .\cloudflared.exe tunnel route dns $TunnelName <your-domain>"
    Write-Host "3. Start: .\cloudflared.exe tunnel run $TunnelName"
} else {
    Write-Host "Could not automatically detect Tunnel ID. Please follow the manual steps in the guide." -ForegroundColor Red
}
