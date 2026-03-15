/**
 * API Route: /api/transcribe
 * Fallback chain: Groq Whisper → AssemblyAI → HuggingFace
 * Otomatis berganti provider jika gagal atau file terlalu besar
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import Groq from 'groq-sdk'
import formidable, { File as FormidableFile } from 'formidable'
import fs from 'fs'
import type { TranscriptSegment } from '../../lib/types'

// ─── Konfigurasi ─────────────────────────────────────────────────────────────

const GROQ_MAX_SIZE      = 25 * 1024 * 1024   // 25MB — batas Groq Whisper
const ASSEMBLYAI_MAX_SIZE = 1000 * 1024 * 1024 // 1GB  — batas AssemblyAI
const UPLOAD_MAX_SIZE    = ASSEMBLYAI_MAX_SIZE

const SUPPORTED_EXTENSIONS = ['.mp3', '.mp4', '.wav', '.m4a', '.ogg', '.webm']

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false, // AssemblyAI butuh waktu poll lebih lama
  },
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse file upload
    const form = formidable({ maxFileSize: UPLOAD_MAX_SIZE })
    const [fields, files] = await form.parse(req)

    const file = files['audio']?.[0] as FormidableFile | undefined
    const language = (Array.isArray(fields['language']) ? fields['language'][0] : fields['language']) || 'auto'

    if (!file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' })
    }

    // Validasi ekstensi
    const fileName = (file.originalFilename || '').toLowerCase()
    if (!SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
      return res.status(400).json({ error: 'Format file tidak didukung. Gunakan: MP3, MP4, WAV, M4A, OGG, atau WEBM.' })
    }

    // Baca file dari temp disk
    const fileBuffer = fs.readFileSync(file.filepath)
    const mimeType   = file.mimetype || 'audio/mpeg'
    const origName   = file.originalFilename || 'audio'

    // Bersihkan temp file
    fs.unlinkSync(file.filepath)

    // ── Tentukan provider berdasarkan ukuran file ──────────────────────────
    // File > 25MB langsung lewati Groq
    const providers: ProviderFn[] = []

    if (file.size <= GROQ_MAX_SIZE && process.env.GROQ_API_KEY) {
      providers.push(() => transcribeGroq(fileBuffer, origName, mimeType, language))
    }
    if (process.env.ASSEMBLYAI_API_KEY) {
      providers.push(() => transcribeAssemblyAI(fileBuffer, origName, mimeType, language))
    }
    if (process.env.HUGGINGFACE_API_KEY) {
      providers.push(() => transcribeHuggingFace(fileBuffer, mimeType))
    }
    if (process.env.DEEPGRAM_API_KEY) {
      providers.push(() => transcribeDeepgram(fileBuffer, mimeType, language))
    }
    if (process.env.GLADIA_API_KEY) {
      providers.push(() => transcribeGladia(fileBuffer, origName, mimeType, language))
    }

    if (providers.length === 0) {
      return res.status(500).json({ error: 'Tidak ada API key yang dikonfigurasi.' })
    }

    // ── Coba satu per satu sampai berhasil ────────────────────────────────
    let lastError = ''
    for (const tryProvider of providers) {
      try {
        const result = await tryProvider()
        return res.status(200).json(result)
      } catch (err: any) {
        console.warn(`[transcribe] Provider gagal: ${err?.message}`)
        lastError = err?.message || 'Error tidak diketahui'
        // Lanjut ke provider berikutnya
      }
    }

    return res.status(500).json({ error: `Semua provider gagal. Error terakhir: ${lastError}` })

  } catch (error: any) {
    console.error('Transcribe handler error:', error)
    return res.status(500).json({ error: `Terjadi kesalahan: ${error?.message || 'Error tidak diketahui'}` })
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TranscribeResult = {
  success: true
  transcript: string
  provider: string
  stats: {
    wordCount: number
    charCount: number
    duration: number
    language: string
  }
  segments: TranscriptSegment[]
}

type ProviderFn = () => Promise<TranscribeResult>

function buildStats(text: string, duration = 0, lang = 'tidak diketahui') {
  return {
    wordCount: text.trim().split(/\s+/).filter(w => w.length > 0).length,
    charCount: text.length,
    duration: Math.round(duration),
    language: lang,
  }
}

// ─── Provider 1: Groq Whisper ─────────────────────────────────────────────────
// Paling cepat. Limit 25MB. Gratis.

async function transcribeGroq(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  language: string
): Promise<TranscribeResult> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const audioFile = new File([buffer], fileName, { type: mimeType })
  const whisperLang = language === 'auto' ? undefined : language

  const transcription = await groq.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-large-v3',
    language: whisperLang,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  const text = transcription.text || ''
  const segments: TranscriptSegment[] = ((transcription as any).segments || []).map((s: any) => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }))
  return {
    success: true,
    transcript: text,
    provider: 'Groq Whisper',
    stats: buildStats(text, (transcription as any).duration, (transcription as any).language),
    segments,
  }
}

// ─── Provider 2: AssemblyAI ───────────────────────────────────────────────────
// Limit 1GB. 100 jam gratis. Support Bahasa Indonesia.

async function transcribeAssemblyAI(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  language: string
): Promise<TranscribeResult> {
  const API_KEY = process.env.ASSEMBLYAI_API_KEY!
  const headers = { authorization: API_KEY, 'content-type': 'application/octet-stream' }

  // Step 1: Upload file
  const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers,
    body: buffer,
  })
  if (!uploadRes.ok) throw new Error(`AssemblyAI upload gagal: ${uploadRes.status}`)
  const { upload_url } = await uploadRes.json()

  // Step 2: Kirim request transkripsi
  const langCode = language === 'auto' ? undefined : language === 'id' ? 'id' : language === 'en' ? 'en' : undefined
  const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: { authorization: API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ audio_url: upload_url, language_code: langCode, speaker_labels: true }),
  })
  if (!transcriptRes.ok) throw new Error(`AssemblyAI submit gagal: ${transcriptRes.status}`)
  const { id } = await transcriptRes.json()

  // Step 3: Poll sampai selesai (max 10 menit)
  const MAX_WAIT_MS = 10 * 60 * 1000
  const POLL_INTERVAL = 4000
  const startTime = Date.now()

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await sleep(POLL_INTERVAL)

    const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { authorization: API_KEY },
    })
    const data = await pollRes.json()

    if (data.status === 'completed') {
      const text = data.text || ''
      const segments: TranscriptSegment[] = (data.utterances || []).map((u: any) => ({
        start: u.start / 1000,
        end: u.end / 1000,
        text: u.text,
        speaker: `Speaker ${u.speaker}`,
      }))
      return {
        success: true,
        transcript: text,
        provider: 'AssemblyAI',
        stats: buildStats(text, data.audio_duration, data.language_model),
        segments,
      }
    }
    if (data.status === 'error') {
      throw new Error(`AssemblyAI error: ${data.error}`)
    }
    // status: 'queued' | 'processing' → lanjut poll
  }

  throw new Error('AssemblyAI timeout: transkripsi terlalu lama')
}

// ─── Provider 3: HuggingFace Whisper ─────────────────────────────────────────
// Gratis selamanya. Lebih lambat. Kadang model sedang loading.

async function transcribeHuggingFace(
  buffer: Buffer,
  mimeType: string
): Promise<TranscribeResult> {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY!
  const MODEL_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3'

  // HuggingFace butuh retry kalau model masih loading
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${HF_TOKEN}`,
        'content-type': mimeType,
      },
      body: buffer,
    })

    if (res.status === 503) {
      // Model sedang loading, tunggu dan retry
      const data = await res.json()
      const waitSec = data?.estimated_time || 20
      console.log(`[HuggingFace] Model loading, tunggu ${waitSec}s...`)
      await sleep(Math.min(waitSec * 1000, 30000))
      continue
    }

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`HuggingFace error ${res.status}: ${err}`)
    }

    const data = await res.json()
    const text = data?.text || ''
    if (!text) throw new Error('HuggingFace mengembalikan teks kosong')

    return {
      success: true,
      transcript: text,
      provider: 'HuggingFace Whisper',
      stats: buildStats(text),
      segments: [],
    }
  }

  throw new Error('HuggingFace gagal setelah 3 percobaan')
}

// ─── Provider 4: Deepgram Nova-2 ─────────────────────────────────────────────
// Akurasi tinggi. Free tier $200 kredit saat daftar. Sangat cepat.

async function transcribeDeepgram(
  buffer: Buffer,
  mimeType: string,
  language: string
): Promise<TranscribeResult> {
  const API_KEY = process.env.DEEPGRAM_API_KEY!
  const langParam = language === 'auto' ? 'detect_language=true' : `language=${language}`
  const url = `https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&diarize=true&utterances=true&${langParam}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${API_KEY}`,
      'Content-Type': mimeType,
    },
    body: new Uint8Array(buffer),
  })

  if (!res.ok) throw new Error(`Deepgram error: ${res.status}`)

  const data = await res.json()
  const alt  = data?.results?.channels?.[0]?.alternatives?.[0]
  const text = alt?.transcript || ''
  if (!text) throw new Error('Deepgram mengembalikan teks kosong')

  const detectedLang = data?.results?.channels?.[0]?.detected_language || language
  const segments: TranscriptSegment[] = (data?.results?.utterances || []).map((u: any) => ({
    start: u.start,
    end: u.end,
    text: u.transcript,
    speaker: `Speaker ${u.speaker + 1}`,
  }))

  return {
    success: true,
    transcript: text,
    provider: 'Deepgram Nova-2',
    stats: buildStats(text, data?.metadata?.duration ?? 0, detectedLang),
    segments,
  }
}

// ─── Provider 5: Gladia ───────────────────────────────────────────────────────
// 10 jam/bulan gratis. Async dengan polling. Support banyak bahasa.

async function transcribeGladia(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  language: string
): Promise<TranscribeResult> {
  const API_KEY = process.env.GLADIA_API_KEY!
  const authHeaders = { 'x-gladia-key': API_KEY }

  // Step 1: Upload file
  const formData = new FormData()
  formData.append('audio', new Blob([new Uint8Array(buffer)], { type: mimeType }), fileName)

  const uploadRes = await fetch('https://api.gladia.io/v2/upload', {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  })
  if (!uploadRes.ok) throw new Error(`Gladia upload gagal: ${uploadRes.status}`)
  const { audio_url } = await uploadRes.json()

  // Step 2: Request transkripsi
  const body: Record<string, unknown> = { audio_url, diarization: true }
  if (language !== 'auto') body.language = language

  const transcribeRes = await fetch('https://api.gladia.io/v2/pre-recorded', {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!transcribeRes.ok) throw new Error(`Gladia submit gagal: ${transcribeRes.status}`)
  const { id } = await transcribeRes.json()

  // Step 3: Poll sampai selesai (max 10 menit)
  const MAX_WAIT_MS = 10 * 60 * 1000
  const POLL_INTERVAL = 5000
  const startTime = Date.now()

  while (Date.now() - startTime < MAX_WAIT_MS) {
    await sleep(POLL_INTERVAL)

    const pollRes = await fetch(`https://api.gladia.io/v2/pre-recorded/${id}`, {
      headers: authHeaders,
    })
    const data = await pollRes.json()

    if (data.status === 'done') {
      const text     = data.result?.transcription?.full_transcript || ''
      const duration = data.result?.metadata?.audio_duration ?? 0
      const segments: TranscriptSegment[] = (data.result?.transcription?.utterances || []).map((u: any) => ({
        start: u.start,
        end: u.end,
        text: u.text,
        speaker: u.speaker !== undefined ? `Speaker ${u.speaker + 1}` : undefined,
      }))
      return {
        success: true,
        transcript: text,
        provider: 'Gladia',
        stats: buildStats(text, duration, language),
        segments,
      }
    }
    if (data.status === 'error') {
      throw new Error(`Gladia error: ${data.error_code || 'unknown'}`)
    }
  }

  throw new Error('Gladia timeout: transkripsi terlalu lama')
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
