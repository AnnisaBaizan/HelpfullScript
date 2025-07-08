import os
import pandas as pd
from time import sleep
from playwright.sync_api import sync_playwright

FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfzChSTgnbrgj5goxhiVChZGClZOmQuI4mF32dQqBpfcBYv3Q/viewform"
AUTH_FILE = "auth.json"

def ensure_login(p):
    if not os.path.exists(AUTH_FILE):
        print("🔐 Belum login. Membuka Google Login...")
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://accounts.google.com")
        print("➡️ Silakan login Google secara manual...")
        page.wait_for_url("https://myaccount.google.com/**", timeout=180000)
        context.storage_state(path=AUTH_FILE)
        print("✅ Login berhasil. Sesi disimpan.")
        browser.close()
    else:
        print("✅ Sesi login sudah tersedia.")

def isi_form(context, nama, jabatan, unit, pelatihan, penyelenggara, tanggal, metode, jpl, file_path):
    page = context.new_page()
    page.goto(FORM_URL)

    # Tunggu sampai input teks pertama yang terlihat muncul (bukan input hidden)
    page.wait_for_selector("input[type='text']:not([readonly])", timeout=10000)

    # Nama Pegawai
    page.locator("input[type='text']").nth(0).fill(nama)
    sleep(0.5)

    # Jabatan
    page.locator(f"[role='radio'][aria-label='{jabatan}']").click()
    sleep(0.5)

    # Unit Kerja
    page.locator(f"[role='radio'][aria-label='{unit}']").click()
    sleep(0.5)

    # Nama Pelatihan
    page.locator("input[type='text']").nth(1).fill(pelatihan)
    sleep(0.5)

    # Penyelenggara
    page.locator("input[type='text']").nth(2).fill(penyelenggara)
    sleep(0.5)

    # Tanggal Pelatihan (Google Form urutannya: bulan, hari, tahun)
    dt = pd.to_datetime(tanggal)
    page.wait_for_selector("input[type='date']", timeout=5000)
    page.locator("input[type='date']").fill(dt.strftime("%Y-%d-%m"))
    # dt = pd.to_datetime(tanggal)
    # page.locator("input[type='text']").nth(3).fill(str(dt.month))  # MM
    # page.locator("input[type='text']").nth(4).fill(str(dt.day))    # DD
    # page.locator("input[type='text']").nth(5).fill(str(dt.year))   # YYYY
    sleep(0.5)

    # Metode Pelatihan
    page.locator(f"[role='radio'][aria-label='{metode}']").click()
    sleep(0.5)

    # JPL
    page.locator("input[type='text']").nth(3).fill(str(jpl))
    # page.locator("input[aria-label='Jam Pembelajaran (JPL)']").fill(str(jpl))
    sleep(0.5)

    # Upload Sertifikat
    # page.set_input_files("input[type='file']", file_path)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ File tidak ditemukan: {file_path}")

    # Tambahan: klik tombol "Add file" agar input[type='file'] muncul
    page.get_by_text("Add file").click()
    sleep(3)
    
    # Klik "Browse" di modal upload Google Drive
    # page.get_by_text("Browse").click()
    # page.get_by_role("button", name="Browse").click()
    # sleep(1)

    page.wait_for_selector("input[type='file']", timeout=5000)
    page.set_input_files("input[type='file']", file_path)
    sleep(1)

    # Submit Form
    page.get_by_role("button", name="Submit").click()
    sleep(3)
    page.close()

def main():
    df = pd.read_excel("data_pelatihan.xlsx")

    with sync_playwright() as p:
        ensure_login(p)
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=AUTH_FILE)

        for index, row in df.iterrows():
            print(f"🚀 Mengisi data baris ke-{index + 1} untuk: {row['Nama Pegawai']}")
            try:
                isi_form(
                    context,
                    row["Nama Pegawai"],
                    row["Jabatan"],
                    row["Unit Kerja"],
                    row["Nama Pelatihan"],
                    row["Penyelenggara"],
                    row["Tanggal"],
                    row["Metode"],
                    row["JPL"],
                    row["File Sertifikat"]
                )
            except Exception as e:
                print(f"❌ Gagal mengisi data baris ke-{index + 1}: {e}")

        browser.close()

if __name__ == "__main__":
    main()
