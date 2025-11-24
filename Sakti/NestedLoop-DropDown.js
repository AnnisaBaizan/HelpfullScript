// ==UserScript==
// @name         Auto Input PDN Full Flow (Manual Button)
// @namespace    http://tampermonkey.net/
// @version      29-10-2025
// @description  Otomatisasi PDN full flow dijalankan manual via tombol di kanan atas layar
// @author       Annisa
// @match        https://sakti.kemenkeu.go.id/*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    let totalRowProcessed = 0;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ===================================================
    // 🌟 Fungsi utama proses baris
    // ===================================================
    async function processRow(row, index) {
        console.group(`▶️ Mulai proses baris ke-${totalRowProcessed + 1}`);
        try {
            row.click();
            console.log("✅ Klik baris");
            await sleep(2000);

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

            // Klik tombol Input/Ubah
            const btnInput = [...document.querySelectorAll("span.ui-button-text.ui-clickable")]
                .find((el) => el.innerText.includes("Input/Ubah"));
            if (!btnInput) {
                console.warn("❌ Tombol Input/Ubah tidak ditemukan");
                return;
            }
            btnInput.click();
            console.log("✅ Klik tombol Input/Ubah");
            await sleep(2000);

            // Pilih "2 - PDN" untuk semua baris detail
            const detailRows = [...document.querySelectorAll(".ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted")];
            for (let i = 0; i < detailRows.length; i++) {
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
            console.error(`❌ Error saat memproses baris ${index + 1}:`, err);
        }
        console.groupEnd();
    }

    // ===================================================
    // 🧠 Jalankan otomatisasi
    // ===================================================
    async function runAutomationWithDelay() {
        console.log("[Tampermonkey] Menunggu 3 detik untuk loading data baris...");
        await sleep(3000);

        let i = 0;
        while (totalRowProcessed < 100) {
            const rows = [...document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted")];
            if (i >= rows.length) break;

            console.log(`🔁 Memproses baris ke-${i + 1}`);
            await processRow(rows[i], i);

            totalRowProcessed++;
            i++;
            await sleep(1000);
        }

        const nextBtn = document.querySelector("a.ui-paginator-next:not(.ui-state-disabled)");
        if (nextBtn && totalRowProcessed < 100) {
            console.log("➡️ Klik halaman berikutnya...");
            nextBtn.click();
            await sleep(3000);
            await runAutomationWithDelay();
        } else {
            console.log("✅ Proses selesai (tidak ada halaman selanjutnya).");
            alert(`✅ Selesai memproses ${totalRowProcessed} baris.`);
        }
    }

    // ===================================================
    // 🟢 Tambahkan tombol di kanan atas layar
    // ===================================================
    function createControlButton() {
        const btn = document.createElement("button");
        btn.textContent = "▶️ Jalankan Auto PDN";
        Object.assign(btn.style, {
            position: "fixed",
            top: "10px",
            right: "10px",
            zIndex: 999999,
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        });

        btn.addEventListener("mouseenter", () => (btn.style.backgroundColor = "#218838"));
        btn.addEventListener("mouseleave", () => (btn.style.backgroundColor = "#28a745"));
        btn.addEventListener("click", async () => {
            if (confirm("Mulai proses otomatisasi PDN?")) {
                totalRowProcessed = 0;
                await runAutomationWithDelay();
            }
        });

        document.body.appendChild(btn);
    }

    window.addEventListener("load", () => {
        setTimeout(createControlButton, 2000);
    });

})();
