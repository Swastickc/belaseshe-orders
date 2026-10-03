---
type: operations
title: Deployment and Table QR Codes
description: How the app is hosted and deployed (Firebase Hosting config plus a GitHub Pages QR URL), how the printable shop QR is generated, and the R1–R5 / D1–D2 table code scheme.
tags: [deployment, firebase-hosting, github-pages, qr, print, tables]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T11:03:11.929Z
sources:
  - id: openwiki-source-e2c6fa1c0ea8d60783512901
    resource: repo://.firebaserc
  - id: openwiki-source-6d4b4e707b8d60b6ccfa3425
    resource: repo://.github/workflows/openwiki-update.yml
  - id: openwiki-source-e2d36065640e6201821ff884
    resource: repo://firebase.json
  - id: openwiki-source-be4b3c3d5fa55f597b20d352
    resource: repo://menu.html
  - id: openwiki-source-4b31673aa3f498ce116f40ed
    resource: repo://print-qr.html
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-4345798e2ca4e093e28ab07d
    resource: repo://scripts/generate-qr.js
  - id: openwiki-source-334209dcccd68ba2712825b2
    resource: repo://shared/menu-data.js
generated: { by: "opencode", at: "2026-10-03T11:03:11.929Z" }
---

# Deployment and Table QR Codes

## Hosting configuration

`firebase.json` serves the repo root as Firebase Hosting's public directory (ignoring config files, rules, indexes, README and dotfiles) and sets one-hour `Cache-Control` on JS/CSS. The same file wires Firestore: `firestore.rules` and `firestore.indexes.json` deploy together with hosting. `.firebaserc` pins the default project alias to `belaseshe-orders`.

The canonical deploy command from the README is:

```bash
firebase deploy --only hosting,firestore:rules
```

**Deployment reality has drifted in two directions** — both are in the repo and worth reconciling:

- The README documents Firebase Hosting (`https://belaseshe-orders.web.app`).
- `scripts/generate-qr.js` states the app is actually hosted on **GitHub Pages** and hardcodes `https://swastickc.github.io/belaseshe-orders/menu.html` as the QR target ("update this URL if the repo/username or hosting method ever changes"). There is no GitHub Actions deploy workflow in the repo — the only workflow is the scheduled OpenWiki update — so Pages hosting is managed outside the repo.

If you deploy to Firebase, update the `TARGET_URL` in `scripts/generate-qr.js` or use `print-qr.html` opened on the live domain.

## The shop QR code

v2 uses **one unified QR for the whole shop**, not one per table: `print-qr.html` encodes `<origin>/menu.html` (no table parameter), and the customer is asked which table they're sitting at only when they actually place an order. The page computes the URL at runtime from `location.origin`, so it must be opened on the deployed domain — opening it locally prints a QR pointing at `localhost`. It renders one branded card (Belasheshe / বেলাশেষে, QR, scan hint, resolved URL) and uses the browser's print dialog; `@media print` strips the toolbar and headings.

For the committed static asset, `scripts/generate-qr.js` (run with `node scripts/generate-qr.js`) writes `assets/shop-qr.svg` using the vendored `vendor/qrcode.js` at error-correction level M.

## Table codes

<!-- openwiki: broken internal link [/openwiki/architecture/data-model.md] link "/openwiki/architecture/data-model.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Tables live in `shared/menu-data.js` as `TABLES = { rooftop: ['R1'..'R5'], downstairs: ['D1'..'D2'] }`. Zone prefixes are deliberate: they keep "Table 1" from existing on both floors. Once a customer picks a table, `menu.html` writes it into the URL as `?t=<table>` via `history.replaceState`, so a refresh or a shared link keeps the table context; stray `?t=` params from old bookmarked per-table links are tolerated rather than trusted. `zoneOfTable`/`isValidTable` guard the value, and the Firestore rules re-validate `zone`/`table` on create (see [Firestore Data Model](/openwiki/architecture/data-model.md)).

<!-- openwiki: broken internal link [/openwiki/quickstart.md] link "/openwiki/quickstart.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/customer-qr-ordering.md] link "/openwiki/workflows/customer-qr-ordering.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Related: [Quickstart](/openwiki/quickstart.md), [Customer QR Ordering](/openwiki/workflows/customer-qr-ordering.md).
