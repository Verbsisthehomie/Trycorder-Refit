#!/bin/bash

##############################################################################
# Android SDK Setup Script for Cloud Servers
# 
# This script installs Android SDK, Java, and all dependencies needed
# to build APKs on a cloud server (Ubuntu/Debian)
#
# Usage: bash setup-android-sdk.sh
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Android SDK Setup for Cloud Servers                     ║${NC}"
echo -e "${BLUE}║   Ubuntu/Debian Linux                                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root for some operations
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Note: Some operations may require sudo${NC}"
fi

# Step 1: Update system
echo -e "${YELLOW}[1/6]${NC} Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq
echo -e "${GREEN}✓ System updated${NC}"

# Step 2: Install Java
echo ""
echo -e "${YELLOW}[2/6]${NC} Installing Java Development Kit..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -1)
    echo -e "${GREEN}✓ Java already installed: $JAVA_VERSION${NC}"
else
    sudo apt-get install -y -qq openjdk-11-jdk
    echo -e "${GREEN}✓ Java 11 installed${NC}"
fi

# Step 3: Install required build tools
echo ""
echo -e "${YELLOW}[3/6]${NC} Installing build tools..."
sudo apt-get install -y -qq \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev
echo -e "${GREEN}✓ Build tools installed${NC}"

# Step 4: Install Node.js and npm
echo ""
echo -e "${YELLOW}[4/6]${NC} Installing Node.js and npm..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js already installed: $NODE_VERSION${NC}"
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y -qq nodejs
    echo -e "${GREEN}✓ Node.js installed${NC}"
fi

# Step 5: Install Android SDK
echo ""
echo -e "${YELLOW}[5/6]${NC} Installing Android SDK..."

ANDROID_SDK_ROOT="${HOME}/Android/Sdk"
ANDROID_HOME="${ANDROID_SDK_ROOT}"

if [ -d "$ANDROID_SDK_ROOT" ]; then
    echo -e "${GREEN}✓ Android SDK already exists at $ANDROID_SDK_ROOT${NC}"
else
    echo -e "${YELLOW}Downloading Android SDK command-line tools...${NC}"
    
    mkdir -p "$ANDROID_SDK_ROOT"
    cd "$ANDROID_SDK_ROOT"
    
    # Download latest command-line tools
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
    unzip -q commandlinetools-linux-9477386_latest.zip
    rm commandlinetools-linux-9477386_latest.zip
    
    # Create proper directory structure
    mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools/latest"
    mv cmdline-tools/* "$ANDROID_SDK_ROOT/cmdline-tools/latest/" 2>/dev/null || true
    
    echo -e "${GREEN}✓ Android SDK downloaded${NC}"
fi

# Step 6: Accept licenses and install platforms
echo ""
echo -e "${YELLOW}[6/6]${NC} Installing Android platforms and build tools..."

export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# Accept all licenses
yes | sdkmanager --licenses > /dev/null 2>&1 || true

# Install required packages
sdkmanager --update > /dev/null 2>&1 || true
sdkmanager "platforms;android-34" > /dev/null 2>&1 || true
sdkmanager "build-tools;34.0.0" > /dev/null 2>&1 || true
sdkmanager "ndk;26.1.10909125" > /dev/null 2>&1 || true

echo -e "${GREEN}✓ Android platforms installed${NC}"

# Step 7: Set environment variables
echo ""
echo -e "${YELLOW}Setting up environment variables...${NC}"

# Add to bashrc if not already there
if ! grep -q "ANDROID_HOME" ~/.bashrc; then
    cat >> ~/.bashrc << EOF

# Android SDK Configuration
export ANDROID_HOME=\$HOME/Android/Sdk
export PATH=\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/tools:\$PATH
EOF
    echo -e "${GREEN}✓ Environment variables added to ~/.bashrc${NC}"
fi

# Source the bashrc
source ~/.bashrc

# Verification
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ SETUP COMPLETE!${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Verification:${NC}"
echo -n "  Java: "
java -version 2>&1 | head -1
echo -n "  Node: "
node --version
echo -n "  npm: "
npm --version
echo -n "  Android SDK: "
if [ -d "$ANDROID_SDK_ROOT" ]; then
    echo -e "${GREEN}Installed at $ANDROID_SDK_ROOT${NC}"
else
    echo -e "${RED}Not found${NC}"
fi

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Clone your Trycorder repository:"
echo "     git clone https://github.com/Verbsisthehomie/Trycorder-Refit.git"
echo ""
echo "  2. Navigate to the project:"
echo "     cd Trycorder-Refit"
echo ""
echo "  3. Run the build script:"
echo "     bash build-apk-cloud.sh"
echo ""
echo -e "${YELLOW}Or build manually:${NC}"
echo "  npm install"
echo "  npm run build"
echo "  npx cap copy android"
echo "  cd android && ./gradlew assembleDebug"
echo ""
