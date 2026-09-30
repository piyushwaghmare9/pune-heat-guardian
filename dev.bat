@echo off
echo ========================================================
echo   HeatGuard AI - Starting Frontend and ML Services
echo ========================================================
start "HeatGuard Next.js (Port 3000)" cmd /k "npm run dev"
start "HeatGuard ML Backend (Port 8000)" cmd /k "npm run dev:ml"
echo Services started in separate terminal windows.
echo Frontend: http://localhost:3000
echo ML Docs:  http://localhost:8000/docs
