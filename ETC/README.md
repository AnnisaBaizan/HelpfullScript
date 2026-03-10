# Utilities & Tools (ETC)

Standalone utility tools that run directly in the browser — no installation, no server.

---

## QR Code Generator

Two HTML-based QR code generators with logo embedding support. Open the file in any browser and use immediately.

### `QRcode.html`
Generates a QR code with a **logo embedded at the center** (70% of QR width, with white padding).

- Good for branded QR codes where the logo needs to be clearly visible
- Uses a white padded background behind the logo to protect scanability

### `QRcodeNopadding logo.html`
Same as above but with a **smaller logo** (30% of QR width) and **no padding**.

- Cleaner, more minimal appearance
- Better if the logo has a transparent background

### Features (both)
- Free-text input → QR code generated instantly
- Logo embedded using the HTML5 Canvas API
- Download as PNG with one click
- No server, no dependencies beyond a CDN-hosted QRCode.js library

### Usage
1. Open the `.html` file in your browser
2. Type or paste the URL or text you want to encode
3. The QR code generates automatically
4. Click **Download** to save as PNG

### Customizing the Logo
The logo image is embedded in the HTML file as a local file reference. To use your own logo:
1. Open the HTML file in a text editor
2. Find the `<img>` or canvas logo reference
3. Replace the image source with your own file path or base64-encoded image

---

**Author:** [Annisa Baizan](https://github.com/AnnisaBaizan)
