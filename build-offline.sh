#!/usr/bin/env bash
# Build offline Android APK with bundled web app
# Usage: ./build-offline.sh [--apk]
#   --apk: also run gradle to produce the signed APK

set -e
cd "$(dirname "$0")"

echo "=== Building web app ==="
npm run build

echo "=== Copying dist to Android assets ==="
mkdir -p android-app/app/src/main/assets
rm -rf android-app/app/src/main/assets/*
cp -r dist/* android-app/app/src/main/assets/

echo "=== Web app bundled successfully ==="

if [[ "$1" == "--apk" ]]; then
  echo "=== Building Android APK ==="
  cd android-app
  ./gradlew assembleRelease
  echo "=== APK built: app/build/outputs/apk/release/app-release-unsigned.apk ==="
else
  echo "Run with --apk to also build the Android APK"
fi
