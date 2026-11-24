@echo off
setlocal
cd /d "%~dp0"

rem Renders resume\resume.html to public\resume.pdf with headless Chrome (or Edge).
set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%BROWSER%" (
  echo Chrome or Edge was not found.
  exit /b 1
)

"%BROWSER%" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 ^
  --print-to-pdf="%~dp0public\resume.pdf" "file:///%~dp0resume\resume.html"
echo Wrote public\resume.pdf
