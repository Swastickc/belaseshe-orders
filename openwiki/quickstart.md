---
type: quickstart
title: Quickstart
description: What Belasheshe Orders is, the three pages and who uses each, how to run it locally, and how to deploy it — the routing map for the rest of the wiki.
tags: [quickstart, overview, setup, deploy]
sources:
  - id: openwiki-source-e2d36065640e6201821ff884
    resource: repo://firebase.json
  - id: openwiki-source-4b31673aa3f498ce116f40ed
    resource: repo://print-qr.html
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-4345798e2ca4e093e28ab07d
    resource: repo://scripts/generate-qr.js
  - id: openwiki-source-6eb9d5586a2ac06d53be7dc2
    resource: repo://shared/firebase-config.js
  - id: openwiki-source-334209dcccd68ba2712825b2
    resource: repo://shared/menu-data.js
generated: { by: "opencode", at: "2026-10-03T12:24:34.678Z" }
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T12:24:34.678Z
---

# Quickstart

**Belasheshe Orders** is order management for the Belasheshe cafe: a staff point-of-sale app plus a customer QR menu, built as three no-build static HTML pages backed entirely by Firebase Firestore (project `belaseshe-orders`). There is no framework, no bundler, and no server.

| Page | Who uses it | What it does |
|---|---|---|
| `index.html` | staff (PIN-locked UI) | take orders, edit the menu, track payments, view history |
| `menu.html` | customers, no login | browse the live menu and order for their table |
| `print-qr.html` | staff | renders the printable shop QR code |

The pages share `shared/firebase-config.js` (Firebase project config) and `shared/menu-data.js` (seeded menu, table codes `R1`–`R5` / `D1`–`D2`, zone helpers). They don't talk to each other directly — they meet in Firestore and sync live via `onSnapshot`.

## Run locally

ES modules require HTTP, so serve statically:

```bash
python -m http.server 8080
```

- Staff app: `http://localhost:8080/index.html`
- Customer menu: `http://localhost:8080/menu.html`

## Deploy

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore:rules
```

Hosting is split by audience: the **customer QR link** is deployed and targeted on Firebase Hosting (`https://belaseshe-orders.web.app/menu.html` — `scripts/generate-qr.js`'s `TARGET_URL`), while the **staff app** stays on GitHub Pages, where its PWA install and local data live. There is no deploy workflow in the repo. QR codes must encode the **deployed** URL: either open `print-qr.html` on the live domain, or update `TARGET_URL` in `scripts/generate-qr.js` and rerun it.

## Where to read next

<!-- openwiki: broken internal link [openwiki/architecture/overview.md] file "openwiki/architecture/overview.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Architecture Overview](openwiki/architecture/overview.md) — how the three pages, shared modules, and Firestore fit together
<!-- openwiki: broken internal link [openwiki/architecture/data-model.md] file "openwiki/architecture/data-model.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Firestore Data Model and Security Rules](openwiki/architecture/data-model.md) — collections, order shape, status lifecycle, what the rules enforce and the no-auth trade-off
<!-- openwiki: broken internal link [openwiki/workflows/staff-pos.md] file "openwiki/workflows/staff-pos.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Staff Point-of-Sale App](openwiki/workflows/staff-pos.md) — PIN, screens, live alerts, open tabs, payment
<!-- openwiki: broken internal link [openwiki/workflows/customer-qr-ordering.md] file "openwiki/workflows/customer-qr-ordering.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Customer QR Ordering Flow](openwiki/workflows/customer-qr-ordering.md) — the customer's three-step flow
<!-- openwiki: broken internal link [openwiki/operations/deployment-and-qr.md] file "openwiki/operations/deployment-and-qr.md" does not exist. Fix the href or restore the target, then delete this comment. -->
- [Deployment and Table QR Codes](openwiki/operations/deployment-and-qr.md) — hosting config, QR generation, table codes
