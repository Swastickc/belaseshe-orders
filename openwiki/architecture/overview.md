---
type: architecture-overview
title: Architecture Overview
description: A no-build static frontend — three standalone HTML pages sharing ES modules, with Firestore as the only backend and real-time sync through onSnapshot.
tags: [architecture, firebase, firestore, static-site, es-modules, realtime]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T11:03:11.929Z
sources:
  - id: openwiki-source-e2d36065640e6201821ff884
    resource: repo://firebase.json
  - id: openwiki-source-f8d10828394c4129061d5b0e
    resource: repo://index.html
  - id: openwiki-source-be4b3c3d5fa55f597b20d352
    resource: repo://menu.html
  - id: openwiki-source-334209dcccd68ba2712825b2
    resource: repo://shared/menu-data.js
generated: { by: "opencode", at: "2026-10-03T11:03:11.929Z" }
---

# Architecture Overview

<!-- openwiki: broken internal link [/openwiki/operations/deployment-and-qr.md] link "/openwiki/operations/deployment-and-qr.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Belasheshe Orders is a no-build, no-framework static web app. There is no bundler, no package.json for the app itself, and no server-side code: each HTML page is self-contained markup plus one inline `<script type="module">` that imports Firebase directly from `https://www.gstatic.com/firebasejs/10.7.0/...` and the repo's own shared ES modules. Deployment is the file system itself (see [Deployment and Table QR Codes](/openwiki/operations/deployment-and-qr.md)).

## The three pages

| Page | Audience | Role |
|---|---|---|
| `index.html` | staff (PIN-gated UI) | point of sale: orders, menu, menu editor, settings, history |
| `menu.html` | customers, no login | browse menu and place a table order |
| `print-qr.html` | staff | renders the printable shop QR code |

The three pages share two ES modules:

- `shared/firebase-config.js` exports `FIREBASE_CONFIG` (project `belaseshe-orders`), which every page uses to initialize the Firebase app;
- `shared/menu-data.js` exports the seeded menu (`DEFAULT_MENU`, `DEFAULT_CATEGORIES`, `PUBLIC_MENU_CATEGORIES`), the `TABLES` map (`rooftop: R1–R5`, `downstairs: D1–D2`), and helpers `zoneOfTable` / `isValidTable` used by both the staff and customer sides.

`vendor/qrcode.js` is the only vendored dependency, used by `print-qr.html` and `scripts/generate-qr.js`.

## Firestore as the integration point

<!-- openwiki: broken internal link [/openwiki/architecture/data-model.md] link "/openwiki/architecture/data-model.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
The pages do not talk to each other — they meet in Firestore (see [Firestore Data Model and Security Rules](/openwiki/architecture/data-model.md)):

- The customer menu subscribes to `config/menu` with `onSnapshot`, so menu edits made in the staff Menu Editor appear on customer phones without a reload.
- The staff app subscribes to the whole `orders` collection with `onSnapshot` (`index.html:1536`): the moment a customer writes an order document, the staff app plays a synthesized two-note alert and shows a banner; tapping the order marks it `seen`.
- The customer's confirmation screen subscribes to its own order document with `onSnapshot` (`menu.html:616`), so status changes made by staff (`pending → preparing → ready → paid`) stream back to the customer live.

Writes go the same direct way: both sides use `setDoc(doc(state.firestore, 'orders', order.id), order)` with client-generated IDs, and menu edits are persisted by writing `config/menu`.

## State held outside Firestore

The staff app keeps an IndexedDB database (name `belasheshe`, version 1) with two stores used for device-local state, never as the source of truth: `orders` mirrors the live order list (written on every local order action and re-backfilled from Firestore snapshots with `setDoc(..., { merge: true })`), and `settings` stores device-local overrides — the menu seed, a custom Payment QR image, the PIN, the alerts-enabled flag, and optionally a custom Firebase config. The customer menu keeps nothing local beyond its in-memory cart.

## Failure posture

With no backend of its own, every failure path is a Firestore failure: pages lazy-import the Firestore module inside `try` blocks and degrade to "not connected yet" toasts (the customer menu tracks `state.connected` and disables Place Order until Firebase initializes), while the staff app catches and logs failed syncs so a networking hiccup doesn't lose an order the staff just took — it is persisted to IndexedDB first, then retried on the next action.

<!-- openwiki: broken internal link [/openwiki/architecture/data-model.md] link "/openwiki/architecture/data-model.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/staff-pos.md] link "/openwiki/workflows/staff-pos.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/customer-qr-ordering.md] link "/openwiki/workflows/customer-qr-ordering.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Related: [Firestore Data Model](/openwiki/architecture/data-model.md), [Staff POS](/openwiki/workflows/staff-pos.md), [Customer QR Ordering](/openwiki/workflows/customer-qr-ordering.md).
