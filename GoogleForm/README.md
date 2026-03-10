# Google Form Autofill

A Python script that automatically fills and submits a Google Form from data in an Excel file. Built for batch entry of employee training records — eliminating the need to fill out the same form manually for each row of data.

---

## How It Works

1. Reads rows from `data_pelatihan.xlsx`
2. Opens the Google Form in a browser (via Playwright)
3. Fills in each field automatically: name, position, work unit, training name, organizer, date, method, and learning hours (JPL)
4. Optionally uploads a certificate file
5. Submits the form
6. Moves on to the next row

---

## Files

| File | Description |
|---|---|
| `autofill.py` | Main script |
| `data_pelatihan.xlsx` | Input data file *(not committed — contains employee data)* |
| `auth.json` | Browser session/authentication file *(not committed — generate your own)* |

---

## Setup

### 1. Install Python (3.10+)

Download from [python.org](https://www.python.org/downloads/).

### 2. Install Dependencies

```bash
pip install playwright pandas openpyxl
playwright install chromium
```

### 3. Prepare Your Authentication File

The script uses a saved browser session to avoid logging in on every run. To generate `auth.json`:

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://accounts.google.com")
    # Log in manually in the browser window
    input("Press Enter after logging in...")
    context.storage_state(path="auth.json")
    browser.close()
```

> **Security note:** `auth.json` contains your Google session cookies. Never commit this file to version control. It is listed in `.gitignore`.

### 4. Prepare Your Excel File

Create `data_pelatihan.xlsx` with columns matching the form fields:

| Column | Description |
|---|---|
| Nama | Employee full name |
| Jabatan | Position/title |
| Unit Kerja | Work unit / department |
| Nama Pelatihan | Training name |
| Penyelenggara | Organizer |
| Tanggal | Training date |
| Metode | Method (online/offline) |
| JPL | Learning hours |

### 5. Update the Form URL

Open `autofill.py` and set the `FORM_URL` variable to your Google Form URL:

```python
FORM_URL = "https://docs.google.com/forms/d/YOUR_FORM_ID/viewform"
```

### 6. Run the Script

```bash
python autofill.py
```

---

## Notes

- The script uses **Playwright** in headed mode (visible browser) by default, so you can monitor what's happening
- If the form layout changes, you may need to update the CSS selectors in `autofill.py`
- For large datasets, add a short delay between submissions to avoid triggering Google's rate limiting

---

## Dependencies

```
playwright
pandas
openpyxl
```

Install all at once:
```bash
pip install playwright pandas openpyxl && playwright install chromium
```

---

**Author:** [Annisa Baizan](https://github.com/AnnisaBaizan)
