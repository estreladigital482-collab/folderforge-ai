#!/usr/bin/env bash
set -e

echo "FolderForge APK build helper"
echo "Este script precisa de Java + Android SDK + internet para baixar Gradle/dependências."

npm install
npm run build
npx cap sync android
cd android
chmod +x ./gradlew
./gradlew assembleDebug

echo "APK gerado em: android/app/build/outputs/apk/debug/"
