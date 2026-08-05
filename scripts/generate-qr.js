// One-off script: generates the unified shop QR code as a standalone SVG file.
// Run with: node scripts/generate-qr.js
//
// The URL below is Firebase Hosting's default domain for this project
// (always <project-id>.web.app once Hosting is deployed). If a custom
// domain is added later, regenerate with that URL instead.
const fs = require('fs');
const path = require('path');
const qrcode = require('../vendor/qrcode.js');

const TARGET_URL = 'https://belaseshe-orders.web.app/menu.html';

const qr = qrcode(0, 'M');
qr.addData(TARGET_URL);
qr.make();
const svg = qr.createSvgTag({ cellSize: 10, margin: 3, scalable: true });

const outPath = path.join(__dirname, '..', 'assets', 'shop-qr.svg');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, svg, 'utf8');
console.log('Wrote', outPath, 'for', TARGET_URL);
