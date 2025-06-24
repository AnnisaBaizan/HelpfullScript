# 📋 Paste Bridge - Trusted Ctrl+V Automation System

## 🧠 Deskripsi

Paste Bridge adalah sistem otomatisasi sederhana yang menjembatani **script Tampermonkey di browser** dengan **input keyboard native dari Python** menggunakan `pyautogui`. Sistem ini dirancang untuk menangani kasus input yang  **tidak bisa dimasukkan langsung melalui JavaScript** , terutama pada aplikasi berbasis Angular/PrimeNG seperti  **SAKTI Kemenkeu** .

Dengan sistem ini, nilai numeric dari form bisa di-*paste* secara **trusted** (seolah-olah oleh manusia), sehingga memicu validasi dan mask Angular seperti seharusnya.

---

## 🔧 Teknologi yang Digunakan

### Python

* `Flask` - Menerima data dari browser (POST)
* `flask-cors` - Mengizinkan akses lintas origin
* `pyautogui` - Simulasi `Ctrl+V` pada input
* `pyperclip` - Menyalin nilai ke clipboard

### JavaScript (Browser)

* `Tampermonkey` - Script automation yang mengirim nilai ke server Python

### Lainnya

* `run.bat` - Script otomatis untuk men-setup dan menjalankan sistem di Windows
* `nilai.txt` - Tempat penyimpanan nilai sementara sebelum dipaste

---

## 🔁 Alur Kerja Sistem

1. **Tampermonkey** mendeteksi nilai dari halaman dan mengirimkannya via `fetch()` ke `http://localhost:3030/paste`.
2. **Flask server** menerima POST request dan menyimpan nilai ke file `nilai.txt`.
3. **Paste Bridge (Python)** mendeteksi perubahan `nilai.txt`, lalu:
   * Menyalin nilai ke clipboard
   * Melakukan `Ctrl+V` ke input aktif di layar (trusted paste)
4. Input field mengenali isi clipboard sebagai input manual → validasi Angular aktif.

---

## 📦 Struktur Folder

```
paste-bridge-project/
├── .venv/                 # Virtual environment (opsional, dibuat otomatis)
├── paste_server.py        # Flask API penerima nilai
├── paste_bridge.py        # Bridge clipboard + Ctrl+V
├── nilai.txt              # Tempat nilai terbaru
├── requirements.txt       # Dependency Python
├── run.bat                # Script eksekusi otomatis
```

---

## 🚀 Cara Menjalankan

### 1. **Install Python** (3.10+)

Pastikan `python` dan `pip` tersedia di PATH (cek dengan `python --version`).

### 2. **Double-click `run.bat`**

Script ini akan:

* Membuat `.venv/` jika belum ada
* Install seluruh dependensi dari `requirements.txt`
* Menjalankan `paste_server.py` dan `paste_bridge.py` di 2 jendela CMD

### 3. **Aktifkan Tampermonkey di Browser**

Gunakan script Tampermonkey yang memanggil `fetch("http://localhost:3030/paste")` dengan nilai.

### 4. **Fokus ke field input**

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

* Sistem menggunakan **timestamp (`mtime`) dari file** `nilai.txt` untuk mendeteksi update, agar nilai yang sama tetap dipaste ulang.
* `pyautogui.hotkey('ctrl', 'v')` hanya bekerja jika field input aktif dan siap menerima input
* File `nilai.txt` tidak perlu dihapus secara manual; cukup di-overwrite oleh Tampermonkey

---

## 🧹 Troubleshooting

| Masalah                     | Penyebab                                  | Solusi                                                        |
| --------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `ModuleNotFoundError`     | pip install salah target                  | Jalankan via `.venv\Scripts\pip`atau `run.bat`            |
| Tidak terjadi paste         | Field tidak fokus                         | Tambahkan `pyautogui.click(x, y)`sebelum `hotkey()`       |
| CORS error di browser       | Flask belum pakai CORS                    | Pastikan ada `from flask_cors import CORS`dan `CORS(app)` |
| Paste tidak trigger Angular | Gunakan `Ctrl+V`, bukan `value = ...` |                                                               |

---

## 🏁 Status

✅  **Stable dan portable** . Dapat dijalankan lintas komputer hanya dengan:

* Copy folder → double-click `run.bat` → jalan otomatis

---

## 📎 Credits

Developed by: **Annisa Baizan**

Guided by: ChatGPT (OpenAI) for automation scripting
