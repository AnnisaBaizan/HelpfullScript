/**
 * VoiceScribe AI — Halaman Utama
 * Transkripsi audio/video + analisis AI on-demand
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import Head from 'next/head'
import {
  ProcessStatus,
  SummaryStyle,
  OutputLanguage,
  TranscriptStats,
  TranscriptSegment,
  SUMMARY_STYLE_LABELS,
  OUTPUT_LANGUAGE_LABELS,
} from '../lib/types'
import { formatDuration, formatFileSize, formatTimestamp, validateFile, downloadTextFile, copyToClipboard } from '../lib/utils'

export default function Home() {
  // File state
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Process state
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Result state
  const [transcript, setTranscript] = useState<string>('')
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [viewMode, setViewMode] = useState<'text' | 'timestamps' | 'speakers'>('text')
  const [stats, setStats] = useState<TranscriptStats | null>(null)
  const [usedProvider, setUsedProvider] = useState<string>('')

  // On-demand summaries: style → generated text
  const [summaries, setSummaries] = useState<Partial<Record<SummaryStyle, string>>>({})
  const [summarizingStyle, setSummarizingStyle] = useState<SummaryStyle | null>(null)
  const [summaryError, setSummaryError] = useState<string>('')

  // Options
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('id')

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Progress animation ──────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'uploading') {
      setProgress(0)
      interval = setInterval(() => setProgress(p => Math.min(p + 5, 30)), 150)
    } else if (status === 'transcribing') {
      interval = setInterval(() => setProgress(p => Math.min(p + 2, 90)), 300)
    } else if (status === 'done') {
      setProgress(100)
    }
    return () => clearInterval(interval)
  }, [status])

  // ── Drag & drop ─────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
  }, [])
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }, [])

  // ── File select ─────────────────────────────────
  const handleFileSelect = (selectedFile: File) => {
    const error = validateFile(selectedFile)
    if (error) { setErrorMsg(error); return }
    setFile(selectedFile)
    setErrorMsg('')
    setTranscript('')
    setStats(null)
    setSummaries({})
    setSummaryError('')
    setStatus('idle')
    setProgress(0)
  }

  // ── Transcription only ──────────────────────────
  const handleProcess = async () => {
    if (!file) return
    setErrorMsg('')
    setTranscript('')
    setStats(null)
    setSummaries({})
    setSummaryError('')

    try {
      if (file.size > 4.5 * 1024 * 1024) {
        throw new Error('Ukuran file terlalu besar (maks 4.5MB). Kompres file audio terlebih dahulu atau gunakan format MP3.')
      }

      setStatus('uploading')
      const formData = new FormData()
      formData.append('audio', file)
      formData.append('language', outputLanguage === 'auto' ? 'auto' : outputLanguage)

      setStatus('transcribing')
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
      const text = await res.text()
      let data: any
      try { data = JSON.parse(text) } catch { throw new Error(`Server error ${res.status} — coba lagi atau gunakan file lebih kecil.`) }
      if (!res.ok || !data.success) throw new Error(data.error || 'Gagal melakukan transkripsi.')

      setTranscript(data.transcript)
      setSegments(data.segments || [])
      setStats(data.stats)
      setUsedProvider(data.provider || '')
      setViewMode('text')
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan yang tidak diketahui.')
      setStatus('error')
    }
  }

  // ── On-demand summary ───────────────────────────
  const handleGenerateSummary = async (style: SummaryStyle) => {
    if (!transcript || summarizingStyle) return
    setSummarizingStyle(style)
    setSummaryError('')
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, style, outputLanguage }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Gagal membuat analisis.')
      setSummaries(prev => ({ ...prev, [style]: data.summary }))
    } catch (err: any) {
      setSummaryError(err.message)
    } finally {
      setSummarizingStyle(null)
    }
  }

  // ── Copy ────────────────────────────────────────
  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  // ── Download TXT ────────────────────────────────
  const handleDownloadTxt = () => {
    const baseName = file?.name.replace(/\.[^.]+$/, '') || 'transkripsi'
    const now = new Date().toLocaleString('id-ID')
    let content = `VOICESCRIBE AI — HASIL TRANSKRIPSI\n${'='.repeat(50)}\n`
    content += `Dibuat: ${now}\nFile: ${file?.name || '-'}\n`
    if (stats) content += `Durasi: ${formatDuration(stats.duration)}\nKata: ${stats.wordCount.toLocaleString('id-ID')}\n`
    content += `\n${'='.repeat(50)}\n`

    const styleOrder: SummaryStyle[] = ['concise', 'bullets', 'formal', 'minutes', 'action_items', 'keywords']
    for (const s of styleOrder) {
      if (summaries[s]) {
        content += `\n${SUMMARY_STYLE_LABELS[s].icon} ${SUMMARY_STYLE_LABELS[s].label.toUpperCase()}\n${'-'.repeat(30)}\n${summaries[s]}\n`
      }
    }
    content += `\nTRANSKRIPSI LENGKAP\n${'-'.repeat(30)}\n${transcript}\n`
    downloadTextFile(content, `VoiceScribe_${baseName}.txt`)
  }

  // ── Download DOCX ───────────────────────────────
  const handleDownloadDocx = async () => {
    try {
      const res = await fetch('/api/download-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          summary: Object.entries(summaries)
            .map(([s, t]) => `${SUMMARY_STYLE_LABELS[s as SummaryStyle].icon} ${SUMMARY_STYLE_LABELS[s as SummaryStyle].label}\n\n${t}`)
            .join('\n\n---\n\n'),
          fileName: file?.name.replace(/\.[^.]+$/, '') || 'transkripsi',
          stats,
        }),
      })
      if (!res.ok) throw new Error('Gagal membuat file DOCX.')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `VoiceScribe_${file?.name.replace(/\.[^.]+$/, '') || 'transkripsi'}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setErrorMsg(err.message)
    }
  }

  // ── Reset ───────────────────────────────────────
  const handleReset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setTranscript('')
    setSegments([])
    setViewMode('text')
    setStats(null)
    setSummaries({})
    setSummaryError('')
    setErrorMsg('')
    setUsedProvider('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isProcessing  = status === 'uploading' || status === 'transcribing'
  const hasResult     = status === 'done' && !!transcript
  const hasTimestamps = segments.length > 0
  const hasSpeakers   = segments.some(s => s.speaker)

  const SPEAKER_COLORS: Record<string, string> = {
    'Speaker A': '#38bdf8', 'Speaker 1': '#38bdf8',
    'Speaker B': '#a78bfa', 'Speaker 2': '#a78bfa',
    'Speaker C': '#34d399', 'Speaker 3': '#34d399',
    'Speaker D': '#fb923c', 'Speaker 4': '#fb923c',
    'Speaker E': '#f472b6', 'Speaker 5': '#f472b6',
    'Speaker F': '#facc15', 'Speaker 6': '#facc15',
  }
  const getSpeakerColor = (speaker?: string) =>
    speaker ? (SPEAKER_COLORS[speaker] ?? '#7d93b8') : '#7d93b8'

  const styleOrder: SummaryStyle[] = ['concise', 'bullets', 'formal', 'minutes', 'action_items', 'keywords']

  return (
    <>
      <Head>
        <title>VoiceScribe AI — Transkripsi & Ringkasan Otomatis</title>
        <meta name="description" content="Transkripsi audio/video ke teks dengan analisis AI on-demand" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        <div className="bg-grid" aria-hidden />

        {/* ── Header ── */}
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
                  <path d="M14 6C14 6 9 8.5 9 14C9 17 10.5 19.5 14 21C17.5 19.5 19 17 19 14C19 8.5 14 6 14 6Z" fill="white" fillOpacity=".9" />
                  <circle cx="14" cy="14" r="2.5" fill="white" />
                  <defs>
                    <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1 className="logo-name">VoiceScribe AI</h1>
                <p className="logo-tagline">Transkripsi &amp; Analisis Otomatis</p>
              </div>
            </div>
            <div className="header-badge">
              <span className="badge-dot" />
              Groq · Deepgram · Gladia · Gemini
            </div>
          </div>
        </header>

        <main className="main">

          {/* ── Upload ── */}
          <section className="card">
            <h2 className="section-title"><span className="section-icon">📁</span>Unggah File Audio / Video</h2>
            <div
              className={`dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={e => e.preventDefault()}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp3,.mp4,.wav,.m4a,.ogg,.webm,audio/*,video/mp4,video/webm"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              {file ? (
                <div className="file-info">
                  <div className="file-icon">🎵</div>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-meta">{formatFileSize(file.size)}</p>
                  </div>
                  <button className="btn-remove" onClick={e => { e.stopPropagation(); handleReset() }} title="Hapus file">✕</button>
                </div>
              ) : (
                <div className="dropzone-content">
                  <div className="dropzone-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path d="M20 8L20 28M20 8L14 14M20 8L26 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 30H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="dropzone-text"><strong>Seret &amp; lepas file di sini</strong><span> atau klik untuk memilih</span></p>
                  <p className="dropzone-formats">MP3 · MP4 · WAV · M4A · OGG · WEBM · Maks. 1GB</p>
                </div>
              )}
            </div>
            {errorMsg && (
              <div className="alert alert-error"><span>⚠️</span><span>{errorMsg}</span></div>
            )}
          </section>

          {/* ── Language & Process ── */}
          <section className="card options-row">
            <div className="option-group">
              <label className="option-label">Bahasa Transkripsi</label>
              <div className="lang-group">
                {(Object.entries(OUTPUT_LANGUAGE_LABELS) as [OutputLanguage, string][]).map(([key, label]) => (
                  <button key={key} className={`lang-btn ${outputLanguage === key ? 'active' : ''}`} onClick={() => setOutputLanguage(key)} disabled={isProcessing}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="action-area">
              <button className="btn-process" onClick={handleProcess} disabled={!file || isProcessing}>
                {isProcessing ? (
                  <><span className="spinner" />
                    {status === 'uploading' && 'Mengunggah...'}
                    {status === 'transcribing' && 'Mentranskrip Audio...'}
                  </>
                ) : (
                  <><svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 7L14 10L8 13V7Z" fill="currentColor" />
                  </svg>
                    {hasResult ? 'Proses Ulang' : 'Mulai Transkripsi'}</>
                )}
              </button>
              {hasResult && <button className="btn-reset" onClick={handleReset}>Mulai Baru</button>}
            </div>
          </section>

          {/* ── Progress ── */}
          {isProcessing && (
            <div className="progress-wrapper">
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
              <div className="progress-labels">
                <span className={`progress-step ${status === 'uploading' ? 'active' : progress > 30 ? 'done' : ''}`}>Unggah File</span>
                <span className={`progress-step ${status === 'transcribing' ? 'active' : ''}`}>Transkripsi Whisper</span>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {hasResult && (
            <>
              {/* Stats */}
              {stats && (
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-value">{stats.wordCount.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Kata</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-value">{stats.charCount.toLocaleString('id-ID')}</span>
                    <span className="stat-label">Karakter</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-value">{formatDuration(stats.duration)}</span>
                    <span className="stat-label">Durasi</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-item">
                    <span className="stat-value">{stats.language.toUpperCase()}</span>
                    <span className="stat-label">Bahasa</span>
                  </div>
                  {usedProvider && (
                    <>
                      <div className="stat-divider" />
                      <div className="stat-item">
                        <span className="stat-value provider-badge">{usedProvider}</span>
                        <span className="stat-label">Provider</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Transcript */}
              <section className="card">
                <div className="result-header">
                  <h2 className="section-title" style={{ margin: 0 }}><span className="section-icon">📄</span>Transkripsi Lengkap</h2>
                  <div className="result-actions">
                    <button className="btn-icon" onClick={() => handleCopy(transcript, 'transcript')} title="Salin">
                      {copiedKey === 'transcript' ? '✅' : '📋'}
                    </button>
                    <button className="btn-download" onClick={handleDownloadTxt}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      .TXT
                    </button>
                    <button className="btn-download btn-download-docx" onClick={handleDownloadDocx}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                      .DOCX
                    </button>
                  </div>
                </div>

                {/* View mode toggle */}
                {hasTimestamps && (
                  <div className="view-toggle">
                    <button className={`view-btn ${viewMode === 'text' ? 'active' : ''}`} onClick={() => setViewMode('text')}>
                      📄 Teks Biasa
                    </button>
                    <button className={`view-btn ${viewMode === 'timestamps' ? 'active' : ''}`} onClick={() => setViewMode('timestamps')}>
                      🕐 Timestamp
                    </button>
                    {hasSpeakers && (
                      <button className={`view-btn ${viewMode === 'speakers' ? 'active' : ''}`} onClick={() => setViewMode('speakers')}>
                        👥 Deteksi Pembicara
                      </button>
                    )}
                  </div>
                )}

                {/* Text view */}
                {viewMode === 'text' && (
                  <pre className="result-text">{transcript}</pre>
                )}

                {/* Timestamp view */}
                {viewMode === 'timestamps' && (
                  <div className="result-text segments-box">
                    {segments.map((seg, i) => (
                      <div key={i} className="segment-row">
                        <span className="seg-time">[{formatTimestamp(seg.start)}]</span>
                        <span className="seg-text">{seg.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Speaker view */}
                {viewMode === 'speakers' && (
                  <div className="result-text segments-box">
                    {segments.map((seg, i) => {
                      const color = getSpeakerColor(seg.speaker)
                      const prevSpeaker = i > 0 ? segments[i - 1].speaker : null
                      const showLabel = seg.speaker !== prevSpeaker
                      return (
                        <div key={i} className="segment-row speaker-row">
                          {showLabel && (
                            <div className="speaker-label" style={{ color }}>
                              {seg.speaker || 'Pembicara'} · {formatTimestamp(seg.start)}
                            </div>
                          )}
                          <div className="speaker-bubble" style={{ borderLeftColor: color }}>
                            {seg.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* AI Analysis */}
              <section className="card ai-section">
                <div className="ai-header">
                  <h2 className="section-title" style={{ margin: 0 }}><span className="section-icon">✨</span>Analisis AI</h2>
                  <div className="option-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <label className="option-label" style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>Bahasa output:</label>
                    <div className="lang-group">
                      {(Object.entries(OUTPUT_LANGUAGE_LABELS) as [OutputLanguage, string][]).map(([key, label]) => (
                        <button key={key} className={`lang-btn lang-btn-sm ${outputLanguage === key ? 'active' : ''}`} onClick={() => setOutputLanguage(key)} disabled={!!summarizingStyle}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="ai-hint">Klik tombol di bawah untuk membuat analisis dari transkripsi.</p>

                {/* Style buttons */}
                <div className="style-grid">
                  {styleOrder.map(style => {
                    const meta = SUMMARY_STYLE_LABELS[style]
                    const isLoading = summarizingStyle === style
                    const isDone    = !!summaries[style]
                    return (
                      <button
                        key={style}
                        className={`style-btn ${isDone ? 'done' : ''} ${isLoading ? 'loading' : ''}`}
                        onClick={() => isDone ? undefined : handleGenerateSummary(style)}
                        disabled={!!summarizingStyle || isDone}
                        title={isDone ? 'Sudah dibuat — lihat di bawah' : meta.desc}
                      >
                        {isLoading ? <span className="spinner spinner-sm" /> : <span className="style-icon">{meta.icon}</span>}
                        <span className="style-label">{meta.label}</span>
                        <span className="style-desc">{isDone ? '✓ Selesai' : meta.desc}</span>
                      </button>
                    )
                  })}
                </div>

                {summaryError && (
                  <div className="alert alert-error" style={{ marginTop: 12 }}><span>⚠️</span><span>{summaryError}</span></div>
                )}

                {/* Generated summaries */}
                {styleOrder.filter(s => summaries[s]).map(style => {
                  const meta = SUMMARY_STYLE_LABELS[style]
                  return (
                    <div key={style} className="summary-result">
                      <div className="summary-result-header">
                        <span className="summary-result-title">{meta.icon} {meta.label}</span>
                        <button className="btn-icon" onClick={() => handleCopy(summaries[style]!, style)} title="Salin">
                          {copiedKey === style ? '✅' : '📋'}
                        </button>
                      </div>
                      <div className="result-text summary-text">{summaries[style]}</div>
                    </div>
                  )
                })}
              </section>
            </>
          )}

        </main>

        <footer className="footer">
          <p>VoiceScribe AI · Transkripsi: <strong>Groq · AssemblyAI · HuggingFace · Deepgram · Gladia</strong> · AI: <strong>LLaMA · OpenRouter · Gemini</strong></p>
        </footer>
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #0a0f1a;
          --bg-card:   #111827;
          --bg-card2:  #1a2234;
          --border:    rgba(99,118,160,0.18);
          --border-hi: rgba(56,189,248,0.35);
          --text:      #e2e8f0;
          --text-muted:#7d93b8;
          --text-dim:  #4a5c7a;
          --accent:    #38bdf8;
          --accent2:   #6366f1;
          --success:   #34d399;
          --error:     #f87171;
          --radius:    14px;
          --shadow:    0 4px 32px rgba(0,0,0,.5);
        }

        html { font-size: 16px; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg); color: var(--text);
          min-height: 100vh; line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(56,189,248,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .app { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }
        .main {
          flex: 1; max-width: 860px; width: 100%;
          margin: 0 auto; padding: 24px 20px 48px;
          display: flex; flex-direction: column; gap: 20px;
        }

        /* Header */
        .header {
          background: rgba(10,15,26,.85); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
        }
        .header-inner {
          max-width: 860px; margin: 0 auto; padding: 16px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo-name {
          font-family: 'DM Serif Display', serif; font-size: 1.35rem; font-weight: 400;
          background: linear-gradient(135deg, #e2e8f0 0%, #38bdf8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; line-height: 1.2;
        }
        .logo-tagline { font-size: .72rem; color: var(--text-muted); letter-spacing: .04em; }
        .header-badge {
          display: flex; align-items: center; gap: 6px; font-size: .72rem; color: var(--text-muted);
          background: rgba(56,189,248,.06); border: 1px solid rgba(56,189,248,.15);
          padding: 5px 12px; border-radius: 100px;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--success); box-shadow: 0 0 6px var(--success);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

        /* Cards */
        .card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px;
          box-shadow: var(--shadow); animation: fadeUp .4s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

        .section-title {
          font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400;
          color: var(--text); margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
        }
        .section-icon { font-size: 1rem; }

        /* Options row */
        .options-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
        }

        /* Dropzone */
        .dropzone {
          border: 2px dashed var(--border); border-radius: 10px;
          padding: 36px 24px; text-align: center; cursor: pointer;
          transition: all .2s; background: rgba(255,255,255,.01);
        }
        .dropzone:hover, .dropzone.dragging { border-color: var(--accent); background: rgba(56,189,248,.04); }
        .dropzone.has-file { cursor: default; border-style: solid; border-color: var(--border-hi); padding: 18px 24px; }
        .dropzone-content { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .dropzone-icon { color: var(--text-dim); margin-bottom: 4px; }
        .dropzone-text { font-size: .95rem; color: var(--text-muted); }
        .dropzone-text strong { color: var(--accent); }
        .dropzone-formats { font-size: .78rem; color: var(--text-dim); letter-spacing: .03em; }
        .file-info { display: flex; align-items: center; gap: 14px; text-align: left; }
        .file-icon { font-size: 2rem; flex-shrink: 0; }
        .file-details { flex: 1; min-width: 0; }
        .file-name { font-size: .9rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-meta { font-size: .78rem; color: var(--text-muted); margin-top: 2px; }
        .btn-remove { background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 1rem; padding: 6px; border-radius: 6px; transition: color .15s; flex-shrink: 0; }
        .btn-remove:hover { color: var(--error); }

        /* Alerts */
        .alert { display: flex; align-items: flex-start; gap: 8px; padding: 12px 14px; border-radius: 8px; font-size: .875rem; margin-top: 14px; }
        .alert-error { background: rgba(248,113,113,.08); border: 1px solid rgba(248,113,113,.25); color: #fca5a5; }

        /* Options */
        .option-group { display: flex; flex-direction: column; gap: 10px; }
        .option-label { font-size: .8rem; font-weight: 500; text-transform: uppercase; letter-spacing: .07em; color: var(--text-muted); }
        .lang-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .lang-btn {
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 8px; padding: 8px 16px; cursor: pointer;
          color: var(--text-muted); font-size: .85rem; font-family: 'DM Sans', sans-serif; transition: all .18s;
        }
        .lang-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--text); }
        .lang-btn.active { border-color: var(--accent); background: rgba(56,189,248,.08); color: var(--accent); }
        .lang-btn:disabled { opacity: .5; cursor: not-allowed; }
        .lang-btn-sm { padding: 5px 10px; font-size: .78rem; }

        /* Action */
        .action-area { display: flex; gap: 12px; align-items: center; }
        .btn-process {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          border: none; border-radius: 12px; padding: 13px 24px;
          color: white; font-size: .95rem; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all .2s; box-shadow: 0 4px 20px rgba(56,189,248,.25);
          white-space: nowrap;
        }
        .btn-process:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(56,189,248,.35); }
        .btn-process:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-reset {
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 12px; padding: 13px 20px;
          color: var(--text-muted); font-size: .9rem; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all .18s; white-space: nowrap;
        }
        .btn-reset:hover { border-color: var(--border-hi); color: var(--text); }
        .spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.2); border-top-color: white;
          animation: spin .7s linear infinite; flex-shrink: 0;
        }
        .spinner-sm { width: 14px; height: 14px; border-color: rgba(56,189,248,.3); border-top-color: var(--accent); }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Progress */
        .progress-wrapper { display: flex; flex-direction: column; gap: 10px; animation: fadeUp .3s ease both; }
        .progress-bar { height: 6px; background: var(--bg-card2); border-radius: 100px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #6366f1); border-radius: 100px; transition: width .4s ease; box-shadow: 0 0 10px rgba(56,189,248,.4); }
        .progress-labels { display: flex; justify-content: space-between; }
        .progress-step { font-size: .72rem; color: var(--text-dim); transition: color .2s; }
        .progress-step.active { color: var(--accent); font-weight: 500; }
        .progress-step.done { color: var(--success); }

        /* Stats */
        .stats-row {
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden; animation: fadeUp .4s ease both;
        }
        .stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 14px 10px; gap: 3px; }
        .stat-value { font-size: 1.1rem; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--accent); }
        .stat-label { font-size: .7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: .06em; }
        .provider-badge { font-size: .68rem !important; color: var(--success) !important; }
        .stat-divider { width: 1px; height: 40px; background: var(--border); flex-shrink: 0; }

        /* Result header */
        .result-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px; flex-wrap: wrap; gap: 10px;
        }
        .result-actions { display: flex; align-items: center; gap: 6px; }

        /* Result text */
        .result-text {
          font-size: .88rem; line-height: 1.8; color: var(--text);
          white-space: pre-wrap; word-break: break-word;
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 8px; padding: 16px;
          max-height: 400px; overflow-y: auto;
          font-family: 'DM Sans', sans-serif;
        }
        .result-text::-webkit-scrollbar { width: 6px; }
        .result-text::-webkit-scrollbar-track { background: transparent; }
        .result-text::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .summary-text { white-space: pre-wrap; }

        /* Buttons */
        .btn-icon {
          background: none; border: 1px solid var(--border); border-radius: 7px; padding: 5px 10px;
          cursor: pointer; font-size: .85rem; transition: all .15s; color: var(--text-muted);
        }
        .btn-icon:hover { border-color: var(--accent); color: var(--text); }
        .btn-download {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 12px;
          color: var(--text-muted); font-size: .82rem; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all .18s;
        }
        .btn-download:hover { border-color: var(--accent); color: var(--accent); }
        .btn-download-docx:hover { border-color: var(--accent2); color: var(--accent2); }

        /* AI Section */
        .ai-section { display: flex; flex-direction: column; gap: 16px; }
        .ai-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .ai-hint { font-size: .82rem; color: var(--text-dim); margin-top: -4px; }

        /* Style buttons grid */
        .style-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
        }
        @media (min-width: 540px) { .style-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 720px) { .style-grid { grid-template-columns: repeat(6, 1fr); } }

        .style-btn {
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 10px; padding: 12px 10px; cursor: pointer;
          color: var(--text-muted); display: flex; flex-direction: column;
          align-items: center; gap: 4px; transition: all .18s; text-align: center;
        }
        .style-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--text); }
        .style-btn.done {
          border-color: var(--success); background: rgba(52,211,153,.07);
          color: var(--success); cursor: default;
        }
        .style-btn.loading { border-color: var(--accent); background: rgba(56,189,248,.06); }
        .style-btn:disabled:not(.done) { opacity: .5; cursor: not-allowed; }
        .style-icon { font-size: 1.3rem; }
        .style-label { font-size: .78rem; font-weight: 500; }
        .style-desc { font-size: .67rem; color: var(--text-dim); }
        .style-btn.done .style-desc { color: var(--success); }

        /* Summary result card */
        .summary-result {
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 10px; overflow: hidden; animation: fadeUp .3s ease both;
        }
        .summary-result-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 14px; border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,.02);
        }
        .summary-result-title { font-size: .88rem; font-weight: 500; color: var(--text); }
        .summary-result .result-text {
          border: none; border-radius: 0; background: transparent;
          margin: 0; max-height: 350px;
        }

        /* View mode toggle */
        .view-toggle {
          display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .view-btn {
          background: var(--bg-card2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 14px; cursor: pointer;
          color: var(--text-muted); font-size: .8rem; font-family: 'DM Sans', sans-serif;
          transition: all .15s;
        }
        .view-btn:hover { border-color: var(--accent); color: var(--text); }
        .view-btn.active { border-color: var(--accent); background: rgba(56,189,248,.08); color: var(--accent); }

        /* Segments */
        .segments-box { display: flex; flex-direction: column; gap: 6px; padding: 14px; }
        .segment-row { display: flex; flex-direction: column; gap: 2px; }
        .seg-time {
          font-size: .72rem; font-family: monospace;
          color: var(--accent); flex-shrink: 0; opacity: .8;
        }
        .seg-text { font-size: .88rem; line-height: 1.7; color: var(--text); }

        /* Speaker mode */
        .speaker-row { margin-bottom: 4px; }
        .speaker-label {
          font-size: .72rem; font-weight: 600; letter-spacing: .05em;
          text-transform: uppercase; margin-top: 12px; margin-bottom: 4px;
        }
        .speaker-bubble {
          border-left: 3px solid;
          padding: 6px 12px;
          background: rgba(255,255,255,.02);
          border-radius: 0 6px 6px 0;
          font-size: .88rem; line-height: 1.7; color: var(--text);
        }

        /* Footer */
        .footer {
          text-align: center; padding: 20px; font-size: .72rem;
          color: var(--text-dim); border-top: 1px solid var(--border);
        }
        .footer strong { color: var(--text-muted); }
      `}</style>
    </>
  )
}
