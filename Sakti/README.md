# SAKTI Automation

Automation tools for **SAKTI** (Sistem Aplikasi Keuangan Tingkat Instansi) — the Indonesian Ministry of Finance's financial management system. These scripts handle hundreds of rows of repetitive data entry that would otherwise be done manually.

---

## Modules

### `NestedLoop-DropDown.js` — PDN Dropdown Automation

A Tampermonkey UserScript that automates the **PDN (Pilihan Data Nontunai)** selection workflow.

**What it does:**
- Sets the table to display 20 items per page
- Selects "2 - PDN" for every row across all pages
- Navigates through pages automatically until all rows are processed
- Tracks and logs deleted/modified rows

**Controls:** A **Start/Stop** button is injected into the page for manual control.

**Installation:**
1. Install [Tampermonkey](https://www.tampermonkey.net/)
2. Create a new script → paste the contents of `NestedLoop-DropDown.js`
3. Save and navigate to the SAKTI page

---

### `paste-bridge-project/` — Belanja Kewilayahan Automation

A two-component system for automating form entries in fields that reject programmatic JavaScript input (Angular/PrimeNG masked fields).

| Component | File | Role |
|---|---|---|
| Tampermonkey Script | `NestedLoop-FormPython.js` | Detects values, sends them to local server |
| Python Server | `PasteBridge.py` | Receives values, pastes them via real `Ctrl+V` |

See [`paste-bridge-project/README.md`](paste-bridge-project/README.md) for full setup instructions.

---

## Folder Structure

```
Sakti/
├── NestedLoop-DropDown.js          ← PDN automation (standalone)
├── paste-bridge-project/           ← Paste Bridge system
│   ├── PasteBridge.py              ← Python server + GUI
│   ├── NestedLoop-FormPython.js    ← Tampermonkey script
│   ├── requirements.txt
│   └── README.md                   ← Full docs for Paste Bridge
└── Failed/                         ← Archived experiments (not for use)
    ├── browser-extension/          ← Chrome Extension approach (abandoned)
    └── native-messaging/           ← Native messaging approach (abandoned)
```

---

## Why Two Separate Approaches?

SAKTI uses Angular with PrimeNG masked input fields that validate input as "trusted" or "untrusted". Directly setting a field's value with JavaScript (`element.value = "..."`) is treated as untrusted and doesn't trigger Angular's validators or number masking.

**`NestedLoop-DropDown.js`** works for dropdown selections — those don't have this restriction.

**Paste Bridge** was built specifically for numeric input fields where the value must appear to come from a real keyboard paste. The Python server simulates an actual `Ctrl+V` keystroke, which Angular treats as trusted input.

The `Failed/` folder contains two earlier approaches that didn't work: a Chrome Extension using native messaging and a direct native messaging setup. Both were abandoned in favor of the Flask server approach.

---

**Author:** [Annisa Baizan](https://github.com/AnnisaBaizan)
