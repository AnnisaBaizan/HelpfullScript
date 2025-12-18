import customtkinter as ctk
import threading
import time
import os
import sys
import platform
import pyperclip
import pyautogui
from flask import Flask, request

# =============== CONFIG ===============
running = True
IS_MAC = platform.system() == "Darwin"
IS_WINDOWS = platform.system() == "Windows"

# =============== HELPER RESOURCE (PyInstaller) ===============
def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# =============== GUI REFERENCE ===============
value_label = None

def update_label(text):
    global value_label
    if value_label:
        try:
            value_label.configure(text=f"Nilai terakhir: {text}")
        except:
            pass

# =============== PASTE FUNCTION (CROSS-PLATFORM) ===============
def do_paste(nilai):
    """Paste dengan hotkey sesuai OS"""
    pyperclip.copy(nilai)
    time.sleep(0.3)
    
    if IS_MAC:
        pyautogui.hotkey("command", "v")
    else:
        pyautogui.hotkey("ctrl", "v")

# =============== FLASK ===============
app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

@app.route("/paste", methods=["POST", "OPTIONS"])
def paste():
    if request.method == "OPTIONS":
        return "", 200
    
    global running
    data = request.get_json()
    nilai = data.get("nilai", "")
    
    if nilai and running:
        print(f"📥 Terima nilai: {nilai}")
        update_label(nilai)
        do_paste(nilai)
        print(f"✅ Paste berhasil: {nilai}")
        return {"status": "ok", "pasted": nilai}, 200
    
    return {"status": "skipped", "reason": "empty or stopped"}, 200

@app.route("/", methods=["GET"])
def index():
    return "PasteBridge aktif! ✅", 200

# =============== GUI ===============
def start_gui():
    global value_label, running
    
    ctk.set_appearance_mode("light")
    ctk.set_default_color_theme("green")
    
    app_gui = ctk.CTk()
    app_gui.title("PasteBridge")
    app_gui.geometry("350x320")
    
    # Icon handling - cross platform
    if IS_WINDOWS:
        try:
            app_gui.iconbitmap(resource_path("paste_bridge_icon.ico"))
        except Exception as e:
            print(f"[⚠] Gagal set ikon: {e}")
    # Di Mac, .icns bisa di-set via .app bundle, skip untuk development
    
    title = ctk.CTkLabel(app_gui, text="📋 PasteBridge", font=("Arial", 18, "bold"))
    title.pack(pady=10)
    
    # Info OS
    os_info = f"OS: {platform.system()} | Paste: {'⌘+V' if IS_MAC else 'Ctrl+V'}"
    os_label = ctk.CTkLabel(app_gui, text=os_info, font=("Arial", 10), text_color="gray")
    os_label.pack(pady=2)
    
    status_label = ctk.CTkLabel(app_gui, text="Status: Aktif ✅", font=("Arial", 13))
    status_label.pack(pady=5)
    
    value_label = ctk.CTkLabel(app_gui, text="Nilai terakhir: -", font=("Arial", 12), wraplength=300)
    value_label.pack(pady=5)
    
    port_label = ctk.CTkLabel(app_gui, text="Server: http://localhost:3030", font=("Arial", 10), text_color="gray")
    port_label.pack(pady=5)
    
    # Warning untuk Mac
    if IS_MAC:
        warn = ctk.CTkLabel(
            app_gui, 
            text="⚠️ Mac: Pastikan Accessibility permission aktif\n(System Preferences → Privacy → Accessibility)",
            font=("Arial", 9),
            text_color="orange",
            wraplength=300
        )
        warn.pack(pady=5)
    
    def toggle_running():
        global running
        running = not running
        if running:
            status_label.configure(text="Status: Aktif ✅")
            btn_toggle.configure(text="Stop", fg_color="red")
        else:
            status_label.configure(text="Status: Berhenti ⏸️")
            btn_toggle.configure(text="Start", fg_color="green")
    
    btn_toggle = ctk.CTkButton(app_gui, text="Stop", command=toggle_running, fg_color="red")
    btn_toggle.pack(pady=10)
    
    btn_quit = ctk.CTkButton(app_gui, text="Keluar", command=app_gui.quit, fg_color="gray")
    btn_quit.pack(pady=10)
    
    def run_flask():
        app.run(host="0.0.0.0", port=3030, debug=False, use_reloader=False, threaded=True)
    
    threading.Thread(target=run_flask, daemon=True).start()
    print(f"🚀 PasteBridge aktif di http://localhost:3030 ({platform.system()})")
    
    app_gui.mainloop()

if __name__ == "__main__":
    start_gui()