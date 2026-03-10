import sys
import json
import struct
import pyautogui
import pyperclip
import time

def read_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode('utf-8')
    return json.loads(message)

def send_response(data):
    encoded = json.dumps(data).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('=I', len(encoded)))
    sys.stdout.buffer.write(encoded)
    sys.stdout.buffer.flush()

while True:
    try:
        message = read_message()
        if message.get("command") == "paste":
            value = message.get("value", "")
            pyperclip.copy(value)
            time.sleep(0.2)
            pyautogui.hotkey('ctrl', 'v')
            send_response({ "status": "ok", "pasted": value })
        else:
            send_response({ "status": "unknown_command" })
    except Exception as e:
        send_response({ "status": "error", "message": str(e) })
