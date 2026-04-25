// ================================================================
// SISTEM MONITORING ED — EMAIL ALERT OTOMATIS
// Lab Kesehatan Gigi · Poltekkes Kemenkes Palembang
// ================================================================
// Versi  : 1.1.0
// Update : April 2026
// Dev    : Annisa Baizan
// ================================================================

// ── KONFIGURASI ──────────────────────────────────────────────────
const CONFIG = {
  EMAIL_PENERIMA:      "labkesgi.poltekkesplg@gmail.com",
  NAMA_LAB:            "Laboratorium Kesehatan Gigi",
  INSTITUSI:           "Poltekkes Kemenkes Palembang",
  ID_SPREADSHEET:      "1l-g93l5iLpI5ZGsiF6ajH41btcl7GQxc3hHDElGMswM",
  NAMA_SHEET:          "BAHAN BHP 2026",
  NAMA_RINGKASAN:      "RINGKASAN",
  BARIS_MULAI:         4,
  SEL_BATAS_PERHATIAN: "D4",   // RINGKASAN!D4 → batas hari PERHATIAN
  SEL_BATAS_KRITIS:    "D6",   // RINGKASAN!D6 → batas hari KRITIS
};

// ── MAPPING KOLOM (A=1, B=2, ... M=13) ───────────────────────────
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
  KODE_BARANG:  10,  // J
  LOKASI:       11,  // K
  MERK:         12,  // L
  KET:          13,  // M
};

// ================================================================
// FUNGSI UTAMA — dipanggil trigger harian jam 07.00
// ================================================================
function kirimEmailAlertED() {
  const ss        = SpreadsheetApp.openById(CONFIG.ID_SPREADSHEET);
  const sheet     = ss.getSheetByName(CONFIG.NAMA_SHEET);
  const ringkasan = ss.getSheetByName(CONFIG.NAMA_RINGKASAN);

  if (!sheet)     { Logger.log("❌ Sheet '" + CONFIG.NAMA_SHEET + "' tidak ditemukan.");  return; }
  if (!ringkasan) { Logger.log("❌ Sheet 'RINGKASAN' tidak ditemukan."); return; }

  // ── Baca threshold dinamis dari RINGKASAN ────────────────────
  const batasPerhatian = ringkasan.getRange(CONFIG.SEL_BATAS_PERHATIAN).getValue();
  const batasKritis    = ringkasan.getRange(CONFIG.SEL_BATAS_KRITIS).getValue();

  if (typeof batasPerhatian !== "number" || typeof batasKritis !== "number") {
    Logger.log("❌ Threshold tidak valid.");
    Logger.log("   PERHATIAN (D4): " + batasPerhatian);
    Logger.log("   KRITIS    (D6): " + batasKritis);
    Logger.log("   Pastikan kedua sel berisi angka murni.");
    return;
  }

  if (batasKritis >= batasPerhatian) {
    Logger.log("❌ Konfigurasi threshold tidak valid: D6 harus lebih kecil dari D4.");
    Logger.log("   D4 (PERHATIAN): " + batasPerhatian + "  |  D6 (KRITIS): " + batasKritis);
    return;
  }

  Logger.log("✅ Threshold — PERHATIAN: ≤" + batasPerhatian + " hari | KRITIS: ≤" + batasKritis + " hari");

  const lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.BARIS_MULAI) {
    Logger.log("ℹ️ Tidak ada data di sheet " + CONFIG.NAMA_SHEET + ".");
    return;
  }

  const data = sheet.getRange(
    CONFIG.BARIS_MULAI, 1,
    lastRow - CONFIG.BARIS_MULAI + 1,
    13   // total kolom A–M
  ).getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const kelompok = { expired: [], kritis: [], perhatian: [] };

  data.forEach(function(row) {
    const namaBahan  = row[COL.NAMA_BAHAN  - 1];
    const tglExpired = row[COL.TGL_EXPIRED - 1];
    const stok       = row[COL.STOK        - 1];
    const kodeBarang = row[COL.KODE_BARANG - 1];
    const lokasi     = row[COL.LOKASI      - 1];
    const merk       = row[COL.MERK        - 1];
    const ket        = row[COL.KET         - 1];

    // Skip baris kosong atau stok habis
    if (!namaBahan || !tglExpired) return;
    if (typeof stok === "number" && stok <= 0) return;

    const exp = new Date(tglExpired);
    exp.setHours(0, 0, 0, 0);
    const sisaHari = Math.round((exp - today) / (1000 * 60 * 60 * 24));

    // ── LOGIKA FILTER ──────────────────────────────────────────
    // Masuk list HANYA jika stok > 0 DAN sisaHari <= batasPerhatian
    // Jika list kosong setelah loop → email TIDAK dikirim
    if (stok > 0 && sisaHari <= batasPerhatian) {
      const item = { namaBahan, tglExpired: exp, sisaHari, stok, kodeBarang, lokasi, merk, ket };
      if (sisaHari < 0) {
        kelompok.expired.push(item);
      } else if (sisaHari <= batasKritis) {
        kelompok.kritis.push(item);
      } else {
        kelompok.perhatian.push(item);
      }
    }
  });

  const totalAlert = kelompok.expired.length + kelompok.kritis.length + kelompok.perhatian.length;

  // Jika tidak ada yang perlu di-alert → tidak kirim email
  if (totalAlert === 0) {
    Logger.log("✅ Semua bahan aman (stok > 0, sisa hari > " + batasPerhatian + "). Email tidak dikirim.");
    return;
  }

  const subjek = "⚠️ [ALERT ED] " + totalAlert + " Bahan Perlu Perhatian — " + CONFIG.NAMA_LAB;
  const body   = buatBodyEmail(kelompok, totalAlert, today, batasKritis, batasPerhatian);

  MailApp.sendEmail({
    to:       CONFIG.EMAIL_PENERIMA,
    subject:  subjek,
    htmlBody: body,
  });

  Logger.log("✅ Email terkirim ke " + CONFIG.EMAIL_PENERIMA);
  Logger.log("   Expired: " + kelompok.expired.length + " | Kritis: " + kelompok.kritis.length + " | Perhatian: " + kelompok.perhatian.length);
}

// ================================================================
// FUNGSI PEMBUAT EMAIL HTML
// ================================================================
function buatBodyEmail(kelompok, totalAlert, today, batasKritis, batasPerhatian) {
  const tglHariIni = Utilities.formatDate(today, "Asia/Jakarta", "dd MMMM yyyy");

  const styleTable = "width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;margin-bottom:16px;";
  const styleTh    = "background:#1a237e;color:#fff;padding:8px 10px;text-align:left;font-size:12px;";
  const styleTd    = "padding:7px 10px;border-bottom:1px solid #e0e0e0;";

  function buatTabel(items, warnaHeader) {
    if (items.length === 0) return "";
    const rows = items.map(function(b) {
      const expStr  = Utilities.formatDate(b.tglExpired, "Asia/Jakarta", "dd/MM/yyyy");
      const sisaStr = b.sisaHari < 0
        ? "<span style='color:#b71c1c;font-weight:bold;'>" + Math.abs(b.sisaHari) + " hari LEWAT</span>"
        : "<span style='font-weight:bold;'>" + b.sisaHari + " hari lagi</span>";
      return [
        "<tr>",
        "  <td style='" + styleTd + "'>" + b.namaBahan + "</td>",
        "  <td style='" + styleTd + "'>" + (b.kodeBarang || "-") + "</td>",
        "  <td style='" + styleTd + ";text-align:center;'>" + expStr + "</td>",
        "  <td style='" + styleTd + ";text-align:center;'>" + sisaStr + "</td>",
        "  <td style='" + styleTd + ";text-align:center;'>" + b.stok + "</td>",
        "  <td style='" + styleTd + "'>" + (b.lokasi || "-") + "</td>",
        "  <td style='" + styleTd + "'>" + (b.merk   || "-") + "</td>",
        "</tr>"
      ].join("\n");
    }).join("\n");

    return [
      "<table style='" + styleTable + "'>",
      "  <thead>",
      "    <tr style='background:" + warnaHeader + ";'>",
      "      <th style='" + styleTh + "'>Nama Bahan</th>",
      "      <th style='" + styleTh + "'>Kode Barang</th>",
      "      <th style='" + styleTh + ";text-align:center;'>Tgl Expired</th>",
      "      <th style='" + styleTh + ";text-align:center;'>Sisa / Status</th>",
      "      <th style='" + styleTh + ";text-align:center;'>Stok</th>",
      "      <th style='" + styleTh + "'>Lokasi</th>",
      "      <th style='" + styleTh + "'>Merk</th>",
      "    </tr>",
      "  </thead>",
      "  <tbody>" + rows + "</tbody>",
      "</table>"
    ].join("\n");
  }

  const sectionExpired = kelompok.expired.length > 0
    ? "<h3 style='color:#b71c1c;margin:20px 0 8px;'>⛔ EXPIRED (" + kelompok.expired.length + " bahan) — Segera Pisahkan & Jangan Digunakan</h3>" + buatTabel(kelompok.expired, "#c62828")
    : "";

  const sectionKritis = kelompok.kritis.length > 0
    ? "<h3 style='color:#e65100;margin:20px 0 8px;'>🔴 KRITIS — ED ≤ " + batasKritis + " Hari (" + kelompok.kritis.length + " bahan) — Prioritaskan Penggunaan</h3>" + buatTabel(kelompok.kritis, "#e64a19")
    : "";

  const sectionPerhatian = kelompok.perhatian.length > 0
    ? "<h3 style='color:#f57f17;margin:20px 0 8px;'>🟡 PERHATIAN — ED " + (batasKritis + 1) + "–" + batasPerhatian + " Hari (" + kelompok.perhatian.length + " bahan) — Pantau Rutin</h3>" + buatTabel(kelompok.perhatian, "#f57c00")
    : "";

  return [
    "<!DOCTYPE html><html>",
    "<body style='font-family:Arial,sans-serif;color:#333;max-width:860px;margin:0 auto;padding:20px;'>",

    "<!-- Header -->",
    "<div style='background:#1a237e;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;'>",
    "  <h2 style='margin:0;font-size:18px;'>📋 LAPORAN MONITORING EXPIRED DATE (ED)</h2>",
    "  <p style='margin:6px 0 0;font-size:13px;opacity:0.85;'>" + CONFIG.NAMA_LAB + " · " + CONFIG.INSTITUSI + "</p>",
    "  <p style='margin:4px 0 0;font-size:12px;opacity:0.7;'>Tanggal Laporan: " + tglHariIni + "</p>",
    "</div>",

    "<!-- Summary -->",
    "<div style='background:#e3f2fd;padding:14px 24px;border:1px solid #90caf9;margin-bottom:20px;'>",
    "  <table style='width:100%;font-size:13px;'><tr>",
    "    <td><b>⛔ Expired:</b> " + kelompok.expired.length + " bahan</td>",
    "    <td><b>🔴 Kritis</b> (≤" + batasKritis + " hr)<b>:</b> " + kelompok.kritis.length + " bahan</td>",
    "    <td><b>🟡 Perhatian</b> (≤" + batasPerhatian + " hr)<b>:</b> " + kelompok.perhatian.length + " bahan</td>",
    "    <td><b>Total Alert:</b> <span style='color:#c62828;font-weight:bold;'>" + totalAlert + " bahan</span></td>",
    "  </tr></table>",
    "</div>",

    sectionExpired,
    sectionKritis,
    sectionPerhatian,

    "<!-- Threshold info -->",
    "<div style='background:#f5f5f5;padding:10px 16px;border-radius:4px;margin-top:16px;font-size:11px;color:#757575;'>",
    "  <b>Konfigurasi threshold aktif:</b>",
    "  KRITIS ≤ " + batasKritis + " hari &nbsp;|&nbsp; PERHATIAN ≤ " + batasPerhatian + " hari",
    "  &nbsp;·&nbsp; Ubah di sheet RINGKASAN sel D6 dan D4",
    "</div>",

    "<!-- Footer -->",
    "<div style='margin-top:20px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:11px;color:#9e9e9e;text-align:center;'>",
    "  <p>Email ini dikirim otomatis oleh Sistem Monitoring ED · " + CONFIG.NAMA_LAB + "</p>",
    "  <p>Jangan balas email ini · Untuk informasi hubungi Pranata Laboratorium Pendidikan</p>",
    "</div>",

    "</body></html>"
  ].join("\n");
}

// ================================================================
// FUNGSI SETUP TRIGGER HARIAN — jalankan SEKALI saja
// ================================================================
function setupTriggerHarian() {
  // Hapus semua trigger lama agar tidak duplikat
  ScriptApp.getProjectTriggers().forEach(function(t) {
    ScriptApp.deleteTrigger(t);
  });

  // Buat trigger baru: setiap hari jam 07.00
  ScriptApp.newTrigger("kirimEmailAlertED")
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log("✅ Trigger harian berhasil dibuat.");
  Logger.log("   Jadwal  : Setiap hari jam 07.00 WIB");
  Logger.log("   Penerima: " + CONFIG.EMAIL_PENERIMA);
  Logger.log("   Sheet   : " + CONFIG.NAMA_SHEET);
}

// ================================================================
// FUNGSI TEST — kirim email langsung tanpa tunggu trigger
// ================================================================
function testKirimEmailSekarang() {
  Logger.log("▶ Menjalankan test...");
  kirimEmailAlertED();
  Logger.log("▶ Test selesai. Cek inbox: " + CONFIG.EMAIL_PENERIMA);
}
