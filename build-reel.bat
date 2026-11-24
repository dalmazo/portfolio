@echo off
setlocal
cd /d "%~dp0"
rem Builds reel\out\fortnite-reel.mp4 from reel\clips.csv. See reel\ROTEIRO.md.
rem Uses the py launcher (default Python has Pillow); falls back to python.
where py >nul 2>nul && (py reel\build_reel.py %*) || (python reel\build_reel.py %*)
pause
