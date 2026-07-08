// ==UserScript==
// @name         LMS Kemkes - Enrich Peserta (Tipe + HP + Biodata)
// @namespace    lms-kemkes-enrich
// @version      2.0
// @description  Kumpulkan NIK peserta (scrape tabel / paste manual) lalu tarik data lengkap via API, export CSV. NIK fleksibel, bisa dipakai lintas pelatihan.
// @match        https://admin-lms.kemkes.go.id/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // ================== KONFIG ==================
    const API = "https://be-lms.kemkes.go.id/v1/user";
    let DELAY = 180;   // jeda antar request (ms)
    const RETRY = 2;

    // NIK yang siap diproses (gabungan hasil scrape + paste manual)
    const LS_KEY = "lms_enrich_niks";
    let nikSet = new Set();
    let running = false;

    // ---- persistence (localStorage: tahan reload / tab ketutup) ----
    function saveNiks() {
        try { localStorage.setItem(LS_KEY, JSON.stringify([...nikSet])); } catch (e) { }
    }
    function loadNiks() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) JSON.parse(raw).forEach(n => nikSet.add(n));
        } catch (e) { }
    }
    loadNiks();

    // ================== TOKEN ==================
    function findToken() {
        const keys = ["token", "accessToken", "access_token", "authToken", "jwt", "Authorization"];
        for (const store of [localStorage, sessionStorage]) {
            for (let i = 0; i < store.length; i++) {
                const k = store.key(i);
                const v = store.getItem(k);
                if (!v) continue;
                if (keys.some(x => k.toLowerCase().includes(x.toLowerCase())) || /ey[A-Za-z0-9_-]+\.ey/.test(v)) {
                    const m = v.match(/ey[A-Za-z0-9_-]+\.ey[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
                    if (m) return m[0];
                }
            }
        }
        return null;
    }

    // ================== UTIL ==================
    const cleanPhone = (p) => {
        if (!p) return "";
        let s = String(p).replace(/^\+62:/, "0").replace(/^\+62/, "0").replace(/[^0-9]/g, "");
        if (s && !s.startsWith("0")) s = "0" + s;
        return s;
    };

    // ambil semua NIK 16 digit dari teks apa pun (paste CSV / list / kolom)
    const extractNiks = (text) => (String(text).match(/\d{16}/g) || []);

    function setStatus(msg) {
        const el = document.getElementById("lmsStatus");
        if (el) el.innerHTML = msg;
    }
    function refreshCount() {
        const el = document.getElementById("lmsCount");
        if (el) el.textContent = nikSet.size;
    }

    // ================== SCRAPE TABEL (paginasi) ==================
    function getRows() {
        return document.querySelectorAll(".ant-table-tbody > tr[data-row-key]");
    }
    function getSignature() {
        const rows = getRows();
        let sig = rows.length.toString();
        if (rows.length) sig += rows[0].textContent;
        return sig;
    }
    function getNextButton() {
        return document.querySelector(".ant-pagination-next:not(.ant-pagination-disabled)");
    }
    function waitTableChanged(oldSig, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (getSignature() !== oldSig) { clearInterval(timer); setTimeout(resolve, 300); return; }
                if (Date.now() - start > timeout) { clearInterval(timer); reject("Timeout"); }
            }, 200);
        });
    }
    function collectCurrentPage() {
        // ambil NIK dari kolom ke-3 (index 2) tiap baris — sama pola export lama
        getRows().forEach(row => {
            const cells = row.querySelectorAll("td");
            const nik = cells[2]?.textContent.trim() || "";
            if (/^\d{16}$/.test(nik)) nikSet.add(nik);
        });
        saveNiks();
    }
    async function scrapeTable() {
        if (running) { setStatus("Masih ada proses berjalan. Tunggu selesai, atau klik 'reset proses'."); return; }
        if (!getRows().length) {
            setStatus("Tidak ada tabel peserta di halaman ini. Buka halaman daftar peserta pelatihan dulu.");
            return;
        }
        running = true;
        let page = 1, safety = 1000;
        try {
            while (safety--) {
                setStatus(`Scan tabel halaman ${page}...`);
                collectCurrentPage();
                refreshCount();
                const next = getNextButton();
                if (!next) break;
                const sig = getSignature();
                next.click();
                await waitTableChanged(sig);
                page++;
            }
            setStatus(`Selesai scan. NIK terkumpul: <b>${nikSet.size}</b>`);
        } catch (e) {
            setStatus(`Scan berhenti (${e}). NIK sejauh ini: <b>${nikSet.size}</b>`);
        }
        running = false;
    }

    // ================== ENRICH VIA API ==================
    async function fetchNik(nik, headers) {
        const filtered = encodeURIComponent(JSON.stringify([{ id: "startsWith$nik", value: nik }]));
        const url = `${API}?filtered=${filtered}&page=1&pageSize=5`;
        for (let a = 0; a <= RETRY; a++) {
            try {
                const r = await fetch(url, { headers, credentials: "include" });
                if (r.status === 401 || r.status === 403) throw new Error("AUTH " + r.status);
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                const list = (j && j.data) || [];
                return list.find(x => x.nik === nik) || list[0] || null;
            } catch (e) {
                if (String(e.message).startsWith("AUTH")) throw e;
                if (a === RETRY) return { __error: e.message };
                await new Promise(z => setTimeout(z, 400));
            }
        }
    }

    function downloadCSV(out, fails) {
        const cols = ["No", "NIK", "Nama", "Tipe Peserta", "Nomor HP", "Email", "Jabatan", "Gender", "Instansi", "ProvinsiId", "Status", "Catatan"];
        const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
        const lines = [cols.join(",")];
        out.forEach((d, i) => lines.push([
            i + 1, esc(d.nik), esc(d.fullName), esc(d.tipePeserta), esc(d.phone), esc(d.email),
            esc(d.jabatan), esc(d.gender), esc(d.instansi), esc(d.provinsiId), esc(d.status), esc(d.note)
        ].join(",")));
        const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `peserta_lengkap_${Date.now()}.csv`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }

    async function startEnrich() {
        if (running) { setStatus("Masih ada proses berjalan (scrape/tarik data). Tunggu selesai, atau klik 'reset proses' bila nyangkut."); return; }
        if (!nikSet.size) { setStatus("Belum ada NIK. Scan tabel atau paste NIK dulu."); return; }

        const manual = (document.getElementById("lmsTokenManual").value || "").trim();
        const TOKEN = manual || findToken();
        if (!TOKEN) {
            setStatus("Token tidak ketemu. Ketik <code>localStorage</code> di Console, cari nilai diawali 'ey...', tempel ke kotak token.");
            return;
        }
        const headers = { "Accept": "application/json, text/plain, */*", "Authorization": "Bearer " + TOKEN };

        running = true;
        const dEl = document.getElementById("lmsDelay");
        if (dEl) DELAY = Math.max(0, parseInt(dEl.value) || 0);
        const niks = [...nikSet];
        const out = [], fails = [];
        let done = 0;

        for (const nik of niks) {
            let u;
            try { u = await fetchNik(nik, headers); }
            catch (e) {
                setStatus(`BERHENTI: gagal auth (${e.message}). Cek token / login ulang.`);
                running = false; return;
            }
            if (!u || u.__error) {
                fails.push(nik);
                out.push({ nik, fullName: "", tipePeserta: "", phone: "", email: "", jabatan: "", gender: "", instansi: "", provinsiId: "", status: "", note: (u && u.__error) ? "ERROR:" + u.__error : "NOT_FOUND" });
            } else {
                out.push({
                    nik,
                    fullName: u.fullName || "",
                    tipePeserta: (u.UserType && u.UserType.name) || "",
                    phone: cleanPhone(u.phone),
                    email: u.email || "",
                    jabatan: u.jabatan || "",
                    gender: u.gender || "",
                    instansi: u.otherInstitutionName || "",
                    provinsiId: u.OtherInstitutionProvinsiId || "",
                    status: u.status || "",
                    note: ""
                });
            }
            done++;
            if (done % 5 === 0 || done === niks.length) setStatus(`Tarik data: ${done}/${niks.length} | gagal: ${fails.length}`);
            await new Promise(z => setTimeout(z, DELAY));
        }

        downloadCSV(out, fails);
        setStatus(`SELESAI. ${out.length} baris, gagal/kosong: ${fails.length}. CSV ter-download.`);
        if (fails.length) console.log("NIK gagal/tidak ketemu:", fails.join(", "));
        running = false;
    }

    // ================== UI PANEL ==================
    function buildPanel() {
        if (document.getElementById("lmsEnrichPanel")) return;

        const p = document.createElement("div");
        p.id = "lmsEnrichPanel";
        p.style.cssText = "position:fixed;top:80px;right:24px;z-index:2147483647;width:300px;background:#0f172a;color:#e2e8f0;font:12px/1.5 system-ui,sans-serif;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.45);overflow:hidden";

        p.innerHTML = `
          <div id="lmsHead" style="background:#16b3ac;color:#fff;padding:10px 14px;font-weight:700;cursor:move;display:flex;justify-content:space-between;align-items:center">
            <span>LMS Enrich Peserta</span>
            <span id="lmsMin" style="cursor:pointer;font-size:16px;line-height:1">_</span>
          </div>
          <div id="lmsBody" style="padding:12px 14px">
            <div style="margin-bottom:8px">NIK siap: <b id="lmsCount">0</b></div>

            <button id="lmsScrape" style="width:100%;margin-bottom:8px;padding:8px;border:none;border-radius:8px;background:#334155;color:#fff;cursor:pointer;font-weight:600">1. Ambil NIK dari tabel halaman ini</button>

            <div style="margin:6px 0 4px">atau paste NIK (bebas format):</div>
            <textarea id="lmsPaste" rows="3" placeholder="tempel NIK / CSV / kolom di sini..." style="width:100%;box-sizing:border-box;background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:6px;resize:vertical"></textarea>
            <button id="lmsAddPaste" style="width:100%;margin:6px 0 10px;padding:7px;border:none;border-radius:8px;background:#334155;color:#fff;cursor:pointer">+ Tambah NIK dari teks</button>

            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <span>Jeda antar request (ms):</span>
              <input id="lmsDelay" type="number" min="0" step="20" value="180" style="width:80px;background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:5px">
            </div>

            <details style="margin-bottom:10px">
              <summary style="cursor:pointer;color:#94a3b8">Token (opsional, kalau auto gagal)</summary>
              <input id="lmsTokenManual" placeholder="tempel Bearer token ey..." style="width:100%;box-sizing:border-box;margin-top:6px;background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:6px;padding:6px">
            </details>

            <button id="lmsStart" style="width:100%;padding:9px;border:none;border-radius:8px;background:#16b3ac;color:#fff;cursor:pointer;font-weight:700">2. Tarik Data Lengkap &amp; Download CSV</button>
            <div style="display:flex;gap:6px;margin-top:6px">
              <button id="lmsViewNik" style="flex:1;padding:6px;border:none;border-radius:8px;background:#334155;color:#fff;cursor:pointer">Lihat/Download NIK</button>
              <button id="lmsClear" style="flex:1;padding:6px;border:none;border-radius:8px;background:transparent;color:#94a3b8;cursor:pointer;border:1px solid #334155">reset NIK</button>
            </div>
            <button id="lmsResetRun" style="width:100%;margin-top:6px;padding:5px;border:none;border-radius:8px;background:transparent;color:#f59e0b;cursor:pointer;border:1px solid #f59e0b;font-size:11px">reset proses (kalau tombol nyangkut)</button>

            <div id="lmsStatus" style="margin-top:10px;padding:8px;background:#1e293b;border-radius:6px;min-height:34px">Siap. Ambil NIK dari tabel atau paste, lalu Tarik Data.</div>
          </div>`;
        document.body.appendChild(p);

        document.getElementById("lmsScrape").onclick = scrapeTable;
        document.getElementById("lmsStart").onclick = startEnrich;
        document.getElementById("lmsAddPaste").onclick = () => {
            const found = extractNiks(document.getElementById("lmsPaste").value);
            found.forEach(n => nikSet.add(n));
            saveNiks();
            refreshCount();
            setStatus(`Ditambah ${found.length} NIK dari teks. Total unik: <b>${nikSet.size}</b>`);
        };
        document.getElementById("lmsClear").onclick = () => { nikSet.clear(); saveNiks(); refreshCount(); setStatus("Daftar NIK direset."); };
        document.getElementById("lmsResetRun").onclick = () => { running = false; setStatus("Status proses direset. Coba klik Tarik Data lagi."); };
        document.getElementById("lmsDelay").oninput = (e) => { DELAY = Math.max(0, parseInt(e.target.value) || 0); };
        document.getElementById("lmsViewNik").onclick = () => {
            const arr = [...nikSet];
            if (!arr.length) { setStatus("Belum ada NIK."); return; }
            console.log("=== NIK terkumpul (" + arr.length + ") ===");
            console.log(arr.join("\n"));
            const blob = new Blob(["\ufeff" + arr.join("\n")], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `nik_${arr.length}_${Date.now()}.csv`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            setStatus(`${arr.length} NIK: ke-download + dicetak di Console (F12).`);
        };

        // minimize
        const min = document.getElementById("lmsMin");
        const body = document.getElementById("lmsBody");
        min.onclick = () => { body.style.display = body.style.display === "none" ? "block" : "none"; };

        // drag
        const head = document.getElementById("lmsHead");
        let dx = 0, dy = 0, drag = false;
        head.onmousedown = (e) => { if (e.target === min) return; drag = true; dx = e.clientX - p.offsetLeft; dy = e.clientY - p.offsetTop; };
        document.onmousemove = (e) => { if (!drag) return; p.style.left = (e.clientX - dx) + "px"; p.style.top = (e.clientY - dy) + "px"; p.style.right = "auto"; };
        document.onmouseup = () => { drag = false; };

        // tampilkan NIK yang sudah tersimpan (dari localStorage)
        refreshCount();
        if (nikSet.size) setStatus(`Ada <b>${nikSet.size}</b> NIK tersimpan dari sesi sebelumnya. Lanjut Tarik Data, atau reset.`);
    }

    // pastikan panel selalu ada (SPA re-render)
    setInterval(buildPanel, 1000);
    buildPanel();

})();