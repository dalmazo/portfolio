@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%PATH%;%ProgramFiles%\nodejs"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm were not found. Install Node.js LTS from https://nodejs.org/ and try again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing project dependencies...
  call npm ci
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
if not errorlevel 1 (
  echo Portfolio is already responding at http://localhost:3000
  start "" "http://localhost:3000"
  exit /b 0
)

start "Portfolio dev server" /D "%~dp0" cmd /k "npm run dev"
echo Waiting for the portfolio to start...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://localhost:3000'; for ($i = 0; $i -lt 60; $i++) { try { $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -ge 200) { Start-Process $url; exit 0 } } catch { }; Start-Sleep -Seconds 1 }; exit 1"
if errorlevel 1 (
  echo The server did not respond within 60 seconds. Check the Portfolio dev server window for errors.
  pause
  exit /b 1
)
echo Portfolio is ready at http://localhost:3000
