// ==UserScript==
// @name         Auto-Edit-Save-and-Confirm-on-Web
// @namespace    http://tampermonkey.net/
// @version      09-12-2024
// @description  Otomatis ubah nama menjadi capitalize dan simpan di halaman edit, termasuk klik tombol konfirmasi "Ya, Yakin"
// @author       Annisa Baizan
// @match        https://ams.poltekkespalembang.ac.id/siakad/data_mahasiswa/edit/*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('📢 Memulai script untuk halaman edit...');

    /**
     * Menunggu elemen sampai tersedia di DOM.
     * @param {string} selector - Selector elemen
     * @param {number} timeout - Waktu tunggu maksimal (default 10 detik)
     */
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let elapsedTime = 0;
            const checkElement = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkElement);
                    resolve(element);
                }
                elapsedTime += 200;
                if (elapsedTime >= timeout) {
                    clearInterval(checkElement);
                    reject(`❌ Element "${selector}" tidak ditemukan setelah ${timeout}ms.`);
                }
            }, 200);
        });
    }

    /**
     * Mengkapitalisasi setiap kata dalam string.
     * @param {string} text - Teks yang akan diubah
     * @returns {string} - Teks dengan kapitalisasi di setiap awal kata
     */
    function capitalizeEachWord(text) {
        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Fungsi utama otomatisasi
     */
    async function autoEditAndSave() {
        try {
            // 1️⃣ Edit Nama
            console.log('📢 Menunggu input Nama...');
            const namaInput = await waitForElement('input#nama');
            console.log('🟢 Input Nama ditemukan dan akan diperbarui.');

            const originalValue = namaInput.value;
            const newValue = capitalizeEachWord(originalValue);

            if (originalValue !== newValue) {
                namaInput.value = newValue;
                namaInput.dispatchEvent(new Event('input', { bubbles: true }));
                namaInput.dispatchEvent(new Event('change', { bubbles: true }));
                console.log(`✍ Nilai input nama telah diubah dari "${originalValue}" menjadi "${newValue}".`);
            }

            // 2️⃣ Klik Tombol Simpan
            console.log('📢 Menunggu tombol Simpan...');
            const saveButton = await waitForElement('button.btn.btn-success.btn-sm[data-type="save"]');
            console.log('🟢 Tombol Simpan ditemukan dan akan diklik.');
            saveButton.click();

            // 3️⃣ Klik Konfirmasi "Ya, Yakin"
            console.log('📢 Menunggu tombol konfirmasi "Ya, Yakin"...');
            const confirmButton = await waitForElement('button.btn.btn-primary[data-bb-handler="confirm"]');
            console.log('🟢 Tombol "Ya, Yakin" ditemukan dan akan diklik.');
            confirmButton.click();

            console.log('✅ Proses selesai: Edit, Simpan, dan Konfirmasi berhasil.');
        } catch (error) {
            console.error('❌ Terjadi kesalahan:', error);
        }
    }

    // Jalankan fungsi utama
    autoEditAndSave();
})();