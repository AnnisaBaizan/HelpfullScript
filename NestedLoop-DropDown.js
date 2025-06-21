// ==UserScript==
// @name         Auto Input PDN Full Flow
// @namespace    http://tampermonkey.net/
// @version      20-06-2025
// @description  Otomatisasi PDN full flow per baris dan per detail
// @author       Annisa Baizan
// @match        https://sakti.kemenkeu.go.id/*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let totalRowProcessed = 0;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processRow(row, index) {
        console.group(`▶️ Mulai proses baris ke-${totalRowProcessed + 1}`);
        try {
            row.click();
            console.log('✅ Klik baris');
            await sleep(2000);

            // Aktifkan "Pilih Semua per Halaman" sekali per baris
            const labelPilihSemua = [...document.querySelectorAll('label.ui-chkbox-label')]
                .find(el => el.textContent.trim() === 'Pilih Semua per Halaman');
            const boxPilihSemua = labelPilihSemua?.previousElementSibling?.querySelector('.ui-chkbox-box');

            if (boxPilihSemua && !boxPilihSemua.classList.contains('ui-state-active')) {
                boxPilihSemua.click();
                console.log('✅ Klik "Pilih Semua per Halaman"');
                await sleep(300);
            } else if (boxPilihSemua) {
                console.log('ℹ️ "Pilih Semua per Halaman" sudah aktif');
            } else {
                console.warn('❌ Tidak menemukan checkbox "Pilih Semua per Halaman"');
            }

            const btnInput = [...document.querySelectorAll('span.ui-button-text.ui-clickable')]
                .find(el => el.innerText.includes('Input/Ubah'));
            if (!btnInput) {
                console.warn('❌ Tombol Input/Ubah tidak ditemukan');
                return;
            }
            btnInput.click();
            console.log('✅ Klik tombol Input/Ubah');
            await sleep(2000);

            // Pilih dropdown "2 - PDN" untuk semua baris detail
            const detailRows = [...document.querySelectorAll('.ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted')];
            for (let i = 0; i < detailRows.length; i++) {
                const dropdownLabel = detailRows[i].querySelector('label.ui-dropdown-label');
                if (dropdownLabel) {
                    dropdownLabel.click();
                    console.log(`🔽 Klik dropdown pada baris detail ${i + 1}`);
                    await sleep(300);
                    const opsiPDN = [...document.querySelectorAll('span.ng-star-inserted')]
                        .find(el => el.textContent.trim() === '2 - PDN');
                    if (opsiPDN) {
                        opsiPDN.click();
                        console.log('✅ Pilih "2 - PDN"');
                        await sleep(300);
                    } else {
                        console.warn('❌ Opsi "2 - PDN" tidak ditemukan');
                    }
                }
            }

            const btnBatal = [...document.querySelectorAll('button')]
                .find(btn => btn.textContent.trim() === 'Batal');
            if (btnBatal) {
                btnBatal.click();
                console.log('✅ Klik tombol Batal');
                await sleep(500);
            } else {
                console.warn('❌ Tombol Batal tidak ditemukan');
            }

            /* const btnSimpan = [...document.querySelectorAll('span.ui-button-text.ui-clickable')]
                .find(el => el.innerText.includes('Simpan'));
            if (btnSimpan) {
                btnSimpan.click();
                console.log('✅ Klik tombol Simpan');
                await sleep(1000);
            } else {
                console.warn('❌ Tombol Simpan tidak ditemukan');
            }

            const btnOke = [...document.querySelectorAll('button')]
                .find(btn => btn.textContent.trim() === 'Oke');
            if (btnOke) {
                btnOke.click();
                console.log('✅ Klik tombol Oke');
                await sleep(1000);
            } */

            row.scrollIntoView({ behavior: 'smooth' });
            console.log('✅ Scroll ke baris');
        } catch (err) {
            console.error(`❌ Error saat memproses baris ${index + 1}:`, err);
        }
        console.groupEnd();
    }

    async function runAutomationWithDelay() {
        console.log('[Tampermonkey] Menunggu 3 detik untuk loading data baris...');
        await sleep(3000);

        const rows = [...document.querySelectorAll('tr.ui-selectable-row.ng-star-inserted')];
        console.log(`📄 Halaman saat ini: ${rows.length} baris ditemukan`);

        for (let i = 0; i < rows.length; i++) {
            if (totalRowProcessed >= 3) {
                console.log('🛑 Sudah mencapai 100 baris, proses dihentikan.');
                alert('✅ Selesai: Total 100 baris diproses.');
                return;
            }

            await processRow(rows[i], totalRowProcessed);
            totalRowProcessed++;
        }

        const nextBtn = document.querySelector('a.ui-paginator-next:not(.ui-state-disabled)');
        if (nextBtn && totalRowProcessed < 3) {
            console.log('➡️ Klik halaman berikutnya...');
            nextBtn.click();
            await sleep(3000);
            await runAutomationWithDelay();
        } else {
            console.log('✅ Proses selesai (tidak ada halaman selanjutnya atau sudah 100 baris).');
            alert(`✅ Selesai memproses ${totalRowProcessed} baris.`);
        }
    }

    const observer = new MutationObserver(() => {
        const targetItems = document.querySelectorAll('li[aria-label="BAST Non Kontraktual Jasa"]');
        if (targetItems.length > 0) {
            targetItems.forEach(item => {
                item.addEventListener('click', () => {
                    console.log('[Tampermonkey] Opsi "BAST Non Kontraktual Jasa" dipilih → mulai otomatisasi');
                    runAutomationWithDelay();
                }, { once: true });
            });

            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
