module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/download-docx.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * API Route: /api/download-docx
 * Membuat dan mendownload file .docx dari teks transkripsi & ringkasan
 */ __turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__ = __turbopack_context__.i("[externals]/docx [external] (docx, esm_import, [project]/node_modules/docx)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        const { transcript, summary, fileName, stats } = req.body;
        if (!transcript) {
            return res.status(400).json({
                error: 'Tidak ada teks untuk diunduh.'
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
            children: [
                new __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["TextRun"]({
                    text: 'Dokumen ini dibuat otomatis oleh VoiceScribe AI',
                    italics: true
                })
            ],
            alignment: __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["AlignmentType"].CENTER
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
        const buffer = await __TURBOPACK__imported__module__$5b$externals$5d2f$docx__$5b$external$5d$__$28$docx$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$docx$29$__["Packer"].toBuffer(doc);
        const safeFileName = (fileName || 'transkripsi').replace(/[^a-zA-Z0-9\-_]/g, '_');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="VoiceScribe_${safeFileName}.docx"`);
        res.send(buffer);
    } catch (error) {
        console.error('DOCX Generation Error:', error);
        res.status(500).json({
            error: `Gagal membuat file DOCX: ${error?.message || 'Error tidak diketahui'}`
        });
    }
}
function formatDuration(seconds) {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__614042d3._.js.map