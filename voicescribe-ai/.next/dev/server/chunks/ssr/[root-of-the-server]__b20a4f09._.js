module.exports = [
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[project]/lib/types.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Type definitions untuk VoiceScribe AI
 */ /** Status proses transkripsi & ringkasan */ __turbopack_context__.s([
    "MAX_FILE_SIZE",
    ()=>MAX_FILE_SIZE,
    "OUTPUT_LANGUAGE_LABELS",
    ()=>OUTPUT_LANGUAGE_LABELS,
    "SUMMARY_STYLE_LABELS",
    ()=>SUMMARY_STYLE_LABELS,
    "SUPPORTED_FORMATS",
    ()=>SUPPORTED_FORMATS,
    "SUPPORTED_MIME_TYPES",
    ()=>SUPPORTED_MIME_TYPES
]);
const SUMMARY_STYLE_LABELS = {
    concise: {
        label: 'Ringkas & Padat',
        icon: '⚡',
        desc: '3-5 kalimat inti'
    },
    bullets: {
        label: 'Poin-Poin Utama',
        icon: '📋',
        desc: 'Bullet points terstruktur'
    },
    formal: {
        label: 'Laporan Formal',
        icon: '📄',
        desc: 'Format laporan resmi'
    },
    minutes: {
        label: 'Notulen Rapat',
        icon: '📝',
        desc: 'Format notulen standar'
    },
    action_items: {
        label: 'Tindak Lanjut',
        icon: '✅',
        desc: 'Daftar aksi & tugas'
    },
    keywords: {
        label: 'Kata Kunci & Topik',
        icon: '🔑',
        desc: 'Topik & istilah utama'
    }
};
const OUTPUT_LANGUAGE_LABELS = {
    id: '🇮🇩 Bahasa Indonesia',
    en: '🇬🇧 English',
    auto: '🌐 Otomatis'
};
const SUPPORTED_FORMATS = [
    '.mp3',
    '.mp4',
    '.wav',
    '.m4a',
    '.ogg',
    '.webm'
];
const SUPPORTED_MIME_TYPES = [
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/x-m4a',
    'audio/ogg',
    'video/webm',
    'video/mp4',
    'audio/webm'
];
const MAX_FILE_SIZE = 1000 * 1024 * 1024;
}),
"[project]/lib/utils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "copyToClipboard",
    ()=>copyToClipboard,
    "downloadTextFile",
    ()=>downloadTextFile,
    "formatDuration",
    ()=>formatDuration,
    "formatFileSize",
    ()=>formatFileSize,
    "formatTimestamp",
    ()=>formatTimestamp,
    "truncateText",
    ()=>truncateText,
    "validateFile",
    ()=>validateFile
]);
/**
 * Utility functions untuk VoiceScribe AI
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [ssr] (ecmascript)");
;
function formatTimestamp(seconds) {
    if (!seconds || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const units = [
        'B',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
function validateFile(file) {
    // Cek ukuran
    if (file.size > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"]) {
        return `Ukuran file terlalu besar (${formatFileSize(file.size)}). Maksimum 1GB.`;
    }
    // Cek tipe/ekstensi
    const fileName = file.name.toLowerCase();
    const hasValidExtension = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_FORMATS"].some((ext)=>fileName.endsWith(ext));
    const hasValidMime = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_MIME_TYPES"].includes(file.type);
    if (!hasValidExtension && !hasValidMime) {
        return `Format file tidak didukung. Gunakan: ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUPPORTED_FORMATS"].join(', ')}`;
    }
    return null;
}
function downloadTextFile(content, filename) {
    const blob = new Blob([
        content
    ], {
        type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
function truncateText(text, maxLength = 200) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch  {
        // Fallback untuk browser lama
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch  {
            return false;
        }
    }
}
}),
"[project]/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
/**
 * VoiceScribe AI — Halaman Utama
 * Transkripsi audio/video + analisis AI on-demand
 */ var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/types.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [ssr] (ecmascript)");
;
;
;
;
;
;
function Home() {
    // File state
    const [file, setFile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Process state
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('idle');
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [errorMsg, setErrorMsg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Result state
    const [transcript, setTranscript] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [segments, setSegments] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('text');
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [usedProvider, setUsedProvider] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // On-demand summaries: style → generated text
    const [summaries, setSummaries] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [summarizingStyle, setSummarizingStyle] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [summaryError, setSummaryError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // Options
    const [outputLanguage, setOutputLanguage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('id');
    // Copy feedback
    const [copiedKey, setCopiedKey] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // ── Progress animation ──────────────────────────
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let interval;
        if (status === 'uploading') {
            setProgress(0);
            interval = setInterval(()=>setProgress((p)=>Math.min(p + 5, 30)), 150);
        } else if (status === 'transcribing') {
            interval = setInterval(()=>setProgress((p)=>Math.min(p + 2, 90)), 300);
        } else if (status === 'done') {
            setProgress(100);
        }
        return ()=>clearInterval(interval);
    }, [
        status
    ]);
    // ── Drag & drop ─────────────────────────────────
    const handleDragEnter = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragging(true);
    }, []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragging(false);
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileSelect(f);
    }, []);
    // ── File select ─────────────────────────────────
    const handleFileSelect = (selectedFile)=>{
        const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["validateFile"])(selectedFile);
        if (error) {
            setErrorMsg(error);
            return;
        }
        setFile(selectedFile);
        setErrorMsg('');
        setTranscript('');
        setStats(null);
        setSummaries({});
        setSummaryError('');
        setStatus('idle');
        setProgress(0);
    };
    // ── Transcription only ──────────────────────────
    const handleProcess = async ()=>{
        if (!file) return;
        setErrorMsg('');
        setTranscript('');
        setStats(null);
        setSummaries({});
        setSummaryError('');
        try {
            setStatus('uploading');
            const formData = new FormData();
            formData.append('audio', file);
            formData.append('language', outputLanguage === 'auto' ? 'auto' : outputLanguage);
            setStatus('transcribing');
            const res = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Gagal melakukan transkripsi.');
            setTranscript(data.transcript);
            setSegments(data.segments || []);
            setStats(data.stats);
            setUsedProvider(data.provider || '');
            setViewMode('text');
            setStatus('done');
        } catch (err) {
            setErrorMsg(err.message || 'Terjadi kesalahan yang tidak diketahui.');
            setStatus('error');
        }
    };
    // ── On-demand summary ───────────────────────────
    const handleGenerateSummary = async (style)=>{
        if (!transcript || summarizingStyle) return;
        setSummarizingStyle(style);
        setSummaryError('');
        try {
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transcript,
                    style,
                    outputLanguage
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error || 'Gagal membuat analisis.');
            setSummaries((prev)=>({
                    ...prev,
                    [style]: data.summary
                }));
        } catch (err) {
            setSummaryError(err.message);
        } finally{
            setSummarizingStyle(null);
        }
    };
    // ── Copy ────────────────────────────────────────
    const handleCopy = async (text, key)=>{
        const ok = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["copyToClipboard"])(text);
        if (ok) {
            setCopiedKey(key);
            setTimeout(()=>setCopiedKey(null), 2000);
        }
    };
    // ── Download TXT ────────────────────────────────
    const handleDownloadTxt = ()=>{
        const baseName = file?.name.replace(/\.[^.]+$/, '') || 'transkripsi';
        const now = new Date().toLocaleString('id-ID');
        let content = `VOICESCRIBE AI — HASIL TRANSKRIPSI\n${'='.repeat(50)}\n`;
        content += `Dibuat: ${now}\nFile: ${file?.name || '-'}\n`;
        if (stats) content += `Durasi: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDuration"])(stats.duration)}\nKata: ${stats.wordCount.toLocaleString('id-ID')}\n`;
        content += `\n${'='.repeat(50)}\n`;
        const styleOrder = [
            'concise',
            'bullets',
            'formal',
            'minutes',
            'action_items',
            'keywords'
        ];
        for (const s of styleOrder){
            if (summaries[s]) {
                content += `\n${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][s].icon} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][s].label.toUpperCase()}\n${'-'.repeat(30)}\n${summaries[s]}\n`;
            }
        }
        content += `\nTRANSKRIPSI LENGKAP\n${'-'.repeat(30)}\n${transcript}\n`;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["downloadTextFile"])(content, `VoiceScribe_${baseName}.txt`);
    };
    // ── Download DOCX ───────────────────────────────
    const handleDownloadDocx = async ()=>{
        try {
            const res = await fetch('/api/download-docx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transcript,
                    summary: Object.entries(summaries).map(([s, t])=>`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][s].icon} ${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][s].label}\n\n${t}`).join('\n\n---\n\n'),
                    fileName: file?.name.replace(/\.[^.]+$/, '') || 'transkripsi',
                    stats
                })
            });
            if (!res.ok) throw new Error('Gagal membuat file DOCX.');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `VoiceScribe_${file?.name.replace(/\.[^.]+$/, '') || 'transkripsi'}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            setErrorMsg(err.message);
        }
    };
    // ── Reset ───────────────────────────────────────
    const handleReset = ()=>{
        setFile(null);
        setStatus('idle');
        setProgress(0);
        setTranscript('');
        setSegments([]);
        setViewMode('text');
        setStats(null);
        setSummaries({});
        setSummaryError('');
        setErrorMsg('');
        setUsedProvider('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const isProcessing = status === 'uploading' || status === 'transcribing';
    const hasResult = status === 'done' && !!transcript;
    const hasTimestamps = segments.length > 0;
    const hasSpeakers = segments.some((s)=>s.speaker);
    const SPEAKER_COLORS = {
        'Speaker A': '#38bdf8',
        'Speaker 1': '#38bdf8',
        'Speaker B': '#a78bfa',
        'Speaker 2': '#a78bfa',
        'Speaker C': '#34d399',
        'Speaker 3': '#34d399',
        'Speaker D': '#fb923c',
        'Speaker 4': '#fb923c',
        'Speaker E': '#f472b6',
        'Speaker 5': '#f472b6',
        'Speaker F': '#facc15',
        'Speaker 6': '#facc15'
    };
    const getSpeakerColor = (speaker)=>speaker ? SPEAKER_COLORS[speaker] ?? '#7d93b8' : '#7d93b8';
    const styleOrder = [
        'concise',
        'bullets',
        'formal',
        'minutes',
        'action_items',
        'keywords'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        className: "jsx-7d5b9b37eb776899",
                        children: "VoiceScribe AI — Transkripsi & Ringkasan Otomatis"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Transkripsi audio/video ke teks dengan analisis AI on-demand",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "icon",
                        href: "/favicon.ico",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.googleapis.com",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 242,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "preconnect",
                        href: "https://fonts.gstatic.com",
                        crossOrigin: "anonymous",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap",
                        rel: "stylesheet",
                        className: "jsx-7d5b9b37eb776899"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 237,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-7d5b9b37eb776899" + " " + "app",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "jsx-7d5b9b37eb776899" + " " + "bg-grid"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        className: "jsx-7d5b9b37eb776899" + " " + "header",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-7d5b9b37eb776899" + " " + "header-inner",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-7d5b9b37eb776899" + " " + "logo",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-7d5b9b37eb776899" + " " + "logo-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                width: "28",
                                                height: "28",
                                                viewBox: "0 0 28 28",
                                                fill: "none",
                                                className: "jsx-7d5b9b37eb776899",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                                                        width: "28",
                                                        height: "28",
                                                        rx: "8",
                                                        fill: "url(#logoGrad)",
                                                        className: "jsx-7d5b9b37eb776899"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 256,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                        d: "M14 6C14 6 9 8.5 9 14C9 17 10.5 19.5 14 21C17.5 19.5 19 17 19 14C19 8.5 14 6 14 6Z",
                                                        fill: "white",
                                                        fillOpacity: ".9",
                                                        className: "jsx-7d5b9b37eb776899"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                        cx: "14",
                                                        cy: "14",
                                                        r: "2.5",
                                                        fill: "white",
                                                        className: "jsx-7d5b9b37eb776899"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("defs", {
                                                        className: "jsx-7d5b9b37eb776899",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("linearGradient", {
                                                            id: "logoGrad",
                                                            x1: "0",
                                                            y1: "0",
                                                            x2: "28",
                                                            y2: "28",
                                                            className: "jsx-7d5b9b37eb776899",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "0%",
                                                                    stopColor: "#38bdf8",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "100%",
                                                                    stopColor: "#6366f1",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 262,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 260,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 259,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 255,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/index.tsx",
                                            lineNumber: 254,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-7d5b9b37eb776899",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                    className: "jsx-7d5b9b37eb776899" + " " + "logo-name",
                                                    children: "VoiceScribe AI"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "jsx-7d5b9b37eb776899" + " " + "logo-tagline",
                                                    children: "Transkripsi & Analisis Otomatis"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.tsx",
                                            lineNumber: 267,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-7d5b9b37eb776899" + " " + "header-badge",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "jsx-7d5b9b37eb776899" + " " + "badge-dot"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/index.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this),
                                        "Groq · Deepgram · Gladia · Gemini"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        className: "jsx-7d5b9b37eb776899" + " " + "main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: "jsx-7d5b9b37eb776899" + " " + "card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "section-title",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "section-icon",
                                                children: "📁"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 283,
                                                columnNumber: 43
                                            }, this),
                                            "Unggah File Audio / Video"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        onDragEnter: handleDragEnter,
                                        onDragOver: (e)=>e.preventDefault(),
                                        onDragLeave: handleDragLeave,
                                        onDrop: handleDrop,
                                        onClick: ()=>!file && fileInputRef.current?.click(),
                                        className: "jsx-7d5b9b37eb776899" + " " + `dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                ref: fileInputRef,
                                                type: "file",
                                                accept: ".mp3,.mp4,.wav,.m4a,.ogg,.webm,audio/*,video/mp4,video/webm",
                                                onChange: (e)=>e.target.files?.[0] && handleFileSelect(e.target.files[0]),
                                                style: {
                                                    display: 'none'
                                                },
                                                className: "jsx-7d5b9b37eb776899"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 292,
                                                columnNumber: 15
                                            }, this),
                                            file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "file-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "file-icon",
                                                        children: "🎵"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "file-details",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "file-name",
                                                                children: file.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 303,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "file-meta",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatFileSize"])(file.size)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 304,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            handleReset();
                                                        },
                                                        title: "Hapus file",
                                                        className: "jsx-7d5b9b37eb776899" + " " + "btn-remove",
                                                        children: "✕"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 306,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "dropzone-content",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "dropzone-icon",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                            width: "40",
                                                            height: "40",
                                                            viewBox: "0 0 40 40",
                                                            fill: "none",
                                                            className: "jsx-7d5b9b37eb776899",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    d: "M20 8L20 28M20 8L14 14M20 8L26 14",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2.5",
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 312,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    d: "M8 30H32",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "2.5",
                                                                    strokeLinecap: "round",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 313,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 311,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "dropzone-text",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                className: "jsx-7d5b9b37eb776899",
                                                                children: "Seret & lepas file di sini"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 48
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899",
                                                                children: " atau klik untuk memilih"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 95
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 316,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "dropzone-formats",
                                                        children: "MP3 · MP4 · WAV · M4A · OGG · WEBM · Maks. 1GB"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this),
                                    errorMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "alert alert-error",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-7d5b9b37eb776899",
                                                children: "⚠️"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 322,
                                                columnNumber: 50
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-7d5b9b37eb776899",
                                                children: errorMsg
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 322,
                                                columnNumber: 65
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 322,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                className: "jsx-7d5b9b37eb776899" + " " + "card options-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "option-group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "option-label",
                                                children: "Bahasa Transkripsi"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "lang-group",
                                                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["OUTPUT_LANGUAGE_LABELS"]).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setOutputLanguage(key),
                                                        disabled: isProcessing,
                                                        className: "jsx-7d5b9b37eb776899" + " " + `lang-btn ${outputLanguage === key ? 'active' : ''}`,
                                                        children: label
                                                    }, key, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "action-area",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleProcess,
                                                disabled: !file || isProcessing,
                                                className: "jsx-7d5b9b37eb776899" + " " + "btn-process",
                                                children: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-7d5b9b37eb776899" + " " + "spinner"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 341,
                                                            columnNumber: 21
                                                        }, this),
                                                        status === 'uploading' && 'Mengunggah...',
                                                        status === 'transcribing' && 'Mentranskrip Audio...'
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                            width: "20",
                                                            height: "20",
                                                            viewBox: "0 0 20 20",
                                                            fill: "none",
                                                            className: "jsx-7d5b9b37eb776899",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                                                    cx: "10",
                                                                    cy: "10",
                                                                    r: "8",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "1.5",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    d: "M8 7L14 10L8 13V7Z",
                                                                    fill: "currentColor",
                                                                    className: "jsx-7d5b9b37eb776899"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 348,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 21
                                                        }, this),
                                                        hasResult ? 'Proses Ulang' : 'Mulai Transkripsi'
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 339,
                                                columnNumber: 15
                                            }, this),
                                            hasResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleReset,
                                                className: "jsx-7d5b9b37eb776899" + " " + "btn-reset",
                                                children: "Mulai Baru"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 353,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-7d5b9b37eb776899" + " " + "progress-wrapper",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "progress-bar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: `${progress}%`
                                            },
                                            className: "jsx-7d5b9b37eb776899" + " " + "progress-fill"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/index.tsx",
                                            lineNumber: 360,
                                            columnNumber: 45
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "progress-labels",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-7d5b9b37eb776899" + " " + `progress-step ${status === 'uploading' ? 'active' : progress > 30 ? 'done' : ''}`,
                                                children: "Unggah File"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-7d5b9b37eb776899" + " " + `progress-step ${status === 'transcribing' ? 'active' : status === 'done' ? 'done' : ''}`,
                                                children: "Transkripsi Whisper"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 363,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 361,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this),
                            hasResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    stats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "stats-row",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-value",
                                                        children: stats.wordCount.toLocaleString('id-ID')
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-label",
                                                        children: "Kata"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-divider"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-value",
                                                        children: stats.charCount.toLocaleString('id-ID')
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-label",
                                                        children: "Karakter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-divider"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 383,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-value",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDuration"])(stats.duration)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-label",
                                                        children: "Durasi"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 384,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-divider"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 388,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-value",
                                                        children: stats.language.toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 390,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-label",
                                                        children: "Bahasa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 389,
                                                columnNumber: 19
                                            }, this),
                                            usedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-divider"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "stat-item",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-value provider-badge",
                                                                children: usedProvider
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 397,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "stat-label",
                                                                children: "Provider"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 398,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "card",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "result-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        style: {
                                                            margin: 0
                                                        },
                                                        className: "jsx-7d5b9b37eb776899" + " " + "section-title",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "section-icon",
                                                                children: "📄"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 71
                                                            }, this),
                                                            "Transkripsi Lengkap"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "result-actions",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCopy(transcript, 'transcript'),
                                                                title: "Salin",
                                                                className: "jsx-7d5b9b37eb776899" + " " + "btn-icon",
                                                                children: copiedKey === 'transcript' ? '✅' : '📋'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: handleDownloadTxt,
                                                                className: "jsx-7d5b9b37eb776899" + " " + "btn-download",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                        width: "14",
                                                                        height: "14",
                                                                        viewBox: "0 0 16 16",
                                                                        fill: "none",
                                                                        className: "jsx-7d5b9b37eb776899",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                                d: "M8 2V10M8 10L5 7M8 10L11 7",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "1.5",
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                className: "jsx-7d5b9b37eb776899"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.tsx",
                                                                                lineNumber: 414,
                                                                                columnNumber: 83
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                                d: "M3 13H13",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "1.5",
                                                                                strokeLinecap: "round",
                                                                                className: "jsx-7d5b9b37eb776899"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.tsx",
                                                                                lineNumber: 414,
                                                                                columnNumber: 207
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.tsx",
                                                                        lineNumber: 414,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    ".TXT"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: handleDownloadDocx,
                                                                className: "jsx-7d5b9b37eb776899" + " " + "btn-download btn-download-docx",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                        width: "14",
                                                                        height: "14",
                                                                        viewBox: "0 0 16 16",
                                                                        fill: "none",
                                                                        className: "jsx-7d5b9b37eb776899",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                                d: "M8 2V10M8 10L5 7M8 10L11 7",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "1.5",
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                className: "jsx-7d5b9b37eb776899"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.tsx",
                                                                                lineNumber: 418,
                                                                                columnNumber: 83
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                                d: "M3 13H13",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "1.5",
                                                                                strokeLinecap: "round",
                                                                                className: "jsx-7d5b9b37eb776899"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/index.tsx",
                                                                                lineNumber: 418,
                                                                                columnNumber: 207
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/index.tsx",
                                                                        lineNumber: 418,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    ".DOCX"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 417,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 407,
                                                columnNumber: 17
                                            }, this),
                                            hasTimestamps && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "view-toggle",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewMode('text'),
                                                        className: "jsx-7d5b9b37eb776899" + " " + `view-btn ${viewMode === 'text' ? 'active' : ''}`,
                                                        children: "📄 Teks Biasa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewMode('timestamps'),
                                                        className: "jsx-7d5b9b37eb776899" + " " + `view-btn ${viewMode === 'timestamps' ? 'active' : ''}`,
                                                        children: "🕐 Timestamp"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 21
                                                    }, this),
                                                    hasSpeakers && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewMode('speakers'),
                                                        className: "jsx-7d5b9b37eb776899" + " " + `view-btn ${viewMode === 'speakers' ? 'active' : ''}`,
                                                        children: "👥 Deteksi Pembicara"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 426,
                                                columnNumber: 19
                                            }, this),
                                            viewMode === 'text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("pre", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "result-text",
                                                children: transcript
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 443,
                                                columnNumber: 19
                                            }, this),
                                            viewMode === 'timestamps' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "result-text segments-box",
                                                children: segments.map((seg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "segment-row",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "seg-time",
                                                                children: [
                                                                    "[",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatTimestamp"])(seg.start),
                                                                    "]"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 451,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "seg-text",
                                                                children: seg.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 452,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 448,
                                                columnNumber: 19
                                            }, this),
                                            viewMode === 'speakers' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "result-text segments-box",
                                                children: segments.map((seg, i)=>{
                                                    const color = getSpeakerColor(seg.speaker);
                                                    const prevSpeaker = i > 0 ? segments[i - 1].speaker : null;
                                                    const showLabel = seg.speaker !== prevSpeaker;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-7d5b9b37eb776899" + " " + "segment-row speaker-row",
                                                        children: [
                                                            showLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    color
                                                                },
                                                                className: "jsx-7d5b9b37eb776899" + " " + "speaker-label",
                                                                children: [
                                                                    seg.speaker || 'Pembicara',
                                                                    " · ",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatTimestamp"])(seg.start)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    borderLeftColor: color
                                                                },
                                                                className: "jsx-7d5b9b37eb776899" + " " + "speaker-bubble",
                                                                children: seg.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 472,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 460,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 406,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                                        className: "jsx-7d5b9b37eb776899" + " " + "card ai-section",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "ai-header",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                        style: {
                                                            margin: 0
                                                        },
                                                        className: "jsx-7d5b9b37eb776899" + " " + "section-title",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "section-icon",
                                                                children: "✨"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 485,
                                                                columnNumber: 71
                                                            }, this),
                                                            "Analisis AI"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 485,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            gap: 8
                                                        },
                                                        className: "jsx-7d5b9b37eb776899" + " " + "option-group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    marginBottom: 0,
                                                                    whiteSpace: 'nowrap'
                                                                },
                                                                className: "jsx-7d5b9b37eb776899" + " " + "option-label",
                                                                children: "Bahasa output:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 487,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "lang-group",
                                                                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["OUTPUT_LANGUAGE_LABELS"]).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setOutputLanguage(key),
                                                                        disabled: !!summarizingStyle,
                                                                        className: "jsx-7d5b9b37eb776899" + " " + `lang-btn lang-btn-sm ${outputLanguage === key ? 'active' : ''}`,
                                                                        children: label
                                                                    }, key, false, {
                                                                        fileName: "[project]/pages/index.tsx",
                                                                        lineNumber: 490,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 488,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 486,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 484,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "ai-hint",
                                                children: "Klik tombol di bawah untuk membuat analisis dari transkripsi."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 497,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-7d5b9b37eb776899" + " " + "style-grid",
                                                children: styleOrder.map((style)=>{
                                                    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][style];
                                                    const isLoading = summarizingStyle === style;
                                                    const isDone = !!summaries[style];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>isDone ? undefined : handleGenerateSummary(style),
                                                        disabled: !!summarizingStyle || isDone,
                                                        title: isDone ? 'Sudah dibuat — lihat di bawah' : meta.desc,
                                                        className: "jsx-7d5b9b37eb776899" + " " + `style-btn ${isDone ? 'done' : ''} ${isLoading ? 'loading' : ''}`,
                                                        children: [
                                                            isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "spinner spinner-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 38
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "style-icon",
                                                                children: meta.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 80
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "style-label",
                                                                children: meta.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 514,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "jsx-7d5b9b37eb776899" + " " + "style-desc",
                                                                children: isDone ? '✓ Selesai' : meta.desc
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/index.tsx",
                                                                lineNumber: 515,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, style, true, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 23
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 500,
                                                columnNumber: 17
                                            }, this),
                                            summaryError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: 12
                                                },
                                                className: "jsx-7d5b9b37eb776899" + " " + "alert alert-error",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899",
                                                        children: "⚠️"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 80
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-7d5b9b37eb776899",
                                                        children: summaryError
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/index.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 95
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.tsx",
                                                lineNumber: 522,
                                                columnNumber: 19
                                            }, this),
                                            styleOrder.filter((s)=>summaries[s]).map((style)=>{
                                                const meta = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["SUMMARY_STYLE_LABELS"][style];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-7d5b9b37eb776899" + " " + "summary-result",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-7d5b9b37eb776899" + " " + "summary-result-header",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-7d5b9b37eb776899" + " " + "summary-result-title",
                                                                    children: [
                                                                        meta.icon,
                                                                        " ",
                                                                        meta.label
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 531,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>handleCopy(summaries[style], style),
                                                                    title: "Salin",
                                                                    className: "jsx-7d5b9b37eb776899" + " " + "btn-icon",
                                                                    children: copiedKey === style ? '✅' : '📋'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/index.tsx",
                                                                    lineNumber: 532,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 530,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-7d5b9b37eb776899" + " " + "result-text summary-text",
                                                            children: summaries[style]
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/index.tsx",
                                                            lineNumber: 536,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, style, true, {
                                                    fileName: "[project]/pages/index.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.tsx",
                                        lineNumber: 483,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                        className: "jsx-7d5b9b37eb776899" + " " + "footer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "jsx-7d5b9b37eb776899",
                            children: [
                                "VoiceScribe AI · Transkripsi: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    className: "jsx-7d5b9b37eb776899",
                                    children: "Groq · AssemblyAI · HuggingFace · Deepgram · Gladia"
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 547,
                                    columnNumber: 44
                                }, this),
                                " · AI: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                    className: "jsx-7d5b9b37eb776899",
                                    children: "LLaMA · OpenRouter · Gemini"
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.tsx",
                                    lineNumber: 547,
                                    columnNumber: 119
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.tsx",
                            lineNumber: 547,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.tsx",
                        lineNumber: 546,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "7d5b9b37eb776899",
                children: "*,:before,:after{box-sizing:border-box;margin:0;padding:0}:root{--bg:#0a0f1a;--bg-card:#111827;--bg-card2:#1a2234;--border:#6376a02e;--border-hi:#38bdf859;--text:#e2e8f0;--text-muted:#7d93b8;--text-dim:#4a5c7a;--accent:#38bdf8;--accent2:#6366f1;--success:#34d399;--error:#f87171;--radius:14px;--shadow:0 4px 32px #00000080}html{font-size:16px}body{background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;min-height:100vh;font-family:DM Sans,sans-serif;line-height:1.6}.bg-grid{pointer-events:none;z-index:0;background-image:linear-gradient(#38bdf808 1px,#0000 1px),linear-gradient(90deg,#38bdf808 1px,#0000 1px);background-size:40px 40px;position:fixed;inset:0}.app{z-index:1;flex-direction:column;min-height:100vh;display:flex;position:relative}.main{flex-direction:column;flex:1;gap:20px;width:100%;max-width:860px;margin:0 auto;padding:24px 20px 48px;display:flex}.header{-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);z-index:100;background:#0a0f1ad9;position:sticky;top:0}.header-inner{justify-content:space-between;align-items:center;max-width:860px;margin:0 auto;padding:16px 20px;display:flex}.logo{align-items:center;gap:12px;display:flex}.logo-name{-webkit-text-fill-color:transparent;background:linear-gradient(135deg,#e2e8f0 0%,#38bdf8 100%);-webkit-background-clip:text;font-family:DM Serif Display,serif;font-size:1.35rem;font-weight:400;line-height:1.2}.logo-tagline{color:var(--text-muted);letter-spacing:.04em;font-size:.72rem}.header-badge{color:var(--text-muted);background:#38bdf80f;border:1px solid #38bdf826;border-radius:100px;align-items:center;gap:6px;padding:5px 12px;font-size:.72rem;display:flex}.badge-dot{background:var(--success);width:6px;height:6px;box-shadow:0 0 6px var(--success);border-radius:50%;animation:2s infinite pulse}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px;animation:.4s both fadeUp}@keyframes fadeUp{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.section-title{color:var(--text);align-items:center;gap:8px;margin-bottom:18px;font-family:DM Serif Display,serif;font-size:1rem;font-weight:400;display:flex}.section-icon{font-size:1rem}.options-row{flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:20px;display:flex}.dropzone{border:2px dashed var(--border);text-align:center;cursor:pointer;background:#ffffff03;border-radius:10px;padding:36px 24px;transition:all .2s}.dropzone:hover,.dropzone.dragging{border-color:var(--accent);background:#38bdf80a}.dropzone.has-file{cursor:default;border-style:solid;border-color:var(--border-hi);padding:18px 24px}.dropzone-content{flex-direction:column;align-items:center;gap:10px;display:flex}.dropzone-icon{color:var(--text-dim);margin-bottom:4px}.dropzone-text{color:var(--text-muted);font-size:.95rem}.dropzone-text strong{color:var(--accent)}.dropzone-formats{color:var(--text-dim);letter-spacing:.03em;font-size:.78rem}.file-info{text-align:left;align-items:center;gap:14px;display:flex}.file-icon{flex-shrink:0;font-size:2rem}.file-details{flex:1;min-width:0}.file-name{color:var(--text);white-space:nowrap;text-overflow:ellipsis;font-size:.9rem;font-weight:500;overflow:hidden}.file-meta{color:var(--text-muted);margin-top:2px;font-size:.78rem}.btn-remove{color:var(--text-dim);cursor:pointer;background:0 0;border:none;border-radius:6px;flex-shrink:0;padding:6px;font-size:1rem;transition:color .15s}.btn-remove:hover{color:var(--error)}.alert{border-radius:8px;align-items:flex-start;gap:8px;margin-top:14px;padding:12px 14px;font-size:.875rem;display:flex}.alert-error{color:#fca5a5;background:#f8717114;border:1px solid #f8717140}.option-group{flex-direction:column;gap:10px;display:flex}.option-label{text-transform:uppercase;letter-spacing:.07em;color:var(--text-muted);font-size:.8rem;font-weight:500}.lang-group{flex-wrap:wrap;gap:8px;display:flex}.lang-btn{background:var(--bg-card2);border:1px solid var(--border);cursor:pointer;color:var(--text-muted);border-radius:8px;padding:8px 16px;font-family:DM Sans,sans-serif;font-size:.85rem;transition:all .18s}.lang-btn:hover:not(:disabled){border-color:var(--accent);color:var(--text)}.lang-btn.active{border-color:var(--accent);color:var(--accent);background:#38bdf814}.lang-btn:disabled{opacity:.5;cursor:not-allowed}.lang-btn-sm{padding:5px 10px;font-size:.78rem}.action-area{align-items:center;gap:12px;display:flex}.btn-process{color:#fff;cursor:pointer;white-space:nowrap;background:linear-gradient(135deg,#0ea5e9,#6366f1);border:none;border-radius:12px;justify-content:center;align-items:center;gap:10px;padding:13px 24px;font-family:DM Sans,sans-serif;font-size:.95rem;font-weight:600;transition:all .2s;display:flex;box-shadow:0 4px 20px #38bdf840}.btn-process:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 28px #38bdf859}.btn-process:disabled{opacity:.45;cursor:not-allowed;box-shadow:none;transform:none}.btn-reset{background:var(--bg-card2);border:1px solid var(--border);color:var(--text-muted);cursor:pointer;white-space:nowrap;border-radius:12px;padding:13px 20px;font-family:DM Sans,sans-serif;font-size:.9rem;transition:all .18s}.btn-reset:hover{border-color:var(--border-hi);color:var(--text)}.spinner{border:2px solid #fff3;border-top-color:#fff;border-radius:50%;flex-shrink:0;width:18px;height:18px;animation:.7s linear infinite spin}.spinner-sm{border-color:#38bdf84d;border-top-color:var(--accent);width:14px;height:14px}@keyframes spin{to{transform:rotate(360deg)}}.progress-wrapper{flex-direction:column;gap:10px;animation:.3s both fadeUp;display:flex}.progress-bar{background:var(--bg-card2);border-radius:100px;height:6px;overflow:hidden}.progress-fill{background:linear-gradient(90deg,#38bdf8,#6366f1);border-radius:100px;height:100%;transition:width .4s;box-shadow:0 0 10px #38bdf866}.progress-labels{justify-content:space-between;display:flex}.progress-step{color:var(--text-dim);font-size:.72rem;transition:color .2s}.progress-step.active{color:var(--accent);font-weight:500}.progress-step.done{color:var(--success)}.stats-row{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;justify-content:center;align-items:center;animation:.4s both fadeUp;display:flex;overflow:hidden}.stat-item{flex-direction:column;flex:1;align-items:center;gap:3px;padding:14px 10px;display:flex}.stat-value{font-variant-numeric:tabular-nums;color:var(--accent);font-size:1.1rem;font-weight:600}.stat-label{color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;font-size:.7rem}.provider-badge{color:var(--success)!important;font-size:.68rem!important}.stat-divider{background:var(--border);flex-shrink:0;width:1px;height:40px}.result-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;margin-bottom:16px;display:flex}.result-actions{align-items:center;gap:6px;display:flex}.result-text{color:var(--text);white-space:pre-wrap;word-break:break-word;background:var(--bg-card2);border:1px solid var(--border);border-radius:8px;max-height:400px;padding:16px;font-family:DM Sans,sans-serif;font-size:.88rem;line-height:1.8;overflow-y:auto}.result-text::-webkit-scrollbar{width:6px}.result-text::-webkit-scrollbar-track{background:0 0}.result-text::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}.summary-text{white-space:pre-wrap}.btn-icon{border:1px solid var(--border);cursor:pointer;color:var(--text-muted);background:0 0;border-radius:7px;padding:5px 10px;font-size:.85rem;transition:all .15s}.btn-icon:hover{border-color:var(--accent);color:var(--text)}.btn-download{background:var(--bg-card2);border:1px solid var(--border);color:var(--text-muted);cursor:pointer;border-radius:8px;align-items:center;gap:6px;padding:6px 12px;font-family:DM Sans,sans-serif;font-size:.82rem;transition:all .18s;display:flex}.btn-download:hover{border-color:var(--accent);color:var(--accent)}.btn-download-docx:hover{border-color:var(--accent2);color:var(--accent2)}.ai-section{flex-direction:column;gap:16px;display:flex}.ai-header{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;display:flex}.ai-hint{color:var(--text-dim);margin-top:-4px;font-size:.82rem}.style-grid{grid-template-columns:repeat(2,1fr);gap:10px;display:grid}@media (width>=540px){.style-grid{grid-template-columns:repeat(3,1fr)}}@media (width>=720px){.style-grid{grid-template-columns:repeat(6,1fr)}}.style-btn{background:var(--bg-card2);border:1px solid var(--border);cursor:pointer;color:var(--text-muted);text-align:center;border-radius:10px;flex-direction:column;align-items:center;gap:4px;padding:12px 10px;transition:all .18s;display:flex}.style-btn:hover:not(:disabled){border-color:var(--accent);color:var(--text)}.style-btn.done{border-color:var(--success);color:var(--success);cursor:default;background:#34d39912}.style-btn.loading{border-color:var(--accent);background:#38bdf80f}.style-btn:disabled:not(.done){opacity:.5;cursor:not-allowed}.style-icon{font-size:1.3rem}.style-label{font-size:.78rem;font-weight:500}.style-desc{color:var(--text-dim);font-size:.67rem}.style-btn.done .style-desc{color:var(--success)}.summary-result{background:var(--bg-card2);border:1px solid var(--border);border-radius:10px;animation:.3s both fadeUp;overflow:hidden}.summary-result-header{border-bottom:1px solid var(--border);background:#ffffff05;justify-content:space-between;align-items:center;padding:10px 14px;display:flex}.summary-result-title{color:var(--text);font-size:.88rem;font-weight:500}.summary-result .result-text{background:0 0;border:none;border-radius:0;max-height:350px;margin:0}.view-toggle{flex-wrap:wrap;gap:6px;margin-bottom:12px;display:flex}.view-btn{background:var(--bg-card2);border:1px solid var(--border);cursor:pointer;color:var(--text-muted);border-radius:8px;padding:6px 14px;font-family:DM Sans,sans-serif;font-size:.8rem;transition:all .15s}.view-btn:hover{border-color:var(--accent);color:var(--text)}.view-btn.active{border-color:var(--accent);color:var(--accent);background:#38bdf814}.segments-box{flex-direction:column;gap:6px;padding:14px;display:flex}.segment-row{flex-direction:column;gap:2px;display:flex}.seg-time{color:var(--accent);opacity:.8;flex-shrink:0;font-family:monospace;font-size:.72rem}.seg-text{color:var(--text);font-size:.88rem;line-height:1.7}.speaker-row{margin-bottom:4px}.speaker-label{letter-spacing:.05em;text-transform:uppercase;margin-top:12px;margin-bottom:4px;font-size:.72rem;font-weight:600}.speaker-bubble{color:var(--text);background:#ffffff05;border-left:3px solid;border-radius:0 6px 6px 0;padding:6px 12px;font-size:.88rem;line-height:1.7}.footer{text-align:center;color:var(--text-dim);border-top:1px solid var(--border);padding:20px;font-size:.72rem}.footer strong{color:var(--text-muted)}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b20a4f09._.js.map