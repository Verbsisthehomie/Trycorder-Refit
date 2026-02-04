# Trycorder LCARS - APK Build & F-Droid Submission Guide

## Overview

This guide explains how to build your Trycorder LCARS web app into a native Android APK and submit it to F-Droid. The project uses **Capacitor** to wrap the web app as a native Android application.

## Prerequisites

### System Requirements
- **Android Studio** (or Android SDK command-line tools)
- **Java Development Kit (JDK)** 11 or higher
- **Gradle** (usually included with Android Studio)
- **Git** (for version control)

### Installation

#### macOS (using Homebrew)
```bash
brew install android-studio openjdk@11
```

#### Ubuntu/Debian
```bash
sudo apt-get install android-studio openjdk-11-jdk
```

#### Windows
- Download Android Studio from https://developer.android.com/studio
- Download JDK 11+ from https://adoptopenjdk.net/

## Project Structure

```
trycorder-lcars/
├── android/                    # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── assets/
│   │   │       └── public/     # Web assets (auto-copied)
│   │   └── build.gradle.kts
│   └── build.gradle.kts
├── dist/                       # Built web app (production build)
├── capacitor.config.ts         # Capacitor configuration
└── package.json
```

## Building the APK

### Step 1: Build the Web App

```bash
cd /home/ubuntu/trycorder-lcars
pnpm build
```

This creates the production build in the `dist/` directory.

### Step 2: Copy Web Assets to Android

```bash
npx cap copy android
```

This copies the built web app to `android/app/src/main/assets/public/`.

### Step 3: Build the APK

#### Option A: Using Android Studio (GUI - Recommended for beginners)

1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to `/home/ubuntu/trycorder-lcars/android`
4. Wait for Gradle sync to complete
5. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
6. APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Using Command Line (Faster)

```bash
cd /home/ubuntu/trycorder-lcars/android
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Build Release APK (for F-Droid)

For F-Droid submission, you need a **release APK**:

```bash
cd /home/ubuntu/trycorder-lcars/android
./gradlew assembleRelease
```

This creates: `app/build/outputs/apk/release/app-release-unsigned.apk`

## Signing the APK

F-Droid requires APKs to be signed with a release key. Follow these steps:

### Step 1: Create a Keystore

```bash
keytool -genkey -v -keystore trycorder-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias trycorder-key
```

You'll be prompted for:
- Password (remember this!)
- First and Last Name
- Organization Unit
- Organization
- City
- State
- Country Code

### Step 2: Sign the APK

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore trycorder-release.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  trycorder-key
```

### Step 3: Verify the Signature

```bash
jarsigner -verify -verbose -certs \
  app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 4: Align the APK (Optional but Recommended)

```bash
zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk \
  app/build/outputs/apk/release/app-release.apk
```

## Testing the APK

### On Android Emulator

1. Open Android Studio
2. Create or start an Android Virtual Device (AVD)
3. Drag and drop the APK onto the emulator, or:

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### On Physical Device

1. Enable Developer Mode (tap Build Number 7 times in Settings)
2. Enable USB Debugging
3. Connect device via USB
4. Run:

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

## F-Droid Submission

### Requirements

F-Droid has strict requirements for app submission:

1. **Open Source License** - Choose one:
   - GPL-3.0
   - MIT
   - Apache-2.0
   - AGPL-3.0
   - Other OSI-approved license

2. **Public Source Code** - Your GitHub repository (already done!)

3. **Build Reproducibly** - F-Droid must be able to rebuild your APK from source

4. **No Proprietary Dependencies** - Only use open-source libraries

5. **Privacy-Friendly** - No tracking, analytics, or ads

6. **Metadata Files** - Create F-Droid metadata

### Step 1: Add License to Project

Create `LICENSE` file in project root:

```bash
# For GPL-3.0
curl https://www.gnu.org/licenses/gpl-3.0.txt > LICENSE
```

Add to `package.json`:
```json
{
  "license": "GPL-3.0-or-later",
  "repository": "https://github.com/Verbsisthehomie/Trycorder-Refit"
}
```

### Step 2: Create F-Droid Metadata

Create `fdroid/metadata/com.trycorder.lcars.yml`:

```yaml
Categories:
  - System
  - Utilities

License: GPL-3.0-or-later

SourceCode: https://github.com/Verbsisthehomie/Trycorder-Refit
IssueTracker: https://github.com/Verbsisthehomie/Trycorder-Refit/issues

Summary: Star Trek LCARS Trycorder System

Description: |
  A fully-featured Star Trek LCARS-themed Trycorder application featuring:
  
  • Authentic LCARS design with Okuda font
  • Real-time environmental sensors (temperature, pressure, light, magnetic field)
  • Server management dashboard with metrics monitoring
  • Voice command recognition
  • Star Trek sound effects and audio system
  • Responsive interface for all screen sizes

Builds:
  - versionName: '1.0.0'
    versionCode: 1
    commit: c71c1ca7
    gradle:
      - yes
    prebuild:
      - npm install
      - npm run build
    build: ./gradlew assembleRelease
```

### Step 3: Update AndroidManifest.xml

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.trycorder.lcars">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
```

### Step 4: Submit to F-Droid

1. Fork the **F-Droid Data** repository: https://gitlab.com/fdroid/fdroiddata
2. Add your app metadata to `metadata/com.trycorder.lcars.yml`
3. Create a Merge Request with your changes
4. F-Droid maintainers will review and test your submission
5. Once approved, your app appears in the F-Droid store!

## Troubleshooting

### Build Fails: "SDK not found"
```bash
# Set ANDROID_SDK_ROOT
export ANDROID_SDK_ROOT=~/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/tools:$ANDROID_SDK_ROOT/platform-tools
```

### APK Installation Fails: "App not installed"
- Ensure device/emulator has enough storage
- Check that the APK is signed correctly
- Verify Android version compatibility (minimum API 21)

### Capacitor Issues
```bash
# Resync Capacitor
npx cap sync android

# Update Capacitor
pnpm update @capacitor/core @capacitor/android
```

### Gradle Build Fails
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleRelease
```

## Continuous Integration

To automate APK builds, add GitHub Actions workflow:

Create `.github/workflows/build-apk.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build web app
        run: pnpm build
      
      - name: Copy to Android
        run: npx cap copy android
      
      - name: Build APK
        run: cd android && ./gradlew assembleDebug
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: trycorder-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

## Resources

- **Capacitor Documentation**: https://capacitorjs.com/docs
- **Android Developer Guide**: https://developer.android.com/docs
- **F-Droid Inclusion Guide**: https://f-droid.org/en/docs/Inclusion_How-To/
- **Gradle Documentation**: https://gradle.org/documentation/

## Next Steps

1. Build and test the APK on your device
2. Create app icons and graphics
3. Write a detailed app description
4. Submit to F-Droid
5. Monitor for feedback and updates

Good luck! 🚀
