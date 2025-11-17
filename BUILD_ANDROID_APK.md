# Build Android APK - CHANDRU CREATION Billing App

This guide will help you convert the web application into an Android APK file.

## Prerequisites

1. **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **Java JDK** (v11 or higher) - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
3. **Android Studio** - Download from [developer.android.com/studio](https://developer.android.com/studio)
4. **Android SDK** - Installed via Android Studio

## Step 1: Install Node.js Dependencies

Open terminal/command prompt in the project folder and run:

```bash
npm install
```

This will install Capacitor and required dependencies.

## Step 2: Install Capacitor CLI (if not already installed)

```bash
npm install -g @capacitor/cli
```

## Step 3: Initialize Capacitor Android Project

```bash
npx cap add android
```

This will create the `android` folder with the Android project.

## Step 4: Sync Web Assets

```bash
npx cap sync android
```

This copies your web files to the Android project.

## Step 5: Open in Android Studio

```bash
npx cap open android
```

Or manually open Android Studio and select: `File > Open` > Navigate to the `android` folder.

## Step 6: Configure Android Project

### In Android Studio:

1. **Wait for Gradle Sync** - Let Android Studio finish syncing (may take a few minutes)

2. **Check Build Variants**:
   - Click on `Build Variants` tab (usually at bottom)
   - Select `debug` or `release` variant

3. **Configure Signing (for Release APK)**:
   - Go to `Build > Generate Signed Bundle / APK`
   - Select `APK`
   - Create a new keystore or use existing
   - Fill in the required information
   - Select `release` build variant
   - Click `Finish`

## Step 7: Build APK

### Option A: Build Debug APK (for testing)

1. In Android Studio: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Wait for build to complete
3. Click `locate` in the notification to find the APK
4. Location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Build Release APK (for distribution)

1. In Android Studio: `Build > Generate Signed Bundle / APK`
2. Follow the signing wizard
3. APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Option C: Build via Command Line

```bash
cd android
./gradlew assembleDebug
```

For release:
```bash
./gradlew assembleRelease
```

## Step 8: Install APK on Device

### Method 1: Direct Install
- Transfer the APK file to your Android device
- Enable "Install from Unknown Sources" in device settings
- Open the APK file and install

### Method 2: Via ADB
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### Issue: "Command not found: npx"
**Solution**: Make sure Node.js is installed and added to PATH

### Issue: "Gradle sync failed"
**Solution**: 
- Check internet connection
- In Android Studio: `File > Invalidate Caches / Restart`
- Update Gradle if needed

### Issue: "SDK not found"
**Solution**: 
- Open Android Studio
- Go to `Tools > SDK Manager`
- Install required SDK platforms and tools

### Issue: "Build failed"
**Solution**:
- Check Android Studio's Build output for specific errors
- Ensure all dependencies are installed
- Try: `File > Sync Project with Gradle Files`

## Quick Build Script

Create a file `build-apk.bat` (Windows) or `build-apk.sh` (Mac/Linux):

**Windows (build-apk.bat):**
```batch
@echo off
echo Installing dependencies...
call npm install
echo Syncing Capacitor...
call npx cap sync android
echo Opening Android Studio...
call npx cap open android
pause
```

**Mac/Linux (build-apk.sh):**
```bash
#!/bin/bash
echo "Installing dependencies..."
npm install
echo "Syncing Capacitor..."
npx cap sync android
echo "Opening Android Studio..."
npx cap open android
```

## App Configuration

To customize the app, edit `capacitor.config.json`:

- `appId`: Your app's unique identifier
- `appName`: App name shown on device
- `webDir`: Directory containing web files (currently ".")

## Permissions

The app may need these permissions (already configured):
- Internet access (for CDN libraries)
- Storage (for localStorage)

## Testing

1. Build debug APK
2. Install on Android device
3. Test all features:
   - Login/Register
   - Add products
   - Add to cart
   - Generate invoice
   - View reports

## Distribution

For Google Play Store:
1. Build signed release APK or AAB (Android App Bundle)
2. Create developer account on Google Play Console
3. Upload APK/AAB
4. Fill in store listing details
5. Submit for review

## Notes

- The app uses localStorage, so data is stored locally on device
- CDN libraries (jsPDF) require internet connection
- For offline use, consider bundling libraries locally

## Support

If you encounter issues:
1. Check Capacitor documentation: https://capacitorjs.com/docs
2. Check Android Studio build logs
3. Verify all prerequisites are installed correctly

