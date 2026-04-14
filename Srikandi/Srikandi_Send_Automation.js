// ==UserScript==
// @name         Auto Kirim Srikandi - Kirim Naskah
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Otomatisasi pengiriman naskah keluar di Srikandi ANRI
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
        LIST_URL: "https://srikandi.arsip.go.id/pembuatan-naskah-keluar/tandatangan-naskah",
        DELAYS: {
            SHORT: 800,
            MEDIUM: 1500,
            LONG: 3000,
            PAGE_LOAD: 4000,
            AFTER_SUBMIT: 5000,
        },
        STORAGE_KEY: "srikandi_kirim_state",
    };

    let controlBtn = null;

    // ===================================================
    // 💾 State Management
    // ===================================================
    function getState() {
        try {
            const raw = sessionStorage.getItem(CONFIG.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
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
    // 🛠️ Utilities
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
                if (el) { observer.disconnect(); resolve(el); }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`⏰ Timeout: ${selector}`));
            }, timeout);
        });
    }

    function findByText(selector, text) {
        return [...document.querySelectorAll(selector)].find((el) =>
            el.textContent.trim().includes(text)
        );
    }

    function findSvgByTitle(titleText) {
        const titles = document.querySelectorAll("svg title");
        for (const t of titles) {
            if (t.textContent.trim() === titleText) return t.closest("svg");
        }
        return null;
    }

    function simulateClick(el) {
        const opts = { bubbles: true, cancelable: true, view: window };
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));
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

    /** Tunggu SweetAlert selesai proses (loading → success/error/close) */
    async function waitForSwalComplete(timeout = 60000) {
        const startTime = Date.now();
        console.log("⏳ Menunggu proses TTE selesai...");

        while (Date.now() - startTime < timeout) {
            if (!isRunning()) return;

            const swalContainer = document.querySelector(".swal2-container");
            if (!swalContainer) {
                console.log("✅ SweetAlert sudah tertutup — proses selesai");
                return;
            }

            // Cek apakah muncul icon success
            const successIcon = swalContainer.querySelector(".swal2-icon-success");
            if (successIcon) {
                console.log("✅ Proses TTE berhasil (success icon)");
                const okBtn = swalContainer.querySelector("button.swal2-confirm");
                if (okBtn) { okBtn.click(); await sleep(500); }
                return;
            }

            // Cek apakah muncul icon error
            const errorIcon = swalContainer.querySelector(".swal2-icon-error");
            if (errorIcon) {
                console.warn("⚠️ Proses TTE gagal (error icon)");
                const okBtn = swalContainer.querySelector("button.swal2-confirm");
                if (okBtn) { okBtn.click(); await sleep(500); }
                return;
            }

            await sleep(500);
        }

        console.warn("⏰ Timeout menunggu proses SweetAlert selesai");
    }

    /** Tunggu tabel load sampai ada link detail (tanpa batas waktu) */
    function waitForTableData() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                if (!isRunning()) { reject(new Error("Dihentikan")); return; }

                const links = document.querySelectorAll(
                    'a[href*="/tandatangan-naskah/detail?id="]'
                );
                if (links.length > 0) {
                    console.log(`✅ Tabel loaded — ${links.length} naskah`);
                    resolve([...links].map((a) => a.href));
                    return;
                }

                const emptyIndicator =
                    findByText("td", "Tidak ada data") ||
                    findByText("td", "No data") ||
                    findByText("p", "Tidak ada data") ||
                    findByText("div", "Tidak ada data");
                if (emptyIndicator) { resolve([]); return; }

                const elapsed = Math.round((Date.now() - startTime) / 1000);
                console.log(`⏳ Menunggu data tabel... (${elapsed}s)`);
                setTimeout(check, 1000);
            };
            check();
        });
    }

    // ===================================================
    // 📄 Fase LIST_KIRIM — Pilih dropdown BELUM, tunggu tabel, ambil link
    // ===================================================
    async function handleListKirim() {
        const state = getState();
        if (!state || !state.running) return;

        console.log("📄 Fase LIST_KIRIM — tunggu elemen muncul...");

        // Tunggu tabel dasar muncul dulu (langsung, tanpa tunggu full page load)
        try {
            await waitForElement("table", 30000);
        } catch {
            console.warn("⚠️ Tabel belum muncul, reload...");
            window.location.reload();
            return;
        }
        await sleep(CONFIG.DELAYS.SHORT);

        // ── STEP 0: Klik dropdown react-select "Cari Status Penandatangan" ──
        console.log("📌 Memilih filter Status Penandatangan = SETUJU...");

        let penandatanganSelected = false;
        try {
            // Cari placeholder "Cari Status Penandatangan"
            const allPh = document.querySelectorAll(".css-1jqq78o-placeholder");
            let penandatanganPlaceholder = null;
            for (const ph of allPh) {
                if (ph.textContent.trim() === "Cari Status Penandatangan") {
                    penandatanganPlaceholder = ph;
                    break;
                }
            }

            // Cek apakah sudah terpilih SETUJU (placeholder hilang, singleValue muncul)
            if (!penandatanganPlaceholder) {
                const singleValues = document.querySelectorAll("[class*='-singleValue']");
                for (const sv of singleValues) {
                    const badge = sv.querySelector(".MuiBadge-badge");
                    if (badge && badge.textContent.trim() === "SETUJU") {
                        console.log("✅ Filter Penandatangan sudah SETUJU, skip");
                        penandatanganSelected = true;
                        break;
                    }
                }
            }

            if (!penandatanganSelected && penandatanganPlaceholder) {
                const controlEl = penandatanganPlaceholder.closest(".css-13cymwt-control");

                if (controlEl) {
                    simulateClick(controlEl);
                    console.log("✅ Klik dropdown Status Penandatangan");
                    await sleep(CONFIG.DELAYS.MEDIUM);

                    // Tunggu menu muncul (polling 5x)
                    let menuEl = null;
                    for (let i = 0; i < 5; i++) {
                        menuEl = document.querySelector("[class*='-menu']");
                        if (menuEl) break;
                        await sleep(500);
                    }

                    if (menuEl) {
                        const allOptions = menuEl.querySelectorAll("[class*='-option']");
                        for (const opt of allOptions) {
                            if (opt.textContent.trim() === "SETUJU") {
                                simulateClick(opt);
                                console.log('✅ Pilih "SETUJU"');
                                penandatanganSelected = true;
                                break;
                            }
                        }
                    }

                    if (!penandatanganSelected) {
                        console.warn("⚠️ Option SETUJU tidak ditemukan di menu");
                    }
                } else {
                    console.warn("⚠️ Control dropdown Penandatangan tidak ditemukan");
                }
            }
        } catch (err) {
            console.error("❌ Error dropdown Penandatangan:", err.message);
        }

        if (!penandatanganSelected) {
            console.error("❌ Gagal pilih filter SETUJU. Reload & coba lagi...");
            await sleep(CONFIG.DELAYS.LONG);
            window.location.reload();
            return;
        }

        // Tunggu tabel refresh setelah filter Penandatangan
        console.log("⏳ Menunggu tabel refresh setelah filter Penandatangan...");
        await sleep(CONFIG.DELAYS.LONG);

        // ── STEP 1: Klik dropdown react-select "Cari Status Kirim" ──
        console.log("📌 Memilih filter Status Kirim = BELUM...");

        let dropdownSelected = false;
        try {
            // Ada 2 dropdown react-select di halaman:
            // 1. "Cari Status Penandatangan"
            // 2. "Cari Status Kirim"
            // Perlu target yang kedua secara spesifik

            // Cari semua placeholder react-select
            const allPlaceholders = document.querySelectorAll(".css-1jqq78o-placeholder");
            let kirimPlaceholder = null;
            for (const ph of allPlaceholders) {
                if (ph.textContent.trim() === "Cari Status Kirim") {
                    kirimPlaceholder = ph;
                    break;
                }
            }

            // Cek apakah sudah terpilih (placeholder hilang, singleValue muncul)
            // Naik ke container react-select
            const selectContainer = kirimPlaceholder
                ? kirimPlaceholder.closest("[class*='container']")
                : null;

            if (selectContainer) {
                const existingValue = selectContainer.querySelector("[class*='-singleValue']");
                if (existingValue && existingValue.textContent.trim() === "BELUM") {
                    console.log("✅ Filter sudah BELUM, skip dropdown");
                    dropdownSelected = true;
                }
            }

            if (!dropdownSelected && kirimPlaceholder) {
                // Cari control element dari placeholder
                const controlEl = kirimPlaceholder.closest(".css-13cymwt-control");

                if (controlEl) {
                    simulateClick(controlEl);
                    console.log("✅ Klik dropdown Status Kirim");
                    await sleep(CONFIG.DELAYS.MEDIUM);

                    // Tunggu menu muncul (polling 5x)
                    let menuEl = null;
                    for (let i = 0; i < 5; i++) {
                        menuEl = document.querySelector("[class*='-menu']");
                        if (menuEl) break;
                        await sleep(500);
                    }

                    if (menuEl) {
                        const allOptions = menuEl.querySelectorAll("[class*='-option']");
                        for (const opt of allOptions) {
                            if (opt.textContent.trim() === "BELUM") {
                                simulateClick(opt);
                                console.log('✅ Pilih "BELUM"');
                                dropdownSelected = true;
                                break;
                            }
                        }
                    }

                    if (!dropdownSelected) {
                        console.warn("⚠️ Option BELUM tidak ditemukan di menu");
                    }
                } else {
                    console.warn("⚠️ Control dropdown tidak ditemukan");
                }
            } else if (!dropdownSelected) {
                console.warn("⚠️ Placeholder 'Cari Status Kirim' tidak ditemukan");
            }
        } catch (err) {
            console.error("❌ Error dropdown:", err.message);
        }

        if (!dropdownSelected) {
            console.error("❌ Gagal pilih filter BELUM. Reload & coba lagi...");
            await sleep(CONFIG.DELAYS.LONG);
            window.location.reload();
            return;
        }

        // ── STEP 2: Tunggu tabel refresh setelah filter ──
        console.log("⏳ Menunggu tabel refresh setelah filter BELUM...");

        // Tunggu sebentar agar API call terpicu
        await sleep(CONFIG.DELAYS.LONG);

        // Tunggu sampai ada link detail muncul (atau tabel kosong)
        let links;
        try {
            links = await waitForTableData();
        } catch (err) {
            console.error(`❌ ${err.message}`);
            finishAutomation();
            return;
        }

        if (links.length === 0) {
            console.log("✅ Tidak ada naskah lagi untuk dikirim");
            finishAutomation();
            return;
        }

        console.log(`📊 Ditemukan ${links.length} naskah untuk dikirim`);

        // ── STEP 3: Navigasi ke detail baris pertama ──
        setState({
            ...state,
            phase: "DETAIL_CHECK_TTE",
            detailUrl: links[0],
            checkTteCount: 0,
        });

        window.location.href = links[0];
    }

    // ===================================================
    // 🔍 Fase DETAIL_CHECK_TTE — Cek apakah Form TTE masih ada
    // ===================================================
    async function handleDetailCheckTTE() {
        const state = getState();
        const checkCount = state.checkTteCount || 0;

        console.log(`🔍 Cek Form TTE (cek ke-${checkCount + 1}/3)`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            const tteHeader = findByText("h5", "Form TTE");
            const tteForm = document.querySelector('form#formTte') ||
                            document.querySelector('input[name="nomor"]');

            if (tteHeader || tteForm) {
                console.log("⚠️ Form TTE masih ada — isi dulu...");
                setState({
                    ...state,
                    phase: "DETAIL_FILL_TTE",
                    tteRetry: 0,
                    checkTteCount: checkCount,
                });
                // Langsung proses
                await handleFillTTE();
                return;
            }

            // Form TTE tidak ada — lanjut ke KIRIM
            console.log("✅ Form TTE sudah tidak ada — lanjut kirim");
            setState({ ...state, phase: "DETAIL_KIRIM" });
            await handleDetailKirim();

        } catch (err) {
            console.error(`❌ Error cek TTE: ${err.message}`);
            setState({ ...state, phase: "LIST_KIRIM" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 📝 Fase DETAIL_FILL_TTE — Isi Form TTE
    // ===================================================
    async function handleFillTTE() {
        const state = getState();
        const tteRetry = state.tteRetry || 0;

        console.log(`📝 Isi Form TTE (retry ke-${tteRetry})`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Copy nomor naskah
            const nomorEl = document.querySelector(
                "div.font-medium.flex.items-center.gap-2 p"
            );
            let nomorNaskah = nomorEl ? nomorEl.textContent.trim() : "";
            console.log(`📋 Nomor naskah: ${nomorNaskah || "(kosong)"}`);

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
            const inputKey = document.querySelector('input[name="key"][type="password"]');
            if (inputKey) {
                await setNativeValue(inputKey, CONFIG.KEY_PHRASE);
                console.log("✅ Input Key Phrase");
                await sleep(CONFIG.DELAYS.SHORT);
            }

            // Klik Tandatangani
            const btnTTE = document.querySelector('button[type="submit"][form="formTte"]');
            if (btnTTE) {
                btnTTE.click();
                console.log("✅ Klik Tandatangani");
                await sleep(CONFIG.DELAYS.LONG);
            }

            // Konfirmasi SweetAlert
            try {
                const btnConfirm = await waitForElement("button.swal2-confirm", 10000);
                btnConfirm.click();
                console.log("✅ Konfirmasi Ya, Tandatangani");
                // Tunggu proses TTE selesai (polling, bukan fixed delay)
                await waitForSwalComplete(60000);
            } catch {
                console.warn("⚠️ Dialog konfirmasi tidak muncul");
            }

            // Refresh dan cek lagi
            setState({
                ...state,
                phase: "DETAIL_VERIFY_TTE",
                tteRetry: tteRetry,
                verifyCount: 0,
            });

            console.log("🔄 Refresh untuk verifikasi TTE...");
            window.location.reload();

        } catch (err) {
            console.error(`❌ Error isi TTE: ${err.message}`);
            setState({ ...state, phase: "LIST_KIRIM" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // ✅ Fase DETAIL_VERIFY_TTE — Cek apakah TTE berhasil
    // ===================================================
    async function handleVerifyTTE() {
        const state = getState();
        const verifyCount = state.verifyCount || 0;
        const tteRetry = state.tteRetry || 0;

        console.log(`✅ Verifikasi TTE (cek ke-${verifyCount + 1}/3, retry ke-${tteRetry})`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            const tteHeader = findByText("h5", "Form TTE");
            const tteForm = document.querySelector('form#formTte') ||
                            document.querySelector('input[name="nomor"]');
            const formStillExists = !!(tteHeader || tteForm);

            if (!formStillExists) {
                console.log("🎉 TTE berhasil! Lanjut ke proses kirim...");
                setState({ ...state, phase: "DETAIL_KIRIM" });
                await handleDetailKirim();
                return;
            }

            console.warn(`⚠️ Form TTE masih ada (cek ke-${verifyCount + 1}/3)`);
            const newCount = verifyCount + 1;

            if (newCount < 3) {
                setState({ ...state, verifyCount: newCount });
                console.log("🔄 Refresh cek ulang...");
                window.location.reload();
            } else if (tteRetry < 2) {
                // Retry isi TTE (max 3 total: 0, 1, 2)
                console.warn(`⚠️ Retry isi TTE (ke-${tteRetry + 1})...`);
                setState({
                    ...state,
                    phase: "DETAIL_FILL_TTE",
                    tteRetry: tteRetry + 1,
                    verifyCount: 0,
                });
                await handleFillTTE();
            } else {
                console.error("❌ TTE gagal 3x. Skip surat ini.");
                setState({ ...state, phase: "LIST_KIRIM" });
                window.location.href = CONFIG.LIST_URL;
            }

        } catch (err) {
            console.error(`❌ Error verifikasi TTE: ${err.message}`);
            setState({ ...state, phase: "LIST_KIRIM" });
            window.location.href = CONFIG.LIST_URL;
        }
    }

    // ===================================================
    // 📤 Fase DETAIL_KIRIM — Pilih Aksi → Kirim Naskah
    // ===================================================
    async function handleDetailKirim() {
        const state = getState();
        console.log("📤 Fase KIRIM — Pilih Aksi → Kirim Naskah");

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Step 6: Klik "Pilih Aksi"
            const btnPilihAksi = findByText("button", "Pilih Aksi");
            if (btnPilihAksi) {
                simulateClick(btnPilihAksi);
                console.log("✅ Klik Pilih Aksi");
                await sleep(CONFIG.DELAYS.MEDIUM);
            } else {
                throw new Error("Tombol Pilih Aksi tidak ditemukan");
            }

            // Step 7: Klik "Kirim Naskah" di dropdown menu
            await sleep(CONFIG.DELAYS.SHORT);
            const menuItems = document.querySelectorAll(
                'li[role="menuitem"]'
            );
            let kirimItem = null;
            for (const item of menuItems) {
                if (item.textContent.trim().includes("Kirim Naskah")) {
                    kirimItem = item;
                    break;
                }
            }

            if (kirimItem) {
                simulateClick(kirimItem);
                console.log("✅ Klik Kirim Naskah");
                await sleep(CONFIG.DELAYS.LONG);
            } else {
                throw new Error("Menu Kirim Naskah tidak ditemukan");
            }

            // Step 8: Modal "Kirim Naskah" → klik "Ya, Lanjutkan"
            try {
                // Tunggu modal muncul — cari heading "Kirim Naskah"
                await waitForElement("iframe", 10000); // Modal punya iframe preview PDF
                await sleep(CONFIG.DELAYS.MEDIUM);

                const btnLanjutkan = findByText("button", "Ya, Lanjutkan");
                if (btnLanjutkan) {
                    simulateClick(btnLanjutkan);
                    console.log("✅ Klik Ya, Lanjutkan");
                    await sleep(CONFIG.DELAYS.LONG);
                } else {
                    throw new Error("Tombol Ya, Lanjutkan tidak ditemukan");
                }
            } catch (err) {
                throw new Error(`Modal Kirim Naskah gagal: ${err.message}`);
            }

            // Step 9: Modal berubah → klik "Ya, Kirim"
            await sleep(CONFIG.DELAYS.MEDIUM);
            const btnYaKirim = findByText("button", "Ya, Kirim");
            if (btnYaKirim) {
                simulateClick(btnYaKirim);
                console.log("✅ Klik Ya, Kirim");
                await sleep(CONFIG.DELAYS.AFTER_SUBMIT);
            } else {
                throw new Error("Tombol Ya, Kirim tidak ditemukan");
            }

            // Pindah ke fase verifikasi kirim
            setState({
                ...state,
                phase: "DETAIL_VERIFY_KIRIM",
                verifyKirimCount: 0,
            });

            console.log("🔄 Refresh untuk verifikasi kirim...");
            window.location.reload();

        } catch (err) {
            console.error(`❌ Error fase KIRIM: ${err.message}`);
            // Ulangi dari cek TTE
            setState({ ...state, phase: "DETAIL_CHECK_TTE", checkTteCount: 0 });
            window.location.reload();
        }
    }

    // ===================================================
    // ✅ Fase DETAIL_VERIFY_KIRIM — Cek banner "Naskah ini telah dikirim"
    // ===================================================
    async function handleVerifyKirim() {
        const state = getState();
        const verifyCount = state.verifyKirimCount || 0;

        console.log(`✅ Verifikasi Kirim (cek ke-${verifyCount + 1})`);

        try {
            await waitForElement("h5.MuiTypography-root", 20000);
            await sleep(CONFIG.DELAYS.MEDIUM);

            // Cek banner sukses
            const bannerSukses = findByText("h5", "Naskah ini telah dikirim");

            if (bannerSukses) {
                const newTotal = (state.totalProcessed || 0) + 1;
                console.log(`🎉 Naskah ke-${newTotal} berhasil dikirim!`);

                setState({
                    ...state,
                    phase: "LIST_KIRIM",
                    totalProcessed: newTotal,
                });

                window.location.href = CONFIG.LIST_URL;
                return;
            }

            // Banner belum ada — ulangi dari step 5 (cek TTE)
            console.warn("⚠️ Banner kirim belum muncul — ulangi dari cek TTE...");
            setState({
                ...state,
                phase: "DETAIL_CHECK_TTE",
                checkTteCount: 0,
            });
            window.location.reload();

        } catch (err) {
            console.error(`❌ Error verifikasi kirim: ${err.message}`);
            setState({ ...state, phase: "LIST_KIRIM" });
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

        const msg = `✅ Selesai!\n📋 Total naskah dikirim: ${total}`;
        console.log(msg);
        alert(msg);
    }

    // ===================================================
    // 🎮 UI Control Button
    // ===================================================
    function updateButtonState() {
        if (!controlBtn) return;
        const running = isRunning();
        controlBtn.textContent = running ? "⏹️ Stop Kirim" : "📤 Auto Kirim";
        controlBtn.style.backgroundColor = running ? "#dc3545" : "#0d9488";
    }

    function createControlButton() {
        controlBtn = document.createElement("button");
        Object.assign(controlBtn.style, {
            position: "fixed",
            top: "120px",
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
            controlBtn.style.backgroundColor = isRunning() ? "#a71d2a" : "#0f766e";
        });
        controlBtn.addEventListener("mouseleave", () => {
            updateButtonState();
        });

        controlBtn.addEventListener("click", () => {
            if (isRunning()) {
                clearState();
                updateButtonState();
                console.log("⏹️ Automasi kirim dihentikan");
                alert("⏹️ Dihentikan.");
            } else {
                if (confirm("Mulai proses Auto Kirim Naskah?\n\nScript akan mengirim semua naskah yang statusnya BELUM.")) {
                    setState({
                        running: true,
                        phase: "LIST_KIRIM",
                        totalProcessed: 0,
                    });
                    updateButtonState();

                    const url = window.location.href;
                    if (url.includes("/tandatangan-naskah") && !url.includes("detail")) {
                        handleListKirim();
                    } else {
                        window.location.href = CONFIG.LIST_URL;
                    }
                }
            }
        });

        document.body.appendChild(controlBtn);
        updateButtonState();
        console.log("[Tampermonkey] ✅ Tombol Auto Kirim ditambahkan");
    }

    // ===================================================
    // 🧭 Router
    // ===================================================
    async function router() {
        createControlButton();

        const state = getState();
        if (!state || !state.running) return;

        const url = window.location.href;
        const isDetailPage = url.includes("/tandatangan-naskah/detail?id=");
        const isListPage = url.includes("/tandatangan-naskah") && !isDetailPage;

        console.log(`🧭 Router Kirim — phase: ${state.phase}, detail: ${isDetailPage}, list: ${isListPage}`);

        // Tidak perlu sleep — setiap handler sudah waitForElement sendiri

        switch (state.phase) {
            case "LIST_KIRIM":
                if (isListPage) {
                    await handleListKirim();
                } else {
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_CHECK_TTE":
                if (isDetailPage) {
                    await handleDetailCheckTTE();
                } else {
                    setState({ ...state, phase: "LIST_KIRIM" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_FILL_TTE":
                if (isDetailPage) {
                    await handleFillTTE();
                } else {
                    setState({ ...state, phase: "LIST_KIRIM" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_VERIFY_TTE":
                if (isDetailPage) {
                    await handleVerifyTTE();
                } else {
                    setState({ ...state, phase: "LIST_KIRIM" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_KIRIM":
                if (isDetailPage) {
                    await handleDetailKirim();
                } else {
                    setState({ ...state, phase: "LIST_KIRIM" });
                    window.location.href = CONFIG.LIST_URL;
                }
                break;

            case "DETAIL_VERIFY_KIRIM":
                if (isDetailPage) {
                    await handleVerifyKirim();
                } else {
                    setState({ ...state, phase: "LIST_KIRIM" });
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
    // Mulai secepat mungkin — tidak perlu tunggu full page load
    // Setiap handler sudah pakai waitForElement untuk tunggu elemen spesifik
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => router());
    } else {
        router();
    }
})();