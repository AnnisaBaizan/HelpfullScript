import customtkinter as ctk
import threading
import time
import os
import sys
import pyperclip
import pyautogui
from flask import Flask, request
from flask_cors import CORS

# =============== CONFIG ===============
CHECK_INTERVAL = 0.5
running = True
last_value = ""
new_value = None  # buffer untuk nilai baru

# =============== HELPER RESOURCE (PyInstaller) ===============
def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# =============== FLASK ===============
app = Flask(__name__)
CORS(app)

@app.route("/paste", methods=["POST"])
def paste():
    global new_value
    data = request.get_json()
    nilai = data.get("nilai", "")
    if nilai:
        new_value = nilai  # langsung simpan ke variabel global
    return {"status": "ok", "received": nilai}, 200

# =============== PASTE BRIDGE LOOP ===============
def bridge_loop(update_callback):
    global last_value, new_value, running
    while True:
        if running and new_value and new_value != last_value:
            last_value = new_value
            update_callback(new_value)
            pyperclip.copy(new_value)
            time.sleep(0.8)
            pyautogui.hotkey("ctrl", "v")
        time.sleep(CHECK_INTERVAL)

# =============== GUI ===============
def start_gui():
    ctk.set_appearance_mode("light")
    ctk.set_default_color_theme("green")

    app_gui = ctk.CTk()
    app_gui.title("PasteBridge")
    app_gui.geometry("350x300")

    try:
        app_gui.iconbitmap(resource_path("paste_bridge_icon.ico"))
    except Exception as e:
        print(f"[⚠] Gagal set ikon: {e}")

    title = ctk.CTkLabel(app_gui, text="📋 PasteBridge", font=("Arial", 18, "bold"))
    title.pack(pady=10)

    status_label = ctk.CTkLabel(app_gui, text="Status: Aktif ✅", font=("Arial", 13))
    status_label.pack(pady=5)

    value_label = ctk.CTkLabel(app_gui, text="Nilai terakhir: -", font=("Arial", 12), wraplength=300)
    value_label.pack(pady=5)

    def update_value(new_val):
        value_label.configure(text=f"Nilai terakhir: {new_val}")

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

    threading.Thread(target=bridge_loop, args=(update_value,), daemon=True).start()
    threading.Thread(target=lambda: app.run(port=3030), daemon=True).start()

    app_gui.mainloop()

if __name__ == "__main__":
    start_gui()
