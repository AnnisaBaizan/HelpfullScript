"""
SPP Bridge - Gabungan PasteBridge + SPP Data Server
Port 3030 : /paste  → PasteBridge (existing, tidak berubah)
Port 3031 : /spp    → Terima data dari SPP Reader web app
           /spp-data → Kirim data ke Tampermonkey
"""

import customtkinter as ctk
import threading
import time
import os
import sys
import platform
import json
import pyperclip
import pyautogui
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# =============== CONFIG ===============
IS_MAC     = platform.system() == "Darwin"
IS_WINDOWS = platform.system() == "Windows"
running    = True
spp_data   = None  # data SPP terakhir dari web app

# =============== FLASK APP ===============
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------------------------------------------------------
# PORT 3030 : PASTEBRIDGE (tidak berubah dari versi lama)
# ---------------------------------------------------------------
@app.route("/paste", methods=["POST", "OPTIONS"])
def paste():
    if request.method == "OPTIONS":
        return "", 200
    global running
    data  = request.get_json()
    nilai = data.get("nilai", "")
    if nilai and running:
        print(f"📥 PasteBridge terima: {nilai}")
        update_label_paste(nilai)
        do_paste(nilai)
        return {"status": "ok", "pasted": nilai}, 200
    return {"status": "skipped"}, 200

@app.route("/", methods=["GET"])
def index():
    return "SPP Bridge aktif! ✅<br>PasteBridge: /paste<br>SPP Data: /spp | /spp-data", 200

# ---------------------------------------------------------------
# PORT 3031 : SPP DATA SERVER
# Terima data dari web app SPP Reader
# ---------------------------------------------------------------
app2 = Flask("spp_data_server")
CORS(app2, resources={r"/*": {"origins": "*"}})

@app2.route("/spp", methods=["POST", "OPTIONS"])
def terima_spp():
    if request.method == "OPTIONS":
        return "", 200
    global spp_data
    spp_data = request.get_json()
    print(f"📥 Data SPP diterima: {spp_data.get('jenis_spp')} - {spp_data.get('supplier')}")
    update_label_spp(spp_data)
    return {"status": "ok"}, 200

@app2.route("/spp-data", methods=["GET"])
def kirim_spp():
    """Tampermonkey ambil data SPP dari sini"""
    global spp_data
    if spp_data:
        return jsonify(spp_data), 200
    return jsonify({"error": "Belum ada data SPP"}), 404

@app2.route("/spp-clear", methods=["POST"])
def clear_spp():
    global spp_data
    spp_data = None
    return {"status": "cleared"}, 200

# =============== PASTE FUNCTION ===============
def do_paste(nilai):
    pyperclip.copy(str(nilai))
    time.sleep(0.3)
    if IS_MAC:
        pyautogui.hotkey("command", "v")
    else:
        pyautogui.hotkey("ctrl", "v")

# =============== GUI REFERENCES ===============
label_paste = None
label_spp   = None

def update_label_paste(text):
    global label_paste
    if label_paste:
        try:
            label_paste.configure(text=f"Paste terakhir: {text}")
        except:
            pass

def update_label_spp(data):
    global label_spp
    if label_spp and data:
        try:
            text = f"SPP {data.get('jenis_spp','-')} | {data.get('supplier','-')[:25]}"
            label_spp.configure(text=text)
        except:
            pass

# =============== GUI ===============
def start_gui():
    global label_paste, label_spp, running

    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("blue")

    root = ctk.CTk()
    root.title("SPP Bridge")
    root.geometry("380x420")
    root.resizable(False, False)

    # Title
    ctk.CTkLabel(root, text="🤖 SPP Bridge", font=("Arial", 20, "bold")).pack(pady=12)

    os_info = f"OS: {platform.system()} | Paste: {'⌘+V' if IS_MAC else 'Ctrl+V'}"
    ctk.CTkLabel(root, text=os_info, font=("Arial", 10), text_color="gray").pack()

    # Separator
    ctk.CTkFrame(root, height=1, fg_color="#333").pack(fill="x", padx=20, pady=8)

    # PasteBridge status
    ctk.CTkLabel(root, text="📋 PasteBridge", font=("Arial", 13, "bold")).pack()
    ctk.CTkLabel(root, text="Port 3030 | /paste", font=("Arial", 10), text_color="gray").pack()

    status_label = ctk.CTkLabel(root, text="Status: Aktif ✅", font=("Arial", 12))
    status_label.pack(pady=4)

    label_paste = ctk.CTkLabel(root, text="Paste terakhir: -", font=("Arial", 11), wraplength=340)
    label_paste.pack(pady=2)

    # Toggle
    def toggle():
        global running
        running = not running
        if running:
            status_label.configure(text="Status: Aktif ✅")
            btn_toggle.configure(text="Stop", fg_color="red")
        else:
            status_label.configure(text="Status: Berhenti ⏸️")
            btn_toggle.configure(text="Start", fg_color="green")

    btn_toggle = ctk.CTkButton(root, text="Stop", command=toggle, fg_color="red", width=120)
    btn_toggle.pack(pady=6)

    # Separator
    ctk.CTkFrame(root, height=1, fg_color="#333").pack(fill="x", padx=20, pady=8)

    # SPP Data status
    ctk.CTkLabel(root, text="📄 SPP Data Server", font=("Arial", 13, "bold")).pack()
    ctk.CTkLabel(root, text="Port 3031 | /spp | /spp-data", font=("Arial", 10), text_color="gray").pack()

    label_spp = ctk.CTkLabel(root, text="Belum ada data SPP", font=("Arial", 11), 
                              text_color="#4f8ef7", wraplength=340)
    label_spp.pack(pady=4)

    def clear_data():
        global spp_data
        spp_data = None
        label_spp.configure(text="Belum ada data SPP")
        print("🗑️ Data SPP dihapus")

    ctk.CTkButton(root, text="🗑 Clear Data SPP", command=clear_data, 
                  fg_color="#2e3350", width=160).pack(pady=4)

    # Mac warning
    if IS_MAC:
        ctk.CTkLabel(root,
            text="⚠️ Mac: Aktifkan Accessibility di System Preferences",
            font=("Arial", 9), text_color="orange", wraplength=340).pack(pady=4)

    # Quit
    ctk.CTkButton(root, text="Keluar", command=root.quit, fg_color="gray", width=120).pack(pady=8)

    # Start Flask servers
    def run_pastebridge():
        app.run(host="0.0.0.0", port=3030, debug=False, use_reloader=False, threaded=True)

    def run_spp_server():
        app2.run(host="0.0.0.0", port=3031, debug=False, use_reloader=False, threaded=True)

    threading.Thread(target=run_pastebridge, daemon=True).start()
    threading.Thread(target=run_spp_server, daemon=True).start()

    print(f"🚀 PasteBridge aktif di http://localhost:3030")
    print(f"🚀 SPP Server aktif di http://localhost:3031")

    root.mainloop()

if __name__ == "__main__":
    start_gui()
