@echo off
setlocal
title Majesty FX - Launcher

echo ==========================================
echo   Majesty FX - install and run
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Install the LTS version from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Reinstall Node.js from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/2] Installing dependencies, this takes a minute the first time...
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
) else (
  echo [1/2] Dependencies already installed. Skipping install.
)

echo.
echo [2/2] Starting dev server at http://localhost:5173
echo Press Ctrl+C in this window to stop.
echo.
start "" http://localhost:5173
call npm run dev
pause
