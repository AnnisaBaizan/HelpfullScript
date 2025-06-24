@echo off
cd /d %~dp0

echo [🔧] Membuat/aktifkan environment .venv...

IF NOT EXIST .venv (
    python -m venv .venv
)

call .venv\Scripts\activate.bat

echo [📦] Install requirements di virtualenv...
.\.venv\Scripts\pip.exe install -r requirements.txt

echo [🚀] Menjalankan server bridge dan auto paste...
REM Gunakan baris ini untuk DEBUGGING (tampilkan console):
REM start cmd /k ".venv\Scripts\python.exe paste_server.py"
REM start cmd /k ".venv\Scripts\python.exe paste_bridge.py"

REM Gunakan baris ini untuk PRODUCTION (silent, tanpa jendela):
start "" .venv\Scripts\pythonw.exe paste_server.py
start "" .venv\Scripts\pythonw.exe paste_bridge.py

echo [✅] Selesai! Jangan tutup jendela ini.
pause