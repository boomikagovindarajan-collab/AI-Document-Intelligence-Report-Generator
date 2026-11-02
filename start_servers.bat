@echo off
title DocuIntellect AI Launcher
cd /d "%~dp0"

echo ======================================================================
echo       DOCUINTELLECT AI - DOCUMENT INTELLIGENCE & REPORT GENERATOR
echo       KPR Institute of Engineering and Technology, Coimbatore
echo ======================================================================
echo.

set "PATH=C:\Users\boomi\AppData\Local\Programs\Python\Python314;C:\Users\boomi\AppData\Local\Programs\Python\Python314\Scripts;C:\Users\boomi\AppData\Local\Programs\nodejs;%PATH%"

echo [+] Starting DocuIntellect AI Server...
start "DocuIntellect AI Server" cmd /k "cd /d "%~dp0" && python run.py"

echo.
echo Server is launching! Your default web browser will open automatically.
echo If it does not open, visit:
echo    http://127.0.0.1:5000
echo.
timeout /t 3 /nobreak > nul
start http://127.0.0.1:5000
