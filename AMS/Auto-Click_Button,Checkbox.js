// ==UserScript==
// @name         Auto Click_Button,Checkbox
// @namespace    http://tampermonkey.net/
// @version      09-12-2024
// @description  Otomatisasi klik tombol dan Checkbox untuk Presensi Dosen
// @author       Annisa Baizan
// @match        https://.../*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Fungsi delay (untuk menunggu elemen muncul atau memproses transisi)
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Fungsi klik elemen dengan selector
    const clickElement = (selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.click();
            console.log(`✅ Clicked: ${selector}`);
        } else {
            console.warn(`❌ Element not found: ${selector}`);
        }
    };

    // Fungsi utama otomatisasi
    async function automateActions() {
        // Cek apakah ada elemen dengan id="check_..." dan name="check[]"
        const checkElement = document.querySelector('input[id^="check_"][name="check[]"]');

        if (checkElement) {
            console.log("🔍 Elemen dengan id='check_...' ditemukan.");

            // 1. Klik elemen dengan id="check_all"
            clickElement('input#check_all + ins');
            await delay(1000); // Tunggu 1 detik

            // 2. Klik tombol dengan id="presensi_dosen"
            clickElement('button#presensi_dosen');
            await delay(1000); // Tunggu 1 detik

            // 3. Cek apakah ada elemen dengan id="dosen_..." dan name="dosen[]"
            const checkElement1 = document.querySelector('input[id^="dosen_"][name="dosen[]"]');

            if (checkElement1) {
                console.log("🔍 Elemen dengan id='dosen_...' ditemukan.");

                // 3.1 Klik elemen ins.iCheck-helper terkait dosen_all
                clickElement('input#dosen_all + ins');
                await delay(1000); // Tunggu 1 detik
            } else {
                console.warn("❌ Elemen dengan id='dosen_...' tidak ditemukan. Menutup modal...");
                // Jika elemen dosen tidak ada, klik tombol tutup
                clickElement('button.btn.btn-danger[data-dismiss="modal"]');
                await delay(1000); // Tunggu 1 detik
            }

            // 4. Klik tombol dengan id="save_absensi_dosen"
            clickElement('button#save_absensi_dosen');
            await delay(1000); // Tunggu 1 detik

            // 5. Klik tombol dengan 'button.btn.btn-primary[data-bb-handler="confirm"]'
            clickElement('button.btn.btn-primary[data-bb-handler="confirm"]');
            await delay(1000); // Tunggu 1 detik

            // 6. Klik tombol dengan class="btn btn-primary" dan onclick mengandung "goSubmit(this, 'next')"
            clickElement('button.btn.btn-primary[onclick*="goSubmit(this, \'next\')"]');
            await delay(1000); // Tunggu 1 detik

        } else {
            console.warn("❌ Elemen dengan id='check_...' tidak ditemukan.");

            // Jika elemen dengan id="check_..." tidak ada, langsung klik tombol berikutnya
            clickElement('button.btn.btn-primary[onclick*="goSubmit(this, \'next\')"]');
        }
    }

    // Tunggu hingga semua elemen dimuat
    window.addEventListener('load', () => {
        console.log("🚀 Halaman dimuat, memulai proses otomatisasi...");
        automateActions();
    });

})();
