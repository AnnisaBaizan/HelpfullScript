module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/pages/api/transcribe.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * API Route: /api/transcribe
 * Fallback chain: Groq Whisper → AssemblyAI → HuggingFace
 * Otomatis berganti provider jika gagal atau file terlalu besar
 */ __turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__ = __turbopack_context__.i("[externals]/groq-sdk [external] (groq-sdk, esm_import, [project]/node_modules/groq-sdk)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$formidable__$5b$external$5d$__$28$formidable$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$formidable$29$__ = __turbopack_context__.i("[externals]/formidable [external] (formidable, esm_import, [project]/node_modules/formidable)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$formidable__$5b$external$5d$__$28$formidable$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$formidable$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$formidable__$5b$external$5d$__$28$formidable$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$formidable$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// ─── Konfigurasi ─────────────────────────────────────────────────────────────
const GROQ_MAX_SIZE = 25 * 1024 * 1024 // 25MB — batas Groq Whisper
;
const ASSEMBLYAI_MAX_SIZE = 1000 * 1024 * 1024 // 1GB  — batas AssemblyAI
;
const UPLOAD_MAX_SIZE = ASSEMBLYAI_MAX_SIZE;
const SUPPORTED_EXTENSIONS = [
    '.mp3',
    '.mp4',
    '.wav',
    '.m4a',
    '.ogg',
    '.webm'
];
const config = {
    api: {
        bodyParser: false,
        responseLimit: false
    }
};
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        // Parse file upload
        const form = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$formidable__$5b$external$5d$__$28$formidable$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$formidable$29$__["default"])({
            maxFileSize: UPLOAD_MAX_SIZE
        });
        const [fields, files] = await form.parse(req);
        const file = files['audio']?.[0];
        const language = (Array.isArray(fields['language']) ? fields['language'][0] : fields['language']) || 'auto';
        if (!file) {
            return res.status(400).json({
                error: 'Tidak ada file yang diunggah.'
            });
        }
        // Validasi ekstensi
        const fileName = (file.originalFilename || '').toLowerCase();
        if (!SUPPORTED_EXTENSIONS.some((ext)=>fileName.endsWith(ext))) {
            return res.status(400).json({
                error: 'Format file tidak didukung. Gunakan: MP3, MP4, WAV, M4A, OGG, atau WEBM.'
            });
        }
        // Baca file dari temp disk
        const fileBuffer = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(file.filepath);
        const mimeType = file.mimetype || 'audio/mpeg';
        const origName = file.originalFilename || 'audio';
        // Bersihkan temp file
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].unlinkSync(file.filepath);
        // ── Tentukan provider berdasarkan ukuran file ──────────────────────────
        // File > 25MB langsung lewati Groq
        const providers = [];
        if (file.size <= GROQ_MAX_SIZE && process.env.GROQ_API_KEY) {
            providers.push(()=>transcribeGroq(fileBuffer, origName, mimeType, language));
        }
        if (process.env.ASSEMBLYAI_API_KEY) {
            providers.push(()=>transcribeAssemblyAI(fileBuffer, origName, mimeType, language));
        }
        if (process.env.HUGGINGFACE_API_KEY) {
            providers.push(()=>transcribeHuggingFace(fileBuffer, mimeType));
        }
        if (process.env.DEEPGRAM_API_KEY) {
            providers.push(()=>transcribeDeepgram(fileBuffer, mimeType, language));
        }
        if (process.env.GLADIA_API_KEY) {
            providers.push(()=>transcribeGladia(fileBuffer, origName, mimeType, language));
        }
        if (providers.length === 0) {
            return res.status(500).json({
                error: 'Tidak ada API key yang dikonfigurasi.'
            });
        }
        // ── Coba satu per satu sampai berhasil ────────────────────────────────
        let lastError = '';
        for (const tryProvider of providers){
            try {
                const result = await tryProvider();
                return res.status(200).json(result);
            } catch (err) {
                console.warn(`[transcribe] Provider gagal: ${err?.message}`);
                lastError = err?.message || 'Error tidak diketahui';
            // Lanjut ke provider berikutnya
            }
        }
        return res.status(500).json({
            error: `Semua provider gagal. Error terakhir: ${lastError}`
        });
    } catch (error) {
        console.error('Transcribe handler error:', error);
        return res.status(500).json({
            error: `Terjadi kesalahan: ${error?.message || 'Error tidak diketahui'}`
        });
    }
}
function buildStats(text, duration = 0, lang = 'tidak diketahui') {
    return {
        wordCount: text.trim().split(/\s+/).filter((w)=>w.length > 0).length,
        charCount: text.length,
        duration: Math.round(duration),
        language: lang
    };
}
// ─── Provider 1: Groq Whisper ─────────────────────────────────────────────────
// Paling cepat. Limit 25MB. Gratis.
async function transcribeGroq(buffer, fileName, mimeType, language) {
    const groq = new __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__["default"]({
        apiKey: process.env.GROQ_API_KEY
    });
    const audioFile = new File([
        buffer
    ], fileName, {
        type: mimeType
    });
    const whisperLang = language === 'auto' ? undefined : language;
    const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-large-v3',
        language: whisperLang,
        response_format: 'verbose_json',
        timestamp_granularities: [
            'segment'
        ]
    });
    const text = transcription.text || '';
    const segments = (transcription.segments || []).map((s)=>({
            start: s.start,
            end: s.end,
            text: s.text.trim()
        }));
    return {
        success: true,
        transcript: text,
        provider: 'Groq Whisper',
        stats: buildStats(text, transcription.duration, transcription.language),
        segments
    };
}
// ─── Provider 2: AssemblyAI ───────────────────────────────────────────────────
// Limit 1GB. 100 jam gratis. Support Bahasa Indonesia.
async function transcribeAssemblyAI(buffer, fileName, mimeType, language) {
    const API_KEY = process.env.ASSEMBLYAI_API_KEY;
    const headers = {
        authorization: API_KEY,
        'content-type': 'application/octet-stream'
    };
    // Step 1: Upload file
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers,
        body: buffer
    });
    if (!uploadRes.ok) throw new Error(`AssemblyAI upload gagal: ${uploadRes.status}`);
    const { upload_url } = await uploadRes.json();
    // Step 2: Kirim request transkripsi
    const langCode = language === 'auto' ? undefined : language === 'id' ? 'id' : language === 'en' ? 'en' : undefined;
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
            authorization: API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            audio_url: upload_url,
            language_code: langCode,
            speaker_labels: true
        })
    });
    if (!transcriptRes.ok) throw new Error(`AssemblyAI submit gagal: ${transcriptRes.status}`);
    const { id } = await transcriptRes.json();
    // Step 3: Poll sampai selesai (max 10 menit)
    const MAX_WAIT_MS = 10 * 60 * 1000;
    const POLL_INTERVAL = 4000;
    const startTime = Date.now();
    while(Date.now() - startTime < MAX_WAIT_MS){
        await sleep(POLL_INTERVAL);
        const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
            headers: {
                authorization: API_KEY
            }
        });
        const data = await pollRes.json();
        if (data.status === 'completed') {
            const text = data.text || '';
            const segments = (data.utterances || []).map((u)=>({
                    start: u.start / 1000,
                    end: u.end / 1000,
                    text: u.text,
                    speaker: `Speaker ${u.speaker}`
                }));
            return {
                success: true,
                transcript: text,
                provider: 'AssemblyAI',
                stats: buildStats(text, data.audio_duration, data.language_model),
                segments
            };
        }
        if (data.status === 'error') {
            throw new Error(`AssemblyAI error: ${data.error}`);
        }
    // status: 'queued' | 'processing' → lanjut poll
    }
    throw new Error('AssemblyAI timeout: transkripsi terlalu lama');
}
// ─── Provider 3: HuggingFace Whisper ─────────────────────────────────────────
// Gratis selamanya. Lebih lambat. Kadang model sedang loading.
async function transcribeHuggingFace(buffer, mimeType) {
    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    const MODEL_URL = 'https://api-inference.huggingface.co/models/openai/whisper-large-v3';
    // HuggingFace butuh retry kalau model masih loading
    for(let attempt = 0; attempt < 3; attempt++){
        const res = await fetch(MODEL_URL, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${HF_TOKEN}`,
                'content-type': mimeType
            },
            body: buffer
        });
        if (res.status === 503) {
            // Model sedang loading, tunggu dan retry
            const data = await res.json();
            const waitSec = data?.estimated_time || 20;
            console.log(`[HuggingFace] Model loading, tunggu ${waitSec}s...`);
            await sleep(Math.min(waitSec * 1000, 30000));
            continue;
        }
        if (!res.ok) {
            const err = await res.text();
            throw new Error(`HuggingFace error ${res.status}: ${err}`);
        }
        const data = await res.json();
        const text = data?.text || '';
        if (!text) throw new Error('HuggingFace mengembalikan teks kosong');
        return {
            success: true,
            transcript: text,
            provider: 'HuggingFace Whisper',
            stats: buildStats(text),
            segments: []
        };
    }
    throw new Error('HuggingFace gagal setelah 3 percobaan');
}
// ─── Provider 4: Deepgram Nova-2 ─────────────────────────────────────────────
// Akurasi tinggi. Free tier $200 kredit saat daftar. Sangat cepat.
async function transcribeDeepgram(buffer, mimeType, language) {
    const API_KEY = process.env.DEEPGRAM_API_KEY;
    const langParam = language === 'auto' ? 'detect_language=true' : `language=${language}`;
    const url = `https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&diarize=true&utterances=true&${langParam}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Token ${API_KEY}`,
            'Content-Type': mimeType
        },
        body: new Uint8Array(buffer)
    });
    if (!res.ok) throw new Error(`Deepgram error: ${res.status}`);
    const data = await res.json();
    const alt = data?.results?.channels?.[0]?.alternatives?.[0];
    const text = alt?.transcript || '';
    if (!text) throw new Error('Deepgram mengembalikan teks kosong');
    const detectedLang = data?.results?.channels?.[0]?.detected_language || language;
    const segments = (data?.results?.utterances || []).map((u)=>({
            start: u.start,
            end: u.end,
            text: u.transcript,
            speaker: `Speaker ${u.speaker + 1}`
        }));
    return {
        success: true,
        transcript: text,
        provider: 'Deepgram Nova-2',
        stats: buildStats(text, data?.metadata?.duration ?? 0, detectedLang),
        segments
    };
}
// ─── Provider 5: Gladia ───────────────────────────────────────────────────────
// 10 jam/bulan gratis. Async dengan polling. Support banyak bahasa.
async function transcribeGladia(buffer, fileName, mimeType, language) {
    const API_KEY = process.env.GLADIA_API_KEY;
    const authHeaders = {
        'x-gladia-key': API_KEY
    };
    // Step 1: Upload file
    const formData = new FormData();
    formData.append('audio', new Blob([
        new Uint8Array(buffer)
    ], {
        type: mimeType
    }), fileName);
    const uploadRes = await fetch('https://api.gladia.io/v2/upload', {
        method: 'POST',
        headers: authHeaders,
        body: formData
    });
    if (!uploadRes.ok) throw new Error(`Gladia upload gagal: ${uploadRes.status}`);
    const { audio_url } = await uploadRes.json();
    // Step 2: Request transkripsi
    const body = {
        audio_url,
        diarization: true
    };
    if (language !== 'auto') body.language = language;
    const transcribeRes = await fetch('https://api.gladia.io/v2/pre-recorded', {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!transcribeRes.ok) throw new Error(`Gladia submit gagal: ${transcribeRes.status}`);
    const { id } = await transcribeRes.json();
    // Step 3: Poll sampai selesai (max 10 menit)
    const MAX_WAIT_MS = 10 * 60 * 1000;
    const POLL_INTERVAL = 5000;
    const startTime = Date.now();
    while(Date.now() - startTime < MAX_WAIT_MS){
        await sleep(POLL_INTERVAL);
        const pollRes = await fetch(`https://api.gladia.io/v2/pre-recorded/${id}`, {
            headers: authHeaders
        });
        const data = await pollRes.json();
        if (data.status === 'done') {
            const text = data.result?.transcription?.full_transcript || '';
            const duration = data.result?.metadata?.audio_duration ?? 0;
            const segments = (data.result?.transcription?.utterances || []).map((u)=>({
                    start: u.start,
                    end: u.end,
                    text: u.text,
                    speaker: u.speaker !== undefined ? `Speaker ${u.speaker + 1}` : undefined
                }));
            return {
                success: true,
                transcript: text,
                provider: 'Gladia',
                stats: buildStats(text, duration, language),
                segments
            };
        }
        if (data.status === 'error') {
            throw new Error(`Gladia error: ${data.error_code || 'unknown'}`);
        }
    }
    throw new Error('Gladia timeout: transkripsi terlalu lama');
}
// ─── Helper ───────────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fb0bc1d2._.js.map