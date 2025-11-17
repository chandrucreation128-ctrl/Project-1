#!/bin/bash

echo "========================================"
echo "CHANDRU CREATION - Android APK Builder"
echo "========================================"
echo ""

echo "[1/4] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js found!"

echo ""
echo "[2/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed!"

echo ""
echo "[3/4] Adding Android platform..."
npx cap add android
if [ $? -ne 0 ]; then
    echo "WARNING: Android platform may already exist, continuing..."
fi

echo ""
echo "[4/4] Syncing web assets to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to sync"
    exit 1
fi
echo "Sync complete!"

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Opening Android Studio..."
echo "2. Wait for Gradle sync to complete"
echo "3. Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "4. Find APK in: android/app/build/outputs/apk/debug/"
echo ""
echo "Opening Android Studio now..."
npx cap open android

