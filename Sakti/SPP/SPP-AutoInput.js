// ==UserScript==
// @name         SPP Auto Input - Poltekkes Palembang
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Otomatisasi input SPP: Pilih jenis → Tambah → Isi form → Simpan
// @author       Annisa Baizan
// @match        https://sakti.kemenkeu.go.id/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// ==/UserScript==

(function () {
    "use strict";

    const SPP_DATA_URL    = "http://localhost:3031/spp-data";
    const PASTEBRIDGE_URL = "http://localhost:3030/paste";

    const D_SHORT  = 700;
    const D_MEDIUM = 1400;
    const D_LONG   = 2500;

    let isRunning = false;
    let panelStatus = null;

    // ============================================================
    // UTIL
    // ============================================================
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function log(msg, type = "info") {
        const icons = { info: "ℹ️", ok: "✅", warn: "⚠️", err: "❌", step: "👉" };
        console.log(`${icons[type] || "•"} [SPP-Bot] ${msg}`);
        if (panelStatus) panelStatus.textContent = msg.substring(0, 65);
    }

    function waitFor(selector, timeout = 12000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const obs = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) { obs.disconnect(); resolve(el); }
            });
            obs.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { obs.disconnect(); reject(new Error(`Timeout: ${selector}`)); }, timeout);
        });
    }

    function findBtn(label) {
        for (const el of document.querySelectorAll("button")) {
            if (!el.disabled && el.textContent.trim() === label) return el;
            const span = el.querySelector(".ui-button-text, span");
            if (span && span.textContent.trim() === label && !el.disabled) return el;
        }
        return null;
    }

    async function klikBtn(label, timeout = 8000) {
        const t0 = Date.now();
        while (Date.now() - t0 < timeout) {
            const btn = findBtn(label);
            if (btn) { btn.click(); log(`Klik: "${label}"`, "step"); await sleep(D_MEDIUM); return true; }
            await sleep(300);
        }
        log(`Tombol "${label}" tidak ditemukan`, "warn");
        return false;
    }

    async function isiInput(el, nilai) {
        if (!el) return;
        el.focus();
        el.value = "";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(100);
        el.value = nilai;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
        await sleep(200);
    }

    function pasteBridge(nilai) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: PASTEBRIDGE_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ nilai: String(nilai) }),
                onload: res => { log(`PasteBridge: ${nilai}`, "ok"); resolve(res); },
                onerror: () => reject(new Error("PasteBridge error")),
                ontimeout: () => reject(new Error("PasteBridge timeout"))
            });
        });
    }

    async function isiNominal(el, nilai) {
        if (!el) return;
        el.focus(); el.select();
        await sleep(300);
        await pasteBridge(nilai);
        await sleep(800);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
        await sleep(300);
    }

    async function pilihDropdown(ddEl, cariTeks) {
        if (!ddEl || !cariTeks) return false;
        (ddEl.querySelector(".ui-dropdown-trigger, .ui-dropdown-label") || ddEl).click();
        await sleep(D_SHORT);
        for (const item of document.querySelectorAll(".ui-dropdown-item, li.ui-dropdown-item")) {
            if (item.textContent.trim().startsWith(cariTeks)) {
                item.click();
                log(`Dropdown: ${item.textContent.trim().substring(0, 40)}`, "ok");
                await sleep(D_SHORT);
                return true;
            }
        }
        document.body.click();
        log(`Dropdown item tidak ditemukan: "${cariTeks}"`, "warn");
        return false;
    }

    function ambilData() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: SPP_DATA_URL,
                onload: res => {
                    try { resolve(JSON.parse(res.responseText)); }
                    catch { reject(new Error("Gagal parse data SPP")); }
                },
                onerror: () => reject(new Error("SPP Reader tidak aktif! Jalankan SPP-Bridge.py dulu."))
            });
        });
    }

    // ============================================================
    // STEP 1 — 3 Dropdown Jenis SPP
    // ============================================================
    async function step1_jenisSPP(data) {
        log("STEP 1: Pilih Jenis SPP", "step");

        const MAP = {
            "111": ["100", "110", "111"],
            "210": ["200", "210", "210"],
            "211": ["200", "210", "211"],
            "231": ["200", "230", "231"],
            "317": ["300", "310", "317"],
        };

        const labels = MAP[data.jenis_spp];
        if (!labels) throw new Error(`Jenis SPP tidak dikenali: ${data.jenis_spp}`);

        let dds = document.querySelectorAll(".drpdwn p-dropdown .ui-dropdown, .drpdwn .ui-dropdown");
        if (dds.length < 1) dds = document.querySelectorAll("p-dropdown .ui-dropdown");
        if (dds.length < 3) throw new Error(`Dropdown Jenis SPP tidak ditemukan (ada ${dds.length}). Pastikan di halaman Catat/Ubah SPP.`);

        await pilihDropdown(dds[0], labels[0]);
        await sleep(D_MEDIUM);

        dds = document.querySelectorAll(".drpdwn p-dropdown .ui-dropdown, .drpdwn .ui-dropdown");
        await pilihDropdown(dds[1], labels[1]);
        await sleep(D_MEDIUM);

        dds = document.querySelectorAll(".drpdwn p-dropdown .ui-dropdown, .drpdwn .ui-dropdown");
        await pilihDropdown(dds[2], labels[2]);
        await sleep(D_MEDIUM);

        log(`Jenis SPP ${data.jenis_spp} dipilih`, "ok");
    }

    // ============================================================
    // STEP 2 — Radio BAST / NON BAST
    // ============================================================
    async function step2_radio(data) {
        log("STEP 2: Pilih Radio BAST/NON BAST", "step");

        let targetValue = null;
        if (data.jenis_spp === "111")                           targetValue = "BAST";
        else if (["210","211","231"].includes(data.jenis_spp)) targetValue = "NON BAST";
        else { log("KKP: tidak ada radio BAST", "info"); return; }

        for (const r of document.querySelectorAll("input[type='radio']")) {
            const lbl = r.labels?.[0]?.textContent.trim() || r.value;
            if (lbl.includes(targetValue) || r.value.includes(targetValue)) {
                r.click();
                r.dispatchEvent(new Event("change", { bubbles: true }));
                log(`Radio: ${targetValue}`, "ok");
                await sleep(D_SHORT);
                return;
            }
        }
        log(`Radio "${targetValue}" tidak ditemukan — lanjut`, "warn");
    }

    // ============================================================
    // STEP 3 — Klik Tambah
    // ============================================================
    async function step3_tambah() {
        log("STEP 3: Klik Tambah", "step");
        await klikBtn("Tambah");
        await sleep(D_LONG);
    }

    // ============================================================
    // STEP 4 — Uraian Pembayaran
    // ============================================================
    async function step4_uraian(data) {
        log("STEP 4: Isi Uraian", "step");
        await waitFor("textarea");
        await sleep(D_SHORT);
        for (const ta of document.querySelectorAll("textarea")) {
            if (!ta.disabled && !ta.readOnly) {
                await isiInput(ta, data.uraian);
                log("Uraian diisi", "ok");
                return;
            }
        }
        log("Textarea uraian tidak ditemukan", "warn");
    }

    // ============================================================
    // STEP 5A — Kontraktual: Cari BAST-BG / Kontrak
    // ============================================================
    async function step5A_kontraktual(data) {
        log("STEP 5A: Kontraktual — Cari BAST/Kontrak", "step");

        await klikBtn("Cari BAST-BG") || await klikBtn("Cari Kontrak");
        await sleep(D_LONG);

        // Pilih baris pertama dari dialog
        const rows = document.querySelectorAll(".ui-dialog tr.ui-selectable-row");
        if (rows[0]) { rows[0].click(); await sleep(D_SHORT); }

        await klikBtn("Pilih");
        await sleep(D_LONG);

        // Pilih Kategori radio: default Jasa/Non Aset (index 1)
        const radios = document.querySelectorAll("p-radiobutton input[type='radio']");
        if (radios[1]) {
            radios[1].click();
            radios[1].dispatchEvent(new Event("change", { bubbles: true }));
            log("Kategori BAST: Jasa/Non Aset", "ok");
            await sleep(D_SHORT);
        }
    }

    // ============================================================
    // STEP 5B — Non-Kontraktual: Cari Supplier
    // ============================================================
    async function step5B_nonKontraktual(data) {
        log("STEP 5B: Non-Kontraktual — Cari Supplier", "step");

        await klikBtn("Cari Supplier");
        await sleep(D_LONG);

        const dlgInput = document.querySelector(".ui-dialog input[type='text']");
        if (dlgInput) {
            await isiInput(dlgInput, data.supplier);
            await sleep(D_SHORT);
        }

        await klikBtn("Cari");
        await sleep(D_LONG);

        const rows = document.querySelectorAll(".ui-dialog tr.ui-selectable-row");
        if (rows[0]) { rows[0].click(); await sleep(D_SHORT); }

        await klikBtn("Pilih") || await klikBtn("OK");
        await sleep(D_LONG);
    }

    // ============================================================
    // STEP 6 — Akun Pengeluaran
    // ============================================================
    async function step6_akunPengeluaran(data) {
        log("STEP 6: Akun Pengeluaran", "step");

        // Klik tab
        for (const tab of document.querySelectorAll(".ui-tabview-nav li a")) {
            if (tab.textContent.includes("Pengeluaran")) {
                tab.click(); await sleep(D_SHORT); break;
            }
        }

        // Klik RUH Akun
        await klikBtn("RUH Akun");
        await sleep(D_LONG);

        // Pilih dropdown COA
        const parts = (data.coa_pengeluaran || "").split(".");
        // Urutan: Program(index 0), Kegiatan(1), Output(2), Akun(3), KPPN(4), S.Dana(5)
        const segments = [
            parts[3]?.substring(0, 4) || "",  // kegiatan 4 digit
            parts[3]?.substring(0, 4) || "",  // kegiatan sama
            parts[4] || "",                    // output
            parts[2] || "",                    // akun
            parts[1] || "",                    // kppn
            parts[5]?.charAt(0) || "A",        // sumber dana
        ];

        for (let i = 0; i < 4; i++) {
            await sleep(D_MEDIUM);
            const dds = document.querySelectorAll("p-dropdown .ui-dropdown");
            if (dds[i] && segments[i]) await pilihDropdown(dds[i], segments[i]);
        }

        // Isi Nilai
        await sleep(D_SHORT);
        const nilaiEl = document.querySelector("input[currencymask]:not([disabled]), p-inputnumber input:not([disabled])");
        if (nilaiEl) {
            await isiNominal(nilaiEl, data.nilai_pengeluaran);
            log(`Nilai pengeluaran: ${data.nilai_pengeluaran}`, "ok");
        }

        await klikBtn("Rekam");
        await sleep(D_LONG);

        // Kembali ke form utama
        if (findBtn("Kembali")) { await klikBtn("Kembali"); await sleep(D_LONG); }

        log("Akun Pengeluaran selesai", "ok");
    }

    // ============================================================
    // STEP 7 — Akun Potongan (PPh, PPN)
    // ============================================================
    async function step7_akunPotongan(data) {
        log("STEP 7: Akun Potongan", "step");

        const potongan = (data.potongan || []).filter(p => p.nilai && p.nilai !== "0");
        if (!potongan.length) { log("Tidak ada potongan", "info"); return; }

        // Klik tab Potongan
        for (const tab of document.querySelectorAll(".ui-tabview-nav li a")) {
            if (tab.textContent.includes("Potongan")) {
                tab.click(); await sleep(D_SHORT); break;
            }
        }

        for (const pot of potongan) {
            log(`Potongan akun ${pot.akun} = ${pot.nilai}`, "step");

            await klikBtn("RUH Akun");
            await sleep(D_LONG);

            // Cari akun via input atau dialog
            const akunInput = document.querySelector("input[formcontrolname*='akun']");
            if (akunInput) {
                await isiInput(akunInput, pot.akun);
            } else {
                // Pakai dialog browser akun
                await klikBtn("Cari") || await klikBtn("Browse");
                await sleep(D_LONG);
                const dlgInput = document.querySelector(".ui-dialog input[type='text']");
                if (dlgInput) { await isiInput(dlgInput, pot.akun); await sleep(D_SHORT); await klikBtn("Cari"); await sleep(D_LONG); }
                const rows = document.querySelectorAll(".ui-dialog tr.ui-selectable-row");
                if (rows[0]) { rows[0].click(); await sleep(D_SHORT); }
                await klikBtn("Pilih");
                await sleep(D_MEDIUM);
            }

            // Isi nilai
            await sleep(D_SHORT);
            const nilaiEl = document.querySelector("input[currencymask]:not([disabled]), p-inputnumber input:not([disabled])");
            if (nilaiEl) await isiNominal(nilaiEl, pot.nilai);

            await klikBtn("Tambah");
            await sleep(D_LONG);
        }

        log("Akun Potongan selesai", "ok");
    }

    // ============================================================
    // STEP 8 — Simpan
    // ============================================================
    async function step8_simpan() {
        log("STEP 8: Simpan", "step");
        await klikBtn("Simpan");
        await sleep(D_LONG);

        for (const lbl of ["Oke", "OK", "Ya", "Yes"]) {
            if (findBtn(lbl)) { await klikBtn(lbl); await sleep(D_LONG); break; }
        }

        log("SPP berhasil disimpan!", "ok");
    }

    // ============================================================
    // MAIN
    // ============================================================
    async function jalankan() {
        if (isRunning) { log("Sudah berjalan!", "warn"); return; }
        isRunning = true;
        setBtnState("running");

        try {
            log("Ambil data dari SPP Reader...", "info");
            const data = await ambilData();
            log(`SPP ${data.jenis_spp} — ${data.supplier?.substring(0, 30)}`, "ok");

            if (!document.querySelector("p-dropdown, .ui-dropdown")) {
                throw new Error("Tidak ada form SPP. Navigasi ke Pembayaran → RUH → Catat/Ubah SPP dulu!");
            }

            await step1_jenisSPP(data);
            await step2_radio(data);
            await step3_tambah();
            await step4_uraian(data);

            if (data.jenis_spp === "111")                           await step5A_kontraktual(data);
            else if (["210","211","231"].includes(data.jenis_spp)) await step5B_nonKontraktual(data);
            else if (["300","310","317"].includes(data.jenis_spp)) log("KKP: pilih KKP manual (5 detik)...", "warn"), await sleep(5000);

            await step6_akunPengeluaran(data);
            await step7_akunPotongan(data);
            await step8_simpan();

            setBtnState("done");

        } catch (err) {
            log(`ERROR: ${err.message}`, "err");
            setBtnState("error");
        } finally {
            isRunning = false;
        }
    }

    // ============================================================
    // UI Panel
    // ============================================================
    function setBtnState(state) {
        const btn = document.getElementById("spp-bot-btn");
        if (!btn) return;
        const states = {
            running: ["⏳ Berjalan...", "#f7a24f"],
            done:    ["✅ Selesai!",    "#00d4aa"],
            error:   ["❌ Error",       "#f75f5f"],
        };
        if (states[state]) {
            btn.textContent = states[state][0];
            btn.style.background = states[state][1];
            if (state !== "running") setTimeout(() => { btn.textContent = "▶ Jalankan"; btn.style.background = "#4f8ef7"; }, 4000);
        }
    }

    function buatPanel() {
        if (document.getElementById("spp-bot-panel")) return;

        const p = document.createElement("div");
        p.id = "spp-bot-panel";
        p.style.cssText = "position:fixed;top:68px;right:14px;z-index:99999;background:#1a1d27;border:1px solid #4f8ef7;border-radius:10px;padding:12px 14px;font-family:'IBM Plex Mono',monospace;color:#e8eaf6;min-width:210px;box-shadow:0 4px 20px rgba(79,142,247,.25);";
        p.innerHTML = `
            <div style="font-weight:700;font-size:13px;color:#4f8ef7;margin-bottom:6px;">🤖 SPP Bot v2</div>
            <div id="spp-bot-status" style="font-size:10px;color:#8b92b8;margin-bottom:10px;min-height:30px;line-height:1.5;">Siap. Buka Catat/Ubah SPP lalu klik Jalankan.</div>
            <button id="spp-bot-btn" style="width:100%;background:#4f8ef7;color:#fff;border:none;border-radius:6px;padding:8px;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:6px;font-family:inherit;">▶ Jalankan</button>
            <button id="spp-bot-stop" style="width:100%;background:#2e3350;color:#8b92b8;border:1px solid #2e3350;border-radius:6px;padding:5px;cursor:pointer;font-size:11px;font-family:inherit;">⏹ Stop</button>
        `;

        document.body.appendChild(p);
        panelStatus = document.getElementById("spp-bot-status");
        document.getElementById("spp-bot-btn").addEventListener("click", jalankan);
        document.getElementById("spp-bot-stop").addEventListener("click", () => {
            isRunning = false; setBtnState("error"); log("Dihentikan", "warn");
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(buatPanel, 2000));
    else setTimeout(buatPanel, 2000);

    const origPush = history.pushState;
    history.pushState = function (...args) { origPush.apply(this, args); setTimeout(buatPanel, 2500); };

})();
