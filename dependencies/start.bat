@echo off

:: Bot configuration
set NODE_ENV=production
set DATABASE_URL=file:./database.sqlite
:: End bot configuration

index.exe --ignore-warnings

echo Please restart the application.

timeout /t 1 >nul & pause>nul
