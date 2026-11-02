# PowerShell Launcher for DocuIntellect AI
$env:Path += ";C:\Users\boomi\AppData\Local\Programs\nodejs"
$projectRoot = $PSScriptRoot

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "      DOCUINTELLECT AI — DOCUMENT INTELLIGENCE & REPORT GENERATOR      " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan

Write-Host "`n[+] Starting Flask Backend on Port 5000..." -ForegroundColor Green
$backendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; python run.py" -PassThru

Start-Sleep -Seconds 3

Write-Host "[+] Starting Vite Development Server on Port 5173..." -ForegroundColor Green
$frontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path += ';C:\Users\boomi\AppData\Local\Programs\nodejs'; cd '$projectRoot\frontend'; npm run dev" -PassThru

Start-Sleep -Seconds 2

Write-Host "`n[+] Opening browser at http://127.0.0.1:5173" -ForegroundColor Green
Start-Process "http://127.0.0.1:5173"

Write-Host "`nServers are running!" -ForegroundColor Cyan
Write-Host "Frontend: http://127.0.0.1:5173" -ForegroundColor White
Write-Host "Backend:  http://127.0.0.1:5000" -ForegroundColor White
