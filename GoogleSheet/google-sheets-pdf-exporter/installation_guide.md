# Panduan Instalasi - Google Sheets PDF Exporter

Panduan lengkap untuk menginstal dan mengkonfigurasi Google Sheets PDF Exporter.

## 📋 Daftar Isi

- [Prasyarat](#prasyarat)
- [Instalasi Step-by-Step](#instalasi-step-by-step)
- [Memberikan Izin Akses](#memberikan-izin-akses)
- [Verifikasi Instalasi](#verifikasi-instalasi)
- [Troubleshooting](#troubleshooting)

---

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- ✅ Akun Google (Gmail)
- ✅ Akses ke Google Sheets
- ✅ Browser modern (Chrome, Firefox, Safari, Edge)
- ✅ Koneksi internet yang stabil

---

## Instalasi Step-by-Step

### Langkah 1: Buka Google Sheets

1. Buka Google Sheets yang ingin Anda tambahkan fitur export PDF
2. Atau buat spreadsheet baru di [sheets.google.com](https://sheets.google.com)

### Langkah 2: Akses Apps Script Editor

Ada 2 cara untuk membuka Apps Script Editor:

**Cara 1: Melalui Menu**
1. Klik menu **Extensions** di toolbar atas
2. Pilih **Apps Script**

**Cara 2: Melalui URL (Langsung)**
```
https://script.google.com/home/projects/[SPREADSHEET_ID]/edit
```

### Langkah 3: Hapus Kode Default

1. Anda akan melihat file `Code.gs` dengan fungsi `myFunction()` default
2. **Hapus semua kode** yang ada di editor

### Langkah 4: Copy-Paste Script

1. Copy seluruh kode dari file `Code.gs` di repository ini
2. Paste ke Apps Script Editor
3. Kode akan terlihat seperti ini:

```javascript
function downloadSheetKolomM() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getActiveSheet();
  // ... dst
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('PRINT TOOLS')
    // ... dst
}
```

### Langkah 5: Simpan Proyek

1. Klik ikon **Save** (💾) atau tekan `Ctrl+S` (Windows) / `Cmd+S` (Mac)
2. Beri nama proyek Anda, misalnya: **"PDF Exporter"**
3. Klik **OK**

### Langkah 6: Kembali ke Spreadsheet

1. Tutup tab Apps Script atau klik ikon **X**
2. Kembali ke tab Google Sheets Anda
3. **Refresh halaman** (F5 atau Ctrl+R)

### Langkah 7: Verifikasi Menu Muncul

Setelah refresh, Anda akan melihat menu baru bernama **"PRINT TOOLS"** di sebelah menu **Help**.

---

## Memberikan Izin Akses

Saat pertama kali menjalankan script, Anda harus memberikan izin:

### Langkah 1: Jalankan Script Pertama Kali

1. Klik menu **PRINT TOOLS**
2. Pilih **Download PDF (Kolom A–M)**

### Langkah 2: Dialog Authorization

Anda akan melihat dialog **"Authorization Required"**:

1. Klik **Continue**
2. Pilih **akun Google Anda**

### Langkah 3: Review Permissions

Google akan menampilkan peringatan karena script ini belum diverifikasi:

1. Klik **Advanced** (di pojok kiri bawah)
2. Klik **Go to [Nama Proyek] (unsafe)**
   - Jangan khawatir, ini aman karena Anda yang membuat script ini

### Langkah 4: Allow Permissions

1. Review izin yang diminta:
   - ✅ View and manage spreadsheets
   - ✅ Connect to external service
2. Klik **Allow**

### Langkah 5: Selesai!

Script sekarang siap digunakan. Izin ini hanya perlu diberikan **sekali**.

---

## Verifikasi Instalasi

### Test 1: Cek Menu

✅ Menu **PRINT TOOLS** muncul di toolbar
✅ Submenu **Download PDF (Kolom A–M)** tersedia

### Test 2: Coba Download

1. Isi cell **F20** dengan nilai, misalnya: `2023`
3. Klik **PRINT TOOLS > Download PDF (Kolom A–M)**
4. Dialog "Download PDF" muncul
5. Status berubah dari "Memproses download..." ke "Download selesai!"
6. File PDF terdownload dengan nama: `Laporan_Monev_Akademik_Tahun_2023.pdf`

### Test 3: Verifikasi Konten PDF

1. Buka file PDF yang terdownload
2. ✅ Hanya kolom A sampai M yang tercetak
3. ✅ Kolom N dan seterusnya tidak muncul
4. ✅ Format sesuai dengan tampilan di spreadsheet

---

## Troubleshooting

### ❌ Menu "PRINT TOOLS" Tidak Muncul

**Solusi:**
1. Pastikan Anda sudah **save** script di Apps Script Editor
2. **Refresh** halaman spreadsheet (F5)
3. Tunggu 5-10 detik, lalu refresh lagi
4. Jika masih belum muncul, tutup spreadsheet dan buka kembali

**Alternatif:**
- Jalankan fungsi `onOpen()` secara manual dari Apps Script Editor:
  1. Buka Apps Script Editor
  2. Pilih fungsi `onOpen` dari dropdown
  3. Klik **Run**
  4. Kembali ke spreadsheet dan refresh

### ❌ Error "Authorization Required"

**Solusi:**
1. Ikuti langkah [Memberikan Izin Akses](#memberikan-izin-akses) di atas
2. Pastikan Anda login dengan akun Google yang benar
3. Jika diminta "App is not verified", klik **Advanced > Go to [Project Name]**

### ❌ Dialog Muncul Kosong / Blank

**Penyebab:**
- Pop-up blocker aktif
- Browser tidak support

**Solusi:**
1. Izinkan pop-up untuk Google Sheets:
   - Chrome: Klik ikon 🚫 di address bar → Allow
   - Firefox: Klik Options → Allow
2. Coba browser lain (Chrome disarankan)
3. Disable extension browser yang mungkin memblokir

### ❌ PDF Tidak Terdownload / Stuck

**Solusi:**
1. Periksa koneksi internet
2. Pastikan spreadsheet tidak terlalu besar (>1000 baris bisa lambat)
3. Tunggu hingga 30 detik untuk file besar
4. Coba tutup dialog dan jalankan ulang

### ❌ Error "Script function not found"

**Penyebab:**
- Nama fungsi salah
- Script belum tersimpan

**Solusi:**
1. Buka Apps Script Editor
2. Pastikan ada fungsi `downloadSheetKolomM()` dan `onOpen()`
3. Save ulang (Ctrl+S)
4. Refresh spreadsheet

### ❌ Kolom N Tetap Muncul di PDF

**Solusi:**
1. Pastikan kode di baris 13-15 ada:
```javascript
if (lastColumn > 13) {
  sheet.hideColumns(14, lastColumn - 13);
}
```
2. Cek apakah ada protected range di kolom N
3. Manual test: coba hide kolom N secara manual dulu

### ❌ Nama File Tidak Sesuai / Aneh

**Penyebab:**
- Cell F20 atau G20 kosong
- Cell berisi formula yang error

**Solusi:**
1. Pastikan F20 dan G20 terisi dengan **nilai teks atau angka**
2. Jika berisi formula, pastikan formula tidak error (#VALUE!, #REF!, dll)
3. Contoh isi cell yang benar:
   - F20: `2023` atau `Semester 1`
   - G20: `2024` atau `Ganjil`

---

## Konfigurasi Lanjutan

### Mengubah Cell Sumber Nama File

Edit di `Code.gs` baris 8-9:

```javascript
// Dari F20:G20
const valueF20 = sheet.getRange('F20').getValue();

// Ubah ke cell lain, misalnya B5:C5
const valueF20 = sheet.getRange('B5').getValue();
```

### Mengubah Format Nama File

Edit baris 10:

```javascript
// Format default
const fileName = `Laporan_Monev_Akademik_Tahun_${valueF20}`;

// Contoh format lain:
const fileName = `Report_${valueF20}`;
const fileName = `${valueF20}_Academic_Report`;
```

### Menambahkan Timestamp di Nama File

```javascript
const timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd_HHmmss');
const fileName = `Laporan_${valueF20}_${timestamp}`;
```

---

## Uninstall / Hapus Script

Jika ingin menghapus script:

### Cara 1: Hapus dari Apps Script Editor
1. Buka **Extensions > Apps Script**
2. Klik **Overview** (ikon ⓘ di sidebar kiri)
3. Klik ikon **⋮** (three dots)
4. Pilih **Remove project**

### Cara 2: Hapus Menu Saja
1. Buka Apps Script Editor
2. Hapus seluruh fungsi `onOpen()`
3. Save dan refresh spreadsheet
4. Menu akan hilang tapi script masih ada

---

## Update Script

Jika ada versi baru:

1. Buka Apps Script Editor
2. **Backup** kode lama Anda (copy ke notepad)
3. Hapus semua kode
4. Copy-paste kode versi baru
5. **Save** (Ctrl+S)
6. Kembali ke spreadsheet dan **refresh**

---

## Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **GitHub Issues**: [Buat issue baru](https://github.com/AnnisaBaizan/HelpfullScript/GoogleSheet/google-sheets-pdf-exporter/issues)
2. **Email Support**: annisabaizan1@gmail.com
3. **Dokumentasi Google**: [Apps Script Documentation](https://developers.google.com/apps-script)

---

## Checklist Instalasi

Gunakan checklist ini untuk memastikan instalasi sukses:

- [ ] Google Sheets terbuka
- [ ] Apps Script Editor diakses
- [ ] Kode default dihapus
- [ ] Kode baru di-paste
- [ ] Proyek disimpan (Ctrl+S)
- [ ] Spreadsheet di-refresh (F5)
- [ ] Menu "PRINT TOOLS" muncul
- [ ] Izin akses diberikan
- [ ] Cell F20 terisi
- [ ] Test download berhasil
- [ ] PDF terdownload dengan nama yang benar
- [ ] Hanya kolom A-M yang tercetak

---

**Selamat! Script berhasil diinstal dan siap digunakan.** 🎉

Jika panduan ini membantu, berikan ⭐ di GitHub!