# README Bahasa Bayi — Sistem Monitoring ED Bahan Lab

**Lab Kesehatan Gigi · Poltekkes Kemenkes Palembang**  
**Versi santai banget / non-tech / anti mumet**  
**Update: April 2026**

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

| Benda di Warung | Dalam Sistem | Bahasa Bayinya |
|---|---|---|
| Buku catatan besar | Google Sheets | Tempat nulis semua bahan |
| Robot kecil | Google Apps Script | Yang ngecek dan kirim email |
| Tukang pos | Gmail / MailApp | Yang nganter surat peringatan |
| Alarm pagi | Trigger harian | Yang bangunin robot jam 7 pagi |
| Kalkulator otomatis | Formula spreadsheet | Yang ngitung sisa hari |

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

| Tab | Ibaratnya | Fungsinya | Yang Boleh Edit |
|---|---|---|---|
| `BAHAN BHP 2026` | halaman utama buku stok | tempat isi data semua bahan | PLP / pengelola lab |
| `REFERENSI` | daftar pilihan | isi dropdown seperti kategori, satuan, lokasi | admin saja |
| `RINGKASAN` | papan skor | lihat total bahan aman/kritis/expired dan atur batas hari | PLP, khusus sel tertentu |
| `LOG` | buku harian | catatan perubahan manual | PLP |

Yang paling sering dipakai adalah:

> `BAHAN BHP 2026`  
> karena di situlah data bahan dimasukkan.

---

## 6. Tab Utama: `BAHAN BHP 2026`

Tab ini adalah **meja besar tempat semua bahan ditulis**.

Setiap baris = satu bahan.

Setiap kolom = satu info kecil tentang bahan itu.

| Kolom | Nama Kolom | Bahasa Bayi |
|---|---|---|
| A | NO | nomor urut |
| B | NAMA BAHAN | nama bahan di kemasan |
| C | KATEGORI | jenis bahan |
| D | SATUAN | botol, kotak, gram, set, dll |
| E | JUMLAH STOK | jumlah yang masih ada |
| F | TANGGAL MASUK | kapan bahan masuk lab |
| G | TANGGAL EXPIRED | kapan bahan kedaluwarsa |
| H | SISA HARI | dihitung otomatis, jangan disentuh |
| I | STATUS ED | status otomatis, jangan disentuh |
| J | KODE BARANG | kode inventaris / BMN |
| K | LOKASI SIMPAN | bahan ditaruh di mana |
| L | MERK / PRODUSEN | merk bahan |
| M | KETERANGAN | catatan tambahan |

Kolom yang paling penting:

> **G — TANGGAL EXPIRED**

Kenapa?

Karena semua hitungan sistem bergantung ke tanggal expired.

Kalau tanggal expired salah, robot juga bisa salah baca.

---

## 7. Status Warna Itu Maksudnya Apa?

Sistem pakai 4 status.

Bayangin seperti lampu lalu lintas.

| Status | Bahasa Bayi | Artinya | Tindakan |
|---|---|---|---|
| AMAN | masih santai | expired masih jauh | tidak perlu panik |
| PERHATIAN | mulai lihat-lihat | mendekati expired | pantau dan prioritaskan |
| KRITIS | bahaya dekat | expired sangat dekat | segera gunakan / lapor |
| EXPIRED | sudah lewat | sudah kedaluwarsa | pisahkan, jangan digunakan |

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

| Sel | Nama | Default | Artinya |
|---|---|---|---|
| D4 | batas PERHATIAN | 90 | kalau sisa hari 90 atau kurang, mulai masuk perhatian |
| D6 | batas KRITIS | 30 | kalau sisa hari 30 atau kurang, masuk kritis |

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

| Info | Diambil Dari |
|---|---|
| nama bahan | kolom B |
| kode barang | kolom J |
| tanggal expired | kolom G |
| sisa hari | hasil hitungan robot |
| stok | kolom E |
| lokasi | kolom K |
| merk | kolom L |

Bahasa bayinya:

> Email itu seperti surat dari robot:  
> “Halo kak, ini bahan-bahan yang harus dicek hari ini.”

---

## 20. Tombol-Tombol Robot

Di script ada beberapa fungsi.

Anggap ini seperti tombol mainan robot.

| Nama Fungsi | Tombol Apa? | Gunanya |
|---|---|---|
| `kirimEmailAlertED()` | tombol kerja utama | cek bahan dan kirim email |
| `buatBodyEmail()` | tombol bikin surat | menyusun isi email HTML |
| `setupTriggerHarian()` | tombol pasang alarm | membuat jadwal harian jam 07.00 |
| `testKirimEmailSekarang()` | tombol coba sekarang | tes kirim email langsung |

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

### Langkah 1 — Siapkan Spreadsheet

```text
1. Upload file Monitoring_ED_LabKesgi.xlsx ke Google Drive.
2. Buka dengan Google Sheets.
3. Pastikan tab utama bernama BAHAN BHP 2026.
4. Cek tab RINGKASAN.
5. Pastikan rumus tidak error.
6. Salin ID spreadsheet dari URL browser.
```

ID spreadsheet itu bagian tengah URL.

Contoh:

```text
https://docs.google.com/spreadsheets/d/INI_ID_SPREADSHEET/edit
```

Yang disalin:

```text
INI_ID_SPREADSHEET
```

---

### Langkah 2 — Pasang Script Robot

```text
1. Buka script.google.com.
2. Buat project baru.
3. Hapus kode bawaan.
4. Paste isi file monitoring_ed_final.gs.
5. Isi EMAIL_PENERIMA.
6. Isi ID_SPREADSHEET.
7. Simpan.
```

Bahasa bayinya:

> Ini seperti memasukkan otak ke robot.

---

### Langkah 3 — Tes Robot

```text
1. Pilih fungsi testKirimEmailSekarang.
2. Klik Run.
3. Beri izin akses kalau Google minta izin.
4. Cek log.
5. Cek inbox email penerima.
```

Kalau email masuk, berarti robot bisa kirim surat.

---

### Langkah 4 — Pasang Alarm Harian

```text
1. Pilih fungsi setupTriggerHarian.
2. Klik Run.
3. Buka menu Triggers.
4. Pastikan ada jadwal harian untuk kirimEmailAlertED.
```

Jadwalnya:

```text
setiap hari jam 07.00 WIB
```

Pastikan timezone project Apps Script:

```text
Asia/Jakarta
```

Kalau timezone salah, robot bisa bangun jam aneh.

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
