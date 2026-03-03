// ==UserScript==
// @name         Auto Input Kewilayahan Full Flow + Paste Bridge (Fixed Loop)
// @namespace    http://tampermonkey.net/
// @version      22-06-2025
// @description  Otomatisasi input kewilayahan - baris & detail hilang setelah diproses
// @author       Annisa
// @match        https://sakti.kemenkeu.go.id/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// ==/UserScript==

(function () {
    "use strict";

    let totalRowProcessed = 0;
    let totalDetailProcessed = 0;
    let isRunning = false;
    let controlBtn = null;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ===================================================
    // 📤 Kirim ke PasteBridge (bypass CORS)
    // ===================================================
    function sendToPasteBridge(nilai) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:3030/paste",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ nilai: nilai }),
                onload: function (response) {
                    console.log("📤 Terkirim ke PasteBridge:", nilai);
                    resolve(response);
                },
                onerror: function (error) {
                    console.error("❌ PasteBridge error:", error);
                    reject(error);
                },
                ontimeout: function () {
                    console.error("❌ PasteBridge timeout");
                    reject(new Error("Timeout"));
                },
            });
        });
    }

    // ===================================================
    // 📦 Proses SATU detail (Tambah → Isi → Simpan → Keluar)
    // ===================================================
    async function processOneDetail() {
        // Cari baris yang PUNYA p-splitbutton (tombol Detail)
        // Ini yang membedakan baris detail vs baris utama
        const detailRow = document.querySelector("tr.ui-selectable-row:has(p-splitbutton)");

        if (!detailRow) {
            // Fallback: cari langsung p-splitbutton
            const directButton = document.querySelector("p-splitbutton[label='Detail'] button");
            if (!directButton) {
                return false; // Tidak ada detail lagi
            }

            console.group(`📦 Proses detail ke-${totalDetailProcessed + 1}`);
            directButton.click();
            console.log("✅ Klik tombol Detail (direct)");
            await sleep(1000);
        } else {
            console.group(`📦 Proses detail ke-${totalDetailProcessed + 1}`);

            // Klik tombol Detail di dalam row
            const btnDetail = detailRow.querySelector("p-splitbutton button");
            if (!btnDetail) {
                console.warn("⚠️ Tombol Detail tidak ditemukan dalam row");
                console.groupEnd();
                return false;
            }

            btnDetail.click();
            console.log("✅ Klik tombol Detail");
            await sleep(1000);
        }

        // 2. Klik tombol Tambah
        const btnTambah = [...document.querySelectorAll("button")].find(
            (btn) => btn.textContent.trim() === "Tambah"
        );
        if (btnTambah) {
            btnTambah.click();
            console.log("✅ Klik tombol Tambah");
            await sleep(1000);
        }

        // 3. Ambil nilai dari "Nilai COA Detail"
        const labelNilai = [...document.querySelectorAll("label")].find(
            (el) => el.textContent.trim() === "Nilai COA Detail"
        );

        const nilaiText =
            labelNilai?.parentElement?.nextElementSibling
                ?.querySelector("label")
                ?.textContent?.trim() ?? "";

        const nilaiRaw = nilaiText
            .replace(/[^\d.,]/g, "")
            .replace(/\./g, "")
            .replace(",", ".");

        const nilaiFormatted = nilaiRaw
            ? parseFloat(nilaiRaw).toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
              })
            : "";

        console.log(`💰 Nilai: ${nilaiFormatted || "(kosong)"}`);

        // 4. Focus ke input dan kirim ke PasteBridge
        const inputNilai = document.querySelector(
            'input[formcontrolname="txtNilai"]'
        );
        if (inputNilai && nilaiFormatted) {
            inputNilai.click();
            inputNilai.focus();
            await sleep(500);

            try {
                await sendToPasteBridge(nilaiFormatted);
                console.log("✅ Nilai dikirim ke PasteBridge");
            } catch (err) {
                console.error("❌ Gagal kirim ke PasteBridge:", err);
            }
            await sleep(2000);
        }

        // 5. Pilih lokasi PALEMBANG
        const btnLokasi = [...document.querySelectorAll("button")].find((btn) =>
            btn.textContent.includes("PALEMBANG")
        );
        if (btnLokasi) {
            btnLokasi.click();
            console.log('✅ Pilih lokasi "PALEMBANG"');
            await sleep(1000);
        }

        // 6. Klik Simpan
        const btnSimpan = document.querySelector(
            'p-button[label="Simpan"] button, p-button[icon="pi pi-save"] button'
        );
        if (btnSimpan) {
            btnSimpan.click();
            console.log("✅ Klik tombol Simpan");
            await sleep(3000);
        }

        // 7. Klik Keluar
        const btnKeluar = document.querySelector(
            'p-button[label="Keluar"] button, p-button[icon="pi pi-sign-out"] button'
        );
        if (btnKeluar) {
            btnKeluar.click();
            console.log("✅ Klik tombol Keluar");
            await sleep(1500);
        }

        totalDetailProcessed++;
        console.groupEnd();
        return true;
    }

    // ===================================================
    // 📋 Proses SATU baris utama (semua detail di dalamnya)
    // ===================================================
    async function processOneRow() {
        // Ambil baris PERTAMA (index 0) - karena yang selesai akan hilang
        const row = document.querySelector(
            "tr.ui-selectable-row.ng-star-inserted"
        );

        if (!row) {
            return false; // Tidak ada baris lagi
        }

        console.group(`▶️ Proses baris utama ke-${totalRowProcessed + 1}`);

        // 1. Klik baris
        row.click();
        console.log("✅ Klik baris");
        await sleep(2000);

        // 2. Klik radio "Belanja Kewilayahan"
        const radioLabel = [...document.querySelectorAll("label.ui-radiobutton-label")].find(
            (el) => el.textContent.trim() === "Belanja Kewilayahan"
        );
        const radioBox = radioLabel?.previousElementSibling?.querySelector(
            ".ui-radiobutton-box"
        );

        if (radioBox && !radioBox.classList.contains("ui-state-active")) {
            radioBox.click();
            console.log('✅ Klik radio "Belanja Kewilayahan"');
            await sleep(4000);
        }

        // 3. Cek apakah ada detail (row yang punya p-splitbutton)
        const initialDetailCount = document.querySelectorAll(
            "tr.ui-selectable-row:has(p-splitbutton)"
        ).length;

        // Fallback jika :has() tidak support
        let detailCount = initialDetailCount;
        if (detailCount === 0) {
            detailCount = document.querySelectorAll("p-splitbutton[label='Detail']").length;
        }

        if (detailCount === 0) {
            console.warn("⚠️ Tidak ada detail ditemukan, skip baris ini");
            console.groupEnd();
            totalRowProcessed++;
            return true; // Lanjut ke baris berikutnya
        }

        console.log(`📊 Ditemukan ${detailCount} detail`);

        // 4. Loop proses detail - WHILE karena detail hilang setelah diproses
        let detailProcessedInThisRow = 0;
        while (isRunning) {
            const hasDetail = await processOneDetail();
            if (!hasDetail) {
                console.log("✅ Semua detail dalam baris ini selesai");
                break;
            }
            detailProcessedInThisRow++;
            await sleep(500);
        }

        console.log(`📊 Total detail diproses di baris ini: ${detailProcessedInThisRow}`);
        console.groupEnd();

        totalRowProcessed++;
        return isRunning; // Return false jika user stop
    }

    // ===================================================
    // 🚀 Main automation loop
    // ===================================================
    async function runAutomation() {
        console.log("🚀 Memulai automasi...");
        console.log("⏳ Menunggu halaman load...");
        await sleep(3000);

        // Loop baris utama - WHILE karena baris hilang setelah semua detailnya selesai
        while (isRunning) {
            const hasRow = await processOneRow();
            if (!hasRow) {
                // Cek apakah ada halaman berikutnya
                const nextBtn = document.querySelector(
                    "a.ui-paginator-next:not(.ui-state-disabled)"
                );

                if (nextBtn && isRunning) {
                    console.log("📄 Pindah ke halaman berikutnya...");
                    nextBtn.click();
                    await sleep(3000);
                    continue; // Lanjut proses halaman baru
                } else {
                    console.log("✅ Semua baris di semua halaman selesai!");
                    break;
                }
            }
            await sleep(1000);
        }

        // Summary
        console.log("═══════════════════════════════════════");
        console.log(`✅ SELESAI!`);
        console.log(`📋 Total baris diproses: ${totalRowProcessed}`);
        console.log(`📦 Total detail diproses: ${totalDetailProcessed}`);
        console.log("═══════════════════════════════════════");

        if (isRunning) {
            alert(
                `✅ Selesai!\n\n` +
                `📋 Baris diproses: ${totalRowProcessed}\n` +
                `📦 Detail diproses: ${totalDetailProcessed}`
            );
        } else {
            alert(
                `⏹️ Dihentikan oleh user.\n\n` +
                `📋 Baris diproses: ${totalRowProcessed}\n` +
                `📦 Detail diproses: ${totalDetailProcessed}`
            );
        }
    }

    // ===================================================
    // 🎮 UI Control Button
    // ===================================================
    function updateButtonState() {
        if (!controlBtn) return;
        if (isRunning) {
            controlBtn.textContent = "⏹️ Stop Kewilayahan";
            controlBtn.style.backgroundColor = "#dc3545";
        } else {
            controlBtn.textContent = "▶️ Kewilayahan";
            controlBtn.style.backgroundColor = "#28a745";
        }
    }

    function createControlButton() {
        controlBtn = document.createElement("button");
        controlBtn.textContent = "▶️ Kewilayahan";
        Object.assign(controlBtn.style, {
            position: "fixed",
            top: "63px",
            right: "15px",
            zIndex: "99999",
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
                isRunning = false;
                updateButtonState();
                console.log("⏹️ Automasi dihentikan");
            } else {
                if (confirm("Mulai proses otomatisasi kewilayahan?")) {
                    totalRowProcessed = 0;
                    totalDetailProcessed = 0;
                    isRunning = true;
                    updateButtonState();
                    await runAutomation();
                    isRunning = false;
                    updateButtonState();
                }
            }
        });

        document.body.appendChild(controlBtn);
        console.log("[Tampermonkey] ✅ Tombol kontrol ditambahkan");
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