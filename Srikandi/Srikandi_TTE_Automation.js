// ==UserScript==
// @name         Auto TTE Srikandi - Tandatangan Naskah (v2)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Otomatisasi tanda tangan elektronik naskah keluar di Srikandi ANRI
// @author       Annisa Baizan
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @match        https://srikandi.arsip.go.id/pembuatan-naskah-keluar/tandatangan-naskah*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // ===================================================
    // ⚙️ KONFIGURASI
    // ===================================================
    const CONFIG = {
        KEY_PHRASE: "qwertyuuiyuioty",
        LIST_URL: "https://srikandi.arsip.go.id/pembuatan-naskah-keluar/tandatangan-naskah?statusTT=BELUM",
        DELAYS: {
            SHORT: 800,
            MEDIUM: 1500,
            LONG: 3000,
            PAGE_LOAD: 4000,
            AFTER_SUBMIT: 5000,
        },
        STORAGE_KEY: "srikandi_tte_state",
    };

    let controlBtn = null;

    // ===================================================
    // 💾 State Management (persist across page navigations)
    // ===================================================
    function getState() {
        try {
            const raw = sessionStorage.getItem(CONFIG.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    function setState(state) {
        sessionStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    }

    function clearState() {
        sessionStorage.removeItem(CONFIG.STORAGE_KEY);
    }

    function isRunning() {
        const state = getState();
        return state && state.running === true;
    }

    // ===================================================
    // 🛠️ Utility Functions
    // ===================================================
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`⏰ Timeout menunggu: ${selector}`));
            }, timeout);
        });
    }

    function findByText(selector, text) {
        return [...document.querySelectorAll(selector)].find((el) =>
            el.textContent.trim().includes(text)
        );
    }

    /** Cari SVG berdasarkan child <title> element */
    function findSvgByTitle(titleText) {
        const titles = document.querySelectorAll("svg title");
        for (const t of titles) {
            if (t.textContent.trim() === titleText) {
                return t.closest("svg");
            }
        }
        return null;
    }

    /** Tunggu SVG dengan child <title> muncul di DOM */
    function waitForSvgByTitle(titleText, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const found = findSvgByTitle(titleText);
            if (found) return resolve(found);

            const observer = new MutationObserver(() => {
                const el = findSvgByTitle(titleText);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`⏰ Timeout menunggu SVG title="${titleText}"`));
            }, timeout);
        });
    }

    async function setNativeValue(input, value) {
        const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, "value"
        ).set;
        setter.call(input, value);

        input.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(CONFIG.DELAYS.SHORT);

        input.dispatchEvent(new Event("change", { bubbles: true }));
        await sleep(CONFIG.DELAYS.SHORT);
    }

    // ===================================================
    // ⏳ Tunggu tabel selesai loading (data row muncul)
    // ===================================================
    function waitForTableData() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                if (!isRunning()) {
                    reject(new Error("Automasi dihentikan"));
                    return;
                }

                // Cek apakah ada link detail di tabel (= data sudah loaded)
                const links = document.querySelectorAll(
                    'a[href*="/tandatangan-naskah/detail?id="]'
                );

                if (links.length > 0) {
                    console.log(`✅ Tabel loaded — ${links.length} naskah ditemukan`);
                    resolve([...links].map((a) => a.href));
                    return;
                }

                // Cek apakah tabel ada tapi kosong (tidak ada data)
                const table = document.querySelector("table.w-full.text-sm.text-left");
                const emptyIndicator =
                    findByText("td", "Tidak ada data") ||
                    findByText("td", "No data") ||
                    findByText("p", "Tidak ada data") ||
                    findByText("div", "Tidak ada data");

                if (table && emptyIndicator) {
                    resolve([]); // Tabel ada tapi kosong
                    return;
                }

                // Masih loading — cek lagi 1 detik kemudian
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                console.log(`⏳ Menunggu data tabel... (${elapsed}s)`);
                setTimeout(check, 1000);
            };

            check();
        });
    }

    // ===================================================
    // 📄 Halaman LIST — tunggu data, ambil link, navigasi
    // ===================================================
    async function handleListPage() {
        const state = getState();
        if (!state || !state.running) return;

        console.log("📄 Halaman LIST — menunggu data loading...");

        let links;
        try {
            links = await waitForTableData(); // Tunggu sampai data muncul (tanpa batas waktu)
        } catch (err) {
            console.error(`❌ ${err.message}`);
            finishAutomation();
            return;
        }

        if (links.length === 0) {
            console.log("✅ Tidak ada naskah lagi untuk diproses");
            finishAutomation();
            return;
        }

        console.log(`📊 Ditemukan ${links.length} naskah`);

        // Simpan state: akan proses di halaman detail
        setState({
            ...state,
            phase: "DETAIL_SETUJU",
            detailUrl: links[0],
        });

        // Navigasi ke detail (script akan re-init di sana)
        window.location.href = links[0];
    }

    // ===================================================
    // 🛠️ Shared: simulateClick untuk React
    // ===================================================
    function simulateClick(el) {
        const opts = { bubbles: true, cancelable: true, view: window };
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));
    }

    // ===================================================
    // 📦 Fase DETAIL_SETUJU — expand → edit → SETUJU → Kirim
    // ===================================================
    async function handleDetailSetuju() {
        const state = getState();
        const setujuRetry = state.setujuRetry || 0;
        console.log(`📦 Fase SETUJU (retry ke-${setujuRetry})`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Expand section pertama
            const expandButtons = document.querySelectorAll(
                "button.hover\\:opacity-75.transition-transform"
            );
            if (expandButtons.length > 0) {
                expandButtons[0].click();
                console.log("✅ Klik expand section pertama");
                await sleep(CONFIG.DELAYS.MEDIUM);
            }

            // Expand "Daftar Penandatangan"
            const penandatanganHeader = findByText("h5", "Daftar Penandatangan");
            if (penandatanganHeader) {
                const sectionContainer = penandatanganHeader.closest(
                    "div.MuiGrid-root.MuiGrid-container"
                );
                if (sectionContainer) {
                    const expandBtn = sectionContainer.querySelector(
                        "button.hover\\:opacity-75"
                    );
                    if (expandBtn) {
                        expandBtn.click();
                        console.log("✅ Expand Daftar Penandatangan");
                        await sleep(CONFIG.DELAYS.LONG);
                    }
                }
            }

            // Klik edit SVG
            console.log("🔍 Mencari tombol edit...");
            const editSvg = await waitForSvgByTitle("Setuju/tolak tanda tangan");

            simulateClick(editSvg);
            console.log("✅ Klik SVG edit");
            await sleep(CONFIG.DELAYS.LONG);

            // Cek modal, fallback cascade
            let modal = document.querySelector('form#formTtd');
            if (!modal) {
                const parentDiv = editSvg.closest("div.flex.justify-center");
                if (parentDiv) { simulateClick(parentDiv); await sleep(CONFIG.DELAYS.LONG); }
            }
            modal = document.querySelector('form#formTtd');
            if (!modal) {
                const parentTd = editSvg.closest("td");
                if (parentTd) { simulateClick(parentTd); await sleep(CONFIG.DELAYS.LONG); }
            }

            await waitForElement('form#formTtd', 10000);
            console.log("✅ Modal Form Penandatangan terbuka");
            await sleep(CONFIG.DELAYS.SHORT);

            // Pilih radio SETUJU
            const radioSetuju = document.querySelector(
                'input[type="radio"][value="SETUJU"][name="status"]'
            );
            if (radioSetuju) {
                radioSetuju.click();
                await sleep(CONFIG.DELAYS.SHORT);
                radioSetuju.dispatchEvent(new Event("change", { bubbles: true }));
                await sleep(CONFIG.DELAYS.SHORT);
                console.log('✅ Pilih radio "SETUJU"');
            }

            // Klik Kirim
            const btnKirim = document.querySelector(
                'button[type="submit"][form="formTtd"]'
            );
            if (btnKirim) {
                btnKirim.click();
                console.log("✅ Klik Kirim");
                await sleep(CONFIG.DELAYS.AFTER_SUBMIT);
            }

            // Pindah ke fase CHECK_STATUS
            setState({
                ...state,
                phase: "DETAIL_CHECK_STATUS",
                checkCount: 0,
                setujuRetry: setujuRetry,
            });

            console.log("🔄 Refresh untuk cek status...");
            window.location.reload();

        } catch (err) {
            console.error(`❌ Error fase SETUJU: ${err.message}`);
            setState({ ...state, phase: "LIST" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 🔍 Fase DETAIL_CHECK_STATUS — cek apakah status sudah SETUJU
    // ===================================================
    async function handleDetailCheckStatus() {
        const state = getState();
        const checkCount = state.checkCount || 0;
        const setujuRetry = state.setujuRetry || 0;

        console.log(`🔍 Cek status SETUJU (cek ke-${checkCount + 1}/3, retry setuju ke-${setujuRetry})`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Expand Daftar Penandatangan untuk lihat status
            const penandatanganHeader = findByText("h5", "Daftar Penandatangan");
            if (penandatanganHeader) {
                const sectionContainer = penandatanganHeader.closest(
                    "div.MuiGrid-root.MuiGrid-container"
                );
                if (sectionContainer) {
                    const expandBtn = sectionContainer.querySelector(
                        "button.hover\\:opacity-75"
                    );
                    // Klik expand jika belum rotate-180
                    if (expandBtn && !expandBtn.classList.contains("rotate-180")) {
                        expandBtn.click();
                        await sleep(CONFIG.DELAYS.MEDIUM);
                    }
                }
            }

            await sleep(CONFIG.DELAYS.MEDIUM);

            // Cek status di tabel — cari badge/span yang berisi "SETUJU"
            const statusBadges = document.querySelectorAll(
                "span.MuiBadge-badge"
            );
            let isSetuju = false;
            for (const badge of statusBadges) {
                if (badge.textContent.trim() === "SETUJU") {
                    isSetuju = true;
                    break;
                }
            }

            if (isSetuju) {
                console.log("✅ Status sudah SETUJU! Lanjut cek Form TTE...");
                setState({
                    ...state,
                    phase: "DETAIL_CHECK_TTE",
                    checkCount: 0,
                });
                window.location.reload();
                return;
            }

            // Belum SETUJU
            const newCheckCount = checkCount + 1;
            console.warn(`⚠️ Status belum SETUJU (cek ke-${newCheckCount}/3)`);

            if (newCheckCount < 3) {
                // Refresh dan cek lagi
                setState({ ...state, checkCount: newCheckCount });
                console.log("🔄 Refresh untuk cek ulang...");
                window.location.reload();
            } else if (setujuRetry < 1) {
                // Sudah 3x cek, retry fase SETUJU
                console.warn("⚠️ 3x cek gagal, ulangi fase SETUJU...");
                setState({
                    ...state,
                    phase: "DETAIL_SETUJU",
                    setujuRetry: setujuRetry + 1,
                    checkCount: 0,
                });
                window.location.reload();
            } else {
                // Sudah retry SETUJU + 3x cek, skip surat ini
                console.error("❌ Gagal SETUJU setelah retry. Skip surat ini.");
                setState({ ...state, phase: "LIST" });
                window.location.href = CONFIG.LIST_URL;
            }

        } catch (err) {
            console.error(`❌ Error cek status: ${err.message}`);
            setState({ ...state, phase: "LIST" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 🔍 Fase DETAIL_CHECK_TTE — cek apakah Form TTE sudah muncul
    // ===================================================
    async function handleDetailCheckTTE() {
        const state = getState();
        const checkCount = state.checkCount || 0;

        console.log(`🔍 Cek Form TTE (cek ke-${checkCount + 1}/3)`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Cek apakah section Form TTE ada
            const tteHeader = findByText("h5", "Form TTE");
            const tteForm = document.querySelector('form#formTte') ||
                            document.querySelector('input[name="nomor"]');

            if (tteHeader || tteForm) {
                console.log("✅ Form TTE ditemukan! Lanjut isi form...");
                setState({
                    ...state,
                    phase: "DETAIL_TTE",
                    checkCount: 0,
                });
                // Langsung proses, tidak perlu refresh
                await handleDetailTTE();
                return;
            }

            // Belum muncul
            const newCheckCount = checkCount + 1;
            console.warn(`⚠️ Form TTE belum muncul (cek ke-${newCheckCount}/3)`);

            if (newCheckCount < 3) {
                setState({ ...state, checkCount: newCheckCount });
                console.log("🔄 Refresh untuk cek ulang...");
                window.location.reload();
            } else {
                console.error("❌ Form TTE tidak muncul setelah 3x. Skip surat ini.");
                setState({ ...state, phase: "LIST" });
                window.location.href = CONFIG.LIST_URL;
            }

        } catch (err) {
            console.error(`❌ Error cek TTE: ${err.message}`);
            setState({ ...state, phase: "LIST" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 📦 Fase DETAIL_TTE — isi form TTE (step 10-16)
    // ===================================================
    async function handleDetailTTE() {
        const state = getState();
        console.log("📦 Fase TTE — isi form");

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Copy nomor naskah
            const nomorEl = document.querySelector(
                "div.font-medium.flex.items-center.gap-2 p"
            );
            let nomorNaskah = "";
            if (nomorEl) {
                nomorNaskah = nomorEl.textContent.trim();
                console.log(`📋 Nomor naskah: ${nomorNaskah}`);
            } else {
                console.warn("⚠️ Nomor naskah tidak ditemukan");
            }

            // Paste ke input + Ambil Nomor
            const inputNomor = document.querySelector(
                'input[name="nomor"][placeholder*="nomor naskah"]'
            );
            if (inputNomor && nomorNaskah) {
                await setNativeValue(inputNomor, nomorNaskah);
                console.log("✅ Paste nomor naskah");
                await sleep(CONFIG.DELAYS.SHORT);

                const btnAmbil = findByText("button", "Ambil Nomor");
                if (btnAmbil) {
                    btnAmbil.click();
                    console.log("✅ Klik Ambil Nomor");
                    await sleep(CONFIG.DELAYS.LONG);
                }
            }

            // Input Key Phrase
            const inputKey = document.querySelector(
                'input[name="key"][type="password"]'
            );
            if (inputKey) {
                await setNativeValue(inputKey, CONFIG.KEY_PHRASE);
                console.log("✅ Input Key Phrase");
                await sleep(CONFIG.DELAYS.SHORT);
            }

            // Klik Tandatangani
            const btnTTE = document.querySelector(
                'button[type="submit"][form="formTte"]'
            );
            if (btnTTE) {
                btnTTE.click();
                console.log("✅ Klik Tandatangani");
                await sleep(CONFIG.DELAYS.LONG);
            }

            // Konfirmasi SweetAlert
            try {
                const btnConfirm = await waitForElement(
                    "button.swal2-confirm", 10000
                );
                btnConfirm.click();
                console.log("✅ Konfirmasi Ya, Tandatangani");
                await sleep(CONFIG.DELAYS.AFTER_SUBMIT);
            } catch {
                console.warn("⚠️ Dialog konfirmasi tidak muncul");
            }

            // Selesai, balik ke list
            const newTotal = (state.totalProcessed || 0) + 1;
            console.log(`✅ Naskah ke-${newTotal} selesai`);

            setState({
                ...state,
                phase: "LIST",
                totalProcessed: newTotal,
            });

            window.location.href = CONFIG.LIST_URL;

        } catch (err) {
            console.error(`❌ Error fase TTE: ${err.message}`);
            setState({ ...state, phase: "LIST" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 🏁 Finish
    // ===================================================
    function finishAutomation() {
        const state = getState();
        const total = state ? state.totalProcessed || 0 : 0;
        clearState();
        updateButtonState();

        const msg = `✅ Selesai!\n📋 Total naskah diproses: ${total}`;
        console.log(msg);
        alert(msg);
    }

    // ===================================================
    // 🎮 UI Control Button
    // ===================================================
    function updateButtonState() {
        if (!controlBtn) return;
        const running = isRunning();
        controlBtn.textContent = running ? "⏹️ Stop TTE" : "▶️ Auto TTE";
        controlBtn.style.backgroundColor = running ? "#dc3545" : "#17c1e8";
    }

    function createControlButton() {
        controlBtn = document.createElement("button");
        Object.assign(controlBtn.style, {
            position: "fixed",
            top: "63px",
            right: "15px",
            zIndex: "99999",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transition: "background-color 0.2s",
        });

        controlBtn.addEventListener("mouseenter", () => {
            controlBtn.style.backgroundColor = isRunning() ? "#a71d2a" : "#0ea5c9";
        });
        controlBtn.addEventListener("mouseleave", () => {
            updateButtonState();
        });

        controlBtn.addEventListener("click", () => {
            if (isRunning()) {
                // STOP
                clearState();
                updateButtonState();
                console.log("⏹️ Automasi dihentikan");
                alert(`⏹️ Dihentikan.`);
            } else {
                // START
                if (confirm("Mulai proses otomatisasi TTE?\n\nPastikan Anda sudah login.")) {
                    setState({
                        running: true,
                        phase: "LIST",
                        totalProcessed: 0,
                    });
                    updateButtonState();

                    // Jika sudah di halaman list, langsung proses
                    if (window.location.href.includes("statusTT=BELUM") &&
                        !window.location.href.includes("detail")) {
                        handleListPage();
                    } else {
                        window.location.href = CONFIG.LIST_URL;
                    }
                }
            }
        });

        document.body.appendChild(controlBtn);
        updateButtonState();
        console.log("[Tampermonkey] ✅ Tombol Auto TTE ditambahkan");
    }

    // ===================================================
    // 🧭 Router — tentukan aksi berdasarkan state + URL
    // ===================================================
    async function router() {
        createControlButton();

        const state = getState();
        if (!state || !state.running) return; // Tidak ada proses aktif

        const url = window.location.href;
        const isDetailPage = url.includes("/tandatangan-naskah/detail?id=");
        const isListPage = url.includes("statusTT=BELUM") && !isDetailPage;

        console.log(`🧭 Router — phase: ${state.phase}, detail: ${isDetailPage}, list: ${isListPage}`);

        await sleep(CONFIG.DELAYS.MEDIUM); // Tunggu DOM settle

        switch (state.phase) {
            case "LIST":
                if (isListPage) {
                    await handleListPage();
                } else {
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_SETUJU":
                if (isDetailPage) {
                    await handleDetailSetuju();
                } else {
                    if (state.detailUrl) {
                        window.location.href = state.detailUrl;
                    }
                }
                break;

            case "DETAIL_CHECK_STATUS":
                if (isDetailPage) {
                    await handleDetailCheckStatus();
                } else {
                    setState({ ...state, phase: "LIST" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_CHECK_TTE":
                if (isDetailPage) {
                    await handleDetailCheckTTE();
                } else {
                    setState({ ...state, phase: "LIST" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_TTE":
                if (isDetailPage) {
                    await handleDetailTTE();
                } else {
                    setState({ ...state, phase: "LIST" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            default:
                console.warn(`⚠️ Phase tidak dikenal: ${state.phase}`);
                clearState();
                break;
        }
    }

    // ===================================================
    // 🏁 Inisialisasi
    // ===================================================
    if (document.readyState === "complete") {
        setTimeout(router, 2000);
    } else {
        window.addEventListener("load", () => {
            setTimeout(router, 2000);
        });
    }
})();