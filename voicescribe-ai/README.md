# 🎙️ VoiceScribe AI

**Transkripsi & Analisis Otomatis** — Aplikasi web gratis berbasis Next.js untuk mentranskrip rekaman audio/video dan menganalisisnya menggunakan AI dengan fitur timestamp dan deteksi pembicara.

![VoiceScribe AI](https://img.shields.io/badge/VoiceScribe-AI-38bdf8?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Deploy](https://img.shields.io/badge/Deploy-Render%20Free-46E3B7?style=for-the-badge&logo=render)

---

## ✨ Fitur

- 🎵 **Upload drag & drop** — MP3, MP4, WAV, M4A, OGG, WEBM (hingga 1GB tergantung provider)
- 🎙️ **Transkripsi otomatis** dengan 5 provider AI (fallback otomatis jika satu gagal)
- 🕐 **Timestamp per segmen** — lihat kapan setiap kalimat diucapkan
- 👥 **Deteksi pembicara** — siapa ngomong apa, diberi label & warna berbeda
- 🌐 **Deteksi bahasa otomatis** (Indonesia, Inggris, dan 99+ bahasa lain)
- 🤖 **Analisis AI on-demand** dengan 6 gaya — klik tombol mana saja yang dibutuhkan
- 📊 **Statistik**: jumlah kata, karakter, durasi audio, provider yang digunakan
- 💾 **Download** sebagai `.TXT` dan `.DOCX` (sudah termasuk semua analisis yang dibuat)
- 🌙 **Dark mode** profesional

---

## 🤖 Provider AI

Semua provider dipilih berdasarkan prioritas **kecepatan → kapasitas → gratis selamanya**.
Jika provider pertama gagal atau rate limit, otomatis beralih ke provider berikutnya.

### Transkripsi Audio (Speech-to-Text)

| # | Provider | Gratis | Batas File | Timestamp | Deteksi Pembicara | Kecepatan |
|---|----------|--------|------------|-----------|-------------------|-----------|
| 1 | **Groq Whisper** | ✅ Rate limit harian | 25 MB | ✅ | ❌ | ⚡ Sangat cepat |
| 2 | **AssemblyAI** | ✅ 100 jam gratis | 1 GB | ✅ | ✅ | 🔄 Async |
| 3 | **HuggingFace** | ✅ Selamanya | — | ❌ | ❌ | 🐢 Lambat |
| 4 | **Deepgram Nova-2** | ✅ $200 kredit | — | ✅ | ✅ | ⚡ Sangat cepat |
| 5 | **Gladia** | ✅ 10 jam/bulan | — | ✅ | ✅ | 🔄 Async |

> Tidak perlu mengisi semua API key. **Minimal 1 provider** sudah cukup.

### Analisis & Ringkasan AI (LLM)

| # | Provider | Model | Gratis | Kecepatan |
|---|----------|-------|--------|-----------|
| 1 | **Groq LLaMA** | llama-3.3-70b-versatile | ✅ Rate limit harian | ⚡ Sangat cepat |
| 2 | **OpenRouter** | llama-3.1-8b-instruct:free | ✅ Selamanya | 🚀 Cepat |
| 3 | **Google Gemini** | gemini-1.5-flash-8b | ✅ 1.500 req/hari | 🚀 Cepat |

### Gaya Analisis AI (On-Demand)

Klik tombol mana saja setelah transkripsi selesai. Bisa generate semua sekaligus.

| Tombol | Hasil |
|--------|-------|
| ⚡ Ringkas & Padat | 3–5 kalimat inti |
| 📋 Poin-Poin Utama | Bullet points terstruktur |
| 📄 Laporan Formal | Format laporan eksekutif resmi |
| 📝 Notulen Rapat | Format notulen standar dengan tindak lanjut |
| ✅ Tindak Lanjut | Daftar aksi & tugas yang perlu dikerjakan |
| 🔑 Kata Kunci & Topik | Topik utama, kata kunci, entitas penting |

---

## 🚀 Cara Deploy di Render (GRATIS Selamanya)

> **Kenapa Render, bukan Vercel?**
> Vercel Hobby membatasi upload request maksimal **4.5MB**. Karena VoiceScribe AI mendukung file hingga 1GB (via AssemblyAI), Render adalah pilihan yang tepat — tidak ada batasan ukuran upload, dan gratis selamanya.
>
> ⚠️ Satu-satunya kekurangan Render Free: app **sleep otomatis** setelah 15 menit tidak ada traffic, sehingga request pertama butuh ~30 detik untuk "bangun".

### Langkah 1 — Daftar & Ambil API Key

Minimal isi **satu** dari masing-masing kategori:

**Transkripsi (pilih salah satu):**
- **Groq** — [console.groq.com](https://console.groq.com) → API Keys → Create API Key
- **AssemblyAI** — [assemblyai.com](https://www.assemblyai.com) → Dashboard → API Key
- **HuggingFace** — [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) → New Token
- **Deepgram** — [console.deepgram.com](https://console.deepgram.com) → API Keys → Create Key
- **Gladia** — [app.gladia.io](https://app.gladia.io) → Settings → API Key

**Analisis AI (pilih salah satu, atau pakai Groq yang sama):**
- **Groq** — API key yang sama di atas sudah mencakup LLaMA
- **OpenRouter** — [openrouter.ai](https://openrouter.ai) → Keys → Create Key
- **Google Gemini** — [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Create API Key

---

### Langkah 2 — Upload ke GitHub

1. Buat repository baru di **[github.com](https://github.com)**
2. Upload semua file project ini ke repository tersebut
3. Pastikan file `.env.local` **TIDAK** ikut diupload (sudah ada di `.gitignore`)

---

### Langkah 3 — Deploy ke Render

1. Buka **[render.com](https://render.com)** → Login dengan GitHub
2. Klik **"New +"** → pilih **"Web Service"**
3. Connect repository VoiceScribe AI
4. Isi pengaturan berikut:
   - **Root Directory**: `voicescribe-ai`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Di bagian **"Environment Variables"**, tambahkan API key:

```
GROQ_API_KEY          = gsk_xxxxxxxxxxxx
ASSEMBLYAI_API_KEY    = xxxxxxxxxxxx          (opsional)
HUGGINGFACE_API_KEY   = hf_xxxxxxxxxxxx       (opsional)
DEEPGRAM_API_KEY      = xxxxxxxxxxxx          (opsional)
GLADIA_API_KEY        = xxxx-xxxx-xxxx-xxxx   (opsional)
OPENROUTER_API_KEY    = sk-or-xxxxxxxxxxxx    (opsional)
GOOGLE_AI_API_KEY     = AIzaxxxxxxxxxx        (opsional)
```

6. Klik **"Deploy Web Service"** — tunggu 3–5 menit
7. ✅ Aplikasi live! URL seperti `voicescribe-ai.onrender.com`

> **Tips:** Render juga mendukung deploy otomatis via `render.yaml` — file ini sudah tersedia di root project.

---

## 💻 Cara Jalankan Secara Lokal

### Prasyarat
- Node.js 18 atau lebih baru ([download](https://nodejs.org))

### Instalasi

```bash
# 1. Masuk ke folder project
cd voicescribe-ai

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env.local

# 4. Edit .env.local dan isi minimal satu API key transkripsi
#    dan satu API key AI ringkasan

# 5. Jalankan server development
npm run dev

# Buka http://localhost:3000
```

---

## 🗂️ Struktur Project

```
voicescribe-ai/
├── pages/
│   ├── index.tsx              # Halaman utama (UI lengkap)
│   └── api/
│       ├── transcribe.ts      # Transkripsi: Groq → AssemblyAI → HuggingFace → Deepgram → Gladia
│       ├── summarize.ts       # Analisis AI: Groq LLaMA → OpenRouter → Gemini
│       └── download-docx.ts   # Generate file .docx
├── lib/
│   ├── types.ts               # TypeScript types, konstanta, label UI
│   └── utils.ts               # Utilitas: format waktu, ukuran, validasi, clipboard
├── .env.example               # Template semua environment variables
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── render.yaml
├── vercel.json
└── README.md
```

---

## 🔧 Teknologi

| Komponen | Teknologi | Keterangan |
|----------|-----------|------------|
| Framework | Next.js 14 + React | Frontend & API routes |
| Bahasa | TypeScript 5 | Type safety |
| Transkripsi | Groq / AssemblyAI / HuggingFace / Deepgram / Gladia | 5 provider, fallback otomatis |
| AI Ringkasan | Groq LLaMA / OpenRouter / Google Gemini | 3 provider, fallback otomatis |
| Deteksi Pembicara | AssemblyAI / Deepgram / Gladia | Diarization gratis |
| File DOCX | docx.js | Generate Word document |
| Deploy | Render | Hosting gratis selamanya, tanpa batasan upload |

---

## ❓ FAQ

**Q: Apakah benar-benar gratis?**
A: Ya! Render gratis selamanya untuk project personal (dengan cold start ~30 detik setelah idle). Semua provider AI memiliki tier gratis. Minimal cukup daftar Groq (gratis) untuk bisa langsung pakai.

**Q: Provider mana yang paling direkomendasikan?**
A: Untuk mulai: **Groq** saja sudah cukup (transkripsi + ringkasan dari satu API key). Untuk file besar atau perlu deteksi pembicara, tambahkan **AssemblyAI**.

**Q: Bagaimana cara kerja fallback?**
A: Jika provider pertama gagal (error, rate limit, file terlalu besar), sistem otomatis coba provider berikutnya sampai ada yang berhasil — tanpa perlu user lakukan apapun.

**Q: Apakah data saya aman?**
A: File audio dikirim ke provider API pilihan untuk diproses, lalu langsung dibuang. Tidak ada penyimpanan permanen di server.

**Q: Berapa batas ukuran file?**
A: Tergantung provider yang aktif. Groq: 25MB. AssemblyAI: 1GB. Jika file > 25MB, sistem otomatis melewati Groq dan langsung ke AssemblyAI.

**Q: Bahasa apa saja yang didukung?**
A: Whisper Large v3 mendukung 99+ bahasa termasuk Indonesia, Inggris, Arab, Mandarin, dll.

**Q: Apakah deteksi pembicara akurat?**
A: Cukup akurat untuk rekaman dengan 2–4 pembicara dan audio berkualitas baik. Akurasi menurun jika banyak suara tumpang tindih.

---

*Dibuat untuk sekretaris, profesional, dan siapa saja yang butuh transkripsi cepat & gratis.*
