/**
 * API Route: /api/summarize
 * Fallback chain: Groq LLaMA → OpenRouter → Google Gemini
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import Groq from 'groq-sdk'

const MAX_TEXT_LENGTH = 50000

function buildSystemPrompt(style: string, outputLanguage: string): string {
  const lang = outputLanguage === 'en'
    ? 'Respond in English.'
    : 'Jawab dalam Bahasa Indonesia.'

  const styleInstructions: Record<string, string> = {
    concise: `Buat ringkasan singkat dan padat dari teks berikut. Gunakan 3-5 kalimat yang menangkap esensi utama. ${lang}`,
    bullets: `Buat ringkasan dalam bentuk poin-poin utama (bullet points). Gunakan format:
• Poin 1
• Poin 2
dst.
Maksimal 8-10 poin. Setiap poin harus informatif dan spesifik. ${lang}`,
    formal: `Buat ringkasan dalam format laporan formal dengan struktur:
**RINGKASAN EKSEKUTIF**
[Paragraf ringkasan 2-3 kalimat]

**POIN UTAMA**
[Poin-poin penting]

**KESIMPULAN**
[Penutup singkat]

${lang}`,
    minutes: `Buat notulen rapat dari teks berikut dengan format resmi:
**NOTULEN RAPAT**

**Topik Pembahasan:**
[Topik utama yang dibahas]

**Poin-Poin Diskusi:**
1. [Poin diskusi 1]
2. [Poin diskusi 2]
dst.

**Keputusan/Hasil:**
[Keputusan yang diambil jika ada]

**Tindak Lanjut:**
[Hal yang perlu ditindaklanjuti jika ada]

${lang}`,
    action_items: `Ekstrak semua tindak lanjut, tugas, dan aksi yang disebutkan atau tersirat dalam teks berikut. Format:
**DAFTAR TINDAK LANJUT**

✅ [Tindakan 1] — Penanggung jawab (jika disebutkan)
✅ [Tindakan 2] — Penanggung jawab (jika disebutkan)
dst.

Jika tidak ada tindak lanjut eksplisit, ekstrak hal-hal yang perlu dilakukan berdasarkan konteks. ${lang}`,
    keywords: `Ekstrak kata kunci, topik utama, dan istilah penting dari teks berikut. Format:
**TOPIK UTAMA**
• [Topik 1]
• [Topik 2]

**KATA KUNCI**
[kata1], [kata2], [kata3], dst.

**ENTITAS PENTING** (nama orang, tempat, organisasi jika ada)
• [Entitas 1]
• [Entitas 2]

${lang}`,
  }

  return styleInstructions[style] || styleInstructions.concise
}

// ─── Provider 1: Groq LLaMA ───────────────────────────────────────────────────

async function summarizeGroq(userPrompt: string, systemPrompt: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  })
  const text = completion.choices[0]?.message?.content || ''
  if (!text) throw new Error('Groq mengembalikan teks kosong')
  return text
}

// ─── Provider 2: OpenRouter (model gratis) ───────────────────────────────────
// Gratis selamanya untuk model :free. Daftar di openrouter.ai

async function summarizeOpenRouter(userPrompt: string, systemPrompt: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://voicescribe-ai.vercel.app',
      'X-Title': 'VoiceScribe AI',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  })
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''
  if (!text) throw new Error('OpenRouter mengembalikan teks kosong')
  return text
}

// ─── Provider 3: Google Gemini ────────────────────────────────────────────────
// Free tier: 1500 req/hari untuk gemini-1.5-flash-8b. Daftar di aistudio.google.com

async function summarizeGemini(userPrompt: string, systemPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
    }),
  })
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  if (!text) throw new Error('Gemini mengembalikan teks kosong')
  return text
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { transcript, style = 'concise', outputLanguage = 'id' } = req.body

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: 'Teks transkripsi tidak valid.' })
    }
    if (transcript.trim().length < 10) {
      return res.status(400).json({ error: 'Teks transkripsi terlalu pendek untuk diringkas.' })
    }

    const textToSummarize = transcript.length > MAX_TEXT_LENGTH
      ? transcript.substring(0, MAX_TEXT_LENGTH) + '\n\n[Teks dipotong karena terlalu panjang]'
      : transcript

    const systemPrompt = buildSystemPrompt(style, outputLanguage)
    const userPrompt   = `Berikut adalah teks yang perlu dianalisis:\n\n${textToSummarize}`

    type ProviderFn = () => Promise<string>
    const providers: ProviderFn[] = []

    if (process.env.GROQ_API_KEY)        providers.push(() => summarizeGroq(userPrompt, systemPrompt))
    if (process.env.OPENROUTER_API_KEY)  providers.push(() => summarizeOpenRouter(userPrompt, systemPrompt))
    if (process.env.GOOGLE_AI_API_KEY)   providers.push(() => summarizeGemini(userPrompt, systemPrompt))

    if (providers.length === 0) {
      return res.status(500).json({ error: 'Tidak ada API key AI yang dikonfigurasi untuk ringkasan.' })
    }

    let lastError = ''
    for (const tryProvider of providers) {
      try {
        const summary = await tryProvider()
        return res.status(200).json({ success: true, summary })
      } catch (err: any) {
        console.warn(`[summarize] Provider gagal: ${err?.message}`)
        lastError = err?.message || 'Error tidak diketahui'
      }
    }

    return res.status(500).json({ error: `Semua provider AI gagal. Error terakhir: ${lastError}` })

  } catch (error: any) {
    console.error('Summarize handler error:', error)
    return res.status(500).json({ error: `Terjadi kesalahan: ${error?.message || 'Error tidak diketahui'}` })
  }
}
