# PowerShell runner to launch both Frontend and ML Backend
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  HeatGuard AI - Starting Frontend and ML Services" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:ml"

Write-Host "Services started in separate PowerShell windows:" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  - ML API:   http://localhost:8000/docs" -ForegroundColor Yellow
