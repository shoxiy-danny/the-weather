# The Weather - Startup Script (PowerShell)
# Usage: .\start.ps1

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  The Weather Startup Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Check dependencies
Write-Host "[Check] Checking dependencies..." -ForegroundColor Blue

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "[Info] Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "node_modules")) {
    Write-Host "[Info] Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[OK] Dependencies ready" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "[Start] Backend service (port 3001)..." -ForegroundColor Blue
Set-Location backend
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow
Set-Location ..

# Start frontend
Write-Host "[Start] Frontend service (port 5173)..." -ForegroundColor Blue
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow

Write-Host "[OK] Services started" -ForegroundColor Green
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  All Services Running!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend:  http://localhost:3001"
Write-Host "  Domain:   https://adventure-practitioners-reached-lounge.trycloudflare.com"
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Wait for Ctrl+C
try {
    while ($true) { Start-Sleep -Seconds 1 }
}
finally {
    Write-Host ""
    Write-Host "[Stop] Stopping services..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "vite" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "[Done] All services stopped" -ForegroundColor Green
}
