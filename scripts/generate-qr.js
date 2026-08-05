// One-off script: generates the unified shop QR code as a standalone SVG file.
// Run with: node scripts/generate-qr.js
//
// This app is hosted on GitHub Pages (not Firebase Hosting) — update this
// URL if the repo/username or hosting method ever changes.
const fs = require('fs');
const path = require('path');
const qrcode = require('../vendor/qrcode.js');

const TARGET_URL = 'https://swastickc.github.io/belaseshe-orders/menu.html';

const qr = qrcode(0, 'M');
qr.addData(TARGET_URL);
qr.make();
const svg = qr.createSvgTag({ cellSize: 10, margin: 3, scalable: true });

const outPath = path.join(__dirname, '..', 'assets', 'shop-qr.svg');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, svg, 'utf8');
console.log('Wrote', outPath, 'for', TARGET_URL);
