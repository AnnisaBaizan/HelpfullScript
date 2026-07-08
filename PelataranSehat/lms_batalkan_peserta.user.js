// ==UserScript==
// @name         LMS Kemkes - Batalkan Peserta dari CSV
// @namespace    lms-kemkes-batalkan
// @version      2.0
// @description  Upload CSV berisi NIK peserta, lalu otomatis batalkan (cari -> Batalkan Peserta -> isi alasan -> OK). Pengaman: review, dry-run, uji 1, konfirmasi ketik, log.
// @match        https://admin-lms.kemkes.go.id/pelatihan/kelola-pelatihan/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let DELAY = 1200; // jeda antar peserta (ms)

    const DEFAULT_REASON =
        `Yth. Bapak/Ibu,
Terima kasih telah mendaftar pada webinar ini. Setelah dilakukan verifikasi, kami informasikan bahwa profesi Bapak/Ibu belum sesuai dengan sasaran peserta yang ditentukan dalam kegiatan ini, sehingga pendaftaran belum dapat dilanjutkan.
Kami sangat menghargai minat dan partisipasi Bapak/Ibu. Terima kasih atas pengertiannya.`;

    let targetSet = new Set(); // NIK yang akan dibatalkan (dari upload / paste)
    let log = [];
    let running = false;

    // ================== UTIL ==================
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const extractNiks = (text) => (String(text).match(/\d{16}/g) || []);

    function setStatus(msg) { const el = document.getElementById("bnStatus"); if (el) el.innerHTML = msg; }
    function refreshCount() { const t = document.getElementById("bnCount"); if (t) t.textContent = targetSet.size; }
    function addLog(nik, status, ket) {
        log.push({ nik, status, ket, t: new Date().toLocaleTimeString() });
        const el = document.getElementById("bnLog");
        if (el) {
            const color = status === "OK" ? "#4ade80" : status === "SKIP" ? "#fbbf24" : status === "DRYRUN" ? "#93c5fd" : "#f87171";
            el.insertAdjacentHTML("afterbegin", `<div style="color:${color}">[${status}] ${nik} - ${ket}</div>`);
        }
    }

    // set nilai input/textarea yang dikontrol React
    function reactSet(el, value) {
        const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function waitFor(fn, timeout = 8000, interval = 150) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                let v; try { v = fn(); } catch (e) { v = null; }
                if (v) { clearInterval(timer); resolve(v); }
                else if (Date.now() - start > timeout) { clearInterval(timer); reject(new Error("timeout")); }
            }, interval);
        });
    }
    const getRows = () => document.querySelectorAll(".ant-table-tbody > tr[data-row-key]");
    const btnByText = (text, root = document) =>
        [...root.querySelectorAll("button")].find(b => b.textContent.trim() === text && !b.disabled);

    // ================== BATALKAN 1 PESERTA ==================
    async function cancelOne(nik, reason, dryRun) {
        // 1. isi kotak cari NIK
        const search = document.querySelector('input[placeholder="Cari NIK Peserta"]');
        if (!search) throw new Error("kotak 'Cari NIK Peserta' tidak ditemukan");
        reactSet(search, nik);

        // 2. klik tombol cari
        const searchBtn = document.querySelector("button.ant-input-search-button")
            || search.closest(".ant-input-search")?.querySelector("button")
            || search.parentElement?.querySelector("button");
        if (searchBtn) searchBtn.click();
        else search.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true }));

        // 3. tunggu tabel memuat baris yang cocok dgn NIK ini
        let rows;
        try {
            rows = await waitFor(() => {
                const rr = [...getRows()].filter(r => r.textContent.includes(nik));
                return rr.length ? rr : null;
            }, 8000);
        } catch (e) {
            return { status: "SKIP", ket: "NIK tidak ditemukan di pelatihan ini" };
        }
        if (rows.length !== 1) return { status: "SKIP", ket: `hasil cari tidak tunggal (${rows.length} baris), dilewati` };
        await sleep(250);

        // 4. centang checkbox baris bila ada (pola bulk-action)
        const cb = rows[0].querySelector('input[type="checkbox"]');
        if (cb && !cb.checked) { cb.click(); await sleep(150); }

        // 5. klik "Batalkan Peserta"
        let batal;
        try { batal = await waitFor(() => btnByText("Batalkan Peserta"), 6000); }
        catch (e) { return { status: "ERROR", ket: "tombol 'Batalkan Peserta' tidak muncul/aktif" }; }
        batal.click();

        // 6. tunggu modal + textarea alasan
        let ta;
        try { ta = await waitFor(() => document.querySelector('textarea[placeholder="Masukkan alasan keluar"]'), 6000); }
        catch (e) { return { status: "ERROR", ket: "modal alasan tidak muncul" }; }
        reactSet(ta, reason);
        await sleep(250);

        // 7. mode uji: JANGAN klik OK
        if (dryRun) return { status: "DRYRUN", ket: "form terisi, OK TIDAK diklik (cek manual)" };

        // 8. klik OK di modal
        const modal = document.querySelector(".ant-modal-wrap, .ant-modal-root, .ant-modal") || document;
        let ok;
        try { ok = await waitFor(() => btnByText("OK", modal), 5000); }
        catch (e) { return { status: "ERROR", ket: "tombol OK tidak ditemukan di modal" }; }
        ok.click();

        // 9. tunggu modal tertutup = sukses
        try { await waitFor(() => !document.querySelector('textarea[placeholder="Masukkan alasan keluar"]'), 10000); }
        catch (e) { return { status: "ERROR", ket: "modal tidak menutup, status tidak pasti" }; }

        return { status: "OK", ket: "peserta dibatalkan" };
    }

    async function runBatch(single) {
        if (running) { setStatus("Proses lain berjalan. Tunggu / reset."); return; }
        const arr = [...targetSet];
        if (!arr.length) { setStatus("Belum ada NIK. Upload CSV atau paste dulu."); return; }

        const reason = (document.getElementById("bnReason").value || "").trim();
        if (!reason) { setStatus("Alasan kosong. Isi dulu teks alasan."); return; }
        const dryRun = document.getElementById("bnDryRun").checked;

        if (!single && !dryRun) {
            const conf = (document.getElementById("bnConfirm").value || "").trim();
            if (conf !== "BATALKAN") { setStatus("Untuk proses SEMUA, ketik <b>BATALKAN</b> di kotak konfirmasi dulu."); return; }
        }
        const dEl = document.getElementById("bnDelay");
        if (dEl) DELAY = Math.max(300, parseInt(dEl.value) || 1200);

        running = true;
        const list = single ? arr.slice(0, 1) : arr;
        let ok = 0, skip = 0, err = 0, done = 0;
        for (const nik of list) {
            setStatus(`${dryRun ? "[UJI] " : ""}Proses ${done + 1}/${list.length}: ${nik}`);
            let res;
            try { res = await cancelOne(nik, reason, dryRun); }
            catch (e) { res = { status: "ERROR", ket: e.message }; }
            addLog(nik, res.status, res.ket);
            if (res.status === "OK") ok++; else if (res.status === "SKIP") skip++; else if (res.status !== "DRYRUN") err++;
            done++;
            const s = document.querySelector('input[placeholder="Cari NIK Peserta"]');
            if (s) reactSet(s, "");
            await sleep(DELAY);
        }
        setStatus(`Selesai. OK:${ok} SKIP:${skip} ERROR:${err} dari ${list.length}. Lihat log & download.`);
        running = false;
    }

    function downloadLog() {
        if (!log.length) { setStatus("Log kosong."); return; }
        const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
        const lines = ["Waktu,NIK,Status,Keterangan"];
        log.forEach(l => lines.push([esc(l.t), esc(l.nik), esc(l.status), esc(l.ket)].join(",")));
        const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `log_batalkan_${Date.now()}.csv`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }

    // ================== UI ==================
    function buildPanel() {
        if (document.getElementById("bnPanel")) return;
        const p = document.createElement("div");
        p.id = "bnPanel";
        p.style.cssText = "position:fixed;top:70px;right:20px;z-index:2147483647;width:330px;max-height:88vh;overflow:auto;background:#1a0f0f;color:#fde8e8;font:12px/1.5 system-ui,sans-serif;border:2px solid #dc2626;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.5)";
        p.innerHTML = `
          <div id="bnHead" style="background:#dc2626;color:#fff;padding:10px 14px;font-weight:700;cursor:move;display:flex;justify-content:space-between;align-items:center">
            <span>Batalkan Peserta (dari CSV)</span><span id="bnMin" style="cursor:pointer;font-size:16px">_</span>
          </div>
          <div id="bnBody" style="padding:12px 14px">
            <div style="background:#3b0d0d;border-radius:6px;padding:8px;margin-bottom:10px;color:#fecaca">Aksi ini <b>tidak bisa dibatalkan</b> & mengirim notifikasi ke peserta. Uji 1 orang & review dulu.</div>

            <div style="font-weight:700;margin-bottom:4px">1) Daftar NIK yang akan dibatalkan</div>
            <div style="background:#0d2a28;border-radius:6px;padding:8px;margin-bottom:6px;color:#99f6e4">Upload CSV (semua NIK 16 digit di file akan jadi target). Kamu yang tentukan isi filternya.</div>
            <input type="file" id="bnUpload" accept=".csv,text/csv,text/plain" style="width:100%;box-sizing:border-box;margin-bottom:8px;color:#fde8e8">
            <textarea id="bnPaste" rows="2" placeholder="atau paste NIK di sini" style="width:100%;box-sizing:border-box;background:#2a1414;color:#fde8e8;border:1px solid #7f1d1d;border-radius:6px;padding:6px"></textarea>
            <button id="bnAddPaste" style="width:100%;margin:6px 0;padding:6px;border:none;border-radius:8px;background:#334155;color:#fff;cursor:pointer">+ Tambah dari teks</button>
            <div style="margin:4px 0">NIK target: <b id="bnCount">0</b>
              <button id="bnDlTarget" style="float:right;padding:3px 8px;border:none;border-radius:6px;background:#334155;color:#fff;cursor:pointer">review</button>
              <button id="bnClear" style="float:right;margin-right:6px;padding:3px 8px;border:none;border-radius:6px;background:transparent;color:#fca5a5;border:1px solid #7f1d1d;cursor:pointer">kosongkan</button></div>

            <div style="font-weight:700;margin:8px 0 4px">2) Alasan (editable)</div>
            <textarea id="bnReason" rows="5" style="width:100%;box-sizing:border-box;background:#2a1414;color:#fde8e8;border:1px solid #7f1d1d;border-radius:6px;padding:6px"></textarea>

            <div style="display:flex;align-items:center;gap:8px;margin:8px 0">
              <span>Jeda (ms):</span><input id="bnDelay" type="number" min="300" step="100" value="1200" style="width:80px;background:#2a1414;color:#fde8e8;border:1px solid #7f1d1d;border-radius:6px;padding:5px">
            </div>
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer">
              <input type="checkbox" id="bnDryRun" checked> <span>Mode uji (isi form tapi <b>TIDAK</b> klik OK)</span>
            </label>

            <div style="font-weight:700;margin:8px 0 4px">3) Jalankan</div>
            <button id="bnTest" style="width:100%;margin-bottom:6px;padding:8px;border:none;border-radius:8px;background:#f59e0b;color:#1a0f0f;cursor:pointer;font-weight:700">Uji 1 NIK pertama</button>
            <input id="bnConfirm" placeholder='ketik BATALKAN utk proses semua' style="width:100%;box-sizing:border-box;margin-bottom:6px;background:#2a1414;color:#fde8e8;border:1px solid #7f1d1d;border-radius:6px;padding:6px">
            <button id="bnRunAll" style="width:100%;padding:9px;border:none;border-radius:8px;background:#dc2626;color:#fff;cursor:pointer;font-weight:700">BATALKAN SEMUA target</button>

            <div style="display:flex;gap:6px;margin-top:8px">
              <button id="bnDlLog" style="flex:1;padding:6px;border:none;border-radius:8px;background:#334155;color:#fff;cursor:pointer">download log</button>
              <button id="bnReset" style="flex:1;padding:6px;border:none;border-radius:8px;background:transparent;color:#fca5a5;border:1px solid #7f1d1d;cursor:pointer">reset proses</button>
            </div>

            <div id="bnStatus" style="margin-top:10px;padding:8px;background:#2a1414;border-radius:6px;min-height:34px">Siap. Upload CSV, review, uji 1, baru batalkan semua.</div>
            <div id="bnLog" style="margin-top:8px;max-height:140px;overflow:auto;font-family:monospace;font-size:11px"></div>
          </div>`;
        document.body.appendChild(p);
        document.getElementById("bnReason").value = DEFAULT_REASON;

        document.getElementById("bnUpload").onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const niks = extractNiks(reader.result);
                if (!niks.length) { setStatus("Tidak ada NIK 16 digit di file. Cek isi CSV."); return; }
                targetSet.clear();
                niks.forEach(n => targetSet.add(n));
                refreshCount();
                setStatus(`Upload OK: <b>${targetSet.size}</b> NIK jadi target. Wajib review & uji 1 dulu.`);
            };
            reader.onerror = () => setStatus("Gagal baca file.");
            reader.readAsText(file);
        };
        document.getElementById("bnAddPaste").onclick = () => {
            const found = extractNiks(document.getElementById("bnPaste").value);
            found.forEach(n => targetSet.add(n));
            refreshCount();
            setStatus(`Ditambah ${found.length} NIK. Total target: <b>${targetSet.size}</b>`);
        };
        document.getElementById("bnClear").onclick = () => { targetSet.clear(); refreshCount(); setStatus("Daftar target dikosongkan."); };
        document.getElementById("bnDlTarget").onclick = () => {
            const arr = [...targetSet];
            if (!arr.length) { setStatus("Belum ada target."); return; }
            const blob = new Blob(["\ufeff" + "NIK\n" + arr.join("\n")], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `target_batalkan_${arr.length}_${Date.now()}.csv`;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
            setStatus(`${arr.length} NIK target ter-download untuk review.`);
        };
        document.getElementById("bnTest").onclick = () => runBatch(true);
        document.getElementById("bnRunAll").onclick = () => runBatch(false);
        document.getElementById("bnDlLog").onclick = downloadLog;
        document.getElementById("bnReset").onclick = () => { running = false; setStatus("Status proses direset."); };

        const min = document.getElementById("bnMin"), body = document.getElementById("bnBody");
        min.onclick = () => { body.style.display = body.style.display === "none" ? "block" : "none"; };
        const head = document.getElementById("bnHead");
        let dx = 0, dy = 0, drag = false;
        head.onmousedown = (e) => { if (e.target === min) return; drag = true; dx = e.clientX - p.offsetLeft; dy = e.clientY - p.offsetTop; };
        document.onmousemove = (e) => { if (!drag) return; p.style.left = (e.clientX - dx) + "px"; p.style.top = (e.clientY - dy) + "px"; p.style.right = "auto"; };
        document.onmouseup = () => { drag = false; };
    }

    setInterval(buildPanel, 1000);
    buildPanel();
})();