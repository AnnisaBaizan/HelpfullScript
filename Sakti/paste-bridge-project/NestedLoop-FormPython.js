// ==UserScript==
// @name         Auto Input Kewilayahan Full Flow + Paste Bridge
// @namespace    http://tampermonkey.net/
// @version      21-06-2025
// @description  Otomatisasi input kewilayahan per baris dan detail, nilai dikirim ke Python untuk Ctrl+V native
// @author       Annisa
// @match        https://sakti.kemenkeu.go.id/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// ==/UserScript==

(function () {
    "use strict";

    let totalRowProcessed = 0;
    let isRunning = false;
    let controlBtn = null;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Fungsi kirim ke PasteBridge (bypass CORS)
    function sendToPasteBridge(nilai) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:3030/paste",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ nilai: nilai }),
                onload: function(response) {
                    console.log("📤 Terkirim ke PasteBridge:", nilai);
                    resolve(response);
                },
                onerror: function(error) {
                    console.error("❌ PasteBridge error:", error);
                    reject(error);
                },
                ontimeout: function() {
                    console.error("❌ PasteBridge timeout");
                    reject(new Error("Timeout"));
                }
            });
        });
    }

    async function processRow(row, index) {
        console.group(`▶️ Mulai proses baris ke-${totalRowProcessed + 1}`);
        try {
            row.click();
            console.log("✅ Klik baris");
            await sleep(2000);

            const radioLabel = [...document.querySelectorAll("label.ui-radiobutton-label")].find(
                (el) => el.textContent.trim() === "Belanja Kewilayahan"
            );
            const radioBox = radioLabel?.previousElementSibling?.querySelector(".ui-radiobutton-box");

            if (radioBox && !radioBox.classList.contains("ui-state-active")) {
                radioBox.click();
                console.log('✅ Klik radio "Belanja Kewilayahan"');
                await sleep(4000);
            }

            const detailRows = [...document.querySelectorAll(
                ".ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted"
            )];

            if (detailRows.length === 0) {
                console.warn("⚠️ Tidak ada detail ditemukan, lanjut ke baris berikutnya");
                console.groupEnd();
                return true;
            }

            for (let i = 0; i < detailRows.length; i++) {
                if (!isRunning) {
                    console.log("⏹️ Dihentikan user");
                    console.groupEnd();
                    return false;
                }

                console.group(`📦 Proses detail ke-${i + 1}`);

                const btnDetail = detailRows[i].querySelector("button");
                if (!btnDetail) {
                    console.groupEnd();
                    continue;
                }

                btnDetail.click();
                console.log("✅ Klik tombol Detail");
                await sleep(1000);

                const btnTambah = [...document.querySelectorAll("button")].find(
                    (btn) => btn.textContent.trim() === "Tambah"
                );
                if (btnTambah) {
                    btnTambah.click();
                    console.log("✅ Klik tombol Tambah");
                    await sleep(1000);
                }

                const labelNilai = [...document.querySelectorAll("label")].find(
                    (el) => el.textContent.trim() === "Nilai COA Detail"
                );

                const nilaiText = labelNilai?.parentElement?.nextElementSibling
                    ?.querySelector("label")?.textContent?.trim() ?? "";

                const nilaiRaw = nilaiText.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
                const nilaiFormatted = nilaiRaw
                    ? parseFloat(nilaiRaw).toLocaleString("id-ID", { minimumFractionDigits: 2 })
                    : "";

                // Kirim ke PasteBridge
                const inputNilai = document.querySelector('input[formcontrolname="txtNilai"]');
                if (inputNilai && nilaiFormatted) {
                    inputNilai.click();
                    inputNilai.focus();
                    await sleep(500);

                    try {
                        await sendToPasteBridge(nilaiFormatted);
                    } catch (err) {
                        console.error("❌ Gagal kirim ke PasteBridge");
                    }
                    await sleep(2000);
                }

                const btnLokasi = [...document.querySelectorAll("button")].find((btn) =>
                    btn.textContent.includes("PALEMBANG")
                );
                if (btnLokasi) {
                    btnLokasi.click();
                    console.log('✅ Pilih lokasi "PALEMBANG"');
                    await sleep(1000);
                }

                // Simpan dulu
                const btnSimpan = document.querySelector('p-button[label="Simpan"] button, p-button[icon="pi pi-save"] button');
                if (btnSimpan) {
                    btnSimpan.click();
                    console.log("✅ Klik tombol Simpan");
                    await sleep(3000);
                }

                // Baru Keluar
                const btnKeluar = document.querySelector('p-button[label="Keluar"] button, p-button[icon="pi pi-sign-out"] button');
                if (btnKeluar) {
                    btnKeluar.click();
                    console.log("✅ Klik tombol Keluar");
                    await sleep(1500);
                }

                console.groupEnd();
            }

            row.scrollIntoView({ behavior: "smooth", block: "center" });
        } catch (err) {
            console.error(`❌ Error proses baris ke-${index + 1}:`, err);
        }
        console.groupEnd();
        return true;
    }

    async function runAutomationWithDelay() {
        console.log("[Tampermonkey] ⏳ Menunggu load baris...");
        await sleep(3000);

        let i = 0;
        while (totalRowProcessed < 100 && isRunning) {
            const rows = [...document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted")];
            if (i >= rows.length) break;

            const ok = await processRow(rows[i], totalRowProcessed);
            if (ok && isRunning) {
                totalRowProcessed++;
                i++;
                await sleep(1000);
            }
        }

        if (!isRunning) {
            console.log("⏹️ Automasi dihentikan oleh user");
            alert(`⏹️ Dihentikan. Total diproses: ${totalRowProcessed} baris.`);
            return;
        }

        const nextBtn = document.querySelector("a.ui-paginator-next:not(.ui-state-disabled)");
        if (nextBtn && totalRowProcessed < 7 && isRunning) {
            nextBtn.click();
            await sleep(3000);
            await runAutomationWithDelay();
        } else {
            console.log("✅ Selesai memproses semua baris.");
            alert(`✅ Selesai memproses ${totalRowProcessed} baris.`);
        }
    }

    // ===================================================
    // 🟢 Tombol kontrol di kanan atas
    // ===================================================
    function updateButtonState() {
        if (!controlBtn) return;
        if (isRunning) {
            controlBtn.textContent = "⏹️ Stop";
            controlBtn.style.backgroundColor = "#dc3545";
        } else {
            controlBtn.textContent = "▶️ Jalankan Auto";
            controlBtn.style.backgroundColor = "#007bff";
        }
    }

    function createControlButton() {
        controlBtn = document.createElement("button");
        controlBtn.textContent = "▶️ Jalankan Auto";
        Object.assign(controlBtn.style, {
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: "99999",
            backgroundColor: "#007bff",
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
            controlBtn.style.backgroundColor = isRunning ? "#a71d2a" : "#0056b3";
        });
        controlBtn.addEventListener("mouseleave", () => {
            controlBtn.style.backgroundColor = isRunning ? "#dc3545" : "#007bff";
        });

        controlBtn.addEventListener("click", async () => {
            if (isRunning) {
                isRunning = false;
                updateButtonState();
                console.log("⏹️ Automasi dihentikan");
            } else {
                if (confirm("Mulai proses otomatisasi kewilayahan?")) {
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
        console.log("[Tampermonkey] ✅ Tombol kontrol ditambahkan");
    }

    // Inisialisasi tombol
    if (document.readyState === "complete") {
        setTimeout(createControlButton, 2000);
    } else {
        window.addEventListener("load", () => {
            setTimeout(createControlButton, 2000);
        });
    }
})();