# Setting Up GitHub Actions for Automated APK Builds

Due to GitHub permissions, you need to manually add the GitHub Actions workflow to your repository. This is a simple 2-minute process!

## Step 1: Create the Workflow File

1. Go to your repository: https://github.com/Verbsisthehomie/Trycorder-Refit
2. Click **Add file** → **Create new file**
3. In the filename field, type: `.github/workflows/build-apk.yml`
4. GitHub will automatically create the directory structure

## Step 2: Copy the Workflow Content

Copy the entire content below and paste it into the file:

```yaml
name: Build Trycorder LCARS APK

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          java-version: '11'
          distribution: 'temurin'

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build web app
        run: npm run build

      - name: Copy web assets to Android
        run: npx cap copy android

      - name: Build debug APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: Build release APK
        run: |
          cd android
          ./gradlew assembleRelease

      - name: Upload debug APK
        uses: actions/upload-artifact@v4
        with:
          name: trycorder-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      - name: Upload release APK
        uses: actions/upload-artifact@v4
        with:
          name: trycorder-release-unsigned.apk
          path: android/app/build/outputs/apk/release/app-release-unsigned.apk
          retention-days: 30

      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Trycorder LCARS ${{ github.ref }}
          body: |
            Trycorder LCARS APK Release
            
            **Debug APK**: For testing on your device
            **Release APK**: For F-Droid submission
            
            See README.md for installation instructions.
          draft: false
          prerelease: false

      - name: Upload APKs to Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: |
            android/app/build/outputs/apk/debug/app-debug.apk
            android/app/build/outputs/apk/release/app-release-unsigned.apk
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Step 3: Commit the File

1. Scroll down to the **Commit new file** section
2. Add a commit message: `Add GitHub Actions APK build workflow`
3. Click **Commit new file**

## Step 4: Watch Your First Build

1. Go to the **Actions** tab of your repository
2. You'll see the workflow running!
3. Wait for it to complete (usually 10-15 minutes)
4. Once done, download your APK from the **Artifacts** section

---

## How to Use It

### Every Time You Push Code:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The workflow automatically triggers and builds a new APK!

### Download Your APK:
1. Go to https://github.com/Verbsisthehomie/Trycorder-Refit/actions
2. Click the latest workflow run
3. Scroll to **Artifacts**
4. Download the APK you want

### Create a Release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

Then go to **Releases** tab to download APKs from the release page.

---

## That's It!

Your GitHub Actions workflow is now set up. Every push to `main` will automatically build your APK. No more manual builds needed! 🚀
