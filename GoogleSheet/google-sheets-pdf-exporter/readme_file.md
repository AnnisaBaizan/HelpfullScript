# Google Sheets PDF Exporter

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)](https://script.google.com/)

Script Google Apps Script untuk mengekspor Google Sheets ke PDF dengan pembatasan kolom tertentu dan penamaan file otomatis berdasarkan data di cell.

## 🌟 Fitur

- ✅ **Export PDF dengan Range Kolom Terbatas** - Hanya mencetak kolom A sampai M
- ✅ **Penamaan File Otomatis** - Nama file diambil dari cell F20
- ✅ **Custom Menu** - Menu khusus "PRINT TOOLS" di Google Sheets
- ✅ **Dialog User-Friendly** - Feedback visual saat proses download
- ✅ **Auto-Close Dialog** - Dialog otomatis tertutup setelah download selesai
- ✅ **Menyembunyikan Kolom Sementara** - Kolom N ke kanan disembunyikan saat export

## 📋 Prasyarat

- Akun Google
- Akses ke Google Sheets
- Izin untuk menjalankan Apps Script

## 🚀 Instalasi

Lihat panduan lengkap di [Installation Guide](docs/installation.md)

**Ringkasan Cepat:**
1. Buka Google Sheets Anda
2. Klik **Extensions > Apps Script**
3. Copy-paste kode dari `Code.gs`
4. Simpan proyek (Ctrl+S)
5. Refresh spreadsheet Anda
6. Menu "PRINT TOOLS" akan muncul

## 💡 Penggunaan

1. Pastikan data di cell **F20** sudah terisi (untuk nama file)
2. Klik menu **PRINT TOOLS > Download PDF (Kolom A–M)**
3. Dialog "Download PDF" akan muncul dengan status "Memproses download..."
4. PDF akan otomatis terdownload dengan nama:
   ```
   Laporan_Monev_Akademik_Tahun_[F20].pdf
   ```
5. Dialog akan otomatis tertutup setelah 2 detik

## ⚙️ Konfigurasi

### Mengubah Nama File
Edit baris 8-9 di `Code.gs`:
```javascript
const valueF20 = sheet.getRange('F20').getValue();
const fileName = `Laporan_Monev_Akademik_Tahun_${valueF20}`;
```

### Mengubah Range Kolom
Edit baris 13 untuk mengubah batas kolom (default: kolom M):
```javascript
const url =
  ss.getUrl().replace(/edit$/, '') +
  'export?format=pdf' +
  '&gid=' + sheetId +
  '&range=A:M' +  // ← ubah bagian ini
  '&size=A4' +
  ...
```

### Mengubah Ukuran Kertas
Edit parameter di URL export (baris 16-28):
```javascript
'&size=A4' +          // Ubah ke: LETTER, LEGAL, A3, A4, A5
'&portrait=true' +    // Ubah ke false untuk landscape
```

### Parameter PDF Lainnya
```javascript
'&fitw=true' +           // Fit to width
'&top_margin=0' +        // Margin atas (dalam inci)
'&bottom_margin=0' +     // Margin bawah
'&left_margin=0' +       // Margin kiri
'&right_margin=0' +      // Margin kanan
'&gridlines=false' +     // Tampilkan gridlines
'&printtitle=false' +    // Tampilkan judul sheet
'&sheetnames=false' +    // Tampilkan nama sheet
'&pagenumbers=false' +   // Tampilkan nomor halaman
```

## 📁 Struktur File

```
google-sheets-pdf-exporter/
│
├── README.md                  # File ini
├── installation.md            # Panduan instalasi lengkap
└── Code.gs                    # Script utama
```

## 🔧 Troubleshooting

### Dialog Kosong / Tidak Muncul
- Pastikan pop-up tidak diblokir browser
- Refresh halaman dan coba lagi
- Periksa console error (F12)

### PDF Tidak Terdownload
- Pastikan Anda sudah memberikan izin akses saat pertama kali menjalankan
- Periksa apakah file terlalu besar (>10MB bisa lambat)

### Error "Authorization Required"
- Klik menu PRINT TOOLS lagi
- Pilih "Review Permissions"
- Pilih akun Google Anda
- Klik "Allow"

### Kolom N Tetap Tercetak
- Pastikan kolom N dan seterusnya tidak dalam kondisi "unhide" permanen
- Cek apakah ada protected range yang mencegah hide/show

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Changelog

### v1.0.0 (2025-01-22)
- ✨ Rilis awal
- ✨ Export PDF kolom A-M
- ✨ Penamaan file otomatis dari cell
- ✨ Dialog download dengan feedback

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👤 Author

**Annisa Baizan**

- GitHub: [@annisabaizan](https://github.com/AnnisaBaizan)
- Email: annisabaizan1@gmail.com

## 🙏 Acknowledgments

- Terinspirasi dari kebutuhan export laporan akademik
- Menggunakan Google Apps Script API
- Komunitas Stack Overflow untuk troubleshooting

## 📞 Support

Jika ada pertanyaan atau masalah:
- Buka [GitHub Issues](https://github.com/AnnisaBaizan/HelpfullScript/GoogleSheet/google-sheets-pdf-exporter/issues)
- Email ke: support@example.com

---

⭐ Jika project ini membantu, berikan star di GitHub!
