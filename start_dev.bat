@echo off
title DocuIntellect AI (Development Mode)
cd /d "%~dp0"

echo ======================================================================
echo       DOCUINTELLECT AI - DEVELOPMENT SERVER LAUNCHER
echo ======================================================================
echo.

set "PATH=C:\Users\boomi\AppData\Local\Programs\Python\Python314;C:\Users\boomi\AppData\Local\Programs\Python\Python314\Scripts;C:\Users\boomi\AppData\Local\Programs\nodejs;%PATH%"

echo [+] Starting Flask API Backend on Port 5000...
start "DocuIntellect Backend (Port 5000)" cmd /k "cd /d "%~dp0" && python run.py"

echo Waiting for backend API to initialize...
timeout /t 3 /nobreak > nul

echo [+] Starting Vite Dev Server on Port 5173...
cd /d "%~dp0frontend"
start "DocuIntellect Vite Frontend (Port 5173)" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul
start http://127.0.0.1:5173
