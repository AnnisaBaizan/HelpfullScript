import threading
import time
import os
import pyperclip
import pyautogui
from flask import Flask, request
from flask_cors import CORS

# =============== CONFIG ===============
NILAI_PATH = "nilai.txt"
CHECK_INTERVAL = 0.5

# =============== FLASK SERVER ===============
app = Flask(__name__)
CORS(app)

@app.route("/paste", methods=["POST"])
def paste():
    data = request.get_json()
    nilai = data.get("nilai", "")
    with open(NILAI_PATH, "w", encoding="utf-8") as f:
        f.write(nilai)
    return {"status": "ok", "received": nilai}, 200

# =============== PASTE BRIDGE LOOP ===============
def bridge_loop():
    print("🟢 Paste Bridge aktif, menunggu nilai...")
    LAST_TS = 0
    while True:
        if os.path.exists(NILAI_PATH):
            ts = os.path.getmtime(NILAI_PATH)
            if ts != LAST_TS:
                with open(NILAI_PATH, "r", encoding="utf-8") as f:
                    nilai = f.read().strip()
                    if nilai:
                        print(f"📥 Menerima nilai baru: {nilai}")
                        pyperclip.copy(nilai)
                        time.sleep(0.8)
                        pyautogui.hotkey("ctrl", "v")
                LAST_TS = ts
        time.sleep(CHECK_INTERVAL)

# =============== MAIN ===============
if __name__ == "__main__":
    threading.Thread(target=bridge_loop, daemon=True).start()
    app.run(port=3030)
