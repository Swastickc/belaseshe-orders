---
type: workflow
title: Staff Point-of-Sale App (index.html)
description: The PIN-gated staff app — five screens, live new-order alerts, open-tab order editing with payments, device-local IndexedDB state, and Firestore seeding and sync.
tags: [staff, pos, pin, orders, menu-editor, indexeddb, index-html]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T11:03:11.929Z
sources:
  - id: openwiki-source-60b51f83565a4de6497fc329
    resource: repo://firestore.rules
  - id: openwiki-source-f8d10828394c4129061d5b0e
    resource: repo://index.html
generated: { by: "opencode", at: "2026-10-03T11:03:11.929Z" }
---

# Staff Point-of-Sale App (index.html)

<!-- openwiki: broken internal link [/openwiki/architecture/data-model.md] link "/openwiki/architecture/data-model.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`index.html` is the staff side: a single-file SPA whose screens are toggled by `data-screen` attributes after a PIN unlock. The PIN (`settings` store, key `pin`) only locks the phone's UI — it is not an authentication boundary (see [Firestore Data Model and Security Rules](/openwiki/architecture/data-model.md)).

## The five screens

| Screen (`data-screen`) | What it does |
|---|---|
| `orders` | the live floor: order cards per table/takeaway, open-tab chips for unpaid orders, take-payment flow |
| `menu` | the in-person ordering pad (same cart model as the customer page, plus zone/table or takeaway selection) |
| `menuedit` | Menu Editor: prices, items, categories; every save writes `config/menu` to Firestore and re-renders both views |
| `settings` | device-local config: PIN change, alerts toggle, Payment QR image upload/removal, Firebase config override |
| `history` | past orders (paid and others), with a clear-history action that wipes the local `orders` store |

Screen switching dispatches a render call per screen (`renderOrders`, `renderHistory`, `renderMenuEditor`, …), so views always re-render from current state on entry.

## Live customer-order alerts

The `orders` collection subscription is the heart of the page. Each snapshot change is classified: an **added** document counts as a new customer order only when it is not from the initial load, `source === 'customer'`, and its id is not already known locally (`state.knownOrderIds` guards against staff-created duplicates). When that fires and alerts are enabled, the app plays a synthesized two-note beep via WebAudio (`playAlertBeep`), slides in a banner naming the table or takeaway, and vibrates the phone. Tapping an order card calls `markOrderSeen`, which writes `{ seen: true }` to Firestore. Removed documents are deleted from the local mirror.

## Orders, open tabs, and payment

Orders are edited as "open tabs": unpaid orders appear as chips; tapping one enters edit mode (`state.editingOrderId`) which reloads its items into the ordering pad. `saveOrder(status)` covers both create and update: it builds/extends the order object, writes it to the IndexedDB `orders` store first, then best-effort `setDoc`s to Firestore — so a failed sync leaves the local copy intact. Payment is the same write with `status: 'paid'` (`confirmPayment`), and "Save as open" re-persists with `status: 'pending'`. The payment modal shows the amount against the uploaded Payment QR image.

## First-write seeding and menu sync

On every Firebase init the staff app guarantees the menu exists: if the `config/menu` snapshot does not exist, it writes `{ items: MENU, updatedAt }` (seeding from IndexedDB settings or `DEFAULT_MENU`); if it does exist, the remote array wins and replaces the in-memory `MENU`, is mirrored into the `settings` store, and the menu screens re-render. Orders already held locally when Firebase connects are backfilled to Firestore with `setDoc(..., { merge: true })`.

<!-- openwiki: broken internal link [/openwiki/workflows/customer-qr-ordering.md] link "/openwiki/workflows/customer-qr-ordering.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/architecture/overview.md] link "/openwiki/architecture/overview.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Related: [Customer QR Ordering](/openwiki/workflows/customer-qr-ordering.md), [Architecture Overview](/openwiki/architecture/overview.md).
