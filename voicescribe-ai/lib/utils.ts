/**
 * Utility functions untuk VoiceScribe AI
 */

import { SUPPORTED_FORMATS, SUPPORTED_MIME_TYPES, MAX_FILE_SIZE } from './types'

/**
 * Format detik menjadi timestamp [MM:SS]
 * Contoh: 83 -> "01:23"
 */
export function formatTimestamp(seconds: number): string {
  if (!seconds || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * Format detik menjadi string yang mudah dibaca
 * Contoh: 3661 -> "1:01:01" atau 125 -> "2:05"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Format ukuran file bytes menjadi string yang mudah dibaca
 * Contoh: 1048576 -> "1.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

/**
 * Validasi file sebelum upload
 * Mengembalikan pesan error atau null jika valid
 */
export function validateFile(file: File): string | null {
  // Cek ukuran
  if (file.size > MAX_FILE_SIZE) {
    return `Ukuran file terlalu besar (${formatFileSize(file.size)}). Maksimum 1GB.`
  }

  // Cek tipe/ekstensi
  const fileName = file.name.toLowerCase()
  const hasValidExtension = SUPPORTED_FORMATS.some(ext => fileName.endsWith(ext))
  const hasValidMime = SUPPORTED_MIME_TYPES.includes(file.type)

  if (!hasValidExtension && !hasValidMime) {
    return `Format file tidak didukung. Gunakan: ${SUPPORTED_FORMATS.join(', ')}`
  }

  return null
}

/**
 * Download string sebagai file teks
 */
export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Potong teks panjang untuk preview
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Salin teks ke clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback untuk browser lama
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      return false
    }
  }
}
