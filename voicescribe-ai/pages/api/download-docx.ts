/**
 * API Route: /api/download-docx
 * Membuat dan mendownload file .docx dari teks transkripsi & ringkasan
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from 'docx'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transcript, summary, fileName, stats } = req.body

    if (!transcript) {
      return res.status(400).json({ error: 'Tidak ada teks untuk diunduh.' })
    }

    // Format tanggal saat ini
    const now = new Date()
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timeStr = now.toLocaleTimeString('id-ID')

    const sections: Paragraph[] = []

    // ---- Header / Judul ----
    sections.push(
      new Paragraph({
        text: 'VoiceScribe AI',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: 'Hasil Transkripsi & Ringkasan Otomatis',
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: `Dibuat pada: ${dateStr}, ${timeStr}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    )

    // ---- Statistik (jika ada) ----
    if (stats) {
      sections.push(
        new Paragraph({
          text: 'STATISTIK DOKUMEN',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Jumlah Kata: ', bold: true }),
            new TextRun({ text: `${stats.wordCount?.toLocaleString('id-ID') || '-'} kata` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Jumlah Karakter: ', bold: true }),
            new TextRun({ text: `${stats.charCount?.toLocaleString('id-ID') || '-'} karakter` }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: 'Durasi Audio: ', bold: true }),
            new TextRun({ text: formatDuration(stats.duration || 0) }),
          ],
          spacing: { after: 400 },
        })
      )
    }

    // ---- Ringkasan (jika ada) ----
    if (summary) {
      sections.push(
        new Paragraph({
          text: 'RINGKASAN',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      )
      const summaryLines = summary.split('\n')
      for (const line of summaryLines) {
        if (line.trim()) {
          sections.push(new Paragraph({ text: line, spacing: { after: 100 } }))
        } else {
          sections.push(new Paragraph({ text: '' }))
        }
      }
    }

    // ---- Transkripsi Lengkap ----
    sections.push(
      new Paragraph({
        text: 'TRANSKRIPSI LENGKAP',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 600, after: 200 },
      })
    )
    const transcriptParagraphs = transcript.split(/\n+/)
    for (const para of transcriptParagraphs) {
      if (para.trim()) {
        sections.push(
          new Paragraph({
            text: para,
            spacing: { after: 200, line: 360 },
          })
        )
      }
    }

    // ---- Footer ----
    sections.push(
      new Paragraph({
        text: '_______________________________________________',
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 200 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Dokumen ini dibuat otomatis oleh VoiceScribe AI', italics: true })],
        alignment: AlignmentType.CENTER,
      })
    )

    // Buat dokumen Word
    const doc = new Document({
      creator: 'VoiceScribe AI',
      title: `Transkripsi - ${fileName || 'Dokumen'}`,
      description: 'Hasil transkripsi dan ringkasan dari VoiceScribe AI',
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          children: sections,
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const safeFileName = (fileName || 'transkripsi').replace(/[^a-zA-Z0-9\-_]/g, '_')

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="VoiceScribe_${safeFileName}.docx"`)
    res.send(buffer)

  } catch (error: any) {
    console.error('DOCX Generation Error:', error)
    res.status(500).json({ error: `Gagal membuat file DOCX: ${error?.message || 'Error tidak diketahui'}` })
  }
}

function formatDuration(seconds: number): string {
  if (!seconds) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}
