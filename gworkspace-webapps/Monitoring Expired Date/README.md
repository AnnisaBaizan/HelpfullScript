# 📋 Sistem Monitoring Expired Date (ED) — Bahan Praktikum Habis Pakai
**Lab Kesehatan Gigi · Poltekkes Kemenkes Palembang**

---

## Overview

Sistem monitoring digital berbasis **Google Sheets + Google Apps Script** untuk memantau masa kedaluwarsa (Expired Date/ED) bahan praktikum habis pakai di Laboratorium Jurusan Kesehatan Gigi Poltekkes Kemenkes Palembang.

Sistem ini dibangun sebagai bagian dari kegiatan **Aktualisasi CPNS Latsar Golongan II Angkatan 6** atas inisiasi Pranata Laboratorium Pendidikan (PLP) Terampil — Salsabila Erwani, A.Md. Kes.

---

## Stack & Platform

| Komponen | Teknologi | Biaya |
|---|---|---|
| Database & UI | Google Sheets | Gratis |
| Automation / Email Alert | Google Apps Script | Gratis |
| Email Delivery | Gmail via `MailApp` | Gratis |
| Hosting / Server | Google Cloud (built-in) | Gratis |
| Spreadsheet template build | Python + openpyxl | — |

**Running cost: Rp 0 / bulan.** Tidak ada server, tidak ada domain, tidak ada biaya berlangganan.

---

## Repository Structure

```
monitoring-ed-lab-kesgi/
│
├── Monitoring_ED_LabKesgi.xlsx        # Template spreadsheet awal (v1)
├── apps_script/
│   └── monitoring_ed.gs               # Full Apps Script code (selalu update ke versi terbaru)
├── docs/
│   ├── Panduan_User_Monitoring_ED.docx
│   └── README_Developer.md            # File ini
└── build/
    └── build_monitoring_ed.py         # Script Python untuk rebuild template xlsx
```

---

## Spreadsheet Architecture

### Sheet Tabs

| Tab | Warna | Fungsi | Editable |
|---|---|---|---|
| `BAHAN BHP 2026` | Biru | Tab utama — input & display semua data bahan | ✅ PLP |
| `REFERENSI` | Abu | Master data dropdown (satuan, lokasi, kategori) | ⚠️ Admin only |
| `RINGKASAN` | Hijau | Dashboard rekap + pengaturan threshold dinamis | ✅ PLP (sel D4 & D6) |
| `LOG` | Abu gelap | Catatan perubahan manual oleh PLP | ✅ PLP |

> ⚠️ **Catatan nama sheet:** Nama tab utama adalah `BAHAN BHP 2026` (bukan `DATABASE`). Semua referensi formula di sheet lain yang merujuk tab ini harus menggunakan tanda kutip satu karena mengandung spasi:
> ```
> ='BAHAN BHP 2026'!I4:I200
> ```

---

### DATABASE Column Map

| Col | Header | Type | Notes |
|---|---|---|---|
| A | NO | Number | Manual — nomor urut |
| B | NAMA BAHAN | String | Manual — nama bahan |
| C | KATEGORI | Dropdown | Source: `REFERENSI!$E$2:$E$8` |
| D | SATUAN | Dropdown | Source: `REFERENSI!$A$2:$A$10` |
| E | JUMLAH STOK | Number | Manual — update setiap perubahan stok |
| F | TANGGAL MASUK | Date (DD/MM/YYYY) | Manual |
| G | TANGGAL EXPIRED | Date (DD/MM/YYYY) | **Manual — dari kemasan fisik** |
| H | SISA HARI | Formula | `=IF(G{n}="","",G{n}-TODAY())` |
| I | STATUS ED | Formula | IFS dinamis — lihat formula section |
| J | KODE BARANG | String | Manual — kode inventaris/BMN |
| K | LOKASI SIMPAN | Dropdown | Source: `REFERENSI!$C$2:$C$8` |
| L | MERK / PRODUSEN | String | Manual — opsional |
| M | KETERANGAN | String | Manual — opsional |

**Total kolom aktif: 13 (A–M)**

---

### Key Formulas

**Kolom H — Sisa Hari:**
```
=IF(G4="","",G4-TODAY())
```

**Kolom I — Status ED (Dinamis):**
```
=IF(H4="","",IF(H4<0,"⛔ EXPIRED",IF(H4<=RINGKASAN!$D$6,"🔴 KRITIS",IF(H4<=RINGKASAN!$D$4,"🟡 PERHATIAN","🟢 AMAN"))))
```

> Threshold diambil langsung dari sheet RINGKASAN:
> - `RINGKASAN!$D$4` = batas hari PERHATIAN (default: 90)
> - `RINGKASAN!$D$6` = batas hari KRITIS (default: 30)
> 
> Mengubah nilai D4/D6 di RINGKASAN → seluruh STATUS ED di sheet BAHAN BHP 2026 otomatis menyesuaikan.

**RINGKASAN sheet — COUNTIF formulas:**
```
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*AMAN*")
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*PERHATIAN*")
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*KRITIS*")
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*EXPIRED*")
=COUNTA('BAHAN BHP 2026'!B4:B200)
```

> ⚠️ Tanda kutip satu wajib karena nama sheet mengandung spasi. Tanpa tanda kutip → error `#REF!`.

---

### Conditional Formatting Rules (BAHAN BHP 2026, A4:M100)

Applied in priority order (highest first wins):

| Priority | Condition | Background | Font Color |
|---|---|---|---|
| 1 | `=$H4<0` | `#FFCDD2` | `#B71C1C` bold |
| 2 | `=AND($H4>=0,$H4<=30)` | `#FFE0B2` | `#E65100` bold |
| 3 | `=AND($H4>30,$H4<=90)` | `#FFF9C4` | `#F57F17` |
| 4 | `=$H4>90` | `#E8F5E9` | `#1B5E20` |

> Jika threshold diubah di RINGKASAN, conditional formatting **tidak otomatis berubah** — perlu diupdate manual di Format → Conditional formatting jika ingin konsisten secara visual dengan nilai threshold baru.

---

## Apps Script

### File Location
Script dijalankan dari akun Google **terpisah** dari pemilik spreadsheet. Akses ke spreadsheet dilakukan via `SpreadsheetApp.openById()`.

### CONFIG Object

```javascript
const CONFIG = {
  EMAIL_PENERIMA:      "labkesgi.poltekkesplg@gmail.com",
  NAMA_LAB:            "Laboratorium Kesehatan Gigi",
  INSTITUSI:           "Poltekkes Kemenkes Palembang",
  BATAS_HARI:          90,
  ID_SPREADSHEET:      "1l-g93l5iLpI5ZGsiF6ajH41btcl7GQxc3hHDElGMswM",
  NAMA_SHEET:          "BAHAN BHP 2026",   // nama tab utama
  NAMA_RINGKASAN:      "RINGKASAN",
  BARIS_MULAI:         4,
  SEL_BATAS_PERHATIAN: "D4",               // RINGKASAN!D4
  SEL_BATAS_KRITIS:    "D6",               // RINGKASAN!D6
};
```

### COL Mapping

```javascript
const COL = {
  NO:           1,   // A
  NAMA_BAHAN:   2,   // B
  KATEGORI:     3,   // C
  SATUAN:       4,   // D
  STOK:         5,   // E
  TGL_MASUK:    6,   // F
  TGL_EXPIRED:  7,   // G
  SISA_HARI:    8,   // H
  STATUS:       9,   // I
  KODE_BARANG:  10,  // J  ← ditambahkan v1.1
  LOKASI:       11,  // K
  MERK:         12,  // L
  KET:          13,  // M
};
```

### Alert Logic

```
for each row in BAHAN BHP 2026 starting from BARIS_MULAI:
  if (namaBahan is empty OR tglExpired is empty) → skip
  if (stok <= 0) → skip

  hitung sisaHari = tglExpired - today

  if (stok > 0 AND sisaHari <= batasPerhatian):
    if (sisaHari < 0)              → kelompok.expired
    if (sisaHari <= batasKritis)   → kelompok.kritis
    else                           → kelompok.perhatian
  else:
    tidak masuk list (aman)

if (totalAlert == 0) → TIDAK kirim email
if (totalAlert > 0)  → kirim email HTML ke EMAIL_PENERIMA
```

### Threshold — Dibaca Dinamis dari Sheet RINGKASAN

```javascript
const batasPerhatian = ringkasan.getRange("D4").getValue();
const batasKritis    = ringkasan.getRange("D6").getValue();
```

Script **tidak hardcode angka 30/90**. Nilai dibaca langsung dari sheet setiap kali script berjalan. Ubah D4/D6 di spreadsheet → email alert besok langsung pakai nilai baru.

### Email Columns (per bahan di tabel)

| Kolom Email | Source |
|---|---|
| Nama Bahan | COL.NAMA_BAHAN |
| Kode Barang | COL.KODE_BARANG ← baru v1.1 |
| Tgl Expired | COL.TGL_EXPIRED |
| Sisa / Status | Dihitung dari sisaHari |
| Stok | COL.STOK |
| Lokasi | COL.LOKASI |
| Merk | COL.MERK |

### Functions

| Function | Deskripsi | Dipanggil oleh |
|---|---|---|
| `kirimEmailAlertED()` | Fungsi utama — baca sheet, filter bahan, kirim email | Trigger harian |
| `buatBodyEmail(kelompok, total, today, batasKritis, batasPerhatian)` | Generate HTML email body | `kirimEmailAlertED()` |
| `buatTabel(items, warnaHeader)` | Generate HTML tabel per kategori | `buatBodyEmail()` |
| `setupTriggerHarian()` | Buat time-based trigger harian jam 07.00 | Manual — jalankan sekali |
| `testKirimEmailSekarang()` | Test kirim email langsung | Manual saat testing |

### Trigger Configuration

```javascript
ScriptApp.newTrigger("kirimEmailAlertED")
  .timeBased()
  .everyDays(1)
  .atHour(7)
  .create();
```

> **Tidak perlu deploy** untuk mengaktifkan trigger. Cukup jalankan `setupTriggerHarian()` sekali via tombol Run di Apps Script editor.

Pastikan timezone project Apps Script sudah diset ke **Asia/Jakarta (WIB, UTC+7)**:
- Apps Script editor → Project Settings → Time zone → `(GMT+07:00) Asia/Jakarta`

### Email Quota

| Tipe Akun | Limit/hari |
|---|---|
| Gmail biasa (@gmail.com) | 100 email |
| Google Workspace | 1.500 email |

Sistem hanya kirim **1 email per hari** (atau 0 jika semua aman) — jauh di bawah limit.

---

## Deployment Steps

### 1. Upload Spreadsheet

```
1. Download file Monitoring_ED_LabKesgi.xlsx
2. Buka drive.google.com dengan akun lab (labkesgi.poltekkesplg@gmail.com)
3. Upload file xlsx
4. Klik kanan → Open with → Google Sheets
5. File terkonversi otomatis ke Google Sheets
6. Catat Spreadsheet ID dari URL:
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
7. Rename tab "DATABASE" → "BAHAN BHP 2026"
8. Update semua formula COUNTIF di sheet RINGKASAN:
   Ctrl+H → cari "DATABASE!" → ganti "'BAHAN BHP 2026'!" → Replace All
```

### 2. Setup Apps Script

```
1. Buka tab baru / incognito
2. Login dengan akun script (bukan akun lab)
3. Buka script.google.com
4. Klik "New project"
5. Rename project: "Monitoring ED - Lab Kesgi"
6. Hapus semua kode default
7. Paste kode dari apps_script/monitoring_ed.gs
8. Update CONFIG.ID_SPREADSHEET dengan ID dari langkah 1
9. Simpan (Ctrl+S)
```

### 3. Test & Authorize

```
1. Dropdown fungsi → pilih: testKirimEmailSekarang
2. Klik Run ▶
3. Klik "Review permissions" → pilih akun script → Advanced → Allow
4. Cek Logger untuk konfirmasi hasil
5. Cek inbox labkesgi.poltekkesplg@gmail.com
```

### 4. Aktifkan Trigger Harian

```
1. Dropdown fungsi → pilih: setupTriggerHarian
2. Klik Run ▶ (tidak perlu deploy)
3. Verifikasi di Triggers (ikon jam sidebar kiri):
   kirimEmailAlertED | Time-driven | Day timer | 7am-8am
```

### 5. Share Spreadsheet ke Akun PLP

```
1. Buka spreadsheet di akun lab
2. Klik Share → tambah email PLP → set permission: Editor
```

---

## Troubleshooting

### #REF! error di sheet RINGKASAN

```
Penyebab: Formula COUNTIF masih mereferensikan nama sheet lama ("DATABASE")
          padahal nama sheet sudah diganti.

Solusi:
1. Buka sheet RINGKASAN
2. Tekan Ctrl+H (Find & Replace)
3. Find:         DATABASE!
   Replace with: 'BAHAN BHP 2026'!
4. Centang "Also search within formulas"
5. Replace All → Done
```

### Trigger tidak jalan / email tidak dikirim

```
1. Buka script.google.com di akun script
2. Buka project "Monitoring ED - Lab Kesgi"
3. Klik Triggers (ikon jam di sidebar)
4. Jika tidak ada trigger → jalankan setupTriggerHarian() lagi
5. Cek Executions (ikon play di sidebar) untuk melihat log error
```

### Email masuk ke Spam

```
1. Buka Gmail lab → folder Spam
2. Cari email dari akun script
3. Klik "Not spam"
4. Tambahkan akun script ke Contacts Gmail lab
```

### Sisa Hari tidak terhitung (kolom H kosong)

```
Penyebab: Kolom G tidak terbaca sebagai Date
Solusi:
1. Select kolom G
2. Format → Number → Date → pilih DD/MM/YYYY
3. Re-enter tanggal di baris yang bermasalah
```

### Status ED tidak berubah setelah ubah threshold D4/D6

```
Penyebab: Google Sheets perlu refresh untuk recalculate
Solusi: Tutup dan buka kembali file, atau tekan Ctrl+R
Catatan: Conditional formatting (warna baris) tidak otomatis ikut threshold —
         perlu update manual di Format → Conditional formatting jika diperlukan.
```

### Menambah penerima email

```javascript
// Ubah EMAIL_PENERIMA di CONFIG menjadi multiple (pisah koma):
EMAIL_PENERIMA: "labkesgi.poltekkesplg@gmail.com,ketua.kesgi@poltekkes-plg.ac.id",
```

---

## Data Migration

Spreadsheet awal berisi data dummy. Langkah migrasi ke data asli:

```
1. Buka tab BAHAN BHP 2026
2. Select baris 4 sampai baris terakhir data dummy
3. Delete rows
4. Input data asli dari stock opname terbaru
5. Pastikan kolom G (Tanggal Expired) terbaca sebagai Date
6. Cek kolom H dan I terisi otomatis
7. Cek sheet RINGKASAN — pastikan COUNTIF sudah menampilkan angka (bukan #REF!)
```

---

## Security Notes

- **Spreadsheet ID** bersifat semi-publik — pastikan sharing setting diset ke **"Restricted"**
- **Akun script** menggunakan OAuth token yang dikelola Google — tidak ada credential tersimpan
- **Email penerima** hardcoded di CONFIG — update manual jika email lab berubah
- Tidak ada data yang dikirim ke pihak ketiga — semua berjalan di ekosistem Google

---

## Change Log

| Tanggal | Versi | Perubahan | Developer |
|---|---|---|---|
| 04/04/2026 | v1.0.0 | Initial release — 36 item dummy, 4 sheet, trigger harian, email HTML | Annisa Baizan |
| 10/04/2026 | v1.1.0 | Tambah kolom KODE BARANG (J), COL mapping 12→13, threshold dinamis via RINGKASAN, rename sheet DATABASE→BAHAN BHP 2026 | Annisa Baizan |

---

## Developer Contact

**Annisa Baizan**
Developer / Penyedia Jasa
Palembang, April 2026

---

*Dokumen ini dibuat untuk keperluan maintenance dan handover teknis sistem.*
*Dilarang mendistribusikan Spreadsheet ID ke pihak yang tidak berkepentingan.*
