# 📋 Paste Bridge - Trusted Ctrl+V Automation System

## 🧠 Deskripsi

Paste Bridge adalah sistem otomatisasi sederhana yang menjembatani **script Tampermonkey di browser** dengan **input keyboard native dari Python** menggunakan `pyautogui`. Sistem ini dirancang untuk menangani kasus input yang **tidak bisa dimasukkan langsung melalui JavaScript**, terutama pada aplikasi berbasis Angular/PrimeNG seperti **SAKTI Kemenkeu**.

Dengan sistem ini, nilai numeric dari form bisa di-*paste* secara **trusted** (seolah-olah oleh manusia), sehingga memicu validasi dan mask Angular seperti seharusnya.

---

## 🔧 Teknologi yang Digunakan

### Python

* `Flask` - Menerima data dari browser (POST)
* `flask-cors` - Mengizinkan akses lintas origin
* `pyautogui` - Simulasi `Ctrl+V` pada input
* `pyperclip` - Menyalin nilai ke clipboard
* `customtkinter` - GUI kontrol status sistem

### JavaScript (Browser)

* `Tampermonkey` - Script automation yang mengirim nilai ke server Python

### Lainnya

* `paste_bridge_icon.ico` - Ikon aplikasi
* `PyInstaller` - Build `.exe` portable

---

## 🔁 Alur Kerja Sistem

1. **Tampermonkey** mendeteksi nilai dari halaman dan mengirimkannya via `fetch()` ke `http://localhost:3030/paste`.
2. **Flask server** menerima POST request dan menyimpan nilai ke variabel global.
3. **Paste Bridge (Python)** otomatis:

   * Menyalin nilai ke clipboard
   * Melakukan `Ctrl+V` ke input aktif di layar (trusted paste)
4. Input field mengenali isi clipboard sebagai input manual → validasi Angular aktif.

---

## 📦 Struktur Folder

```
paste-bridge-project/
├── build/                  # Folder build PyInstaller (otomatis)
├── dist/                   # Hasil akhir .exe dari PyInstaller
├── .gitignore              # File git ignore
├── NestedLoop-FormPython.js # Script Tampermonkey contoh
├── paste_bridge_icon.ico   # Ikon aplikasi
├── PasteBridge.py          # Aplikasi utama (Python)
├── PasteBridge.spec        # Spec file PyInstaller
├── README.md               # Dokumentasi
├── requirements.txt        # Dependency Python
```

---

## 🚀 Cara Menjalankan (Mode Python)

### 1. **Install Python** (3.10+)

Pastikan `python` dan `pip` tersedia di PATH (cek dengan `python --version`).

### 2. **Install Dependency**

```bash
pip install -r requirements.txt
```

### 3. **Jalankan Aplikasi**

```bash
python PasteBridge.py
```

### 4. **Aktifkan Tampermonkey di Browser**

Gunakan script Tampermonkey yang memanggil `fetch("http://localhost:3030/paste")` dengan nilai.

### 5. **Fokus ke field input**

Field input harus dalam keadaan aktif (fokus) saat nilai dikirim agar `Ctrl+V` langsung bekerja.

---

## 🖥️ Build ke `.exe`

Untuk membuat versi portable tanpa Python:

```bash
pyinstaller --onefile --windowed \
  --icon=paste_bridge_icon.ico \
  --add-data "paste_bridge_icon.ico;." \
  PasteBridge.py
```

Hasil build ada di folder `dist/` → file `PasteBridge.exe` siap dijalankan.

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

* Tidak ada lagi `nilai.txt`, sistem langsung pakai variabel global.
* `pyautogui.hotkey('ctrl', 'v')` hanya bekerja jika field input aktif dan siap menerima input.
* GUI tersedia untuk memantau status dan menghentikan/melanjutkan bridge.

---

## 🧹 Troubleshooting

| Masalah                     | Penyebab                              | Solusi                                                     |
| --------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `ModuleNotFoundError`       | pip install salah target              | Jalankan via `pip install -r requirements.txt`             |
| Tidak terjadi paste         | Field tidak fokus                     | Tambahkan `pyautogui.click(x, y)` sebelum `hotkey()`       |
| CORS error di browser       | Flask belum pakai CORS                | Pastikan ada `from flask_cors import CORS` dan `CORS(app)` |
| Paste tidak trigger Angular | Gunakan `Ctrl+V`, bukan `value = ...` |                                                            |

---

## 🏁 Status

✅ **Stable dan portable**. Dapat dijalankan lintas komputer hanya dengan:

* Copy folder → jalankan `PasteBridge.exe` → siap digunakan

---

## 📎 Credits

Developed by: **Annisa Baizan**
Guided by: ChatGPT (OpenAI) for automation scripting
