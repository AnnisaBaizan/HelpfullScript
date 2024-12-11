// ==UserScript==
// @name         Otomatisasi Pengisian Data
// @namespace    http://tampermonkey.net/
// @version      09-12-2024
// @description  Mengisi data secara otomatis dan mengklik tombol sesuai kriteria tertentu.
// @author       Annisa Baizan
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function automateInput() {
  'use strict';

  const valueNoSK = "PP.01.01/F.XL/9227/2024";
  const valueTglSK = "05-12-2024";

  const batchRules = [
    { year: 2021, start: 1, end: 41 },
    { year: 2022, start: 2, end: 40 },
    { year: 2023, start: 1, end: 80 },
    { year: 2024, start: 1, end: 80 }
  ];

  let elementCounter = 0;

  async function waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector);
      if (element) return element;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Tunggu 1 detik
    }
    throw new Error(`Element with selector '${selector}' not found after ${timeout}ms`);
  }

  async function processBatch(year, start, end) {
    for (let i = start; i <= end; i++) {
      try {
        const yearSuffix = String(year).slice(2); // Hanya mengambil 2 digit terakhir dari tahun
        const dataId = `20241/PO71242${yearSuffix}${String(i).padStart(3, '0')}`;

        console.log(`Processing dataId: ${dataId}`);

        const editButton = await waitForElement(`button[data-id='${dataId}'][data-type='editip']`);
        editButton.click();

        const inputNoSK = await waitForElement('#u_nosk');
        const inputTglSK = await waitForElement('#u_tglsk');

        inputNoSK.value = valueNoSK;
        inputTglSK.value = valueTglSK;

        const saveButton = await waitForElement(`button[data-id='${dataId}'][data-type='updateip']`);
        saveButton.click();

        elementCounter++;
      } catch (error) {
        console.error(`Error processing dataId ${year}-${i}:`, error);
      }

      // Jika sudah mencapai 100 elemen, klik tombol halaman berikutnya
      if (elementCounter === 100) {
        try {
          const pageButtons = document.querySelectorAll("a[href^='javascript:goPage']");
          if (!pageButtons.length) throw new Error('No page navigation buttons found');

          const nextPageButton = pageButtons[pageButtons.length - 1]; // Ambil tombol terakhir yang dianggap sebagai "Halaman Selanjutnya"
          nextPageButton.click();
        } catch (error) {
          console.error('Error navigating to next page:', error);
        }

        // Reset counter setelah berpindah halaman
        elementCounter = 0;

        // Tunggu sejenak agar halaman selesai dimuat sebelum melanjutkan
        await new Promise(resolve => setTimeout(resolve, 5000)); // Tunggu 5 detik
      }
    }
  }

  (async function processAllBatches() {
    for (const { year, start, end } of batchRules) {
      console.log(`Starting batch for year: ${year}`);
      await processBatch(year, start, end);
    }
    console.log('All batches processed');
  })();
})();
