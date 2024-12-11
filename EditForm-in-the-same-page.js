// ==UserScript==
// @name         Otomatisasi Pengisian Data
// @namespace    http://tampermonkey.net/
// @version      09-12-2024
// @description  Mengisi data secara otomatis dan mengklik tombol sesuai kriteria tertentu.
// @author       Annisa Baizan
// @icon         https://avatars.githubusercontent.com/u/117755758?s=48&v=4
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  const valueNoSK = "PP.01.01/F.XL/9227/2024";
  const valueTglSK = "05-12-2024";

  const batchRules = [
      { year: 2021, start: 1, end: 41 },
      { year: 2022, start: 2, end: 40 },
      { year: 2023, start: 1, end: 80 },
      { year: 2024, start: 1, end: 80 }
  ];

  const PROCESSED_KEY = 'processed_index';
  let processedIndex = parseInt(localStorage.getItem(PROCESSED_KEY)) || 0;
  let elementCounter = 0;

  async function waitForElement(selector, timeout = 10000) {
      const startTime = Date.now();
      while (Date.now() - startTime < timeout) {
          const element = document.querySelector(selector);
          if (element) return element;
          await new Promise(resolve => setTimeout(resolve, 1000));
      }
      throw new Error(`Element with selector '${selector}' not found after ${timeout}ms`);
  }

  async function processBatch(year, start, end, batchIndex) {
      for (let i = start; i <= end; i++) {
          const globalIndex = batchIndex * 1000 + i; // Membuat indeks unik global

          if (globalIndex <= processedIndex) {
              console.log(`Skipping dataId for ${year}-${i} since it has been processed.`);
              continue; // Lewati jika sudah diproses
          }

          try {
              const yearSuffix = String(year).slice(2);
              const dataId = `20241/PO71242${yearSuffix}${String(i).padStart(3, '0')}`;

              console.log(`Processing dataId: ${dataId}`);

              const editButton = await waitForElement(`button[data-id='${dataId}'][data-type='editip']`);
              editButton.click();

              const inputNoSK = await waitForElement('#u_nosk');
              const inputTglSK = await waitForElement('#u_tglsk');

              inputNoSK.value = valueNoSK;
              inputTglSK.value = valueTglSK;

              // Simpan indeks pemrosesan ke localStorage **sebelum** mengklik tombol simpan
              processedIndex = globalIndex;
              localStorage.setItem(PROCESSED_KEY, processedIndex);
              console.log(`DataId ${dataId} processed and saved with index ${processedIndex}`);

              const saveButton = await waitForElement(`button[data-id='${dataId}'][data-type='updateip']`);
              saveButton.click();

              console.log('Waiting for page to reload after saving...');

              // Tunggu sejenak setelah mengklik simpan untuk memastikan halaman sepenuhnya diperbarui
              await new Promise(resolve => setTimeout(resolve, 10000)); // Tambahkan jeda tambahan 10 detik

              // Pastikan bahwa tombol edit berikutnya tersedia sebelum melanjutkan iterasi
              const nextDataId = `20241/PO71242${yearSuffix}${String(i + 1).padStart(3, '0')}`;
              console.log(`Waiting for next edit button for dataId: ${nextDataId}`);

              await waitForElement(`button[data-id='${nextDataId}'][data-type='editip']`, 15000);
              console.log(`Edit button for next dataId ${nextDataId} found. Continuing to next iteration.`);

              elementCounter++;

          } catch (error) {
              console.error(`Error processing dataId ${year}-${i}:`, error);
          }

          if (elementCounter === 100) {
              try {
                  const pageButtons = document.querySelectorAll("a[href^='javascript:goPage']");
                  if (!pageButtons.length) throw new Error('No page navigation buttons found');

                  const nextPageButton = pageButtons[pageButtons.length - 1];
                  nextPageButton.click();
              } catch (error) {
                  console.error('Error navigating to next page:', error);
              }

              elementCounter = 0;
              await new Promise(resolve => setTimeout(resolve, 5000));
          }
      }
  }

  (async function processAllBatches() {
      for (let batchIndex = 0; batchIndex < batchRules.length; batchIndex++) {
          const { year, start, end } = batchRules[batchIndex];
          console.log(`Starting batch for year: ${year}`);
          await processBatch(year, start, end, batchIndex);
      }
      console.log('All batches processed');
  })();
})();
