# 📋 Paste Bridge - Trusted Ctrl+V / ⌘+V Automation System

## 🧠 Deskripsi

Paste Bridge adalah sistem otomatisasi yang menjembatani **script Tampermonkey di browser** dengan **input keyboard native dari Python** menggunakan `pyautogui`. Sistem ini dirancang untuk menangani kasus input yang **tidak bisa dimasukkan langsung melalui JavaScript**, terutama pada aplikasi berbasis Angular/PrimeNG seperti **SAKTI Kemenkeu**.

Dengan sistem ini, nilai numeric dari form bisa di-*paste* secara **trusted** (seolah-olah oleh manusia), sehingga memicu validasi dan mask Angular seperti seharusnya.

**✅ Cross-Platform:** Mendukung Windows dan macOS.

---

## 🔧 Teknologi yang Digunakan

### Python
- `Flask` - Menerima data dari browser (POST)
- `pyautogui` - Simulasi `Ctrl+V` (Windows) / `⌘+V` (macOS)
- `pyperclip` - Menyalin nilai ke clipboard
- `customtkinter` - GUI kontrol status sistem

### JavaScript (Browser)
- `Tampermonkey` - Script automation yang mengirim nilai ke server Python

### Build Tools
- `PyInstaller` - Build executable (`.exe` untuk Windows, `.app` untuk macOS)

---

## 🔄 Alur Kerja Sistem

```
┌─────────────────┐      POST /paste       ┌─────────────────┐
│   Tampermonkey  │ ──────────────────────▶│   Flask Server  │
│    (Browser)    │   { "nilai": "123" }   │  (localhost:3030)│
└─────────────────┘                        └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │  Copy to        │
                                           │  Clipboard      │
                                           └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │  Ctrl+V / ⌘+V   │
                                           │  (pyautogui)    │
                                           └────────┬────────┘
                                                    │
                                                    ▼
                                           ┌─────────────────┐
                                           │  Input Field    │
                                           │  (Trusted Paste)│
                                           └─────────────────┘
```

1. **Tampermonkey** mendeteksi nilai dari halaman dan mengirimkannya via `fetch()` ke `http://localhost:3030/paste`
2. **Flask server** menerima POST request
3. **Paste Bridge** otomatis:
   - Menyalin nilai ke clipboard
   - Melakukan `Ctrl+V` (Windows) atau `⌘+V` (macOS) ke input aktif
4. Input field mengenali isi clipboard sebagai input manual → validasi Angular aktif

---

## 📦 Struktur Folder

```
paste-bridge-project/
├── build/                     # Folder build PyInstaller (auto-generated)
├── dist/                      # Hasil executable dari PyInstaller
├── .gitignore
├── NestedLoop-FormPython.js   # Script Tampermonkey contoh
├── paste_bridge_icon.ico      # Ikon aplikasi (Windows)
├── paste_bridge_icon.png      # Ikon aplikasi (macOS) - opsional
├── PasteBridge.py             # Aplikasi utama
├── PasteBridge.spec           # Spec file PyInstaller
├── README.md
└── requirements.txt
```

---

## 🚀 Cara Menjalankan

### 1. Install Python (3.10+)

**Windows:**
Download dari [python.org](https://www.python.org/downloads/) dan centang "Add to PATH" saat install.

**macOS:**
```bash
brew install python
```

Verifikasi instalasi:
```bash
python --version   # atau python3 --version
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Jalankan Aplikasi

```bash
python PasteBridge.py
```

### 4. (macOS Only) Berikan Accessibility Permission

Agar `pyautogui` bisa simulasi keyboard di macOS:

1. Buka **System Preferences** → **Security & Privacy** → **Privacy**
2. Pilih **Accessibility** di sidebar
3. Klik 🔒 untuk unlock, lalu tambahkan **Terminal** atau **Python**

### 5. Aktifkan Tampermonkey di Browser

Gunakan script Tampermonkey yang memanggil endpoint `/paste`.

### 6. Fokus ke Field Input

Field input harus dalam keadaan aktif (fokus) saat nilai dikirim agar paste langsung bekerja.

---

## 🖥️ Build Executable

### Windows (.exe)

```bash
pyinstaller --onefile --windowed ^
  --icon=paste_bridge_icon.ico ^
  --add-data "paste_bridge_icon.ico;." ^
  PasteBridge.py
```

Hasil: `dist/PasteBridge.exe`

### macOS (.app)

```bash
pyinstaller --onefile --windowed \
  --icon=paste_bridge_icon.png \
  --add-data "paste_bridge_icon.ico:." \
  PasteBridge.py
```

> ⚠️ **Perbedaan penting:**
> - Windows menggunakan `;` (titik koma) untuk `--add-data`
> - macOS menggunakan `:` (titik dua) untuk `--add-data`
> - macOS bisa pakai `.png` untuk icon (auto-convert ke `.icns`)

Hasil: `dist/PasteBridge` (unix executable) atau `dist/PasteBridge.app`

### Build Script (Cross-Platform)

Buat file `build.py` untuk otomatis detect OS:

```python
import platform
import os

is_windows = platform.system() == "Windows"
separator = ";" if is_windows else ":"
icon_file = "paste_bridge_icon.ico" if is_windows else "paste_bridge_icon.png"

cmd = f'pyinstaller --onefile --windowed --icon={icon_file} --add-data "paste_bridge_icon.ico{separator}." PasteBridge.py'

print(f"Building for {platform.system()}...")
print(f"Command: {cmd}")
os.system(cmd)
```

Jalankan:
```bash
python build.py
```

---

## 📋 Contoh Script Tampermonkey

```javascript
// ==UserScript==
// @name         Paste Bridge Sender
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kirim nilai ke Paste Bridge
// @match        https://your-target-site.com/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    function sendToPasteBridge(nilai) {
        fetch("http://localhost:3030/paste", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nilai: nilai })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Paste Bridge:", data))
        .catch(err => console.error("❌ Error:", err));
    }

    // Contoh penggunaan
    sendToPasteBridge("9875000.00");
})();
```

---

## ⚙️ API Endpoint

### `GET /`
Health check endpoint.

**Response:**
```
PasteBridge aktif! ✅
```

### `POST /paste`
Menerima nilai untuk di-paste.

**Request Body:**
```json
{
  "nilai": "9875000.00"
}
```

**Response (Success):**
```json
{
  "status": "ok",
  "pasted": "9875000.00"
}
```

**Response (Skipped):**
```json
{
  "status": "skipped",
  "reason": "empty or stopped"
}
```

---

## 🧪 Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| `ModuleNotFoundError` | Dependencies belum terinstall | Jalankan `pip install -r requirements.txt` |
| Tidak terjadi paste | Field tidak fokus | Pastikan cursor aktif di input field |
| CORS error di browser | Header CORS tidak ada | Sudah ditangani di kode, pastikan server berjalan |
| Paste tidak trigger Angular | Menggunakan JS assignment | Gunakan Paste Bridge untuk trusted input |
| **[macOS]** Paste tidak bekerja | Tidak ada Accessibility permission | Tambahkan Terminal/Python di System Preferences → Privacy → Accessibility |
| **[macOS]** `command+v` tidak jalan | pyautogui belum dapat akses | Restart Terminal setelah memberikan permission |

---

## 🔒 Keamanan

- Server hanya listen di `localhost` (tidak bisa diakses dari luar)
- Hanya menerima request dari origin yang sama (CORS configured)
- Tidak ada data yang disimpan permanen

---

## 📊 Kompatibilitas

| OS | Status | Paste Shortcut | Icon Format |
|----|--------|----------------|-------------|
| Windows 10/11 | ✅ Tested | `Ctrl+V` | `.ico` |
| macOS 12+ | ✅ Tested | `⌘+V` | `.png` / `.icns` |
| Linux (Ubuntu/Debian) | ✅ Supported | `Ctrl+V` | `.png` |

---

## 🐧 Setup untuk Linux

### 1. Install Dependencies Sistem

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-tk xclip xdotool
```

**Fedora:**
```bash
sudo dnf install python3 python3-pip python3-tkinter xclip xdotool
```

**Arch Linux:**
```bash
sudo pacman -S python python-pip tk xclip xdotool
```

> ⚠️ `xclip` diperlukan untuk clipboard, `xdotool` untuk simulasi keyboard

### 2. Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

### 3. Jalankan

```bash
python3 PasteBridge.py
```

### 4. Build Executable (Linux)

```bash
pyinstaller --onefile --windowed \
  --icon=paste_bridge_icon.png \
  --add-data "paste_bridge_icon.ico:." \
  PasteBridge.py
```

Hasil: `dist/PasteBridge` (ELF binary)

### Troubleshooting Linux

| Masalah | Solusi |
|---------|--------|
| `Xlib.error.DisplayConnectionError` | Jalankan di environment dengan display (bukan SSH tanpa X11) |
| Clipboard tidak bekerja | Install `xclip`: `sudo apt install xclip` |
| Keyboard simulasi gagal | Install `xdotool`: `sudo apt install xdotool` |
| Permission denied | Pastikan user ada di group `input`: `sudo usermod -aG input $USER` |

---

## 🧪 Testing API

Sebelum menggunakan dengan Tampermonkey, pastikan server berjalan dengan benar.

### Health Check

**Browser:**
```
http://localhost:3030/
```
Response: `PasteBridge aktif! ✅`

### Test Paste Endpoint

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3030/paste" -Method POST -ContentType "application/json" -Body '{"nilai":"123.456,78"}'
```

**macOS / Linux (curl):**
```bash
curl -X POST http://localhost:3030/paste \
  -H "Content-Type: application/json" \
  -d '{"nilai":"123.456,78"}'
```

**Expected Response:**
```json
{
  "status": "ok",
  "pasted": "123.456,78"
}
```

### Test dengan Python

```python
import requests

response = requests.post(
    "http://localhost:3030/paste",
    json={"nilai": "9875000.00"}
)
print(response.json())
```

### Test CORS (Browser Console)

Buka browser console (F12) di halaman manapun dan jalankan:

```javascript
fetch("http://localhost:3030/paste", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nilai: "test123" })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Test Checklist

| Test | Command | Expected |
|------|---------|----------|
| Server aktif | `curl http://localhost:3030/` | `PasteBridge aktif! ✅` |
| POST request | `curl -X POST ... -d '{"nilai":"123"}'` | `{"status":"ok",...}` |
| Empty value | `curl -X POST ... -d '{"nilai":""}'` | `{"status":"skipped",...}` |
| CORS preflight | `curl -X OPTIONS http://localhost:3030/paste` | HTTP 200 |

---

## 📝 Requirements

```
customtkinter>=5.0.0
flask>=2.0.0
pyautogui>=0.9.50
pyperclip>=1.8.0
```

---

## 📄 License

MIT License - Bebas digunakan dan dimodifikasi.

---

## 👤 Credits

Developed by: **Annisa Baizan**

---

## 📌 Status

✅ **Stable dan Cross-Platform**

Dapat dijalankan di Windows dan macOS dengan executable masing-masing.