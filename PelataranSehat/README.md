# LMS Kemkes - Toolkit Peserta (Tampermonkey)

Kumpulan userscript untuk membantu pengelolaan data peserta pelatihan di
`admin-lms.kemkes.go.id`. Terdiri dari **2 script utama**:

1. **LMS Kemkes - Export & Enrich Peserta** (`lms_enrich_peserta.user.js`)
   Menarik data lengkap peserta (Tipe Peserta, Nomor HP, biodata) lalu export ke CSV.
2. **LMS Kemkes - Batalkan Peserta dari CSV** (`lms_batalkan_peserta.user.js`)
   Membatalkan peserta secara massal berdasarkan daftar NIK di file CSV.

> Kedua script berjalan memakai sesi login kamu sendiri (token/akun kamu). Tidak ada
> data yang dikirim ke pihak ketiga. Gunakan hanya untuk keperluan dinas yang sah.

---

## Prasyarat

- Browser Chrome/Firefox/Edge + ekstensi **Tampermonkey**.
- Sudah **login** di `admin-lms.kemkes.go.id` sebagai admin/pengelola.
- Punya akses ke pelatihan yang mau diproses.

## Instalasi (untuk tiap script)

1. Buka Tampermonkey → **Create a new script** (atau **Utilities → Import**).
2. Tempel seluruh isi file `.user.js` → **Ctrl+S**.
3. Pastikan script **Enabled**.

Nama yang muncul di Tampermonkey diambil dari baris `// @name`. Untuk mengubah,
edit baris itu lalu simpan.

---

## Script 1 — Export & Enrich Peserta

**Fungsi:** kumpulkan NIK peserta, lalu ambil data lengkap via API
(`be-lms.kemkes.go.id/v1/user`), hasilnya CSV.

**Cara pakai:**

1. Buka halaman **daftar peserta pelatihan** (yang ada tabel NIK-nya).
2. Panel muncul di kanan atas. Kumpulkan NIK dengan salah satu cara:
   - Klik **"Ambil NIK dari tabel halaman ini"** (paginasi otomatis), atau
   - Tempel NIK / CSV ke kotak teks → **"+ Tambah NIK dari teks"**.
3. Klik **"Tarik Data Lengkap & Download CSV"**.
4. Tunggu progres selesai. File `peserta_lengkap_xxx.csv` otomatis ter-download.

**Kolom output:** No, NIK, Nama, Tipe Peserta, Nomor HP, Email, Jabatan, Gender,
Instansi, ProvinsiId, Status, Catatan.

**Catatan:**
- Daftar NIK tersimpan di **localStorage** (tahan reload / tab tertutup). Cek di
  DevTools → Application → Local Storage → key `lms_enrich_niks`.
- Tombol **"Lihat/Download NIK"** untuk mengecek daftar NIK.
- **Nomor HP** dinormalkan ke format `08...`.
- Ganti pelatihan → klik **"reset NIK"** dulu agar tidak tercampur.
- **Jeda antar request (ms)** bisa diubah (default 180). Naikkan bila kena rate-limit.

---

## Script 2 — Batalkan Peserta dari CSV

**Fungsi:** membatalkan peserta massal berdasarkan CSV berisi NIK.
Alur otomatis: cari NIK → klik "Batalkan Peserta" → isi alasan → klik OK.

> **PERINGATAN:** aksi ini **tidak bisa dibatalkan** dan mengirim notifikasi ke
> peserta. Selalu review daftar, uji 1 orang, dan pastikan datanya benar.

**Cara pakai:**

1. Siapkan CSV berisi peserta yang mau dibatalkan (kamu filter sendiri di Excel).
   Format bebas — script hanya mengambil semua angka 16 digit (NIK).
2. Buka halaman pelatihan (`.../kelola-pelatihan/...`). Panel merah muncul.
3. **Langkah 1:** Upload CSV (atau paste NIK). Klik **"review"** untuk cek daftar target.
4. **Langkah 2:** Edit teks **Alasan** sesuai kebutuhan (template sudah tersedia).
5. **Langkah 3 — jalankan dengan pengaman:**
   - Biarkan **"Mode uji" tercentang** → klik **"Uji 1 NIK pertama"**.
     Script mengisi form tapi **TIDAK** klik OK — cek manual, lalu klik OK sendiri
     untuk memastikan alur benar.
   - Jika mulus, **hilangkan centang Mode uji** → uji 1 lagi (kini full otomatis) →
     verifikasi peserta benar terbatalkan.
   - Ketik **`BATALKAN`** di kotak konfirmasi → klik **"BATALKAN SEMUA target"**.
6. Pantau **log** di panel. Klik **"download log"** untuk arsip.

**Pengaman bawaan:**
- Jika hasil pencarian NIK **tidak tunggal** (0 atau >1 baris), peserta **di-skip**
  (tidak diklik apa-apa) dan dicatat di log.
- Tombol "BATALKAN SEMUA" tidak jalan tanpa mengetik `BATALKAN`.
- **Mode uji** mengisi form tanpa klik OK (dry-run).
- **Jeda (ms)** default 1200; naikkan bila koneksi lambat agar modal sempat muncul.

---

## Token (berlaku untuk Script 1)

Script mencari token login otomatis dari storage. Jika gagal (muncul pesan token
tidak ketemu):

1. Buka DevTools (F12) → Console → ketik `localStorage` → Enter.
2. Cari nilai yang diawali `ey...` (JWT). Salin.
3. Tempel ke kotak token manual di panel → jalankan ulang.

> Token biasanya berlaku ~24 jam. Untuk pemakaian esok hari, ambil token baru.

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| Tombol diklik tapi diam | Baca pesan di kotak status. Kemungkinan proses lain masih jalan → klik **reset proses**, atau reload halaman. |
| "Token tidak ketemu" | Isi token manual (lihat bagian Token). Atau pastikan masih login. |
| Banyak baris ERROR / rate-limit | Naikkan **Jeda (ms)**, jalankan ulang. |
| Modal alasan tidak muncul (Script 2) | Naikkan Jeda ke 2000ms. Kalau tetap gagal, struktur UI mungkin berubah — perlu penyesuaian selektor. |
| NIK ke-skip semua (Script 2) | Pastikan halaman benar (ada kotak "Cari NIK Peserta") dan NIK memang terdaftar di pelatihan itu. |
| Panel tidak muncul | Cek script Enabled di Tampermonkey & URL cocok dengan `@match`. |

---

## File yang sebaiknya dihapus (versi lama)

Agar tidak bentrok/dobel panel, hapus dari Tampermonkey jika masih ada:

- `lms_enrich_peserta.js` (versi console lama — digantikan versi Tampermonkey)
- `lms_batalkan_nonnakes.user.js` (versi non-nakes lama — digantikan "dari CSV")

---

## Catatan data & etika

- Script memproses data pribadi peserta (NIK, HP, email). Gunakan sesuai keperluan
  dinas dan aturan perlindungan data instansi.
- Untuk pembatalan massal, sebaiknya ada dasar/persetujuan (mis. dari PPK/panitia)
  dan simpan arsip daftar target + log sebagai bukti proses.
