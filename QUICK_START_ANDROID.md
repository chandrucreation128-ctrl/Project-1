# Quick Start - Build Android APK

## Fastest Way to Build APK

### Step 1: Install Prerequisites

1. **Node.js** - Download from https://nodejs.org/ (Install LTS version)
2. **Android Studio** - Download from https://developer.android.com/studio
   - During installation, make sure to install Android SDK

### Step 2: Run Build Script

**Windows:**
- Double-click `build-apk.bat`
- Wait for it to complete
- Android Studio will open automatically

**Mac/Linux:**
```bash
chmod +x build-apk.sh
./build-apk.sh
```

### Step 3: Build APK in Android Studio

1. Wait for Gradle sync to complete (may take 5-10 minutes first time)
2. Click `Build` menu → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. Wait for build to complete
4. Click `locate` in the notification
5. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Install on Device

**Option 1: Direct Install**
- Transfer APK to your Android phone
- Enable "Install from Unknown Sources" in Settings
- Open APK file and install

**Option 2: Via USB (ADB)**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

**"Node.js not found"**
- Install Node.js from nodejs.org
- Restart command prompt/terminal

**"Gradle sync failed"**
- Check internet connection
- In Android Studio: File → Invalidate Caches / Restart

**"SDK not found"**
- Open Android Studio
- Tools → SDK Manager
- Install Android SDK Platform (latest)

## Need More Help?

See `BUILD_ANDROID_APK.md` for detailed instructions.

