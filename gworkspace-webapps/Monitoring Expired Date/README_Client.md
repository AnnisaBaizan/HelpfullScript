# README Bahasa Bayi — Sistem Monitoring ED Bahan Lab

**Lab Kesehatan Gigi · Poltekkes Kemenkes Palembang**  
**Versi santai banget / non-tech / anti mumet**  
**Update: April 2026**

---

## Daftar Isi

Klik judul di bawah ini buat langsung lompat ke bagian yang mau dibaca.

- [0. Baca Ini Dulu, Biar Nggak Panik](#0-baca-ini-dulu-biar-nggak-panik)
- [1. Sistem Ini Sebenarnya Apa?](#1-sistem-ini-sebenarnya-apa)
- [2. Untuk Siapa Sistem Ini?](#2-untuk-siapa-sistem-ini)
- [3. Sistem Ini Dibuat Pakai Apa?](#3-sistem-ini-dibuat-pakai-apa)
- [4. Isi File / Kotak Kerjanya Ada Apa Aja?](#4-isi-file-kotak-kerjanya-ada-apa-aja)
- [5. Google Sheets Itu Isinya Apa?](#5-google-sheets-itu-isinya-apa)
- [6. Tab Utama: `BAHAN BHP 2026`](#6-tab-utama-bahan-bhp-2026)
- [7. Status Warna Itu Maksudnya Apa?](#7-status-warna-itu-maksudnya-apa)
- [8. Rumus Ajaib: Sisa Hari](#8-rumus-ajaib-sisa-hari)
- [9. Rumus Ajaib: Status ED](#9-rumus-ajaib-status-ed)
- [10. Threshold Itu Apa?](#10-threshold-itu-apa)
- [11. Tab `RINGKASAN` Itu Buat Apa?](#11-tab-ringkasan-itu-buat-apa)
- [12. Warna Otomatis Itu Apa?](#12-warna-otomatis-itu-apa)
- [13. Robot Apps Script Itu Apa?](#13-robot-apps-script-itu-apa)
- [14. Kartu Identitas Robot: `CONFIG`](#14-kartu-identitas-robot-config)
- [15. Robot Tahu Kolom Dari Mana?](#15-robot-tahu-kolom-dari-mana)
- [16. Kerja Robot Tiap Pagi](#16-kerja-robot-tiap-pagi)
- [17. Kenapa Bahan Stok 0 Tidak Masuk Email?](#17-kenapa-bahan-stok-0-tidak-masuk-email)
- [18. Email Dikirim Kapan?](#18-email-dikirim-kapan)
- [19. Isi Email Alert](#19-isi-email-alert)
- [20. Tombol-Tombol Robot](#20-tombol-tombol-robot)
- [21. Cara Input Bahan Baru](#21-cara-input-bahan-baru)
- [22. Cara Update Stok](#22-cara-update-stok)
- [23. Apa yang Harus Dilakukan Kalau Ada Email Alert?](#23-apa-yang-harus-dilakukan-kalau-ada-email-alert)
- [24. Tab `LOG` Untuk Apa?](#24-tab-log-untuk-apa)
- [25. Cara Pasang Sistem Dari Nol](#25-cara-pasang-sistem-dari-nol)
- [26. Masalah Umum dan Cara Beresinnya](#26-masalah-umum-dan-cara-beresinnya)
- [27. Aturan Jangan Nakal](#27-aturan-jangan-nakal)
- [28. Keamanan Data](#28-keamanan-data)
- [29. Checklist Setelah Sistem Dipasang](#29-checklist-setelah-sistem-dipasang)
- [30. Checklist Harian PLP](#30-checklist-harian-plp)
- [31. Checklist Saat Ada Bahan Baru](#31-checklist-saat-ada-bahan-baru)
- [32. Penjelasan Paling Pendek Sedunia](#32-penjelasan-paling-pendek-sedunia)
- [33. Versi “Ngomong ke Bayi”](#33-versi-ngomong-ke-bayi)
- [34. Ringkasan Developer Tapi Tetap Santai](#34-ringkasan-developer-tapi-tetap-santai)
- [35. Riwayat Singkat](#35-riwayat-singkat)
- [36. Penutup](#36-penutup)

---

## 0. Baca Ini Dulu, Biar Nggak Panik

Dokumen ini adalah versi **super sederhana** dari penjelasan sistem Monitoring ED.

Bahasanya sengaja dibuat kayak lagi jelasin ke orang yang **nggak ngerti IT sama sekali**.

Ibaratnya:

> Ada rak bahan lab.  
> Di rak itu ada banyak bahan.  
> Tiap bahan punya tanggal kedaluwarsa.  
> Sistem ini jadi **robot kecil** yang bantu lihat:  
> “Mana bahan yang masih aman?”  
> “Mana yang hampir basi?”  
> “Mana yang sudah nggak boleh dipakai?”

Jadi jangan takut sama kata-kata seperti **Google Sheets**, **Apps Script**, **trigger**, atau **formula**.

Anggap saja:

- Google Sheets = buku catatan pintar
- Apps Script = robot kecil
- Trigger = alarm bangunin robot
- Email alert = surat peringatan
- Formula = hitungan otomatis
- Threshold = batas hari bahaya

---

## 1. Sistem Ini Sebenarnya Apa?

Sistem Monitoring ED adalah **buku catatan pintar** untuk bahan praktikum habis pakai di laboratorium.

Tugas utamanya:

1. Menyimpan daftar bahan lab.
2. Mencatat tanggal expired setiap bahan.
3. Menghitung otomatis sisa hari sebelum expired.
4. Memberi status warna: aman, perhatian, kritis, atau expired.
5. Mengirim email otomatis setiap pagi kalau ada bahan yang harus diperhatikan.

Bayangin kamu punya **kulkas besar**.

Di dalam kulkas ada banyak makanan.

Kalau kamu cek satu-satu setiap hari, capek.

Nah sistem ini seperti **anak kecil rajin** yang tiap pagi buka kulkas, lihat tanggal makanan, lalu bilang:

> “Ini masih aman.”  
> “Ini bentar lagi basi.”  
> “Ini sudah basi, jangan dimakan.”

Versi lab-nya:

> “Bahan ini masih aman.”  
> “Bahan ini mendekati expired.”  
> “Bahan ini kritis.”  
> “Bahan ini sudah expired, jangan dipakai.”

---

## 2. Untuk Siapa Sistem Ini?

Sistem ini dibuat untuk membantu:

- PLP / pengelola laboratorium
- petugas lab
- kepala lab / ketua jurusan
- siapa pun yang perlu memantau bahan praktikum

Tujuannya sederhana:

> Biar bahan yang mau expired tidak kelewat.  
> Biar bahan expired tidak dipakai mahasiswa.  
> Biar kerja lab lebih rapi dan aman.

---

## 3. Sistem Ini Dibuat Pakai Apa?

Anggap sistem ini seperti warung kecil.

| Benda di Warung     | Dalam Sistem        | Bahasa Bayinya                 |
| ------------------- | ------------------- | ------------------------------ |
| Buku catatan besar  | Google Sheets       | Tempat nulis semua bahan       |
| Robot kecil         | Google Apps Script  | Yang ngecek dan kirim email    |
| Tukang pos          | Gmail / MailApp     | Yang nganter surat peringatan  |
| Alarm pagi          | Trigger harian      | Yang bangunin robot jam 7 pagi |
| Kalkulator otomatis | Formula spreadsheet | Yang ngitung sisa hari         |

Biaya bulanannya:

> **Rp 0**  
> Alias gratis, karena numpang layanan Google.

---

## 4. Isi File / Kotak Kerjanya Ada Apa Aja?

Struktur proyeknya kira-kira seperti ini:

```text
monitoring-ed-lab-kesgi/
│
├── Monitoring_ED_LabKesgi.xlsx
│   └── template spreadsheet awal
│
├── monitoring_ed_final.gs
│   └── otak robot email otomatis
│
├── Panduan_User_Monitoring_ED.docx
│   └── buku panduan untuk pengguna lab
│
└── README_Sederhana.md
    └── penjelasan teknis yang sudah disederhanakan
```

Kalau dianalogikan:

- file `.xlsx` = buku kosong yang siap diisi
- file `.gs` = otak robot
- file `.docx` = buku petunjuk manusia
- file `.md` ini = versi cerita bayi biar gampang paham

---

## 5. Google Sheets Itu Isinya Apa?

Spreadsheet punya **4 tab**.

Anggap tab itu seperti **4 halaman dalam satu buku**.

| Tab              | Ibaratnya               | Fungsinya                                                 | Yang Boleh Edit          |
| ---------------- | ----------------------- | --------------------------------------------------------- | ------------------------ |
| `BAHAN BHP 2026` | halaman utama buku stok | tempat isi data semua bahan                               | PLP / pengelola lab      |
| `REFERENSI`      | daftar pilihan          | isi dropdown seperti kategori, satuan, lokasi             | admin saja               |
| `RINGKASAN`      | papan skor              | lihat total bahan aman/kritis/expired dan atur batas hari | PLP, khusus sel tertentu |
| `LOG`            | buku harian             | catatan perubahan manual                                  | PLP                      |

Yang paling sering dipakai adalah:

> `BAHAN BHP 2026`  
> karena di situlah data bahan dimasukkan.

---

## 6. Tab Utama: `BAHAN BHP 2026`

Tab ini adalah **meja besar tempat semua bahan ditulis**.

Setiap baris = satu bahan.

Setiap kolom = satu info kecil tentang bahan itu.

| Kolom | Nama Kolom      | Bahasa Bayi                        |
| ----- | --------------- | ---------------------------------- |
| A     | NO              | nomor urut                         |
| B     | NAMA BAHAN      | nama bahan di kemasan              |
| C     | KATEGORI        | jenis bahan                        |
| D     | SATUAN          | botol, kotak, gram, set, dll       |
| E     | JUMLAH STOK     | jumlah yang masih ada              |
| F     | TANGGAL MASUK   | kapan bahan masuk lab              |
| G     | TANGGAL EXPIRED | kapan bahan kedaluwarsa            |
| H     | SISA HARI       | dihitung otomatis, jangan disentuh |
| I     | STATUS ED       | status otomatis, jangan disentuh   |
| J     | KODE BARANG     | kode inventaris / BMN              |
| K     | LOKASI SIMPAN   | bahan ditaruh di mana              |
| L     | MERK / PRODUSEN | merk bahan                         |
| M     | KETERANGAN      | catatan tambahan                   |

Kolom yang paling penting:

> **G — TANGGAL EXPIRED**

Kenapa?

Karena semua hitungan sistem bergantung ke tanggal expired.

Kalau tanggal expired salah, robot juga bisa salah baca.

---

## 7. Status Warna Itu Maksudnya Apa?

Sistem pakai 4 status.

Bayangin seperti lampu lalu lintas.

| Status    | Bahasa Bayi       | Artinya              | Tindakan                   |
| --------- | ----------------- | -------------------- | -------------------------- |
| AMAN      | masih santai      | expired masih jauh   | tidak perlu panik          |
| PERHATIAN | mulai lihat-lihat | mendekati expired    | pantau dan prioritaskan    |
| KRITIS    | bahaya dekat      | expired sangat dekat | segera gunakan / lapor     |
| EXPIRED   | sudah lewat       | sudah kedaluwarsa    | pisahkan, jangan digunakan |

Versi super gampang:

```text
Hijau  = aman, bobok tenang.
Kuning = awas, mulai dilihat.
Merah  = cepat urus.
Expired = jangan dipakai.
```

---

## 8. Rumus Ajaib: Sisa Hari

Di kolom H, sistem menghitung sisa hari.

Rumusnya:

```excel
=IF(G4="","",G4-TODAY())
```

Bahasa manusianya:

> Kalau tanggal expired kosong, ya sudah kosong.  
> Kalau ada tanggal expired, hitung: tanggal expired dikurangi tanggal hari ini.

Contoh:

- Hari ini 1 April
- Expired 10 April
- Sisa hari = 9 hari

Jadi manusia tidak perlu ngitung manual.

Bukunya yang ngitung sendiri.

---

## 9. Rumus Ajaib: Status ED

Di kolom I, sistem memberi status.

Rumusnya kira-kira berpikir seperti ini:

```text
Kalau sisa hari kosong:
  kosongkan status

Kalau sisa hari kurang dari 0:
  status = EXPIRED

Kalau sisa hari kecil banget:
  status = KRITIS

Kalau sisa hari mulai dekat:
  status = PERHATIAN

Kalau masih jauh:
  status = AMAN
```

Default batasnya:

- PERHATIAN = 90 hari
- KRITIS = 30 hari

Jadi:

```text
> 90 hari      = AMAN
31–90 hari    = PERHATIAN
0–30 hari     = KRITIS
sudah lewat   = EXPIRED
```

Tapi angka ini bisa diubah.

---

## 10. Threshold Itu Apa?

Threshold itu bahasa ribet dari:

> batas hari.

Di sistem ini ada dua batas penting:

| Sel | Nama            | Default | Artinya                                               |
| --- | --------------- | ------- | ----------------------------------------------------- |
| D4  | batas PERHATIAN | 90      | kalau sisa hari 90 atau kurang, mulai masuk perhatian |
| D6  | batas KRITIS    | 30      | kalau sisa hari 30 atau kurang, masuk kritis          |

Letaknya di tab:

> `RINGKASAN`

Bahasa bayinya:

> D4 itu pagar kuning.  
> D6 itu pagar merah.

Kalau bahan sudah melewati pagar kuning, dia masuk perhatian.

Kalau sudah melewati pagar merah, dia masuk kritis.

Aturan penting:

> **D6 harus lebih kecil dari D4.**

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

Kalau kebalik, robot bingung.

Seperti bayi disuruh pakai sepatu di tangan.

---

## 11. Tab `RINGKASAN` Itu Buat Apa?

Tab `RINGKASAN` adalah **papan skor**.

Dia menghitung:

- berapa bahan aman
- berapa bahan perhatian
- berapa bahan kritis
- berapa bahan expired
- total semua bahan

Rumusnya pakai `COUNTIF`.

Bahasa bayinya:

> “Bukunya menghitung sendiri berapa teman yang hijau, kuning, merah, dan expired.”

Catatan penting:

Karena nama tab utama adalah `BAHAN BHP 2026` dan ada spasi, rumus harus pakai tanda kutip satu.

Contoh:

```excel
=COUNTIF('BAHAN BHP 2026'!I4:I200,"*AMAN*")
```

Kalau tidak pakai tanda kutip, Google Sheets bisa bingung.

---

## 12. Warna Otomatis Itu Apa?

Warna otomatis disebut **conditional formatting**.

Bahasa bayinya:

> Buku catatan punya stabilo otomatis.

Kalau bahan aman, distabilo hijau.

Kalau perhatian, kuning.

Kalau kritis, oranye / merah.

Kalau expired, merah banget.

Catatan:

Kalau threshold D4/D6 diubah, status dan email ikut membaca angka baru.

Tapi kalau aturan warna dibuat manual dengan angka lama, warna mungkin perlu dicek ulang di menu:

```text
Format → Conditional formatting
```

---

## 13. Robot Apps Script Itu Apa?

Apps Script adalah **robot kecil** yang hidup di Google.

Dia tidak punya badan.

Tapi dia bisa:

1. membuka spreadsheet,
2. membaca daftar bahan,
3. menghitung sisa hari,
4. memilih bahan yang perlu alert,
5. membuat isi email,
6. mengirim email.

Robot ini ditulis di file:

```text
monitoring_ed_final.gs
```

---

## 14. Kartu Identitas Robot: `CONFIG`

Di dalam script ada bagian `CONFIG`.

Anggap ini seperti KTP + daftar tugas robot.

Isinya:

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

Bahasa bayinya:

- `EMAIL_PENERIMA` = email tujuan laporan
- `ID_SPREADSHEET` = alamat rumah buku catatan
- `NAMA_SHEET` = nama halaman utama
- `BARIS_MULAI` = mulai baca data dari baris 4
- `D4` = batas perhatian
- `D6` = batas kritis

Kalau email tujuan atau spreadsheet berubah, bagian ini harus disesuaikan.

---

## 15. Robot Tahu Kolom Dari Mana?

Di script ada mapping kolom.

Bahasa gampangnya:

> Robot dikasih tahu:  
> “Nama bahan ada di kolom B.”  
> “Stok ada di kolom E.”  
> “Tanggal expired ada di kolom G.”

Contohnya:

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

Kalau kolom di spreadsheet digeser sembarangan, robot bisa salah baca.

Jadi jangan suka mindahin kolom tanpa update script.

---

## 16. Kerja Robot Tiap Pagi

Setiap pagi jam 07.00 WIB, robot bangun.

Lalu dia melakukan ini:

```text
1. Buka spreadsheet.
2. Buka tab BAHAN BHP 2026.
3. Buka tab RINGKASAN.
4. Baca batas PERHATIAN dari D4.
5. Baca batas KRITIS dari D6.
6. Cek apakah D4 dan D6 angka beneran.
7. Cek apakah D6 lebih kecil dari D4.
8. Baca semua bahan mulai baris 4.
9. Lewati baris kosong.
10. Lewati bahan yang stoknya 0.
11. Hitung sisa hari setiap bahan.
12. Masukkan bahan ke kelompok EXPIRED / KRITIS / PERHATIAN.
13. Kalau tidak ada bahan bahaya, tidak kirim email.
14. Kalau ada bahan bahaya, kirim email laporan.
```

Bahasa bayinya:

> Robot bangun, lihat rak, catat yang bahaya, lalu kirim surat.  
> Kalau semua aman, robot diam saja biar tidak spam.

---

## 17. Kenapa Bahan Stok 0 Tidak Masuk Email?

Karena stok 0 artinya bahan sudah habis / sudah tidak aktif dipakai.

Jadi robot menganggap:

> “Kalau barangnya sudah tidak ada, tidak usah diteriakin lagi.”

Maka kalau bahan expired sudah dipisahkan atau habis, cukup ubah stok di kolom E menjadi:

```text
0
```

Jangan langsung hapus barisnya kalau masih ingin menyimpan riwayat.

---

## 18. Email Dikirim Kapan?

Email dikirim kalau ada bahan dengan kondisi:

```text
stok > 0
DAN
sisa hari <= batas PERHATIAN
```

Artinya:

- kalau semua bahan aman, email tidak dikirim
- kalau ada bahan perhatian/kritis/expired, email dikirim
- email dikirim setiap hari sekitar jam 07.00 WIB

Subject email kira-kira seperti:

```text
[ALERT ED] X Bahan Perlu Perhatian — Laboratorium Kesehatan Gigi
```

---

## 19. Isi Email Alert

Email berisi:

- jumlah bahan expired
- jumlah bahan kritis
- jumlah bahan perhatian
- threshold yang sedang aktif
- tabel detail bahan

Detail bahan yang muncul:

| Info            | Diambil Dari         |
| --------------- | -------------------- |
| nama bahan      | kolom B              |
| kode barang     | kolom J              |
| tanggal expired | kolom G              |
| sisa hari       | hasil hitungan robot |
| stok            | kolom E              |
| lokasi          | kolom K              |
| merk            | kolom L              |

Bahasa bayinya:

> Email itu seperti surat dari robot:  
> “Halo kak, ini bahan-bahan yang harus dicek hari ini.”

---

## 20. Tombol-Tombol Robot

Di script ada beberapa fungsi.

Anggap ini seperti tombol mainan robot.

| Nama Fungsi                | Tombol Apa?          | Gunanya                         |
| -------------------------- | -------------------- | ------------------------------- |
| `kirimEmailAlertED()`      | tombol kerja utama   | cek bahan dan kirim email       |
| `buatBodyEmail()`          | tombol bikin surat   | menyusun isi email HTML         |
| `setupTriggerHarian()`     | tombol pasang alarm  | membuat jadwal harian jam 07.00 |
| `testKirimEmailSekarang()` | tombol coba sekarang | tes kirim email langsung        |

Yang biasanya dipakai saat setup:

1. Jalankan `testKirimEmailSekarang()` untuk uji coba.
2. Jalankan `setupTriggerHarian()` untuk pasang jadwal otomatis.

---

## 21. Cara Input Bahan Baru

Kalau ada bahan baru masuk lab, lakukan ini:

```text
1. Buka Google Sheets.
2. Masuk ke tab BAHAN BHP 2026.
3. Cari baris kosong paling bawah.
4. Isi nomor urut di kolom A.
5. Isi nama bahan di kolom B.
6. Pilih kategori di kolom C.
7. Pilih satuan di kolom D.
8. Isi jumlah stok di kolom E.
9. Isi tanggal masuk di kolom F.
10. Isi tanggal expired dari kemasan di kolom G.
11. Jangan isi kolom H dan I, biarkan otomatis.
12. Isi kode barang di kolom J kalau ada.
13. Pilih lokasi simpan di kolom K.
14. Isi merk dan keterangan kalau perlu.
```

Format tanggal yang aman:

```text
DD/MM/YYYY
```

Contoh:

```text
15/06/2026
```

Kalau kemasan cuma tulis bulan dan tahun, misalnya `JUN 2026`, pakai tanggal akhir bulan:

```text
30/06/2026
```

---

## 22. Cara Update Stok

Kalau stok berkurang setelah praktikum:

```text
1. Cari nama bahan.
2. Klik kolom E.
3. Ganti jumlah stok terbaru.
```

Kalau bahan sudah habis atau sudah dipisahkan:

```text
isi kolom E = 0
```

Ingat:

> Stok 0 tidak masuk email alert.

---

## 23. Apa yang Harus Dilakukan Kalau Ada Email Alert?

Kalau pagi-pagi dapat email alert, jangan panik.

Lakukan ini:

```text
1. Buka email.
2. Lihat bagian EXPIRED dulu.
3. Kalau ada expired, pisahkan bahan dari rak.
4. Jangan gunakan bahan expired untuk praktikum.
5. Lihat bagian KRITIS.
6. Prioritaskan bahan kritis untuk dipakai dulu atau laporkan.
7. Lihat bagian PERHATIAN.
8. Pantau bahan tersebut.
9. Update stok di spreadsheet kalau ada perubahan.
10. Catat perubahan penting di tab LOG.
```

Bahasa bayinya:

> Email bukan buat nakut-nakutin.  
> Email cuma bilang:  
> “Kak, tolong lihat bahan ini ya.”

---

## 24. Tab `LOG` Untuk Apa?

Tab `LOG` adalah buku harian.

Dipakai untuk mencatat perubahan penting.

Contoh yang bagus dicatat:

- bahan baru masuk
- stok bahan berubah besar
- bahan expired dipisahkan
- bahan dibuang / dimusnahkan
- ada koreksi data tanggal

Contoh isi log:

```text
Tanggal: 10/04/2026
Nama petugas: PLP Lab
Aksi: Update stok
Bahan: Alginat Merk X
Detail: Stok dari 5 jadi 2 setelah praktikum
```

Kenapa perlu log?

Karena manusia bisa lupa.

Buku harian bantu ingat.

---

## 25. Cara Pasang Sistem Dari Nol

Bagian ini adalah versi **lebih detail** dari cara pasang sistem.

Ibaratnya kita mau bikin **warung kecil yang punya robot penjaga stok**.

Yang harus disiapkan:

1. **Buku catatan pintar** → Google Sheets.
2. **Otak robot** → Apps Script.
3. **Alamat buku** → ID Spreadsheet.
4. **Alamat penerima surat** → email penerima alert.
5. **Alarm pagi** → trigger harian jam 07.00 WIB.

Kalau bingung, ingat analogi dari poin sebelumnya:

| Lihat Poin | Isinya                                     | Dipakai di Nomor 25 Untuk                 |
| ---------- | ------------------------------------------ | ----------------------------------------- |
| Poin 3     | Google Sheets, Apps Script, Gmail, Trigger | memahami alat yang dipasang               |
| Poin 5     | isi 4 tab spreadsheet                      | memastikan bukunya sudah benar            |
| Poin 6     | kolom A sampai M                           | memastikan data bahan bisa dibaca robot   |
| Poin 10    | threshold / batas hari                     | mengatur kapan bahan dianggap bahaya      |
| Poin 13    | robot Apps Script                          | memahami siapa yang kerja otomatis        |
| Poin 14    | `CONFIG`                                   | mengisi identitas robot                   |
| Poin 16    | kerja robot tiap pagi                      | memahami alur cek bahan                   |
| Poin 18    | kapan email dikirim                        | memahami kenapa email kadang tidak muncul |
| Poin 20    | tombol-tombol robot                        | tahu fungsi mana yang harus dipencet      |
| Poin 26    | masalah umum                               | tempat cek kalau ada error                |
| Poin 29    | checklist akhir                            | memastikan sistem sudah siap dipakai      |

---

### 25.1 Gambaran Besarnya Dulu

Jangan langsung panik lihat kata **script**.

Urutan pasangnya cuma begini:

```text
1. Taruh buku catatan di Google Drive.
2. Pastikan halaman dan kolomnya benar.
3. Ambil ID buku catatan itu.
4. Buka tempat bikin robot, yaitu Apps Script.
5. Masukkan kode robot.
6. Kasih tahu robot alamat buku dan email penerima.
7. Tes robot sekali.
8. Pasang alarm supaya robot jalan tiap pagi.
9. Cek hasilnya.
```

Bahasa bayinya:

> Kita taruh buku di meja.  
> Kita masukin otak ke robot.  
> Kita kasih robot alamat buku.  
> Kita kasih robot alamat email.  
> Kita pencet tombol tes.  
> Kalau hidup, kita pasang alarm pagi.

---

### 25.2 Yang Harus Disiapkan Sebelum Mulai

Sebelum pasang, siapkan dulu benda-benda ini:

| Yang Disiapkan                | Contoh                        | Kenapa Penting                  |
| ----------------------------- | ----------------------------- | ------------------------------- |
| File spreadsheet              | `Monitoring_ED_LabKesgi.xlsx` | ini buku catatan bahan lab      |
| File script                   | `monitoring_ed_final.gs`      | ini otak robot email            |
| Akun Google lab               | misalnya email lab            | tempat spreadsheet disimpan     |
| Akun Google robot / developer | akun yang buka Apps Script    | yang menjalankan robot otomatis |
| Email penerima alert          | email lab / admin             | tempat laporan dikirim          |
| Daftar bahan asli             | data stock opname             | isi data beneran, bukan dummy   |

Catatan bayi:

> Jangan mulai kalau belum tahu email mana yang akan menerima alert.  
> Jangan mulai kalau file spreadsheet belum ada.  
> Jangan mulai kalau script robot belum siap.

---

### 25.3 Langkah 1 — Upload Buku Catatan ke Google Drive

Ini bagian membuat **buku catatan pintar**.

```text
1. Buka Google Drive.
2. Login pakai akun lab.
3. Upload file Monitoring_ED_LabKesgi.xlsx.
4. Setelah upload selesai, klik kanan file itu.
5. Pilih Open with → Google Sheets.
6. Tunggu sampai file terbuka sebagai Google Sheets.
```

Bahasa bayinya:

> File Excel itu seperti buku kertas.  
> Kita pindahkan ke Google Sheets supaya bukunya bisa hidup dan dihitung otomatis.

Setelah terbuka, cek bagian bawah spreadsheet.

Harus ada tab seperti ini:

```text
BAHAN BHP 2026
REFERENSI
RINGKASAN
LOG
```

Kalau nama tab utama masih beda, misalnya masih `DATABASE`, ganti jadi:

```text
BAHAN BHP 2026
```

Kenapa harus persis?

> Karena robot mencari tab dengan nama itu.  
> Kalau namanya beda satu huruf saja, robot seperti anak kecil nyari kamar tapi tulisannya beda. Dia bingung.

---

### 25.4 Langkah 2 — Cek Isi Tab `BAHAN BHP 2026`

Tab ini adalah **rak utama**.

Robot nanti membaca bahan dari tab ini.

Pastikan kolomnya urut seperti poin 6:

| Kolom | Nama            | Harus Ada? |
| ----- | --------------- | ---------- |
| A     | NO              | ya         |
| B     | NAMA BAHAN      | ya         |
| C     | KATEGORI        | ya         |
| D     | SATUAN          | ya         |
| E     | JUMLAH STOK     | ya         |
| F     | TANGGAL MASUK   | ya         |
| G     | TANGGAL EXPIRED | ya         |
| H     | SISA HARI       | otomatis   |
| I     | STATUS ED       | otomatis   |
| J     | KODE BARANG     | disarankan |
| K     | LOKASI SIMPAN   | disarankan |
| L     | MERK / PRODUSEN | opsional   |
| M     | KETERANGAN      | opsional   |

Penting:

```text
Data bahan mulai dari baris 4.
```

Kenapa baris 4?

> Karena di kode robot, `BARIS_MULAI` disetel ke 4.  
> Jadi robot mulai membaca dari baris 4 ke bawah.

Kalau data ditulis di atas baris 4, robot bisa saja tidak membacanya.

---

### 25.5 Langkah 3 — Cek Rumus Otomatis Kolom H dan I

Kolom H dan I jangan diisi manual.

| Kolom         | Tugas                                       |
| ------------- | ------------------------------------------- |
| H / SISA HARI | menghitung sisa hari menuju expired         |
| I / STATUS ED | menentukan aman, perhatian, kritis, expired |

Bahasa bayinya:

> Kolom G adalah tanggal basi.  
> Kolom H adalah hitungan “berapa hari lagi basi”.  
> Kolom I adalah lampu warna statusnya.

Coba isi satu baris dummy:

```text
Nama bahan     : TEST BAHAN
Stok           : 1
Tanggal Expired: tanggal beberapa hari dari hari ini
```

Lalu lihat:

```text
Kolom H harus muncul angka.
Kolom I harus muncul status.
```

Kalau H dan I kosong, biasanya tanggal di kolom G belum terbaca sebagai tanggal.

Solusi detailnya ada di poin 26.

---

### 25.6 Langkah 4 — Cek Tab `RINGKASAN`

Tab `RINGKASAN` itu seperti **papan skor**.

Di sini sistem menghitung:

```text
berapa bahan aman
berapa bahan perhatian
berapa bahan kritis
berapa bahan expired
berapa total bahan
```

Di tab ini juga ada dua angka penting:

| Sel | Artinya         | Contoh Default |
| --- | --------------- | -------------- |
| D4  | batas PERHATIAN | 90             |
| D6  | batas KRITIS    | 30             |

Bahasa bayinya:

> D4 itu batas mulai “eh, awas ya”.  
> D6 itu batas mulai “waduh, cepat urus”.

Aturan wajib:

```text
D6 harus lebih kecil dari D4.
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

Kenapa salah?

> Karena masa “kritis” kok lebih longgar daripada “perhatian”.  
> Ibarat bilang: “sangat bahaya kalau masih 90 hari, tapi cuma perhatian kalau 30 hari.” Itu kebalik.

Kalau D4/D6 salah, robot sengaja berhenti supaya tidak kirim laporan ngawur.

---

### 25.7 Langkah 5 — Bereskan Rumus `RINGKASAN` Kalau Masih `#REF!`

Kadang setelah tab diganti nama, rumus masih mencari nama lama.

Contoh masalah:

```text
#REF!
```

Atau rumus masih menunjuk ke:

```text
DATABASE!
```

Solusinya:

```text
1. Buka tab RINGKASAN.
2. Tekan Ctrl + H.
3. Cari: DATABASE!
4. Ganti dengan: 'BAHAN BHP 2026'!
5. Centang pilihan untuk mencari di formula.
6. Klik Replace All.
```

Kenapa pakai tanda kutip satu?

```text
'BAHAN BHP 2026'!
```

Karena nama tab ada spasi.

Bahasa bayinya:

> Kalau nama orang panjang dan ada spasi, harus dipanggil lengkap.  
> Kalau tidak, Google Sheets bisa salah paham.

---

### 25.8 Langkah 6 — Ambil ID Spreadsheet

Robot butuh alamat buku catatan.

Alamat itu disebut:

```text
ID_SPREADSHEET
```

Cara ambil:

```text
1. Buka spreadsheet di browser.
2. Lihat URL di atas.
3. Cari bagian setelah /d/ dan sebelum /edit.
4. Salin bagian itu saja.
```

Contoh URL:

```text
https://docs.google.com/spreadsheets/d/1ABCdefGHIjklMNOP987xyz/edit
```

Yang disalin:

```text
1ABCdefGHIjklMNOP987xyz
```

Bahasa bayinya:

> ID Spreadsheet itu seperti alamat rumah si buku.  
> Robot perlu alamat itu supaya tidak nyasar.

Jangan salah salin:

| Salah                       | Benar                |
| --------------------------- | -------------------- |
| salin seluruh URL           | salin ID tengah saja |
| ikut `/edit`                | jangan ikut `/edit`  |
| ada spasi di depan/belakang | bersihkan spasi      |

---

### 25.9 Langkah 7 — Buka Apps Script

Sekarang kita pasang **otak robot**.

```text
1. Buka script.google.com.
2. Login memakai akun yang akan menjalankan robot.
3. Klik New project.
4. Beri nama project, misalnya:
   Monitoring ED - Lab Kesgi
```

Saran:

> Pakai akun yang memang disiapkan untuk sistem, bukan akun pribadi yang nanti bisa lupa password atau pindah orang.

Bahasa bayinya:

> Apps Script itu bengkel robot.  
> Di sinilah otak robot ditempel.

---

### 25.10 Langkah 8 — Masukkan Kode Robot

Di project Apps Script baru:

```text
1. Hapus kode bawaan yang muncul.
2. Buka file monitoring_ed_final.gs.
3. Copy semua isi file itu.
4. Paste ke editor Apps Script.
5. Klik Save / Ctrl + S.
```

Jangan copy setengah.

Harus dari awal sampai akhir, termasuk fungsi:

```text
kirimEmailAlertED()
buatBodyEmail()
setupTriggerHarian()
testKirimEmailSekarang()
```

Bahasa bayinya:

> Kalau otak robot cuma dicopy separuh, robot bisa hidup tapi linglung.  
> Jadi copy semuanya.

---

### 25.11 Langkah 9 — Isi `CONFIG`

Di bagian atas script, ada bagian bernama:

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

Yang biasanya perlu diganti hanya:

| Bagian           | Isi Dengan                       |
| ---------------- | -------------------------------- |
| `EMAIL_PENERIMA` | email penerima laporan           |
| `ID_SPREADSHEET` | ID spreadsheet dari langkah 25.8 |

Contoh:

```javascript
EMAIL_PENERIMA: "labkesgi.poltekkesplg@gmail.com",
ID_SPREADSHEET: "1ABCdefGHIjklMNOP987xyz",
```

Kalau penerima lebih dari satu, pisahkan dengan koma:

```javascript
EMAIL_PENERIMA: "email1@gmail.com,email2@gmail.com",
```

Jangan ubah ini kalau tidak perlu:

```javascript
NAMA_SHEET: "BAHAN BHP 2026";
NAMA_RINGKASAN: "RINGKASAN";
BARIS_MULAI: 4;
SEL_BATAS_PERHATIAN: "D4";
SEL_BATAS_KRITIS: "D6";
```

Karena itu sudah nyambung dengan struktur spreadsheet di poin 5, 6, dan 10.

---

### 25.12 Langkah 10 — Pastikan Mapping Kolom Tidak Berubah

Di script ada peta kolom bernama `COL`.

Itu seperti denah rak.

```text
B = Nama bahan
E = Stok
G = Tanggal expired
J = Kode barang
K = Lokasi
L = Merk
```

Robot membaca data berdasarkan posisi kolom, bukan berdasarkan perasaan.

Jadi jangan sembarang geser kolom di spreadsheet.

Contoh:

> Kalau kolom TANGGAL EXPIRED dipindah dari G ke H, robot tetap mencari tanggal expired di G.  
> Akhirnya robot bingung atau laporan salah.

Aturan aman:

```text
Jangan mengubah urutan kolom A sampai M.
```

Kalau mau tambah kolom baru, sebaiknya taruh setelah kolom M dan konsultasi dulu.

---

### 25.13 Langkah 11 — Tes Robot Sekarang

Sebelum pasang alarm harian, robot harus dites dulu.

Di Apps Script:

```text
1. Pilih fungsi testKirimEmailSekarang.
2. Klik tombol Run.
3. Kalau Google minta izin, klik Review permissions.
4. Pilih akun robot.
5. Klik Advanced kalau muncul peringatan.
6. Klik Allow.
```

Kenapa Google minta izin?

> Karena robot mau membaca spreadsheet dan mengirim email.  
> Google perlu tanya dulu: “Bener nih robot boleh kerja?”

Setelah itu:

```text
1. Buka menu Executions atau Logs.
2. Lihat apakah ada tulisan sukses atau error.
3. Cek inbox email penerima.
4. Cek juga folder Spam.
```

Penting banget:

> Kalau semua bahan masih aman, email memang tidak dikirim.  
> Itu bukan error.

Robot hanya kirim email kalau ada bahan:

```text
stok > 0
DAN
sisa hari <= D4
```

Kalau ingin mengetes email, buat satu data dummy:

```text
Nama bahan      : TEST ALERT
Stok            : 1
Tanggal Expired : tanggal dalam 1–30 hari ke depan
```

Lalu jalankan lagi:

```text
testKirimEmailSekarang
```

Kalau email masuk, robot sudah bisa kerja.

Setelah selesai tes, data dummy boleh dihapus atau stoknya dibuat 0.

---

### 25.14 Langkah 12 — Pasang Alarm Harian / Trigger

Kalau tes sudah berhasil, pasang alarm harian.

Di Apps Script:

```text
1. Pilih fungsi setupTriggerHarian.
2. Klik Run.
3. Tunggu sampai selesai.
4. Buka menu Triggers / ikon jam.
5. Pastikan ada trigger untuk fungsi kirimEmailAlertED.
```

Trigger yang benar kira-kira seperti ini:

```text
Function       : kirimEmailAlertED
Event source   : Time-driven
Type           : Day timer
Jam            : 07.00 - 08.00
```

Bahasa bayinya:

> Trigger itu alarm.  
> Alarm membangunkan robot setiap pagi.  
> Setelah bangun, robot cek bahan.  
> Kalau ada yang bahaya, robot kirim email.

Catatan penting:

> Fungsi `setupTriggerHarian()` sengaja menghapus trigger lama dulu supaya alarm tidak dobel.

Jadi kalau fungsi ini dijalankan ulang, dia akan:

```text
1. Buang alarm lama.
2. Pasang alarm baru.
```

Ini bagus supaya email tidak terkirim berkali-kali karena trigger dobel.

---

### 25.15 Langkah 13 — Cek Timezone Project

Timezone harus:

```text
Asia/Jakarta
```

Kenapa?

> Karena jadwal email yang diinginkan adalah jam 07.00 WIB.  
> Kalau timezone salah, robot bisa bangun bukan jam 7 pagi WIB.

Cara cek:

```text
1. Buka Apps Script.
2. Klik Project Settings.
3. Cari Time zone.
4. Pilih Asia/Jakarta.
5. Simpan kalau ada perubahan.
```

Bahasa bayinya:

> Kalau jam dinding robot salah negara, dia bangunnya ikut jam negara lain.

---

### 25.16 Langkah 14 — Share Spreadsheet ke Pengguna Lab

Setelah sistem hidup, kasih akses ke PLP / pengelola lab.

Di Google Sheets:

```text
1. Klik Share.
2. Masukkan email PLP / pengelola lab.
3. Pilih role Editor.
4. Kirim undangan akses.
```

Tapi hati-hati:

| Bagian                         | Boleh Diedit?                    |
| ------------------------------ | -------------------------------- |
| Data bahan di `BAHAN BHP 2026` | boleh                            |
| Sel D4 dan D6 di `RINGKASAN`   | boleh kalau perlu ubah threshold |
| Tab `REFERENSI`                | admin saja                       |
| Rumus H dan I                  | jangan                           |
| Kode Apps Script               | developer saja                   |

Bahasa bayinya:

> PLP boleh isi buku.  
> Tapi jangan bongkar mesin robotnya.

---

### 25.17 Langkah 15 — Tes Alur Lengkap Dari Awal Sampai Akhir

Setelah semua dipasang, lakukan tes end-to-end.

Artinya:

> Tes dari input bahan sampai email masuk.

Checklist tes:

```text
1. Masukkan satu bahan dummy di BAHAN BHP 2026.
2. Isi stok lebih dari 0.
3. Isi tanggal expired yang masuk batas alert.
4. Pastikan kolom H menghitung sisa hari.
5. Pastikan kolom I muncul status.
6. Pastikan RINGKASAN ikut berubah.
7. Jalankan testKirimEmailSekarang.
8. Cek email masuk.
9. Jalankan setupTriggerHarian.
10. Cek menu Triggers.
```

Kalau semua lulus, sistem siap dipakai.

---

### 25.18 Langkah 16 — Bersihkan Data Dummy

Kalau saat tes kamu membuat bahan palsu, jangan dibiarkan campur dengan data asli.

Pilihan aman:

```text
1. Hapus baris dummy.
```

atau:

```text
1. Ubah stok dummy menjadi 0.
2. Tambahkan keterangan bahwa itu data tes.
```

Kalau stok dibuat 0, robot tidak akan memasukkannya ke email alert.

Ini nyambung dengan poin 17:

> Stok 0 artinya barang sudah habis / tidak perlu di-alert.

---

### 25.19 Langkah 17 — Masukkan Data Asli Lab

Kalau template masih berisi data contoh, ganti dengan data asli.

Cara aman:

```text
1. Buka tab BAHAN BHP 2026.
2. Hapus data dummy dari baris 4 ke bawah.
3. Masukkan data asli dari stock opname.
4. Pastikan tanggal masuk dan tanggal expired formatnya benar.
5. Pastikan kolom H dan I otomatis muncul.
6. Cek RINGKASAN.
```

Jangan lupa:

```text
Tanggal expired harus dilihat dari kemasan fisik.
```

Kalau kemasan hanya menulis bulan dan tahun:

```text
JUN 2026 → pakai 30/06/2026
DES 2026 → pakai 31/12/2026
```

Bahasa bayinya:

> Jangan nebak tanggal basi.  
> Lihat bungkusnya.  
> Kalau cuma ada bulan, pakai akhir bulan.

---

### 25.20 Langkah 18 — Catat di Tab `LOG`

Setelah pemasangan selesai, catat di tab `LOG`.

Contoh isi log:

| Tanggal    | Nama   | Aksi            | Keterangan                         |
| ---------- | ------ | --------------- | ---------------------------------- |
| 10/04/2026 | Annisa | Setup sistem    | Trigger harian aktif jam 07.00 WIB |
| 10/04/2026 | Annisa | Tes email       | Email alert berhasil masuk         |
| 10/04/2026 | PLP    | Input data awal | Data stock opname dimasukkan       |

Kenapa perlu LOG?

> Supaya kalau nanti ada masalah, orang berikutnya tahu riwayatnya.  
> Ini seperti buku catatan satpam.

---

### 25.21 Checklist Besar Pemasangan

Pakai checklist ini biar tidak ada yang kelewat.

| No  | Cek                                                 | Status |
| --- | --------------------------------------------------- | ------ |
| 1   | File spreadsheet sudah diupload ke Google Drive     | ☐      |
| 2   | File sudah dibuka sebagai Google Sheets             | ☐      |
| 3   | Tab utama bernama `BAHAN BHP 2026`                  | ☐      |
| 4   | Tab `REFERENSI`, `RINGKASAN`, `LOG` ada             | ☐      |
| 5   | Kolom A sampai M sesuai urutan                      | ☐      |
| 6   | Data mulai dari baris 4                             | ☐      |
| 7   | Kolom H menghitung sisa hari otomatis               | ☐      |
| 8   | Kolom I menampilkan status otomatis                 | ☐      |
| 9   | `RINGKASAN` tidak ada error `#REF!`                 | ☐      |
| 10  | D4 dan D6 berisi angka murni                        | ☐      |
| 11  | D6 lebih kecil dari D4                              | ☐      |
| 12  | ID Spreadsheet sudah disalin                        | ☐      |
| 13  | Project Apps Script sudah dibuat                    | ☐      |
| 14  | Kode `monitoring_ed_final.gs` sudah dipaste lengkap | ☐      |
| 15  | `EMAIL_PENERIMA` sudah diisi benar                  | ☐      |
| 16  | `ID_SPREADSHEET` sudah diisi benar                  | ☐      |
| 17  | Fungsi `testKirimEmailSekarang()` berhasil jalan    | ☐      |
| 18  | Email test berhasil masuk                           | ☐      |
| 19  | Fungsi `setupTriggerHarian()` sudah dijalankan      | ☐      |
| 20  | Trigger harian `kirimEmailAlertED` sudah ada        | ☐      |
| 21  | Timezone project `Asia/Jakarta`                     | ☐      |
| 22  | Spreadsheet sudah dishare ke PLP                    | ☐      |
| 23  | Data dummy sudah dibersihkan                        | ☐      |
| 24  | Data asli sudah dimasukkan                          | ☐      |
| 25  | Tab `LOG` sudah diisi catatan setup                 | ☐      |

---

### 25.22 Kalau Setelah Dipasang Email Tidak Masuk

Jangan langsung panik.

Cek dulu pertanyaan ini:

```text
1. Apakah ada bahan dengan stok > 0?
2. Apakah sisa harinya <= D4?
3. Apakah tanggal expired terbaca sebagai tanggal?
4. Apakah EMAIL_PENERIMA benar?
5. Apakah ID_SPREADSHEET benar?
6. Apakah trigger harian sudah ada?
7. Apakah timezone sudah Asia/Jakarta?
8. Apakah email masuk Spam?
9. Apakah Google sudah memberi izin akses ke robot?
10. Apakah D4 dan D6 valid?
```

Ingat:

> Kalau semua bahan aman, email memang tidak dikirim.  
> Itu tanda sistem sopan, bukan rusak.

Kalau mau memaksa tes, buat data dummy yang masuk alert seperti di langkah 25.13.

---

### 25.23 Versi Super Pendek Pemasangan

Kalau mau versi paling pendek:

```text
1. Upload spreadsheet.
2. Pastikan tab dan kolom benar.
3. Ambil ID spreadsheet.
4. Paste script ke Apps Script.
5. Isi EMAIL_PENERIMA dan ID_SPREADSHEET.
6. Run testKirimEmailSekarang.
7. Izinkan akses Google.
8. Cek email.
9. Run setupTriggerHarian.
10. Cek trigger dan timezone.
```

Bahasa bayi paling bayi:

> Buku siap.  
> Robot dikasih otak.  
> Robot dikasih alamat buku.  
> Robot dikasih alamat email.  
> Robot dites.  
> Robot dikasih alarm pagi.  
> Selesai.

---

## 26. Masalah Umum dan Cara Beresinnya

### Masalah 1 — Kolom H / I Tidak Terisi

Penyebab paling sering:

> tanggal expired di kolom G tidak kebaca sebagai tanggal.

Solusi:

```text
1. Klik kolom G.
2. Format → Number → Date.
3. Isi ulang tanggal dengan format DD/MM/YYYY.
```

---

### Masalah 2 — RINGKASAN Muncul `#REF!`

Penyebab:

> rumus masih nyari nama tab lama, misalnya DATABASE.

Solusi:

```text
1. Buka tab RINGKASAN.
2. Tekan Ctrl + H.
3. Cari: DATABASE!
4. Ganti dengan: 'BAHAN BHP 2026'!
5. Centang cari di formula.
6. Replace All.
```

Jangan lupa tanda kutip satu.

---

### Masalah 3 — Email Tidak Masuk

Cek ini:

```text
1. Apakah ada bahan stok > 0?
2. Apakah sisa hari <= D4?
3. Apakah email masuk Spam?
4. Apakah trigger harian sudah ada?
5. Apakah EMAIL_PENERIMA benar?
6. Apakah robot sudah diberi izin Google?
```

Kalau semua aman tapi tetap tidak masuk, cek menu Executions di Apps Script.

---

### Masalah 4 — Threshold Error

Script sengaja menolak jalan kalau:

```text
D4 atau D6 bukan angka
```

atau:

```text
D6 >= D4
```

Solusi:

```text
1. Buka RINGKASAN.
2. Isi D4 dengan angka, misalnya 90.
3. Isi D6 dengan angka lebih kecil, misalnya 30.
4. Jangan tulis "90 hari".
5. Tulis angka saja: 90.
```

---

### Masalah 5 — Bahan Sudah Habis Tapi Masih Muncul

Cek kolom E.

Kalau masih lebih dari 0, robot mengira stok masih ada.

Solusi:

```text
ubah stok menjadi 0
```

---

## 27. Aturan Jangan Nakal

Supaya sistem tidak rusak, jangan lakukan ini sembarangan:

```text
1. Jangan ubah nama tab tanpa update script dan rumus.
2. Jangan geser kolom A sampai M tanpa update mapping script.
3. Jangan isi manual kolom H dan I.
4. Jangan tulis tanggal asal-asalan.
5. Jangan isi D4/D6 pakai teks seperti "90 hari".
6. Jangan hapus trigger kalau tidak tahu fungsinya.
7. Jangan bagikan spreadsheet ke publik.
```

Bahasa bayinya:

> Jangan cabut kaki robot, nanti robot jalannya pincang.

---

## 28. Keamanan Data

Sistem ini masih di dalam ekosistem Google.

Data tidak dikirim ke aplikasi luar.

Tapi tetap harus hati-hati.

Aturan aman:

```text
1. Spreadsheet jangan dibuat public.
2. Sharing sebaiknya Restricted.
3. Beri akses hanya ke orang yang perlu.
4. Jangan sebar ID spreadsheet sembarangan.
5. Akun robot jangan dipakai untuk hal aneh-aneh.
6. Kalau email penerima berubah, update CONFIG.
```

Ibarat rumah:

> ID spreadsheet itu alamat rumah.  
> Sharing permission itu kunci pintu.  
> Jangan kasih kunci ke orang random.

---

## 29. Checklist Setelah Sistem Dipasang

Gunakan checklist ini.

```text
[ ] Spreadsheet sudah di Google Sheets
[ ] Tab utama bernama BAHAN BHP 2026
[ ] Tab RINGKASAN ada D4 dan D6
[ ] D4 berisi angka perhatian, contoh 90
[ ] D6 berisi angka kritis, contoh 30
[ ] D6 lebih kecil dari D4
[ ] Kolom A sampai M sesuai urutan
[ ] Tanggal expired terbaca sebagai Date
[ ] Apps Script sudah dipasang
[ ] EMAIL_PENERIMA sudah benar
[ ] ID_SPREADSHEET sudah benar
[ ] testKirimEmailSekarang berhasil
[ ] setupTriggerHarian sudah dijalankan
[ ] Trigger harian muncul di menu Triggers
[ ] Timezone Apps Script = Asia/Jakarta
[ ] Email tidak masuk spam
[ ] PLP sudah diberi akses edit spreadsheet
```

---

## 30. Checklist Harian PLP

Setiap hari, PLP cukup lakukan ini:

```text
[ ] Cek email pagi
[ ] Kalau ada EXPIRED, pisahkan bahan
[ ] Kalau ada KRITIS, prioritaskan penggunaan / laporkan
[ ] Kalau ada PERHATIAN, pantau rutin
[ ] Update stok kalau ada perubahan
[ ] Catat perubahan penting di LOG
```

Tidak perlu hitung manual.

Tidak perlu cek semua bahan satu per satu setiap pagi.

Robot bantu menyaring yang perlu dilihat.

---

## 31. Checklist Saat Ada Bahan Baru

```text
[ ] Isi nama bahan
[ ] Isi kategori
[ ] Isi satuan
[ ] Isi jumlah stok
[ ] Isi tanggal masuk
[ ] Isi tanggal expired dari kemasan
[ ] Pastikan kolom H dan I otomatis terisi
[ ] Isi kode barang kalau ada
[ ] Isi lokasi simpan
[ ] Isi merk kalau ada
[ ] Cek status warna muncul benar
```

---

## 32. Penjelasan Paling Pendek Sedunia

Kalau harus dijelaskan dalam 5 kalimat:

> Ini sistem buat mencatat bahan lab dan tanggal expired-nya.  
> Google Sheets jadi buku catatan pintar.  
> Apps Script jadi robot yang ngecek setiap pagi.  
> Kalau ada bahan hampir expired atau sudah expired, robot kirim email.  
> PLP tinggal cek email, pisahkan bahan expired, dan update stok.

---

## 33. Versi “Ngomong ke Bayi”

Halo adek.

Ini ada buku pintar.

Di buku pintar ada banyak nama bahan.

Setiap bahan punya tanggal “jangan dipakai lagi”.

Nanti robot kecil bangun pagi-pagi.

Robot lihat buku.

Kalau bahan masih aman, robot diam.

Kalau bahan mau expired, robot bilang lewat email:

> “Kak, ini bahan udah mau bahaya.”

Kalau bahan sudah expired, robot bilang:

> “Kak, ini jangan dipakai ya.”

Terus kakak lab pisahkan bahan itu.

Selesai.

---

## 34. Ringkasan Developer Tapi Tetap Santai

Bagian penting untuk developer:

```text
Spreadsheet utama: BAHAN BHP 2026
Range data: mulai baris 4
Total kolom aktif: A sampai M
Threshold perhatian: RINGKASAN!D4
Threshold kritis: RINGKASAN!D6
Fungsi utama: kirimEmailAlertED()
Fungsi trigger: setupTriggerHarian()
Fungsi test: testKirimEmailSekarang()
Jadwal: harian jam 07.00
Timezone: Asia/Jakarta
Email: MailApp.sendEmail()
```

Validasi penting di script:

```text
1. Sheet utama harus ada.
2. Sheet RINGKASAN harus ada.
3. D4 dan D6 harus angka.
4. D6 harus lebih kecil dari D4.
5. Data kosong dilewati.
6. Stok <= 0 dilewati.
7. Email tidak dikirim kalau total alert = 0.
```

Jadi script sudah cukup sopan:

> Kalau tidak ada yang perlu diberitahu, dia tidak berisik.

---

## 35. Riwayat Singkat

```text
v1.0.0 — peluncuran awal sistem monitoring ED
v1.1.0 — tambah kode barang, mapping kolom disesuaikan, threshold dibaca dari RINGKASAN D4/D6
```

---

## 36. Penutup

Sistem ini bukan buat bikin kerja jadi ribet.

Justru tujuannya:

> kerja lab lebih ringan,  
> bahan expired tidak kelewat,  
> mahasiswa lebih aman,  
> laporan lebih rapi.

Kalau masih bingung, ingat saja:

```text
Isi data bahan dengan benar.
Isi tanggal expired dengan benar.
Jangan sentuh kolom otomatis.
Cek email pagi.
Update stok kalau berubah.
```

Udah.

Robot yang bantu sisanya.

---

**Developer:** Annisa Baizan  
**Sistem:** Monitoring Expired Date Bahan Praktikum Habis Pakai  
**Instansi:** Laboratorium Kesehatan Gigi · Poltekkes Kemenkes Palembang  
**Catatan:** Dokumen ini adalah versi super sederhana untuk non-tech.
