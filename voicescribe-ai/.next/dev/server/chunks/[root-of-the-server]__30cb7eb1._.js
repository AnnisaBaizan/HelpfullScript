module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/pages/api/transcribe.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "config",
    ()=>config
]);
/**
 * API Route: /api/transcribe
 * Menerima file audio/video, mengirim ke Groq Whisper untuk transkripsi
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__ = __turbopack_context__.i("[externals]/groq-sdk [external] (groq-sdk, esm_import, [project]/node_modules/groq-sdk)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// Inisialisasi Groq client — API key diambil dari environment variable
const groq = new __TURBOPACK__imported__module__$5b$externals$5d2f$groq$2d$sdk__$5b$external$5d$__$28$groq$2d$sdk$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$groq$2d$sdk$29$__["default"]({
    apiKey: process.env.GROQ_API_KEY
});
// Batasan ukuran file: 25MB (batas Groq Whisper API)
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '25') * 1024 * 1024;
// Format file yang didukung
const SUPPORTED_FORMATS = [
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/x-m4a',
    'audio/ogg',
    'video/webm',
    'video/mp4',
    'audio/webm'
];
const SUPPORTED_EXTENSIONS = [
    '.mp3',
    '.mp4',
    '.wav',
    '.m4a',
    '.ogg',
    '.webm'
];
async function POST(request) {
    try {
        // Pastikan API key sudah dikonfigurasi
        if (!process.env.GROQ_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'API key Groq belum dikonfigurasi. Hubungi administrator.'
            }, {
                status: 500
            });
        }
        // Parse form data (file upload)
        const formData = await request.formData();
        const file = formData.get('audio');
        const language = formData.get('language');
        // Validasi: file harus ada
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Tidak ada file yang diunggah.'
            }, {
                status: 400
            });
        }
        // Validasi: cek ukuran file
        if (file.size > MAX_FILE_SIZE) {
            const maxMB = Math.round(MAX_FILE_SIZE / 1024 / 1024);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Ukuran file terlalu besar. Maksimum ${maxMB}MB.`
            }, {
                status: 400
            });
        }
        // Validasi: cek ekstensi file
        const fileName = file.name.toLowerCase();
        const hasValidExtension = SUPPORTED_EXTENSIONS.some((ext)=>fileName.endsWith(ext));
        if (!hasValidExtension) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Format file tidak didukung. Gunakan: MP3, MP4, WAV, M4A, OGG, atau WEBM.`
            }, {
                status: 400
            });
        }
        // Konversi File ke format yang bisa dikirim ke Groq API
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // Buat objek File yang kompatibel dengan Groq SDK
        const audioFile = new File([
            buffer
        ], file.name, {
            type: file.type || 'audio/mpeg'
        });
        // Tentukan bahasa untuk Whisper
        // Jika "auto", biarkan Whisper mendeteksi sendiri
        const whisperLanguage = language === 'auto' || !language ? undefined : language;
        // Kirim ke Groq Whisper API untuk transkripsi
        const transcription = await groq.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-large-v3',
            language: whisperLanguage,
            response_format: 'verbose_json',
            timestamp_granularities: [
                'segment'
            ]
        });
        // Hitung statistik teks
        const text = transcription.text || '';
        const wordCount = text.trim().split(/\s+/).filter((w)=>w.length > 0).length;
        const charCount = text.length;
        const duration = transcription.duration || 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            transcript: text,
            stats: {
                wordCount,
                charCount,
                duration: Math.round(duration),
                language: transcription.language || 'tidak diketahui'
            }
        });
    } catch (error) {
        console.error('Groq Transcription Error:', error);
        // Tangani error spesifik dari Groq API
        if (error?.status === 401) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'API key Groq tidak valid. Hubungi administrator.'
            }, {
                status: 401
            });
        }
        if (error?.status === 429) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Batas permintaan API tercapai. Coba lagi dalam beberapa menit.'
            }, {
                status: 429
            });
        }
        if (error?.status === 413) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'File terlalu besar untuk diproses. Maksimum 25MB.'
            }, {
                status: 413
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Terjadi kesalahan saat transkripsi: ${error?.message || 'Error tidak diketahui'}`
        }, {
            status: 500
        });
    }
}
const config = {
    api: {
        bodyParser: false
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__30cb7eb1._.js.map