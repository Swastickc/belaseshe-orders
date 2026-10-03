---
type: data-model
title: Firestore Data Model and Security Rules
description: The orders and config collections, the order document shape and status lifecycle, what firestore.rules validates on create and update, and the accepted no-auth security trade-off.
tags: [firestore, data-model, security, rules, orders, config]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T11:03:11.929Z
sources:
  - id: openwiki-source-60b51f83565a4de6497fc329
    resource: repo://firestore.rules
  - id: openwiki-source-f8d10828394c4129061d5b0e
    resource: repo://index.html
  - id: openwiki-source-be4b3c3d5fa55f597b20d352
    resource: repo://menu.html
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-6eb9d5586a2ac06d53be7dc2
    resource: repo://shared/firebase-config.js
  - id: openwiki-source-334209dcccd68ba2712825b2
    resource: repo://shared/menu-data.js
generated: { by: "opencode", at: "2026-10-03T11:03:11.929Z" }
---

# Firestore Data Model and Security Rules

Firestore is the app's only backend. Every HTML page talks to it directly from the browser through the Firebase JS SDK — there is no server, no REST API, and no authentication layer. The database has exactly two collections, both defined in `firestore.rules`: `orders/{orderId}` and `config/{docId}`.

## Collections

| Collection | Written by | Read by | Purpose |
|---|---|---|---|
| `orders/{orderId}` | staff app and customer menu | both (live via `onSnapshot`) | one document per order |
| `config/{docId}` | staff Menu Editor / Settings screens | both | shared live menu (`config/menu` holds `{ items, updatedAt }`), QR image, settings |

The `config/menu` document is the live copy of the menu. `shared/menu-data.js` only seeds it: on first run the staff app pushes `DEFAULT_MENU` to `config/menu`, and afterwards the Firestore copy wins and edits made in the staff Menu Editor are persisted there (`index.html` writes it with `setDoc(doc(state.firestore, 'config', 'menu'), { items: MENU, updatedAt: Date.now() })`).

## Order document shape

Both creators build the same flat document. The order ID is generated client-side with a prefix that encodes who created it: the customer menu uses `c_` + timestamp + random suffix and marks the document `source: 'customer'`, `seen: false`; the staff app uses `o_` and marks it `source: 'staff'`, `seen: true`. Common fields: `destination` (`'table'` | `'takeaway'`), `zone` (`'rooftop'` | `'downstairs'` | `'none'`), `table`, `note`, `items` (array of `{ id, bn, en, price, qty }`), `total`, `createdAt`, `status`.

Customer orders always write `destination: 'table'` with the scanned table and zone; staff orders can also be takeaway, in which case `zone` is `'none'` and `table` is `null`.

## Status lifecycle

`pending → preparing → ready → paid`. The rules only accept updates whose status is one of those four values. The customer's live status tracker renders the same mapping — it folds `ready` and `paid` onto the same final step — by subscribing with `onSnapshot` to the single order document until the customer closes the confirmation.

## What the rules actually enforce

Creation of an order must pass `isValidNewOrder`: required keys present, `destination` valid, `zone` valid, 1–40 items, numeric total between 0 and 100000, `status` exactly `'pending'`, `source` in `['staff','customer']`. An order therefore cannot be created already paid.

Updates must pass `isValidStatusUpdate`, which restricts the changed keys to `status`, `updatedAt`, `note`, `seen`, `items`, `total` and requires the new status to be in the lifecycle above.

A documented-but-not-enforced detail: the header comment in `firestore.rules` claims items and total are frozen after creation, but the enforcement function's `hasOnly` list includes both `items` and `total` — the rules allow rewriting an existing order's items and total, contrary to the comment. If that freeze is ever needed, remove `items` and `total` from the `hasOnly` list.

## Security trade-off

There is no login system. The staff PIN only gates the UI on the phone — it does not protect the database. Rules therefore cannot distinguish staff from a random customer: `orders` is world-readable and deletable, `config` is world-writable, and anyone with the public Firebase web config can read orders or spam order creation. The file itself documents this as an accepted trade-off for a single small cafe, with Firebase App Check and/or Firebase Auth named as the escalation path. The web config in `shared/firebase-config.js` is deliberately public per Firebase's own guidance; the intended real boundary is the rules file, and defense-in-depth would be restricting the API key to known domains in Google Cloud Console.

<!-- openwiki: broken internal link [/openwiki/architecture/overview.md] link "/openwiki/architecture/overview.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/staff-pos.md] link "/openwiki/workflows/staff-pos.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/customer-qr-ordering.md] link "/openwiki/workflows/customer-qr-ordering.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Related: [Architecture Overview](/openwiki/architecture/overview.md), [Staff POS](/openwiki/workflows/staff-pos.md), [Customer QR Ordering](/openwiki/workflows/customer-qr-ordering.md).
