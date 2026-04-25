# README Bahasa Bayi — Sistem Monitoring ED Bahan Lab

**Lab Kesehatan Gigi · Poltekkes Kemenkes Palembang**  
**Versi santai / non-tech / ringkas / tanpa pengulangan**  
**Update: April 2026**

---

## Daftar Isi

- [0. Baca Ini Dulu](#0-baca-ini-dulu)
- [1. Sistem Ini Apa?](#1-sistem-ini-apa)
- [2. Dipakai Oleh Siapa?](#2-dipakai-oleh-siapa)
- [3. Komponen Sistem](#3-komponen-sistem)
- [4. Struktur Spreadsheet](#4-struktur-spreadsheet)
- [5. Tab Utama: `BAHAN BHP 2026`](#5-tab-utama-bahan-bhp-2026)
- [6. Status ED dan Sisa Hari](#6-status-ed-dan-sisa-hari)
- [7. Threshold / Batas Hari](#7-threshold--batas-hari)
- [8. Tab `RINGKASAN`, Warna Otomatis, dan `LOG`](#8-tab-ringkasan-warna-otomatis-dan-log)
- [9. Robot Apps Script](#9-robot-apps-script)
- [10. Cara Kerja Email Alert](#10-cara-kerja-email-alert)
- [11. Cara Input dan Update Data](#11-cara-input-dan-update-data)
- [12. Cara Menindaklanjuti Email Alert](#12-cara-menindaklanjuti-email-alert)
- [13. Cara Pasang Sistem Dari Nol](#13-cara-pasang-sistem-dari-nol)
- [14. Tes Sistem](#14-tes-sistem)
- [15. Masalah Umum dan Solusi](#15-masalah-umum-dan-solusi)
- [16. Aturan Aman](#16-aturan-aman)
- [17. Checklist Pemakaian](#17-checklist-pemakaian)
- [18. Ringkasan Developer](#18-ringkasan-developer)
- [19. Riwayat dan Penutup](#19-riwayat-dan-penutup)

---

## 0. Baca Ini Dulu

Dokumen ini menjelaskan sistem Monitoring ED dengan bahasa sederhana untuk pengguna yang tidak harus paham IT.

Anggap saja sistem ini seperti **buku catatan pintar** yang dibantu **robot kecil**.

- **Google Sheets** = buku catatan bahan lab
- **Apps Script** = robot kecil yang mengecek data
- **Trigger** = alarm yang membangunkan robot setiap pagi
- **Email alert** = surat peringatan otomatis
- **Formula** = hitungan otomatis
- **Threshold** = batas hari sebelum bahan dianggap perlu diperhatikan

Tujuan utamanya sederhana:

> Bahan yang hampir expired atau sudah expired tidak terlewat.

---

## 1. Sistem Ini Apa?

Sistem Monitoring ED adalah sistem berbasis Google Sheets dan Google Apps Script untuk mencatat, menghitung, dan memantau masa expired bahan praktikum habis pakai.

Sistem ini membantu untuk:

1. Menyimpan daftar bahan lab.
2. Mencatat tanggal masuk dan tanggal expired.
3. Menghitung sisa hari sebelum expired.
4. Memberi status bahan: `AMAN`, `PERHATIAN`, `KRITIS`, atau `EXPIRED`.
5. Mengirim email otomatis jika ada bahan yang perlu dicek.

Kalau semua bahan masih aman, sistem tidak mengirim email agar tidak membuat spam.

---

## 2. Dipakai Oleh Siapa?

Sistem ini dibuat untuk:

- PLP / pengelola laboratorium
- petugas lab
- kepala lab / ketua jurusan
- pihak lain yang perlu memantau bahan praktikum

Manfaatnya:

- bahan expired tidak dipakai mahasiswa;
- bahan yang hampir expired bisa diprioritaskan;
- stok dan riwayat bahan lebih rapi;
- pengelolaan lab menjadi lebih aman.

---

## 3. Komponen Sistem

| Komponen            | Fungsi                           | Bahasa Sederhana    |
| ------------------- | -------------------------------- | ------------------- |
| Google Sheets       | Tempat menyimpan data bahan      | Buku catatan pintar |
| Google Apps Script  | Mengecek data dan mengirim email | Robot kecil         |
| Gmail / MailApp     | Mengirim laporan                 | Tukang pos          |
| Trigger harian      | Menjalankan robot otomatis       | Alarm pagi          |
| Formula spreadsheet | Menghitung sisa hari dan status  | Kalkulator otomatis |

Struktur file proyek:

```text
monitoring-ed-lab-kesgi/
│
├── Monitoring_ED_LabKesgi.xlsx
│   └── template spreadsheet awal
│
├── monitoring_ed_final.gs
│   └── script email otomatis
│
├── Panduan_User_Monitoring_ED.docx
│   └── panduan pengguna lab
│
└── README_Sederhana.md
    └── penjelasan ringkas sistem
```

Biaya bulanan sistem:

```text
Rp 0
```

Selama memakai layanan Google yang tersedia, sistem ini tidak membutuhkan aplikasi berbayar tambahan.

---

## 4. Struktur Spreadsheet

Spreadsheet memiliki 4 tab utama.

| Tab              | Fungsi                                  | Yang Boleh Edit          |
| ---------------- | --------------------------------------- | ------------------------ |
| `BAHAN BHP 2026` | tempat data bahan dimasukkan            | PLP / pengelola lab      |
| `REFERENSI`      | daftar pilihan kategori, satuan, lokasi | admin                    |
| `RINGKASAN`      | rekap status dan pengaturan threshold   | PLP, khusus sel tertentu |
| `LOG`            | catatan perubahan penting               | PLP                      |

Tab yang paling sering digunakan adalah:

```text
BAHAN BHP 2026
```

Karena semua data bahan utama dimasukkan di sana.

---

## 5. Tab Utama: `BAHAN BHP 2026`

Setiap baris mewakili satu bahan. Setiap kolom berisi informasi tentang bahan tersebut.

| Kolom | Nama Kolom      | Keterangan                    |
| ----- | --------------- | ----------------------------- |
| A     | NO              | nomor urut                    |
| B     | NAMA BAHAN      | nama bahan sesuai kemasan     |
| C     | KATEGORI        | jenis bahan                   |
| D     | SATUAN          | botol, kotak, gram, set, dll  |
| E     | JUMLAH STOK     | stok yang masih ada           |
| F     | TANGGAL MASUK   | tanggal bahan masuk lab       |
| G     | TANGGAL EXPIRED | tanggal kedaluwarsa           |
| H     | SISA HARI       | otomatis, jangan diisi manual |
| I     | STATUS ED       | otomatis, jangan diisi manual |
| J     | KODE BARANG     | kode inventaris / BMN         |
| K     | LOKASI SIMPAN   | lokasi penyimpanan            |
| L     | MERK / PRODUSEN | merek bahan                   |
| M     | KETERANGAN      | catatan tambahan              |

Hal paling penting:

```text
Kolom G = TANGGAL EXPIRED
```

Semua hitungan sistem bergantung pada kolom ini. Kalau tanggal expired salah atau tidak terbaca sebagai tanggal, hasil sistem juga bisa salah.

Data bahan mulai dibaca dari:

```text
Baris 4
```

---

## 6. Status ED dan Sisa Hari

### Sisa Hari

Kolom H menghitung jumlah hari dari hari ini sampai tanggal expired.

Rumus dasarnya:

```excel
=IF(G4="","",G4-TODAY())
```

Artinya:

- kalau tanggal expired kosong, kolom H ikut kosong;
- kalau tanggal expired ada, sistem menghitung selisih hari dari hari ini.

Contoh:

```text
Hari ini        : 1 April
Tanggal expired : 10 April
Sisa hari       : 9 hari
```

### Status ED

Kolom I memberi status otomatis berdasarkan sisa hari.

| Status      | Artinya                        | Tindakan                      |
| ----------- | ------------------------------ | ----------------------------- |
| `AMAN`      | expired masih jauh             | tidak perlu tindakan khusus   |
| `PERHATIAN` | mulai mendekati expired        | pantau dan prioritaskan       |
| `KRITIS`    | expired sangat dekat           | segera gunakan / laporkan     |
| `EXPIRED`   | sudah melewati tanggal expired | pisahkan dan jangan digunakan |

Aturan default:

```text
> 90 hari      = AMAN
31–90 hari    = PERHATIAN
0–30 hari     = KRITIS
< 0 hari      = EXPIRED
```

---

## 7. Threshold / Batas Hari

Threshold adalah batas hari untuk menentukan status bahan.

Letaknya di tab:

```text
RINGKASAN
```

| Sel | Fungsi            | Default |
| --- | ----------------- | ------- |
| D4  | batas `PERHATIAN` | 90      |
| D6  | batas `KRITIS`    | 30      |

Aturan wajib:

```text
D6 harus lebih kecil dari D4
```

Contoh benar:

```text
D4 = 90
D6 = 30
```

Contoh salah:

```text
D4 = 30
D6 = 90
```

Kalau D4 dan D6 terbalik, robot sengaja berhenti agar tidak mengirim laporan yang salah.

---

## 8. Tab `RINGKASAN`, Warna Otomatis, dan `LOG`

### Tab `RINGKASAN`

Tab ini menampilkan rekap jumlah bahan berdasarkan status:

- total bahan aman;
- total bahan perhatian;
- total bahan kritis;
- total bahan expired;
- total semua bahan.

Rumus biasanya memakai `COUNTIF`.

Contoh:

```excel
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*AMAN*")
```

Nama tab `BAHAN BHP 2026` harus ditulis dengan tanda kutip satu karena mengandung spasi.

### Warna Otomatis

Warna otomatis disebut **conditional formatting**.

Fungsinya:

- `AMAN` diberi warna aman;
- `PERHATIAN` diberi warna peringatan;
- `KRITIS` diberi warna bahaya;
- `EXPIRED` diberi warna paling tegas.

Kalau threshold D4/D6 diubah, cek juga aturan warna di:

```text
Format → Conditional formatting
```

### Tab `LOG`

Tab `LOG` dipakai sebagai buku catatan perubahan.

Contoh yang perlu dicatat:

- bahan baru masuk;
- stok berubah banyak;
- bahan expired dipisahkan;
- bahan dibuang / dimusnahkan;
- tanggal expired dikoreksi.

Contoh isi LOG:

```text
Tanggal      : 10/04/2026
Nama petugas : PLP Lab
Aksi         : Update stok
Bahan        : Alginat Merk X
Detail       : Stok dari 5 menjadi 2 setelah praktikum
```

---

## 9. Robot Apps Script

Apps Script adalah robot kecil yang bekerja otomatis di Google.

Script utama berada di file:

```text
monitoring_ed_final.gs
```

Robot dapat:

1. membuka spreadsheet;
2. membaca data bahan;
3. membaca threshold dari tab `RINGKASAN`;
4. menghitung status bahan;
5. memilih bahan yang perlu alert;
6. membuat isi email;
7. mengirim email ke penerima.

### CONFIG

Bagian `CONFIG` adalah identitas dan pengaturan utama robot.

```javascript
const CONFIG = {
  EMAIL_PENERIMA: "[EMAIL_ADDRESS]",
  NAMA_LAB: "Laboratorium Kesehatan Gigi",
  INSTITUSI: "Poltekkes Kemenkes Palembang",
  ID_SPREADSHEET: "[ID_SPREADSHEET]",
  NAMA_SHEET: "BAHAN BHP 2026",
  NAMA_RINGKASAN: "RINGKASAN",
  BARIS_MULAI: 4,
  SEL_BATAS_PERHATIAN: "D4",
  SEL_BATAS_KRITIS: "D6",
};
```

Yang biasanya perlu diganti:

| Bagian           | Diisi Dengan           |
| ---------------- | ---------------------- |
| `EMAIL_PENERIMA` | email penerima laporan |
| `ID_SPREADSHEET` | ID spreadsheet         |

Kalau email penerima lebih dari satu, pisahkan dengan koma:

```javascript
EMAIL_PENERIMA: "email1@gmail.com,email2@gmail.com",
```

### Mapping Kolom

Robot membaca kolom berdasarkan nomor.

```javascript
const COL = {
  NAMA_BAHAN: 2,
  STOK: 5,
  TGL_EXPIRED: 7,
  STATUS: 9,
  KODE_BARANG: 10,
  LOKASI: 11,
  MERK: 12,
};
```

Artinya:

- nama bahan dibaca dari kolom B;
- stok dari kolom E;
- tanggal expired dari kolom G;
- status dari kolom I.

Jangan menggeser kolom A sampai M tanpa mengubah mapping script.

### Fungsi Penting

| Fungsi                     | Kegunaan                         |
| -------------------------- | -------------------------------- |
| `kirimEmailAlertED()`      | mengecek data dan mengirim email |
| `buatBodyEmail()`          | menyusun isi email HTML          |
| `setupTriggerHarian()`     | memasang jadwal otomatis harian  |
| `testKirimEmailSekarang()` | mengetes email secara manual     |

---

## 10. Cara Kerja Email Alert

Robot dijalankan setiap pagi sekitar pukul:

```text
07.00 WIB
```

Alur kerjanya:

```text
1. Buka spreadsheet.
2. Buka tab BAHAN BHP 2026.
3. Buka tab RINGKASAN.
4. Baca threshold D4 dan D6.
5. Validasi D4 dan D6 harus angka.
6. Pastikan D6 lebih kecil dari D4.
7. Baca data mulai baris 4.
8. Lewati baris kosong.
9. Lewati bahan dengan stok 0.
10. Hitung sisa hari.
11. Kelompokkan bahan menjadi EXPIRED, KRITIS, atau PERHATIAN.
12. Kirim email hanya jika ada bahan yang perlu diperhatikan.
```

Email dikirim jika:

```text
stok > 0
DAN
sisa hari <= batas PERHATIAN
```

Email tidak dikirim jika:

- semua bahan masih aman;
- stok bahan sudah 0;
- tidak ada bahan yang masuk kategori alert.

Isi email mencakup:

- jumlah bahan expired;
- jumlah bahan kritis;
- jumlah bahan perhatian;
- threshold aktif;
- tabel detail bahan.

Detail bahan yang muncul:

| Info            | Sumber Kolom         |
| --------------- | -------------------- |
| nama bahan      | B                    |
| kode barang     | J                    |
| tanggal expired | G                    |
| sisa hari       | hasil hitungan robot |
| stok            | E                    |
| lokasi          | K                    |
| merk            | L                    |

---

## 11. Cara Input dan Update Data

### Input Bahan Baru

Saat ada bahan baru, isi data di tab `BAHAN BHP 2026` mulai dari baris kosong paling bawah.

```text
1. Isi NO di kolom A.
2. Isi NAMA BAHAN di kolom B.
3. Pilih KATEGORI di kolom C.
4. Pilih SATUAN di kolom D.
5. Isi JUMLAH STOK di kolom E.
6. Isi TANGGAL MASUK di kolom F.
7. Isi TANGGAL EXPIRED di kolom G.
8. Jangan isi kolom H dan I secara manual.
9. Isi KODE BARANG di kolom J jika ada.
10. Isi LOKASI SIMPAN di kolom K.
11. Isi MERK dan KETERANGAN jika perlu.
```

Format tanggal yang disarankan:

```text
DD/MM/YYYY
```

Contoh:

```text
15/06/2026
```

Kalau kemasan hanya menulis bulan dan tahun, gunakan tanggal akhir bulan.

```text
JUN 2026 → 30/06/2026
DES 2026 → 31/12/2026
```

### Update Stok

Kalau stok berubah:

```text
1. Cari nama bahan.
2. Ubah jumlah stok di kolom E.
3. Catat perubahan penting di tab LOG.
```

Kalau bahan sudah habis atau sudah dipisahkan:

```text
Isi stok di kolom E = 0
```

Stok 0 tidak akan masuk email alert.

---

## 12. Cara Menindaklanjuti Email Alert

Kalau mendapat email alert, lakukan urutan berikut:

```text
1. Cek bagian EXPIRED terlebih dahulu.
2. Pisahkan bahan yang sudah expired.
3. Jangan gunakan bahan expired untuk praktikum.
4. Cek bagian KRITIS.
5. Prioritaskan pemakaian atau laporkan bahan kritis.
6. Cek bagian PERHATIAN.
7. Pantau bahan tersebut secara rutin.
8. Update stok jika ada perubahan.
9. Catat tindakan penting di tab LOG.
```

Email alert bukan tanda sistem rusak. Email hanya memberi tahu bahan mana yang perlu dicek.

---

## 13. Cara Pasang Sistem Dari Nol

### A. Siapkan File dan Akun

Siapkan:

| Yang Disiapkan                | Keterangan                   |
| ----------------------------- | ---------------------------- |
| `Monitoring_ED_LabKesgi.xlsx` | template spreadsheet         |
| `monitoring_ed_final.gs`      | script robot                 |
| akun Google lab               | tempat menyimpan spreadsheet |
| email penerima alert          | tujuan laporan otomatis      |
| data bahan asli               | hasil stock opname           |

### B. Upload Spreadsheet

```text
1. Buka Google Drive.
2. Upload file Monitoring_ED_LabKesgi.xlsx.
3. Klik kanan file.
4. Pilih Open with → Google Sheets.
5. Pastikan tabnya ada: BAHAN BHP 2026, REFERENSI, RINGKASAN, LOG.
```

Jika nama tab utama berbeda, ubah menjadi persis:

```text
BAHAN BHP 2026
```

### C. Cek Struktur Spreadsheet

Pastikan:

```text
1. Kolom A sampai M sesuai urutan.
2. Data mulai dari baris 4.
3. Kolom H dan I otomatis.
4. Tab RINGKASAN tidak error.
5. D4 dan D6 berisi angka.
6. D6 lebih kecil dari D4.
```

Jika rumus `RINGKASAN` masih menunjuk ke nama tab lama seperti `DATABASE!`, perbaiki dengan:

```text
Ctrl + H
Cari       : DATABASE!
Ganti      : 'BAHAN BHP 2026'!
Replace All
```

### D. Ambil ID Spreadsheet

Buka URL spreadsheet.

Contoh:

```text
https://docs.google.com/spreadsheets/d/1ABCdefGHIjklMNOP987xyz/edit
```

Yang disalin hanya bagian tengah:

```text
1ABCdefGHIjklMNOP987xyz
```

Jangan ikut menyalin `/edit`.

### E. Pasang Apps Script

```text
1. Buka script.google.com.
2. Login dengan akun yang akan menjalankan robot.
3. Klik New project.
4. Beri nama project, misalnya Monitoring ED - Lab Kesgi.
5. Hapus kode bawaan.
6. Copy seluruh isi monitoring_ed_final.gs.
7. Paste ke editor Apps Script.
8. Simpan.
```

### F. Isi CONFIG

Ubah bagian berikut:

```javascript
EMAIL_PENERIMA: "email_tujuan@gmail.com",
ID_SPREADSHEET: "ID_SPREADSHEET_HASIL_SALIN",
```

Jangan ubah nama sheet, baris mulai, atau sel threshold kalau struktur spreadsheet tidak berubah.

### G. Cek Timezone

Timezone project harus:

```text
Asia/Jakarta
```

Cara cek:

```text
Apps Script → Project Settings → Time zone → Asia/Jakarta
```

### H. Share Spreadsheet

Bagikan spreadsheet ke PLP / pengelola lab dengan role **Editor**.

Bagian yang boleh diedit:

- data bahan di `BAHAN BHP 2026`;
- D4 dan D6 di `RINGKASAN`, jika perlu mengubah threshold;
- tab `LOG`.

Bagian yang sebaiknya tidak diedit sembarangan:

- rumus kolom H dan I;
- tab `REFERENSI`;
- kode Apps Script;
- urutan kolom A sampai M.

---

## 14. Tes Sistem

Sebelum dipakai, lakukan tes dari awal sampai akhir.

### Tes Manual

```text
1. Buat satu bahan dummy di BAHAN BHP 2026.
2. Isi stok lebih dari 0.
3. Isi tanggal expired dalam 1–30 hari ke depan.
4. Pastikan kolom H muncul angka.
5. Pastikan kolom I muncul status.
6. Jalankan fungsi testKirimEmailSekarang().
7. Izinkan akses Google jika diminta.
8. Cek inbox dan folder Spam.
```

Kalau email masuk, robot bisa mengirim laporan.

Setelah tes selesai:

```text
Hapus data dummy
```

atau:

```text
Ubah stok dummy menjadi 0
```

### Pasang Trigger Harian

Jika tes manual berhasil:

```text
1. Jalankan fungsi setupTriggerHarian().
2. Buka menu Triggers / ikon jam.
3. Pastikan ada trigger untuk kirimEmailAlertED.
```

Trigger yang benar:

```text
Function       : kirimEmailAlertED
Event source   : Time-driven
Type           : Day timer
Jam            : 07.00–08.00
```

Catatan:

```text
setupTriggerHarian() menghapus trigger lama dulu, lalu memasang trigger baru.
```

Tujuannya agar email tidak terkirim dobel karena trigger ganda.

---

## 15. Masalah Umum dan Solusi

### 1. Kolom H / I Tidak Terisi

Penyebab paling sering:

```text
Tanggal expired di kolom G tidak terbaca sebagai tanggal.
```

Solusi:

```text
1. Klik kolom G.
2. Format → Number → Date.
3. Isi ulang tanggal dengan format DD/MM/YYYY.
```

### 2. `RINGKASAN` Muncul `#REF!`

Penyebab:

```text
Rumus masih mencari nama tab lama, misalnya DATABASE.
```

Solusi:

```text
Ctrl + H
Cari       : DATABASE!
Ganti      : 'BAHAN BHP 2026'!
Replace All
```

### 3. Email Tidak Masuk

Cek:

```text
1. Apakah ada bahan dengan stok > 0?
2. Apakah sisa hari <= D4?
3. Apakah EMAIL_PENERIMA benar?
4. Apakah ID_SPREADSHEET benar?
5. Apakah robot sudah diberi izin Google?
6. Apakah trigger harian sudah ada?
7. Apakah timezone sudah Asia/Jakarta?
8. Apakah email masuk Spam?
9. Apakah D4 dan D6 valid?
```

Kalau semua bahan aman, email memang tidak dikirim.

### 4. Threshold Error

Penyebab:

```text
D4 atau D6 bukan angka
```

atau:

```text
D6 >= D4
```

Solusi:

```text
1. Isi D4 dengan angka, misalnya 90.
2. Isi D6 dengan angka lebih kecil, misalnya 30.
3. Jangan tulis "90 hari".
4. Tulis angka saja: 90.
```

### 5. Bahan Sudah Habis Tapi Masih Muncul di Email

Penyebab:

```text
Stok di kolom E masih lebih dari 0.
```

Solusi:

```text
Ubah stok menjadi 0.
```

---

## 16. Aturan Aman

Agar sistem tidak rusak, jangan lakukan ini sembarangan:

```text
1. Jangan ubah nama tab tanpa update rumus dan script.
2. Jangan geser kolom A sampai M tanpa update mapping script.
3. Jangan isi manual kolom H dan I.
4. Jangan menulis tanggal asal-asalan.
5. Jangan isi D4/D6 dengan teks seperti "90 hari".
6. Jangan hapus trigger jika tidak tahu fungsinya.
7. Jangan bagikan spreadsheet ke publik.
```

Aturan keamanan data:

```text
1. Sharing spreadsheet sebaiknya Restricted.
2. Beri akses hanya ke orang yang perlu.
3. Jangan sebar ID spreadsheet sembarangan.
4. Gunakan akun robot/lab yang aman.
5. Update CONFIG jika email penerima berubah.
```

Sistem ini tidak mengirim data ke aplikasi luar. Data tetap berada dalam ekosistem Google.

---

## 17. Checklist Pemakaian

### Checklist Setelah Pemasangan

```text
[ ] Spreadsheet sudah di Google Sheets
[ ] Tab utama bernama BAHAN BHP 2026
[ ] Tab REFERENSI, RINGKASAN, dan LOG ada
[ ] Kolom A sampai M sesuai urutan
[ ] Data mulai dari baris 4
[ ] Kolom H menghitung sisa hari otomatis
[ ] Kolom I menampilkan status otomatis
[ ] RINGKASAN tidak error #REF!
[ ] D4 dan D6 berisi angka
[ ] D6 lebih kecil dari D4
[ ] ID Spreadsheet sudah disalin
[ ] Apps Script sudah dipasang
[ ] EMAIL_PENERIMA sudah benar
[ ] ID_SPREADSHEET sudah benar
[ ] Timezone Apps Script = Asia/Jakarta
[ ] testKirimEmailSekarang() berhasil
[ ] Email test berhasil masuk
[ ] setupTriggerHarian() sudah dijalankan
[ ] Trigger harian kirimEmailAlertED sudah ada
[ ] Spreadsheet sudah dibagikan ke PLP
[ ] Data dummy sudah dibersihkan
[ ] Data asli sudah dimasukkan
[ ] Setup dicatat di tab LOG
```

### Checklist Harian PLP

```text
[ ] Cek email pagi
[ ] Pisahkan bahan EXPIRED
[ ] Prioritaskan bahan KRITIS
[ ] Pantau bahan PERHATIAN
[ ] Update stok jika ada perubahan
[ ] Catat perubahan penting di LOG
```

### Checklist Saat Ada Bahan Baru

```text
[ ] Isi nama bahan
[ ] Isi kategori
[ ] Isi satuan
[ ] Isi jumlah stok
[ ] Isi tanggal masuk
[ ] Isi tanggal expired dari kemasan
[ ] Pastikan kolom H dan I otomatis terisi
[ ] Isi kode barang jika ada
[ ] Isi lokasi simpan
[ ] Isi merk jika ada
[ ] Cek status warna muncul benar
```

---

## 18. Ringkasan Developer

```text
Spreadsheet utama      : BAHAN BHP 2026
Range data             : mulai baris 4
Total kolom aktif      : A sampai M
Threshold perhatian    : RINGKASAN!D4
Threshold kritis       : RINGKASAN!D6
Fungsi utama           : kirimEmailAlertED()
Fungsi trigger         : setupTriggerHarian()
Fungsi test            : testKirimEmailSekarang()
Jadwal                 : harian sekitar jam 07.00 WIB
Timezone               : Asia/Jakarta
Email                  : MailApp.sendEmail()
```

Validasi penting di script:

```text
1. Sheet utama harus ada.
2. Sheet RINGKASAN harus ada.
3. D4 dan D6 harus angka.
4. D6 harus lebih kecil dari D4.
5. Baris kosong dilewati.
6. Stok <= 0 dilewati.
7. Email tidak dikirim jika total alert = 0.
```

---

## 19. Riwayat dan Penutup

Riwayat singkat:

```text
v1.0.0 — peluncuran awal sistem monitoring ED
v1.1.0 — tambah kode barang, mapping kolom disesuaikan, threshold dibaca dari RINGKASAN D4/D6
```

Sistem ini dibuat agar:

- kerja lab lebih ringan;
- bahan expired tidak terlewat;
- mahasiswa lebih aman;
- laporan lebih rapi.

Inti pemakaian:

```text
Isi data bahan dengan benar.
Isi tanggal expired dengan benar.
Jangan sentuh kolom otomatis.
Cek email pagi.
Update stok kalau berubah.
Catat perubahan penting di LOG.
```

**Developer:** Annisa Baizan  
**Sistem:** Monitoring Expired Date Bahan Praktikum Habis Pakai  
**Instansi:** Laboratorium Kesehatan Gigi · Poltekkes Kemenkes Palembang  
**Catatan:** Dokumen ini adalah versi sederhana, rapi, dan tidak berulang untuk pengguna non-tech.
