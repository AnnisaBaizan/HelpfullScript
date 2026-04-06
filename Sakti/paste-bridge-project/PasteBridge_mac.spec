# -*- mode: python ; coding: utf-8 -*-

a = Analysis(
    ['PasteBridge.py'],
    pathex=[],
    binaries=[],
    datas=[('paste_bridge_icon.icns', '.')],
    hiddenimports=[
        'tkinter',
        'tkinter.ttk',
        'tkinter.messagebox',
        '_tkinter',
        'customtkinter',
        'flask',
        'pyperclip',
        'pyautogui',
        'pyscreeze',
        'PIL',
        'pkg_resources.py2_warn',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='PasteBridge',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    argv_emulation=True,
    target_arch='arm64',
    codesign_identity=None,
    entitlements_file=None,
    icon='paste_bridge_icon.icns',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='PasteBridge',
)

app = BUNDLE(
    coll,
    name='PasteBridge.app',
    icon='paste_bridge_icon.icns',
    bundle_identifier='com.pastebridge.app',
    info_plist={
        'CFBundleName': 'PasteBridge',
        'CFBundleDisplayName': 'PasteBridge',
        'CFBundleVersion': '1.0.0',
        'CFBundleShortVersionString': '1.0.0',
        'NSHighResolutionCapable': True,
        'NSAppleEventsUsageDescription': 'PasteBridge needs Accessibility access to paste values.',
        'NSAccessibilityUsageDescription': 'PasteBridge needs Accessibility access to paste values.',
        'LSUIElement': False,
    },
)
