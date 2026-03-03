// ==UserScript==
// @name         Auto Input PDN Full Flow (Manual Button + Stop)
// @namespace    http://tampermonkey.net/
// @version      22-06-2025
// @description  Otomatisasi PDN full flow dengan tombol Start/Stop
// @author       Annisa Baizan
// @match        https://sakti.kemenkeu.go.id/*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let totalRowProcessed = 0;
    let isRunning = false;
    let controlBtn = null;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ===================================================
    // 🌟 Fungsi utama proses baris
    // ===================================================
    async function processRow() {
        // Selalu ambil baris paling atas (index 0)
        const row = document.querySelector("tr.ui-selectable-row.ng-star-inserted");

        if (!row) {
            return false; // Tidak ada baris lagi
        }

        console.group(`▶️ Mulai proses baris ke-${totalRowProcessed + 1}`);
        try {
            row.click();
            console.log("✅ Klik baris");
            await sleep(2000);

            if (!isRunning) return false;

            // Dropdown jumlah baris = 20
            async function setDropdownJumlah() {
                const dropdownWrapper = document.querySelector(".ui-dropdown");
                const label = dropdownWrapper?.querySelector(".ui-dropdown-label");

                if (label && label.textContent.trim() !== "20") {
                    const trigger = dropdownWrapper.querySelector(".ui-dropdown-trigger");
                    if (trigger) {
                        trigger.click();
                        console.log("🔽 Klik tombol dropdown jumlah baris");
                    } else {
                        console.warn("❌ Trigger dropdown tidak ditemukan");
                        return;
                    }

                    await sleep(500);
                    const opsi20 = document.querySelector('li.ui-dropdown-item[aria-label="20"]');
                    if (opsi20) {
                        opsi20.click();
                        console.log("✅ Pilih opsi jumlah baris: 20");
                        await sleep(1000);
                    } else {
                        console.warn("❌ Opsi '20' tidak ditemukan di dropdown");
                    }
                } else {
                    console.log("ℹ️ Jumlah baris sudah 20");
                }
            }

            await setDropdownJumlah();

            if (!isRunning) return false;

            // Klik "Pilih Semua per Halaman"
            const labelPilihSemua = [...document.querySelectorAll("label.ui-chkbox-label")]
                .find((el) => el.textContent.trim() === "Pilih Semua per Halaman");
            const boxPilihSemua = labelPilihSemua?.previousElementSibling?.querySelector(".ui-chkbox-box");

            if (boxPilihSemua && !boxPilihSemua.classList.contains("ui-state-active")) {
                boxPilihSemua.click();
                console.log('✅ Klik "Pilih Semua per Halaman"');
                await sleep(300);
            } else if (boxPilihSemua) {
                console.log('ℹ️ "Pilih Semua per Halaman" sudah aktif');
            } else {
                console.warn('❌ Tidak menemukan checkbox "Pilih Semua per Halaman"');
            }

            if (!isRunning) return false;

            // Klik tombol Input/Ubah
            const btnInput = [...document.querySelectorAll("span.ui-button-text.ui-clickable")]
                .find((el) => el.innerText.includes("Input/Ubah"));
            if (!btnInput) {
                console.warn("❌ Tombol Input/Ubah tidak ditemukan, skip baris ini");
                console.groupEnd();
                totalRowProcessed++;
                return true; // Lanjut ke baris berikutnya
            }
            btnInput.click();
            console.log("✅ Klik tombol Input/Ubah");
            await sleep(2000);

            if (!isRunning) return false;

            // Pilih "2 - PDN" untuk semua baris detail
            const detailRows = [...document.querySelectorAll(".ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted")];
            for (let i = 0; i < detailRows.length; i++) {
                if (!isRunning) return false;

                const dropdownLabel = detailRows[i].querySelector("label.ui-dropdown-label");
                if (dropdownLabel) {
                    dropdownLabel.click();
                    console.log(`🔽 Klik dropdown pada baris detail ${i + 1}`);
                    await sleep(300);

                    const opsiPDN = [...document.querySelectorAll("span.ng-star-inserted")]
                        .find((el) => el.textContent.trim() === "2 - PDN");
                    if (opsiPDN) {
                        opsiPDN.click();
                        console.log('✅ Pilih "2 - PDN"');
                        await sleep(300);
                    } else {
                        console.warn('❌ Opsi "2 - PDN" tidak ditemukan');
                    }
                }
            }

            if (!isRunning) return false;

            // Klik Simpan
            const btnSimpan = [...document.querySelectorAll("span.ui-button-text.ui-clickable")]
                .find((el) => el.innerText.includes("Simpan"));
            if (btnSimpan) {
                btnSimpan.click();
                console.log("✅ Klik tombol Simpan");
                await sleep(1000);
            } else {
                console.warn("❌ Tombol Simpan tidak ditemukan");
            }

            if (!isRunning) return false;

            // Klik Oke
            const btnOke = [...document.querySelectorAll("button")]
                .find((btn) => btn.textContent.trim() === "Oke");
            if (btnOke) {
                btnOke.click();
                console.log("✅ Klik tombol Oke");
                await sleep(1000);
            }

            row.scrollIntoView({ behavior: "smooth" });
            console.log("✅ Scroll ke baris");

        } catch (err) {
            console.error(`❌ Error saat memproses baris:`, err);
        }

        console.groupEnd();
        totalRowProcessed++;
        return true;
    }

    // ===================================================
    // 🧠 Jalankan otomatisasi
    // ===================================================
    async function runAutomationWithDelay() {
        console.log("[Tampermonkey] ⏳ Menunggu 3 detik untuk loading data baris...");
        await sleep(3000);

        // Loop WHILE - selalu ambil baris pertama, tidak pakai index i
        while (isRunning) {
            const rowsBefore = document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted").length;

            if (rowsBefore === 0) {
                console.log("📭 Tidak ada baris tersisa di halaman ini");
                break;
            }

            console.log(`🔁 Memproses baris paling atas (sisa: ${rowsBefore} baris)`);
            const ok = await processRow();

            if (!ok || !isRunning) {
                console.log("⏹️ Proses dihentikan");
                break;
            }

            await sleep(1000);

            // Safety check: kalau jumlah baris tidak berkurang, hentikan agar tidak infinite loop
            const rowsAfter = document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted").length;
            if (rowsAfter >= rowsBefore) {
                console.warn("⚠️ Baris tidak berkurang setelah diproses, automasi dihentikan untuk mencegah infinite loop");
                break;
            }
        }

        if (!isRunning) {
            console.log("⏹️ Automasi dihentikan oleh user");
            alert(`⏹️ Dihentikan.\n\n📊 Total baris diproses: ${totalRowProcessed}`);
            return;
        }

        // Cek halaman berikutnya
        const nextBtn = document.querySelector("a.ui-paginator-next:not(.ui-state-disabled)");
        if (nextBtn && isRunning) {
            console.log("➡️ Klik halaman berikutnya...");
            nextBtn.click();
            await sleep(3000);
            await runAutomationWithDelay();
        } else {
            console.log("✅ Proses selesai.");
            alert(`✅ Selesai!\n\n📊 Total baris diproses: ${totalRowProcessed}`);
        }
    }

    // ===================================================
    // 🎮 Update tampilan tombol
    // ===================================================
    function updateButtonState() {
        if (!controlBtn) return;
        if (isRunning) {
            controlBtn.textContent = "⏹️ Stop PDN";
            controlBtn.style.backgroundColor = "#dc3545";
        } else {
            controlBtn.textContent = "▶️ PDN";
            controlBtn.style.backgroundColor = "#28a745";
        }
    }

    // ===================================================
    // 🟢 Tambahkan tombol di kanan atas layar
    // ===================================================
    function createControlButton() {
        controlBtn = document.createElement("button");
        controlBtn.textContent = "▶️ PDN";
        Object.assign(controlBtn.style, {
            position: "fixed",
            top: "63px",
            right: "170px",
            zIndex: "999999",
            backgroundColor: "#28a745",
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
            controlBtn.style.backgroundColor = isRunning ? "#a71d2a" : "#1e7e34";
        });
        controlBtn.addEventListener("mouseleave", () => {
            controlBtn.style.backgroundColor = isRunning ? "#dc3545" : "#28a745";
        });

        controlBtn.addEventListener("click", async () => {
            if (isRunning) {
                // STOP
                isRunning = false;
                updateButtonState();
                console.log("⏹️ Automasi PDN dihentikan");
            } else {
                // START
                if (confirm("Mulai proses otomatisasi PDN?")) {
                    totalRowProcessed = 0;
                    isRunning = true;
                    updateButtonState();
                    await runAutomationWithDelay();
                    isRunning = false;
                    updateButtonState();
                }
            }
        });

        document.body.appendChild(controlBtn);
        console.log("[Tampermonkey] ✅ Tombol kontrol PDN ditambahkan");
    }

    // ===================================================
    // 🏁 Inisialisasi
    // ===================================================
    if (document.readyState === "complete") {
        setTimeout(createControlButton, 2000);
    } else {
        window.addEventListener("load", () => {
            setTimeout(createControlButton, 2000);
        });
    }
})();