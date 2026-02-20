# Trycorder LCARS - GitHub Actions APK Build Guide

## Automated APK Building with GitHub Actions

This guide explains how to use GitHub Actions to automatically build your Trycorder LCARS APK in the cloud. Every time you push code to GitHub, a new APK is built automatically!

---

## How It Works

1. You push code to GitHub
2. GitHub Actions automatically triggers
3. APK is built in the cloud (no setup needed on your machine!)
4. APK is available for download
5. You download and test on your Galaxy Tab

---

## Getting Started

### Step 1: Check the Workflow

The workflow file is already in your repository at:
```
.github/workflows/build-apk.yml
```

This file tells GitHub Actions what to do when you push code.

### Step 2: Push Code to Trigger Build

Make a small change to your project and push to GitHub:

```bash
# On your local machine or zo.computer server
cd Trycorder-Refit
git add .
git commit -m "Trigger APK build"
git push origin main
```

### Step 3: Watch the Build

1. Go to: https://github.com/Verbsisthehomie/Trycorder-Refit
2. Click the **Actions** tab
3. You'll see your build running!
4. Wait for it to complete (usually 10-15 minutes)

---

## Downloading Your APK

### Option 1: From GitHub Actions (Easiest)

1. Go to https://github.com/Verbsisthehomie/Trycorder-Refit/actions
2. Click the latest workflow run
3. Scroll down to **Artifacts**
4. Download either:
   - `trycorder-debug.apk` - For testing
   - `trycorder-release-unsigned.apk` - For F-Droid submission

### Option 2: From GitHub Releases (After Tagging)

To create a release with APKs:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Then go to: https://github.com/Verbsisthehomie/Trycorder-Refit/releases

Your APKs will be attached to the release!

---

## What Gets Built

Each workflow run creates:

1. **Debug APK** (`app-debug.apk`)
   - For testing on your Galaxy Tab
   - Unsigned (doesn't need signing)
   - Larger file size
   - Easier to install

2. **Release APK** (`app-release-unsigned.apk`)
   - For F-Droid submission
   - Needs to be signed with your key
   - Optimized for production
   - Smaller file size

---

## Installing the APK on Your Galaxy Tab

### From Your Chromebook:

1. Download the APK from GitHub Actions
2. Transfer to Galaxy Tab (USB, cloud storage, or email)
3. On Galaxy Tab:
   - Go to **Settings** → **Apps** → **Special app access** → **Install unknown apps**
   - Select your file manager and enable "Allow from this source"
   - Open file manager, find the APK
   - Tap to install
4. Launch Trycorder!

---

## Workflow Details

The GitHub Actions workflow does the following:

1. **Checks out your code** from GitHub
2. **Installs Java 11** (required for Android development)
3. **Installs Node.js 18** (for web app building)
4. **Installs npm dependencies** (`npm install`)
5. **Builds the web app** (`npm run build`)
6. **Copies web assets to Android** (`npx cap copy android`)
7. **Builds debug APK** (`./gradlew assembleDebug`)
8. **Builds release APK** (`./gradlew assembleRelease`)
9. **Uploads APKs as artifacts** (available for download for 30 days)
10. **Creates GitHub releases** (if you tag a version)

---

## Triggering Builds

### Automatic Triggers

Builds run automatically when you:
- Push to the `main` branch
- Create a pull request to `main`

### Manual Trigger

To manually trigger a build without pushing code:

1. Go to https://github.com/Verbsisthehomie/Trycorder-Refit/actions
2. Click **Build Trycorder LCARS APK** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

---

## Troubleshooting

### Build Failed

Check the workflow logs:
1. Go to **Actions** tab
2. Click the failed workflow
3. Click **build** job
4. Scroll through the logs to find the error

Common issues:
- **Out of memory** - GitHub's runners have 7GB RAM, usually enough
- **Gradle cache issues** - Try clearing cache (see below)
- **Dependency issues** - Make sure `package.json` is valid

### Clear Gradle Cache

If builds are failing, try clearing the cache:

```bash
cd android
./gradlew clean
git add .
git commit -m "Clear Gradle cache"
git push origin main
```

### APK Not Downloading

Make sure:
- Workflow completed successfully (green checkmark)
- You're looking in the **Artifacts** section
- The artifact hasn't expired (30 days)

---

## Signing for F-Droid

The release APK from GitHub Actions is **unsigned**. To submit to F-Droid, you need to sign it:

### Step 1: Create a Signing Key

On your computer (or zo.computer server):

```bash
keytool -genkey -v -keystore trycorder-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias trycorder-key
```

You'll be prompted for:
- Password (remember this!)
- Your name, organization, etc.

### Step 2: Sign the APK

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore trycorder-release.keystore \
  app-release-unsigned.apk \
  trycorder-key
```

### Step 3: Verify Signature

```bash
jarsigner -verify -verbose -certs app-release-unsigned.apk
```

### Step 4: Rename and Align

```bash
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

Now `app-release.apk` is ready for F-Droid!

---

## Continuous Updates

Every time you make changes to your Trycorder:

1. Commit and push to GitHub
2. GitHub Actions automatically builds
3. Download the new APK
4. Test on your Galaxy Tab
5. Repeat!

This is perfect for iterative development.

---

## Advanced: Custom Workflow

Want to customize the build? Edit `.github/workflows/build-apk.yml`:

- Change build steps
- Add signing (requires secrets)
- Deploy to different platforms
- Run tests before building

See GitHub Actions documentation: https://docs.github.com/en/actions

---

## Tips

- **Keep your main branch clean** - Only push stable code
- **Use branches for development** - Create feature branches, merge when ready
- **Tag releases** - Use `git tag v1.0.0` to mark stable versions
- **Monitor artifact storage** - GitHub gives you 500MB free storage for artifacts
- **Check build logs** - Always review logs to catch issues early

---

## Next Steps

1. ✅ **Workflow is set up** - Already in your repository
2. 🔨 **Push code to trigger build** - Make a commit and push
3. ⏳ **Wait for build to complete** - Usually 10-15 minutes
4. 📥 **Download APK** - From GitHub Actions artifacts
5. 📱 **Test on Galaxy Tab** - Install and verify features
6. 🚀 **Submit to F-Droid** - Sign the release APK and submit

---

## Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Gradle Documentation**: https://gradle.org/documentation/
- **Android Developer Docs**: https://developer.android.com/docs
- **Capacitor Docs**: https://capacitorjs.com/docs

---

## Quick Reference

```bash
# Push code to trigger build
git add .
git commit -m "Your message"
git push origin main

# Create a release
git tag v1.0.0
git push origin v1.0.0

# Check build status
# Go to: https://github.com/Verbsisthehomie/Trycorder-Refit/actions
```

Happy building! 🚀
