/**
 * Type definitions untuk VoiceScribe AI
 */

/** Status proses transkripsi & ringkasan */
export type ProcessStatus = 'idle' | 'uploading' | 'transcribing' | 'done' | 'error'

/** Gaya ringkasan yang tersedia */
export type SummaryStyle = 'concise' | 'bullets' | 'formal' | 'minutes' | 'action_items' | 'keywords'

/** Bahasa output */
export type OutputLanguage = 'id' | 'en' | 'auto'

/** Satu segmen transkripsi dengan waktu & pembicara */
export interface TranscriptSegment {
  start: number     // detik
  end: number       // detik
  text: string
  speaker?: string  // "Speaker A", "Speaker 1", dll — ada jika provider support
}

/** Statistik hasil transkripsi */
export interface TranscriptStats {
  wordCount: number
  charCount: number
  duration: number    // dalam detik
  language: string
}

/** Hasil lengkap transkripsi */
export interface TranscriptResult {
  transcript: string
  stats: TranscriptStats
}

/** Opsi ringkasan */
export interface SummaryOptions {
  style: SummaryStyle
  outputLanguage: OutputLanguage
}

/** Label tampilan untuk gaya ringkasan */
export const SUMMARY_STYLE_LABELS: Record<SummaryStyle, { label: string; icon: string; desc: string }> = {
  concise: {
    label: 'Ringkas & Padat',
    icon: '⚡',
    desc: '3-5 kalimat inti',
  },
  bullets: {
    label: 'Poin-Poin Utama',
    icon: '📋',
    desc: 'Bullet points terstruktur',
  },
  formal: {
    label: 'Laporan Formal',
    icon: '📄',
    desc: 'Format laporan resmi',
  },
  minutes: {
    label: 'Notulen Rapat',
    icon: '📝',
    desc: 'Format notulen standar',
  },
  action_items: {
    label: 'Tindak Lanjut',
    icon: '✅',
    desc: 'Daftar aksi & tugas',
  },
  keywords: {
    label: 'Kata Kunci & Topik',
    icon: '🔑',
    desc: 'Topik & istilah utama',
  },
}

/** Label tampilan untuk bahasa output */
export const OUTPUT_LANGUAGE_LABELS: Record<OutputLanguage, string> = {
  id: '🇮🇩 Bahasa Indonesia',
  en: '🇬🇧 English',
  auto: '🌐 Otomatis',
}

/** Format file yang didukung */
export const SUPPORTED_FORMATS = ['.mp3', '.mp4', '.wav', '.m4a', '.ogg', '.webm']
export const SUPPORTED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/x-m4a',
  'audio/ogg',
  'video/webm',
  'video/mp4',
  'audio/webm',
]

/** Batas ukuran file (1GB — sesuai batas AssemblyAI) */
export const MAX_FILE_SIZE = 1000 * 1024 * 1024
