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
├── Monitoring_ED_LabKesgi.xlsx        # Template spreadsheet (upload ke Google Drive)
├── apps_script/
│   └── monitoring_ed.gs               # Full Apps Script code
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
| `DATABASE` | Biru | Tab utama — input & display semua data bahan | ✅ PLP |
| `REFERENSI` | Abu | Master data dropdown (satuan, lokasi, kategori) | ⚠️ Admin only |
| `RINGKASAN` | Hijau | Dashboard rekap otomatis via COUNTIF | ❌ Read-only |
| `LOG` | Abu gelap | Catatan perubahan manual oleh PLP | ✅ PLP |

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
| I | STATUS ED | Formula | IFS based on H value — lihat formula section |
| J | LOKASI SIMPAN | Dropdown | Source: `REFERENSI!$C$2:$C$8` |
| K | MERK / PRODUSEN | String | Manual — opsional |
| L | KETERANGAN | String | Manual — opsional |

### Key Formulas

**Kolom H — Sisa Hari:**
```
=IF(G4="","",G4-TODAY())
```

**Kolom I — Status ED:**
```
=IF(H4="","",IF(H4<0,"⛔ EXPIRED",IF(H4<=30,"🔴 KRITIS",IF(H4<=90,"🟡 PERHATIAN","🟢 AMAN"))))
```

**RINGKASAN sheet — COUNTIF formulas:**
```
=COUNTIF(DATABASE!I4:I200,"*AMAN*")
=COUNTIF(DATABASE!I4:I200,"*PERHATIAN*")
=COUNTIF(DATABASE!I4:I200,"*KRITIS*")
=COUNTIF(DATABASE!I4:I200,"*EXPIRED*")
=COUNTA(DATABASE!B4:B200)
```

### Conditional Formatting Rules (Database, A4:L100)

Applied in priority order (highest first wins):

| Priority | Condition | Background | Font Color |
|---|---|---|---|
| 1 | `=$H4<0` | `#FFCDD2` | `#B71C1C` bold |
| 2 | `=AND($H4>=0,$H4<=30)` | `#FFE0B2` | `#E65100` bold |
| 3 | `=AND($H4>30,$H4<=90)` | `#FFF9C4` | `#F57F17` |
| 4 | `=$H4>90` | `#E8F5E9` | `#1B5E20` |

---

## Apps Script

### File Location
Script dijalankan dari akun Google **terpisah** dari pemilik spreadsheet. Akses ke spreadsheet dilakukan via `SpreadsheetApp.openById()`.

### CONFIG Object

```javascript
const CONFIG = {
  EMAIL_PENERIMA: "labkesgi.poltekkesplg@gmail.com", // email tujuan notifikasi
  NAMA_LAB:       "Laboratorium Kesehatan Gigi",
  INSTITUSI:      "Poltekkes Kemenkes Palembang",
  BATAS_HARI:     90,                                 // threshold alert
  ID_SPREADSHEET: "1l-g93l5iLpI5ZGsiF6ajH41btcl7GQxc3hHDElGMswM",
  NAMA_SHEET:     "DATABASE",
  BARIS_MULAI:    4,                                  // header di baris 3, data mulai baris 4
};
```

### Alert Logic

```
for each row in DATABASE starting from BARIS_MULAI:
  if (namaBahan is empty OR tglExpired is empty) → skip
  if (stok <= 0) → skip (bahan habis, tidak perlu alert)
  
  hitung sisaHari = tglExpired - today
  
  if (sisaHari <= BATAS_HARI):   // yaitu <= 90
    if (sisaHari < 0)   → kelompok.expired
    if (sisaHari <= 30) → kelompok.kritis
    else                → kelompok.perhatian
  else:
    tidak masuk list (aman)

if (totalAlert == 0) → TIDAK kirim email, return
if (totalAlert > 0)  → kirim email HTML ke EMAIL_PENERIMA
```

### Functions

| Function | Deskripsi | Dipanggil oleh |
|---|---|---|
| `kirimEmailAlertED()` | Fungsi utama — baca sheet, filter bahan, kirim email | Trigger harian |
| `buatBodyEmail(kelompok, total, today)` | Generate HTML email body | `kirimEmailAlertED()` |
| `buatTabel(items, warnaHeader)` | Generate HTML tabel per kategori | `buatBodyEmail()` |
| `setupTriggerHarian()` | Buat time-based trigger harian jam 07.00 | Manual — jalankan sekali |
| `testKirimEmailSekarang()` | Test kirim email langsung | Manual saat testing |

### Trigger Configuration

```javascript
ScriptApp.newTrigger("kirimEmailAlertED")
  .timeBased()
  .everyDays(1)
  .atHour(7)        // 07.00–08.00 WIB
  .create();
```

Timezone default Apps Script mengikuti timezone project Google Cloud. Pastikan timezone di script project sudah diset ke **Asia/Jakarta (WIB, UTC+7)**:
- Di Apps Script editor → Project Settings → Time zone → pilih `(GMT+07:00) Asia/Jakarta`

### Email Quota

Google Apps Script memiliki quota pengiriman email:
- Akun **Google Workspace**: 1.500 email/hari
- Akun **Gmail biasa (@gmail.com)**: 100 email/hari

Sistem ini hanya mengirim **1 email per hari** — jauh di bawah limit. Aman untuk akun Gmail biasa.

---

## Deployment Steps

### 1. Upload Spreadsheet

```
1. Download file Monitoring_ED_LabKesgi.xlsx
2. Buka drive.google.com menggunakan akun lab (labkesgi.poltekkesplg@gmail.com)
3. Upload file xlsx
4. Klik kanan → Open with → Google Sheets
5. File akan terkonversi otomatis ke format Google Sheets
6. Catat Spreadsheet ID dari URL:
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
```

### 2. Setup Apps Script

```
1. Buka browser baru / tab incognito
2. Login dengan akun Google yang digunakan untuk script (BUKAN akun lab)
3. Buka script.google.com
4. Klik "New project"
5. Ganti nama project menjadi: "Monitoring ED - Lab Kesgi"
6. Hapus semua kode default
7. Paste seluruh kode dari apps_script/monitoring_ed.gs
8. Update CONFIG.ID_SPREADSHEET dengan ID yang dicatat di langkah 1
9. Simpan (Ctrl+S)
```

### 3. Test & Authorize

```
1. Di dropdown fungsi, pilih: testKirimEmailSekarang
2. Klik Run ▶
3. Klik "Review permissions" → pilih akun script → Advanced → Allow
4. Cek Logger untuk konfirmasi hasil
5. Cek inbox labkesgi.poltekkesplg@gmail.com
```

### 4. Aktifkan Trigger Harian

```
1. Di dropdown fungsi, pilih: setupTriggerHarian
2. Klik Run ▶
3. Verifikasi di menu Triggers (ikon jam di sidebar kiri):
   kirimEmailAlertED | Time-driven | Day timer | 7am-8am
```

### 5. Share Spreadsheet ke Akun Lab

```
1. Buka spreadsheet di akun lab
2. Klik tombol Share (pojok kanan atas)
3. Tambahkan akun PLP lain yang perlu akses edit
4. Set permission: Editor
```

---

## Data Migration — Replace Dummy Data

Spreadsheet awal berisi 36 baris data dummy dari stock opname Februari 2026.

**Langkah mengganti dengan data asli:**
1. Buka tab DATABASE di Google Sheets
2. Select baris 4 sampai 39 (semua data dummy)
3. Delete rows
4. Input ulang data asli dari stock opname terbaru
5. Verifikasi kolom G (Tanggal Expired) terbaca sebagai Date (bukan teks)
6. Cek kolom H dan I terisi otomatis

---

## Maintenance & Troubleshooting

### Trigger tidak jalan / email tidak dikirim

```
1. Buka script.google.com di akun script
2. Buka project "Monitoring ED - Lab Kesgi"
3. Klik Triggers (ikon jam di sidebar)
4. Pastikan trigger ada dan aktif
5. Jika tidak ada → jalankan setupTriggerHarian() lagi
6. Cek Executions (ikon play di sidebar) untuk melihat log error
```

### Email masuk ke Spam

```
1. Buka Gmail lab
2. Buka folder Spam
3. Cari email dari akun script
4. Klik "Not spam" / "Report not spam"
5. Tambahkan akun script ke Contacts Gmail lab
```

### Sisa Hari tidak terhitung (kolom H kosong atau error)

```
Penyebab: Kolom G tidak terbaca sebagai Date oleh Google Sheets
Solusi:
1. Select seluruh kolom G
2. Format → Number → Date
3. Pilih format DD/MM/YYYY
4. Re-enter tanggal di baris yang bermasalah
```

### Menambah pilihan dropdown baru

```
1. Buka tab REFERENSI
2. Tambahkan nilai baru di kolom yang sesuai:
   - Kolom A: Satuan baru
   - Kolom C: Lokasi penyimpanan baru
   - Kolom E: Kategori bahan baru
3. Range dropdown otomatis menyesuaikan (sudah dikonfigurasi hingga baris 20)
4. Jika melebihi baris 20, update range DataValidation di spreadsheet
```

### Menambah penerima email

```javascript
// Di CONFIG, ubah EMAIL_PENERIMA menjadi multiple emails:
EMAIL_PENERIMA: "labkesgi.poltekkesplg@gmail.com,ketua.kesgi@poltekkes-plg.ac.id",
```

---

## Rebuild Spreadsheet Template

Jika perlu rebuild file xlsx dari awal:

```bash
# Install dependency
pip install openpyxl

# Jalankan script builder
python build/build_monitoring_ed.py

# Output: Monitoring_ED_LabKesgi.xlsx
```

---

## Security Notes

- **Spreadsheet ID** bersifat semi-publik — siapa saja dengan link bisa lihat jika sharing setting salah. Pastikan sharing setting di Google Sheets diset ke **"Restricted"** (hanya orang yang diberi akses).
- **Akun script** tidak menyimpan credential apapun — hanya menggunakan OAuth token yang dikelola Google.
- **Email penerima** hardcoded di CONFIG — update manual jika email lab berubah.
- Tidak ada data yang dikirim ke pihak ketiga. Semua berjalan di ekosistem Google.

---

## Change Log

| Tanggal | Versi | Perubahan | Developer |
|---|---|---|---|
| 04/04/2026 | v1.0.0 | Initial release — 36 item dummy, 4 sheet, trigger harian, email HTML | Annisa Baizan |

---

## Developer Contact

**Annisa Baizan**
Developer / Penyedia Jasa
Palembang, April 2026

---

*Dokumen ini dibuat untuk keperluan maintenance dan handover teknis sistem.*
*Dilarang mendistribusikan Spreadsheet ID ke pihak yang tidak berkepentingan.*
