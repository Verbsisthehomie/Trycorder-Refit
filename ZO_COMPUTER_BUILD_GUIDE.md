# Trycorder LCARS - zo.computer APK Build Guide

## Complete Step-by-Step Instructions

This guide walks you through building your Trycorder LCARS APK directly on your zo.computer cloud server. You can copy and paste these commands directly into your terminal.

---

## Step 1: SSH into Your zo.computer Server

Open a terminal on any machine with SSH access (your Chromebook, Galaxy Tab with SSH app, or another computer) and run:

```bash
ssh -i /path/to/your/private/key -p 31076 root@p1.zo.computer
```

Or if you have the key configured in your SSH config:

```bash
ssh zo-computer
```

---

## Step 2: Check Your Server OS

Once connected, verify what operating system you're running:

```bash
uname -a
cat /etc/os-release
```

This will show you if it's Ubuntu, Debian, CentOS, etc.

---

## Step 3: Update System Packages

```bash
apt-get update -y
apt-get upgrade -y
```

---

## Step 4: Install Java Development Kit (Required)

```bash
apt-get install -y openjdk-11-jdk
java -version
```

You should see output like: `openjdk version "11.0.x"`

---

## Step 5: Install Required Build Tools

```bash
apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev
```

---

## Step 6: Install Node.js and npm

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
node --version
npm --version
```

---

## Step 7: Create Android SDK Directory

```bash
mkdir -p ~/Android/Sdk
cd ~/Android/Sdk
```

---

## Step 8: Download Android SDK Command-Line Tools

```bash
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip
rm commandlinetools-linux-9477386_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
```

---

## Step 9: Set Environment Variables

Add these to your shell profile so they're always available:

```bash
cat >> ~/.bashrc << 'EOF'

# Android SDK Configuration
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
EOF

source ~/.bashrc
```

---

## Step 10: Accept Android Licenses and Install Platforms

```bash
yes | sdkmanager --licenses
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
sdkmanager "ndk;26.1.10909125"
```

---

## Step 11: Clone Your Trycorder Repository

```bash
cd ~
git clone https://github.com/Verbsisthehomie/Trycorder-Refit.git
cd Trycorder-Refit
```

---

## Step 12: Install Project Dependencies

```bash
npm install
```

This may take a few minutes. Grab some coffee! ☕

---

## Step 13: Build the Web Application

```bash
npm run build
```

This creates the production build in the `dist/` directory.

---

## Step 14: Copy Web Assets to Android

```bash
npx cap copy android
```

---

## Step 15: Build Debug APK

This is the easiest way to test. The APK will be unsigned but works for testing:

```bash
cd android
./gradlew assembleDebug
```

This takes 5-10 minutes. Grab another coffee! ☕

Once complete, you'll see:
```
BUILD SUCCESSFUL in XXs
```

---

## Step 16: Find Your APK

Your debug APK is located at:

```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Step 17: Download APK to Your Chromebook

On your **Chromebook terminal** (or another machine), run:

```bash
scp -i /path/to/key -P 31076 root@p1.zo.computer:~/Trycorder-Refit/android/app/build/outputs/apk/debug/app-debug.apk ./
```

This downloads the APK to your Chromebook's Downloads folder.

---

## Step 18: Transfer APK to Galaxy Tab

You have several options:

### Option A: USB Cable
1. Connect Galaxy Tab to Chromebook via USB
2. Drag and drop the APK file to the tablet
3. On tablet, open file manager and tap the APK to install

### Option B: Cloud Storage
1. Upload APK to Google Drive, Dropbox, or similar
2. Download on your Galaxy Tab
3. Tap to install

### Option C: Email
1. Email the APK to yourself
2. Download on Galaxy Tab
3. Tap to install

---

## Step 19: Install APK on Galaxy Tab

1. On your Galaxy Tab, go to **Settings** → **Apps** → **Special app access** → **Install unknown apps**
2. Select your file manager and enable "Allow from this source"
3. Open your file manager, navigate to the APK
4. Tap the APK file
5. Tap **Install**
6. Wait for installation to complete
7. Tap **Open** to launch Trycorder!

---

## Step 20: Build Release APK (For F-Droid)

Once you've tested the debug version, build a release APK:

```bash
cd ~/Trycorder-Refit/android
./gradlew assembleRelease
```

This creates: `app/build/outputs/apk/release/app-release-unsigned.apk`

---

## Troubleshooting

### Issue: "gradle: command not found"
**Solution:** Gradle is included with the Android project. Use `./gradlew` instead of `gradle`.

### Issue: "Java not found"
**Solution:** Run `java -version` to verify installation. If not found, reinstall:
```bash
apt-get install -y openjdk-11-jdk
```

### Issue: "npm: command not found"
**Solution:** Reinstall Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### Issue: Build fails with "Out of memory"
**Solution:** Your server might not have enough RAM. Try:
```bash
cd android
./gradlew assembleDebug --no-daemon
```

### Issue: "Cannot find module" errors
**Solution:** Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: APK is too large
**Solution:** This is normal. The APK includes the entire web app. Size is typically 50-100MB.

---

## Quick Reference - Copy & Paste Commands

### One-Time Setup (run once):
```bash
# Update system
apt-get update -y && apt-get upgrade -y

# Install dependencies
apt-get install -y openjdk-11-jdk git curl wget unzip build-essential libssl-dev libffi-dev python3-dev

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Android SDK
mkdir -p ~/Android/Sdk && cd ~/Android/Sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip && rm commandlinetools-linux-9477386_latest.zip
mkdir -p cmdline-tools/latest && mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

# Set environment variables
cat >> ~/.bashrc << 'EOF'
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
EOF
source ~/.bashrc

# Accept licenses and install platforms
yes | sdkmanager --licenses
sdkmanager "platforms;android-34" "build-tools;34.0.0" "ndk;26.1.10909125"

# Clone and setup Trycorder
cd ~ && git clone https://github.com/Verbsisthehomie/Trycorder-Refit.git
cd Trycorder-Refit && npm install
```

### Build APK (run anytime):
```bash
cd ~/Trycorder-Refit
npm run build
npx cap copy android
cd android && ./gradlew assembleDebug
```

### Download APK (from your Chromebook):
```bash
scp -i /path/to/key -P 31076 root@p1.zo.computer:~/Trycorder-Refit/android/app/build/outputs/apk/debug/app-debug.apk ./
```

---

## Next Steps

1. ✅ **Set up Android SDK** - Follow steps 1-10
2. ✅ **Clone and build** - Follow steps 11-15
3. ✅ **Download and test** - Follow steps 16-19
4. 📱 **Test on Galaxy Tab** - Verify all features work
5. 🚀 **Submit to F-Droid** - Build release APK and submit

---

## Support Resources

- **Android Developer Docs**: https://developer.android.com/docs
- **Capacitor Documentation**: https://capacitorjs.com/docs
- **Gradle Documentation**: https://gradle.org/documentation/
- **F-Droid Submission**: https://f-droid.org/en/docs/Inclusion_How-To/

---

## Tips

- **Keep your SSH session alive**: If your connection drops, just SSH back in and continue where you left off
- **Use `screen` or `tmux`**: For long builds, use `screen` to keep the build running even if you disconnect:
  ```bash
  screen -S trycorder-build
  # Run your build commands
  # Press Ctrl+A then D to detach
  # Reconnect later with: screen -r trycorder-build
  ```
- **Monitor disk space**: Check available space with `df -h` before building
- **Monitor RAM**: Check available memory with `free -h`

Good luck! 🚀
