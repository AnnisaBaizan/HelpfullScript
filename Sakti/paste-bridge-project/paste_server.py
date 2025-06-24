from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 💡 Izinkan semua origin, termasuk dari https://sakti.kemenkeu.go.id

@app.route("/paste", methods=["POST"])
def paste():
    data = request.get_json()
    nilai = data.get("nilai", "")
    with open("nilai.txt", "w", encoding="utf-8") as f:
        f.write(nilai)
    return {"status": "ok", "received": nilai}, 200

if __name__ == "__main__":
    app.run(port=3030)
