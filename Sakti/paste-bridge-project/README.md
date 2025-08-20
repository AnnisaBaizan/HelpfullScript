# 📋 Paste Bridge - Trusted Ctrl+V Automation System

## 🧠 Deskripsi

**Paste Bridge** adalah sistem otomatisasi sederhana yang menjembatani **script Tampermonkey di browser** dengan **input keyboard native dari Python** menggunakan `pyautogui`.

Sistem ini dirancang untuk menangani kasus input yang **tidak bisa dimasukkan langsung lewat JavaScript**, terutama pada aplikasi berbasis Angular/PrimeNG seperti **SAKTI Kemenkeu**.

Dengan Paste Bridge, nilai numeric dari form bisa di-*paste* secara **trusted** (seolah-olah diketik manusia), sehingga validasi dan masking Angular tetap berjalan normal.

---

## 🔧 Teknologi yang Digunakan

### Python

* `Flask` - Menerima data dari browser (POST)
* `flask-cors` - Mengizinkan akses lintas origin
* `pyautogui` - Simulasi `Ctrl+V` pada input
* `pyperclip` - Menyalin nilai ke clipboard
* `customtkinter` - GUI kontrol sederhana (Start/Stop, status, nilai terakhir)

### JavaScript (Browser)

* `Tampermonkey` - Script automation yang mengirim nilai ke server Python

### Lainnya

* `run.bat` - Script otomatis untuk setup & menjalankan aplikasi di Windows
* `paste_bridge_icon.ico` - Ikon GUI (opsional)

---

## 🔁 Alur Kerja Sistem

1. **Tampermonkey** mengambil nilai dari halaman dan mengirimkannya via `fetch()` ke `http://localhost:3030/paste`.
2. **Flask server (dalam `main.py`)** menerima nilai dan menyimpannya ke variabel global.
3. **Bridge loop** mendeteksi nilai baru, lalu:

   * Menyalin nilai ke clipboard (`pyperclip`)
   * Melakukan `Ctrl+V` (`pyautogui.hotkey("ctrl", "v")`) ke field input aktif
4. Field input mengenali isi clipboard sebagai input manual → validasi Angular aktif.

---

## 📦 Struktur Folder

```
paste-bridge-project/
├── .venv/                   # Virtual environment (opsional)
├── main.py                  # Program utama (Flask + Bridge + GUI)
├── requirements.txt          # Dependency Python
├── run.bat                   # Script eksekusi otomatis
├── paste_bridge_icon.ico     # Ikon aplikasi (opsional)
```

---

## 🚀 Cara Menjalankan

### 1. **Install Python** (3.10+)

Pastikan `python` dan `pip` tersedia di PATH (cek dengan `python --version`).

### 2. **Double-click `run.bat`**

Script ini akan:

* Membuat `.venv/` jika belum ada
* Install seluruh dependensi dari `requirements.txt`
* Menjalankan `main.py` (GUI akan terbuka)

### 3. **Aktifkan Tampermonkey di Browser**

Gunakan script Tampermonkey yang memanggil `fetch("http://localhost:3030/paste")` dengan nilai.

### 4. **Fokus ke Field Input**

Field input harus dalam keadaan aktif (fokus) saat nilai dikirim agar `Ctrl+V` langsung bekerja.

---

## 📋 Contoh Script Tampermonkey

```js
fetch("http://localhost:3030/paste", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nilai: "9875000.00" })
});
```

---

## 🧪 Catatan Teknis

* Sistem sekarang **tidak lagi menggunakan `nilai.txt`** → lebih cepat & ringan.
* Deteksi nilai baru dilakukan langsung dari variabel global (in-memory).
* `pyautogui.hotkey('ctrl', 'v')` hanya bekerja jika field input aktif.
* GUI menampilkan status aktif/berhenti dan nilai terakhir yang berhasil dipaste.

---

## 🧹 Troubleshooting

| Masalah                     | Penyebab                            | Solusi                                                       |
| --------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `ModuleNotFoundError`       | Dependensi belum terinstall         | Jalankan via `.venv\Scripts\pip install -r requirements.txt` |
| Tidak terjadi paste         | Field tidak fokus                   | Pastikan kursor ada di field sebelum nilai dikirim           |
| CORS error di browser       | Flask belum pakai CORS              | Pastikan ada `from flask_cors import CORS` dan `CORS(app)`   |
| Paste tidak trigger Angular | Gunakan `Ctrl+V`, bukan `value=...` |                                                              |

---

## 🏁 Build ke .EXE

Jika ingin program dijalankan tanpa Python, bisa build ke `.exe` menggunakan **PyInstaller**:

```bash
pip install pyinstaller
pyinstaller --onefile --windowed ^
  --icon=paste_bridge_icon.ico ^
  --add-data "paste_bridge_icon.ico;." ^
  main.py
```

Hasil build akan ada di folder `dist/main.exe`.
File `.exe` ini bisa langsung dipakai di komputer lain tanpa perlu install Python.

---

## 📌 Credits

Developed by: **Annisa Baizan**
Guided by: ChatGPT (OpenAI) for automation scripting