#!/bin/bash
set -e

BASE="$(cd "$(dirname "$0")" && pwd)"
cd "$BASE"

echo "== [1/4] Setup virtual environment =="
python3 -m venv venv
source venv/bin/activate

echo "== [2/4] Install dependencies =="
pip install --upgrade pip
pip install pyinstaller customtkinter flask pyautogui pyperclip

echo "== [3/4] Build .app (arm64 / Apple Silicon) =="
pyinstaller PasteBridge_mac.spec --clean --noconfirm

echo "== [4/4] Package into .dmg =="
rm -f dist/PasteBridge.dmg
hdiutil create \
  -volname "PasteBridge" \
  -srcfolder dist/PasteBridge.app \
  -ov \
  -format UDZO \
  dist/PasteBridge.dmg

echo ""
echo "✅ Done! Output: $BASE/dist/PasteBridge.dmg"
echo ""
echo "⚠️  IMPORTANT — After first launch on Mac:"
echo "   System Settings → Privacy & Security → Accessibility"
echo "   → Enable PasteBridge"
