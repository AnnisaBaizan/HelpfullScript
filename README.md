# HelpfullScript

A collection of automation scripts and tools built to eliminate repetitive manual work in real institutional environments — government financial systems, academic information systems, Google Workspace, and internal web apps.

All tools here were built to solve actual problems, not for practice.

**Repository:** [github.com/AnnisaBaizan/HelpfullScript](https://github.com/AnnisaBaizan/HelpfullScript)

---

## Projects

### 1. SAKTI Automation — [`Sakti/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/Sakti)

Automation tools for **SAKTI** (Sistem Aplikasi Keuangan Tingkat Instansi), the Indonesian Ministry of Finance's web-based financial management system.

The core challenge: SAKTI uses Angular with PrimeNG masked input fields that reject programmatic JavaScript input. Direct DOM manipulation (`element.value = "..."`) is treated as "untrusted" and bypasses Angular's validators entirely.

**Two tools were built:**

**`NestedLoop-DropDown.js`** — Tampermonkey UserScript that automates PDN (Pilihan Data Nontunai) dropdown selection across hundreds of rows and pages automatically.

**[PasteBridge](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/Sakti/paste-bridge-project)** — A two-component system: a Tampermonkey script detects values and sends them to a local Python server via HTTP, and the Python server pastes them using real `Ctrl+V` simulation (pyautogui), which Angular treats as trusted keyboard input.

- Cross-platform: Windows, macOS, Linux
- Ships as a standalone `.exe` (no Python install needed)
- GUI built with customtkinter

**Download:** [PasteBridge.exe — Releases](https://github.com/AnnisaBaizan/HelpfullScript/releases/tag/v1.0.0)

**Stack:** Python · Flask · pyautogui · pyperclip · customtkinter · Tampermonkey (JavaScript)

---

### 2. SIAKAD Automation Scripts (AMS) — [`AMS/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/AMS)

Tampermonkey UserScripts for automating batch data operations in **SIAKAD** (Student Information System) at Politeknik Kesehatan Palembang.

Built for operators managing hundreds of student records — tasks that previously required clicking through every page manually.

| Script | What It Does |
|---|---|
| `Auto-Click-Edit-on-Web.js` | Auto-clicks the Edit button on student detail pages |
| `Auto-Edit-Save-and-Confirm-on-Web.js` | Capitalizes names, saves form, confirms dialog |
| `Auto-Click-Button-Checkbox.js` | Automates the lecturer attendance click workflow |
| `EditForm-in-the-same-page.js` | Bulk-fills SK (government decree) data for ~161 students across 4 cohorts, handles pagination, resumes on reload |

**Stack:** JavaScript · Tampermonkey · localStorage (for pagination state)

---

### 3. Google Form Autofill — [`GoogleForm/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/GoogleForm)

Python script that reads employee training data from an Excel file and automatically fills and submits a Google Form for each row — using Playwright for browser automation with a saved session.

Eliminates manual re-entry of the same form for large batches of training records.

**Stack:** Python · Playwright · pandas · openpyxl

---

### 4. Google Sheets PDF Exporter — [`GoogleSheet/google-sheets-pdf-exporter/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/GoogleSheet/google-sheets-pdf-exporter)

Google Apps Script that adds a custom **"PRINT TOOLS"** menu to a Google Sheet. One click exports a specific column range (A–M) to a formatted PDF, with the filename auto-generated from a cell value.

Features:
- Temporarily hides columns outside the print range before export
- Auto-names the file from cell F20
- User-friendly download dialog with status feedback

**Stack:** Google Apps Script · Google Sheets API

---

### 5. BMN Repair Request System — [`gworkspace-webapps/surat-usulan-bmn/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/gworkspace-webapps/surat-usulan-bmn)

A zero-infrastructure web app for submitting asset repair requests (Surat Usulan Perbaikan BMN) at Politeknik Kesehatan Palembang's facilities department.

Staff fill out a form on a GitHub Pages-hosted HTML page. On submit:
- Data is saved to Google Sheets (auto-numbered letter reference)
- Up to 4 photos are uploaded to Google Drive
- An HTML email notification is sent to the facilities team
- A WhatsApp notification is sent (supports CallMeBot, Fonnte, or Meta WA Cloud API)
- A print-ready letter (2 × F4 pages) is generated in the browser

Runs entirely on free services: GitHub Pages + Google Apps Script + Google Drive/Sheets.

**Stack:** HTML · CSS · JavaScript · Google Apps Script · Google Sheets · Google Drive · WhatsApp API

---

### 6. QR Code Generator — [`ETC/`](https://github.com/AnnisaBaizan/HelpfullScript/tree/main/ETC)

Two standalone HTML tools for generating QR codes with an embedded logo. No server, no install — open in browser and use.

- `QRcode.html` — Large logo (70% width) with white padding
- `QRcodeNopadding-logo.html` — Smaller logo (30% width), no padding, cleaner look

Both generate instantly from text input and export as PNG.

**Stack:** HTML · Canvas API · QRCode.js (CDN)

---

## Repository Structure

```
HelpfullScript/
├── AMS/                          ← SIAKAD automation (Tampermonkey)
├── ETC/                          ← QR code generator tools
├── GoogleForm/                   ← Google Form autofill (Python + Playwright)
├── GoogleSheet/
│   └── google-sheets-pdf-exporter/  ← PDF export via Apps Script
├── Sakti/
│   ├── NestedLoop-DropDown.js    ← PDN dropdown automation
│   ├── paste-bridge-project/     ← PasteBridge (Python server + Tampermonkey)
│   └── Experiments/              ← Archived approaches (Chrome extension, native messaging)
└── gworkspace-webapps/
    └── surat-usulan-bmn/         ← BMN repair request web app
```

---

## Tech Used Across This Repo

| Category | Technologies |
|---|---|
| Browser Automation | Tampermonkey, Playwright, pyautogui |
| Backend | Python, Flask, Google Apps Script |
| Frontend | HTML, CSS, JavaScript |
| Data | pandas, openpyxl, Google Sheets |
| Desktop | customtkinter, PyInstaller |
| Notifications | Gmail API (GAS), WhatsApp (CallMeBot / Fonnte / Meta Cloud API) |

---

## Author

**Annisa Baizan** — [github.com/AnnisaBaizan](https://github.com/AnnisaBaizan)
