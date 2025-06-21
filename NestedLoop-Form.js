// ==UserScript==
// @name         Auto Input Kewilayahan Full Flow
// @namespace    http://tampermonkey.net/
// @version      20-06-2025
// @description  Otomatisasi Kewilayahan full flow per baris dan per detail
// @author       Annisa Baizan
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

  async function waitForDetailRows(timeout = 10000, interval = 300) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const rows = document.querySelectorAll(
        ".ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted"
      );
      if (rows.length > 0) return rows;
      await sleep(interval);
    }
    console.warn(
      "⚠️ Timeout: Tidak menemukan baris detail setelah klik radio button."
    );
    return [];
  }

  async function processRow(row, index) {
    console.group(`▶️ Mulai proses baris ke-${totalRowProcessed + 1}`);
    try {
      row.click();
      console.log("✅ Klik baris");
      await sleep(2000);

      const radioLabel = [
        ...document.querySelectorAll("label.ui-radiobutton-label"),
      ].find((el) => el.textContent.trim() === "Belanja Kewilayahan");
      const radioBox = radioLabel?.previousElementSibling?.querySelector(
        ".ui-radiobutton-box"
      );

      if (radioBox && !radioBox.classList.contains("ui-state-active")) {
        radioBox.click();
        console.log('✅ Klik radio "Belanja Kewilayahan"');
        await sleep(4000);
      } else if (radioBox) {
        console.log('ℹ️ Radio "Belanja Kewilayahan" sudah aktif');
      } else {
        console.warn('❌ Radio "Belanja Kewilayahan" tidak ditemukan');
      }

      let retry = 0;
      let detailRows = [];
      while (retry < 3) {
        detailRows = [
          ...document.querySelectorAll(
            ".ui-table-scrollable-body-table tr.ui-selectable-row.ng-star-inserted"
          ),
        ];
        if (detailRows.length > 0) break;
        console.log("🔄 Menunggu detail muncul...");
        await sleep(2000);
        retry++;
      }

      if (detailRows.length === 0) {
        console.warn(
          "⚠️ Tidak ada detail ditemukan, lanjut ke baris utama berikutnya"
        );
        return true;
      }

      for (let i = 0; i < detailRows.length; i++) {
        console.group(`📦 Proses detail ke-${i + 1}`);
        const btnDetail = detailRows[i].querySelector("button");
        if (!btnDetail) {
          console.warn("❌ Tombol Detail tidak ditemukan di baris detail");
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

        const btnLokasi = [...document.querySelectorAll("button")].find((btn) =>
          btn.textContent.includes("PALEMBANG")
        );
        if (btnLokasi) {
          btnLokasi.click();
          console.log('✅ Pilih lokasi "PALEMBANG"');
          await sleep(1000);
        }

        const labelNilai = [...document.querySelectorAll("label")].find(
          (el) => el.textContent.trim() === "Nilai COA Detail"
        );

        const nilaiText =
          labelNilai?.parentElement?.nextElementSibling
            ?.querySelector("label")
            ?.textContent?.trim() ?? "";

        const cleanNumber = nilaiText.replace(/[^\d]/g, "");
        const nilaiFormatted = cleanNumber
          ? parseInt(cleanNumber).toLocaleString("id-ID") + ",00"
          : "";

        const inputNilai = document.querySelector(
          'input[formcontrolname="txtNilai"]'
        );
        if (inputNilai && nilaiFormatted) {
          inputNilai.value = nilaiFormatted;
          inputNilai.dispatchEvent(new Event("input", { bubbles: true }));
          console.log(`✅ Isi nilai: ${nilaiFormatted}`);
          await sleep(500);
        }

        // const btnSimpan2 = [...document.querySelectorAll("button")].find(
        //   (btn) => btn.textContent.trim() === "Simpan"
        // );
        // if (btnSimpan2) {
        //   btnSimpan2.click();
        //   console.log("✅ Klik tombol Simpan (Detail)");
        //   await sleep(1000);
        // }F

        const btnBatal = [...document.querySelectorAll("button")].find(
          (btn) => btn.textContent.trim() === "Batal"
        );
        if (btnBatal) {
          btnBatal.click();
          console.log("✅ Klik tombol Batal");
          await sleep(1000);
        } else {
          console.warn("❌ Tombol Batal tidak ditemukan");
        }

        const btnKeluar = [
          ...document.querySelectorAll("p-button button"),
        ].find((btn) => btn.textContent.trim() === "Keluar");
        if (btnKeluar) {
          btnKeluar.click();
          console.log("✅ Klik tombol Keluar (p-button)");
          await sleep(1000);
        } else {
          console.warn("❌ Tombol Keluar (p-button) tidak ditemukan");
        }

        console.groupEnd();
      }

      row.scrollIntoView({ behavior: "smooth" });
      console.log("✅ Scroll ke baris");
    } catch (err) {
      console.error(`❌ Error saat memproses baris ${index + 1}:`, err);
    }
    console.groupEnd();
    return true;
  }

  async function runAutomationWithDelay() {
    console.log("[Tampermonkey] Menunggu 3 detik untuk loading data baris...");
    await sleep(3000);

    let i = 0;
    while (totalRowProcessed < 100) {
      const rows = [
        ...document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted"),
      ];
      if (i >= rows.length) break;

      const ok = await processRow(rows[i], totalRowProcessed);
      if (ok) {
        totalRowProcessed++;
        i++;
        await sleep(1000);
      }
    }

    const nextBtn = document.querySelector(
      "a.ui-paginator-next:not(.ui-state-disabled)"
    );
    if (nextBtn && totalRowProcessed < 100) {
      console.log("➡️ Klik halaman berikutnya...");
      nextBtn.click();
      await sleep(3000);
      await runAutomationWithDelay();
    } else {
      console.log(
        "✅ Proses selesai (tidak ada halaman selanjutnya atau sudah 100 baris)."
      );
      alert(`✅ Selesai memproses ${totalRowProcessed} baris.`);
    }
  }

  const observer = new MutationObserver(() => {
    const targetItems = document.querySelectorAll(
      'li[aria-label="BAST Non Kontraktual Jasa"]'
    );
    if (targetItems.length > 0) {
      targetItems.forEach((item) => {
        item.addEventListener(
          "click",
          () => {
            console.log(
              '[Tampermonkey] Opsi "BAST Non Kontraktual Jasa" dipilih → mulai otomatisasi'
            );
            runAutomationWithDelay();
          },
          { once: true }
        );
      });
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
