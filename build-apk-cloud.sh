#!/bin/bash

##############################################################################
# Trycorder LCARS - Automated APK Build Script for Cloud Servers
# 
# This script automates the entire APK build process on a cloud server
# Usage: ./build-apk-cloud.sh
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="${HOME}/trycorder-lcars"
ANDROID_SDK_ROOT="${HOME}/Android/Sdk"
BUILD_TYPE="${1:-debug}"  # debug or release
OUTPUT_DIR="${PROJECT_DIR}/build-output"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Trycorder LCARS - APK Build Script                      ║${NC}"
echo -e "${BLUE}║   Cloud Server Edition                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/7]${NC} Checking prerequisites..."
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}✗ $1 not found. Please install it first.${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
    fi
}

check_command "java"
check_command "node"
check_command "npm"
check_command "git"

# Step 2: Clone/Update repository
echo ""
echo -e "${YELLOW}[2/7]${NC} Cloning/updating repository..."
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${GREEN}✓ Repository exists, pulling latest changes...${NC}"
    cd "$PROJECT_DIR"
    git pull origin main
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone https://github.com/Verbsisthehomie/Trycorder-Refit.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Step 3: Install dependencies
echo ""
echo -e "${YELLOW}[3/7]${NC} Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 4: Build web app
echo ""
echo -e "${YELLOW}[4/7]${NC} Building web application..."
npm run build
if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✓ Web app built successfully${NC}"
else
    echo -e "${RED}✗ Web build failed${NC}"
    exit 1
fi

# Step 5: Copy to Android
echo ""
echo -e "${YELLOW}[5/7]${NC} Copying web assets to Android..."
npx cap copy android
echo -e "${GREEN}✓ Web assets copied${NC}"

# Step 6: Build APK
echo ""
echo -e "${YELLOW}[6/7]${NC} Building Android APK (${BUILD_TYPE})..."
cd "$PROJECT_DIR/android"

if [ "$BUILD_TYPE" = "release" ]; then
    echo -e "${YELLOW}Building RELEASE APK...${NC}"
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
else
    echo -e "${YELLOW}Building DEBUG APK...${NC}"
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}✓ APK built successfully${NC}"
else
    echo -e "${RED}✗ APK build failed${NC}"
    exit 1
fi

# Step 7: Copy output
echo ""
echo -e "${YELLOW}[7/7]${NC} Preparing output..."
mkdir -p "$OUTPUT_DIR"
cp "$APK_PATH" "$OUTPUT_DIR/"
echo -e "${GREEN}✓ APK copied to output directory${NC}"

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ BUILD COMPLETE!${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}APK Location:${NC}"
echo -e "${GREEN}  ${OUTPUT_DIR}/$(basename "$APK_PATH")${NC}"
echo ""
echo -e "${YELLOW}Build Type:${NC} ${BUILD_TYPE}"
echo -e "${YELLOW}Build Date:${NC} $(date)"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Download the APK from: $OUTPUT_DIR/"
echo "  2. Transfer to your Galaxy Tab"
echo "  3. Install and test the app"
echo "  4. If release build, sign the APK with your key"
echo ""
echo -e "${YELLOW}To download the APK:${NC}"
echo "  scp user@blackzissou.zo.computer:${OUTPUT_DIR}/$(basename "$APK_PATH") ./"
echo ""
