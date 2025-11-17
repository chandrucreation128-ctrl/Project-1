@echo off
echo ========================================
echo CHANDRU CREATION - Android APK Builder
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed!

echo.
echo [3/4] Adding Android platform...
call npx cap add android
if %errorlevel% neq 0 (
    echo WARNING: Android platform may already exist, continuing...
)

echo.
echo [4/4] Syncing web assets to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Failed to sync
    pause
    exit /b 1
)
echo Sync complete!

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Opening Android Studio...
echo 2. Wait for Gradle sync to complete
echo 3. Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 4. Find APK in: android\app\build\outputs\apk\debug\
echo.
echo Opening Android Studio now...
call npx cap open android

pause

