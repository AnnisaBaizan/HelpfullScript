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
"[project]/pages/api/download-docx.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
/**
 * API Route: /api/download-docx
 * Membuat dan mendownload file .docx dari teks transkripsi & ringkasan
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__ = __turbopack_context__.i("[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { transcript, summary, fileName, stats } = body;
        if (!transcript) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Tidak ada teks untuk diunduh.'
            }, {
                status: 400
            });
        }
        // Format tanggal saat ini
        const now = new Date();
        const dateStr = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeStr = now.toLocaleTimeString('id-ID');
        // Bangun konten dokumen Word
        const sections = [];
        // ---- Header / Judul ----
        sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: 'VoiceScribe AI',
            heading: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["HeadingLevel"].TITLE,
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER
        }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: 'Hasil Transkripsi & Ringkasan Otomatis',
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER,
            spacing: {
                after: 400
            }
        }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: `Dibuat pada: ${dateStr}, ${timeStr}`,
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER,
            spacing: {
                after: 600
            }
        }));
        // ---- Statistik (jika ada) ----
        if (stats) {
            sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                text: 'STATISTIK DOKUMEN',
                heading: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["HeadingLevel"].HEADING_1,
                spacing: {
                    before: 400,
                    after: 200
                }
            }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                children: [
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: 'Jumlah Kata: ',
                        bold: true
                    }),
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: `${stats.wordCount?.toLocaleString('id-ID') || '-'} kata`
                    })
                ]
            }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                children: [
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: 'Jumlah Karakter: ',
                        bold: true
                    }),
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: `${stats.charCount?.toLocaleString('id-ID') || '-'} karakter`
                    })
                ]
            }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                children: [
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: 'Durasi Audio: ',
                        bold: true
                    }),
                    new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                        text: formatDuration(stats.duration || 0)
                    })
                ],
                spacing: {
                    after: 400
                }
            }));
        }
        // ---- Ringkasan (jika ada) ----
        if (summary) {
            sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                text: 'RINGKASAN',
                heading: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["HeadingLevel"].HEADING_1,
                spacing: {
                    before: 400,
                    after: 200
                }
            }));
            // Pisahkan ringkasan per baris untuk formatting yang lebih baik
            const summaryLines = summary.split('\n');
            for (const line of summaryLines){
                if (line.trim()) {
                    sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                        text: line,
                        spacing: {
                            after: 100
                        }
                    }));
                } else {
                    sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                        text: ''
                    }));
                }
            }
        }
        // ---- Transkripsi Lengkap ----
        sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: 'TRANSKRIPSI LENGKAP',
            heading: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["HeadingLevel"].HEADING_1,
            spacing: {
                before: 600,
                after: 200
            }
        }));
        // Pisahkan transkripsi per paragraf
        const transcriptParagraphs = transcript.split(/\n+/);
        for (const para of transcriptParagraphs){
            if (para.trim()) {
                sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
                    text: para,
                    spacing: {
                        after: 200,
                        line: 360
                    }
                }));
            }
        }
        // ---- Footer ----
        sections.push(new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: '_______________________________________________',
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER,
            spacing: {
                before: 600,
                after: 200
            }
        }), new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Paragraph"]({
            text: 'Dokumen ini dibuat otomatis oleh VoiceScribe AI',
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER,
            italics: true
        }));
        // Buat dokumen Word
        const doc = new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Document"]({
            creator: 'VoiceScribe AI',
            title: `Transkripsi - ${fileName || 'Dokumen'}`,
            description: 'Hasil transkripsi dan ringkasan dari VoiceScribe AI',
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 1440,
                                right: 1440,
                                bottom: 1440,
                                left: 1440
                            }
                        }
                    },
                    children: sections
                }
            ]
        });
        // Konversi ke buffer
        const buffer = await __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Packer"].toBuffer(doc);
        // Kirim sebagai file download
        const safeFileName = (fileName || 'transkripsi').replace(/[^a-zA-Z0-9\-_]/g, '_');
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"](buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="VoiceScribe_${safeFileName}.docx"`
            }
        });
    } catch (error) {
        console.error('DOCX Generation Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$api$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Gagal membuat file DOCX: ${error?.message || 'Error tidak diketahui'}`
        }, {
            status: 500
        });
    }
}
/**
 * Format detik menjadi string yang mudah dibaca (mm:ss atau hh:mm:ss)
 */ function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f75ff4d9._.js.map