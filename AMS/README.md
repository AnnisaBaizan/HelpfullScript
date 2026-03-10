# SIAKAD Automation Scripts (AMS)

Tampermonkey UserScripts for automating repetitive administrative tasks in **SIAKAD** (Student Information System) at Politeknik Kesehatan Palembang.

These scripts were built for operators who need to update data for hundreds of students across multiple pages — work that would otherwise be done manually, one click at a time.

---

## Scripts

### `Auto-Click-Edit-on-Web.js`
Automatically clicks the **Edit** button when navigating to a student detail page.

- Waits for the Edit button to appear (10-second timeout)
- Uses `localStorage` to prevent double-processing the same page on refresh
- Target URL: `https://ams.poltekkespalembang.ac.id/siakad/data_mahasiswa/detail/*`

**Use case:** You're looping through student detail pages and want to skip the manual "click Edit" step on every page.

---

### `Auto-Edit-Save-and-Confirm-on-Web.js`
Automatically capitalizes the student name field, saves the form, and clicks the confirmation button.

- Capitalizes each word in the name field (Title Case)
- Clicks **Save**, then clicks the **"Ya, Yakin"** (Yes, Confirm) button
- Target URL: `https://ams.poltekkespalembang.ac.id/siakad/data_mahasiswa/edit/*`

**Use case:** Batch-correcting inconsistent name casing across all student records.

---

### `Auto-Click_Button,Checkbox.js`
Automates the lecturer attendance (presensi dosen) workflow by checking for relevant checkboxes and buttons and clicking them conditionally.

- Checks element presence before clicking (safe, no errors if elements are missing)
- Target URL: generic (`https://.../*`)

**Use case:** Speeds up the repetitive click pattern in the attendance management flow.

---

### `EditForm-in-the-same-page.js`
Bulk-edits SK (Surat Keputusan / Decree) data for approximately 161 students across 4 cohorts (2021–2024).

- Fills the SK number and SK date fields for each student record
- Handles pagination and navigates to the next page automatically
- Tracks progress with `localStorage` so it can resume after a page reload
- Processes records in batches of up to 100 per page

**Use case:** Updating government decree references for all active students in one automated run.

---

## Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Click the Tampermonkey icon → **Create a new script**
3. Delete the default content → paste the script you want
4. Save (Ctrl+S)
5. Navigate to the matching URL — the script will activate automatically

---

## Notes

- These scripts target a specific internal system (`ams.poltekkespalembang.ac.id`). They won't run on other sites unless you update the `@match` URL in the script header.
- Always test on a single record before running in bulk.
- Scripts that modify data (save/confirm) should be monitored on first run.

---

**Author:** [Annisa Baizan](https://github.com/AnnisaBaizan)
