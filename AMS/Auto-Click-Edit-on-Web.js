// ==UserScript==
// @name         Auto-Click-Edit-on-Web
// @namespace    http://tampermonkey.net/
// @version      09-12-2024
// @description  Klik otomatis tombol Edit di halaman detail Web
// @author       Annisa Baizan
// @match        https://ams.poltekkespalembang.ac.id/siakad/data_mahasiswa/detail/*
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Ambil ID unik dari URL
    const currentId = window.location.pathname.split('/').pop(); // ID adalah bagian terakhir dari URL
    const storedId = localStorage.getItem('lastProcessedDetailId'); // Ambil ID yang terakhir diproses dari localStorage

    // Jika ID yang sama sudah diproses pada halaman detail yang sama, hentikan skrip
    if (storedId === currentId) {
        console.log('📢 Halaman detail ini sudah diproses sebelumnya. Menghentikan eksekusi skrip.');
        return; // Menghentikan eksekusi skrip pada halaman yang sama
    }

    console.log('📢 Memulai script untuk halaman detail...');

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
                    reject(❌ Element "${selector}" tidak ditemukan setelah ${timeout}ms.);
                }
            }, 200);
        });
    }

    async function autoClickEdit() {
        try {
            console.log('📢 Menunggu tombol Edit...');
            const editButton = await waitForElement('button.btn.btn-warning.btn-sm[data-type="edit"]');
            console.log('🟢 Tombol Edit ditemukan dan akan diklik.');
            editButton.click();

            // Tandai bahwa halaman detail telah diproses
            localStorage.setItem('lastProcessedDetailId', currentId); // Menyimpan ID yang telah diproses
            console.log(📢 ID halaman detail ${currentId} telah diproses dan disimpan.);
        } catch (error) {
            console.error('❌ Terjadi kesalahan:', error);
        }
    }

    // Jalankan autoClickEdit jika belum pernah diproses
    autoClickEdit();
})();