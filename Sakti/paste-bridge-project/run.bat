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
start cmd /k ".venv\Scripts\python.exe paste_server.py"
start cmd /k ".venv\Scripts\python.exe paste_bridge.py"

echo [✅] Selesai! Jangan tutup jendela ini.
pause
