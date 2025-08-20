@echo off
cd /d %~dp0

echo [🔍] Mengecek Python...
where python >nul 2>&1
if errorlevel 1 (
    echo ❌ Python tidak ditemukan di PATH.
    echo Silakan install dari https://www.python.org/downloads/windows/
    pause
    exit /b
)

echo [🔧] Membuat/aktifkan environment .venv...
if not exist .venv (
    python -m venv .venv
)

call .venv\Scripts\activate.bat

echo [📦] Install requirements di virtualenv...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo [🚀] Menjalankan server bridge dan auto paste...
REM DEBUG MODE (pakai console):
REM start cmd /k ".venv\Scripts\python.exe paste_server.py"
REM start cmd /k ".venv\Scripts\python.exe paste_bridge.py"

REM PRODUCTION MODE (silent, tanpa jendela):
start "" .venv\Scripts\pythonw.exe paste_server.py
start "" .venv\Scripts\pythonw.exe paste_bridge.py

echo [✅] Selesai! Jangan tutup jendela ini.
pause
