// ==UserScript==
// @name         Auto Input Kewilayahan Full Flow + Paste Bridge
// @namespace    http://tampermonkey.net/
// @version      21-06-2025
// @description  Otomatisasi input kewilayahan per baris dan detail, nilai dikirim ke Python untuk Ctrl+V native
// @author       Annisa
// @match        https://sakti.kemenkeu.go.id/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const EXTENSION_ID = "mgdjbnogalhcmeeglgggmojpjplajifp";
  let totalRowProcessed = 0;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
        return true;
      }

      for (let i = 0; i < detailRows.length; i++) {
        console.group(`📦 Proses detail ke-${i + 1}`);
        const btnDetail = detailRows[i].querySelector("button");
        if (!btnDetail) continue;

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

        const nilaiRaw = nilaiText.replace(/[^\u0000-\u007F]/g, "").replace(/\./g, "").replace(",", ".");
        const nilaiFormatted = nilaiRaw
          ? parseFloat(nilaiRaw).toLocaleString("id-ID", { minimumFractionDigits: 2 })
          : "";

        const inputNilai = document.querySelector('input[formcontrolname="txtNilai"]');
        if (inputNilai && nilaiFormatted) {
          inputNilai.focus();
          await sleep(200); // tunggu fokus

          try {
            chrome.runtime.sendMessage(
              EXTENSION_ID,
              {
                type: "PASTE_REQUEST",
                value: nilaiFormatted
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("❌ Gagal kirim ke ekstensi:", chrome.runtime.lastError.message);
                } else {
                  console.log("📤 Nilai dikirim ke ekstensi:", response);
                }
              }
            );
          } catch (e) {
            console.error("❌ Error kirim ke ekstensi:", e);
          }

          await sleep(1500); // tunggu hasil paste dari Python
        }

        const btnLokasi = [...document.querySelectorAll("button")].find((btn) =>
          btn.textContent.includes("PALEMBANG")
        );
        if (btnLokasi) {
          btnLokasi.click();
          console.log('✅ Pilih lokasi "PALEMBANG"');
          await sleep(1000);
        }

        const btnSimpan = [...document.querySelectorAll("p-button button")].find(
          (btn) => btn.textContent.trim() === "Simpan"
        );
        if (btnSimpan) {
          btnSimpan.click();
          console.log("✅ Klik tombol Simpan");
          await sleep(2000);
        }

        const btnKeluar = [...document.querySelectorAll("p-button button")].find(
          (btn) => btn.textContent.trim() === "Keluar"
        );
        if (btnKeluar) {
          btnKeluar.click();
          console.log("✅ Klik tombol Keluar");
          await sleep(1000);
        }

        console.groupEnd();
      }

      row.scrollIntoView({ behavior: "smooth" });
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
    while (totalRowProcessed < 3) {
      const rows = [...document.querySelectorAll("tr.ui-selectable-row.ng-star-inserted")];
      if (i >= rows.length) break;

      const ok = await processRow(rows[i], totalRowProcessed);
      if (ok) {
        totalRowProcessed++;
        i++;
        await sleep(1000);
      }
    }

    const nextBtn = document.querySelector("a.ui-paginator-next:not(.ui-state-disabled)");
    if (nextBtn && totalRowProcessed < 3) {
      nextBtn.click();
      await sleep(3000);
      await runAutomationWithDelay();
    } else {
      console.log("✅ Selesai memproses semua baris.");
      alert(`✅ Selesai memproses ${totalRowProcessed} baris.`);
    }
  }

  const observer = new MutationObserver(() => {
    const targetItems = document.querySelectorAll(
      'li[aria-label="BAST Non Kontraktual Jasa"]'
    );
    if (targetItems.length > 0) {
      targetItems.forEach((item) => {
        item.addEventListener("click", () => {
          console.log("[Tampermonkey] ▶️ Mulai otomatisasi setelah klik menu BAST");
          runAutomationWithDelay();
        }, { once: true });
      });
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
