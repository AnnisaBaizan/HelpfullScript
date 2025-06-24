import pyautogui
import pyperclip
import time
import os

NILAI_PATH = "nilai.txt"
LAST_TS = 0

print("🟢 Paste Bridge aktif, menunggu nilai...")

while True:
    if os.path.exists(NILAI_PATH):
        ts = os.path.getmtime(NILAI_PATH)  # ambil waktu terakhir file berubah
        if ts != LAST_TS:
            with open(NILAI_PATH, "r", encoding="utf-8") as f:
                nilai = f.read().strip()
                if nilai:
                    print(f"📥 Menerima nilai baru: {nilai}")
                    pyperclip.copy(nilai)
                    time.sleep(0.8)
                    pyautogui.hotkey("ctrl", "v")
            LAST_TS = ts
    time.sleep(0.5)
