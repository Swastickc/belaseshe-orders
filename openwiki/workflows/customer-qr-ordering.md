---
type: workflow
title: Customer QR Ordering Flow (menu.html)
description: The customer-facing step flow — browse the live menu, pick a table, place the order straight into Firestore, and watch its status stream back live.
tags: [customer, qr, ordering, cart, workflow, menu-html]
verified:
  - by: openwiki/0.6.1
    at: 2026-10-03T11:03:11.929Z
sources:
  - id: openwiki-source-be4b3c3d5fa55f597b20d352
    resource: repo://menu.html
  - id: openwiki-source-334209dcccd68ba2712825b2
    resource: repo://shared/menu-data.js
generated: { by: "opencode", at: "2026-10-03T11:03:11.929Z" }
---

# Customer QR Ordering Flow (menu.html)

<!-- openwiki: broken internal link [/openwiki/operations/deployment-and-qr.md] link "/openwiki/operations/deployment-and-qr.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`menu.html` is the customer-facing page. It needs no login: scanning the shop QR (see [Deployment and Table QR Codes](/openwiki/operations/deployment-and-qr.md)) opens it directly, and the only identity it relies on is the table the customer says they're at.

## A single-purpose three-step flow

The page is one long-lived SPA with three full-screen steps (`data-step="menu|table|order"`) managed by `goToStep()`:

1. **Menu (browse)** — categories and items come from the live `config/menu` document (subscribed via `onSnapshot`), not from the hardcoded seed, so staff menu edits appear mid-session. Cigarettes are excluded from this browse view by `PUBLIC_MENU_CATEGORIES`, though they remain orderable from the Place Order tab and the staff app.
2. **Table (picker)** — the customer picks a zone tab (Rooftop / Downstairs) then a table tile (`R1`–`R5`, `D1`–`D2`). On selection, `setTable()` derives the zone via `zoneOfTable`, updates the order-context header, and rewrites the URL to `?t=<table>` with `history.replaceState`. The table is **always** chosen explicitly here: even a stray `?t=` param from an old bookmarked per-table link never auto-fills or skips this step (an explicit v2 design note in `init()`).
3. **Order (cart)** — quantities, an optional note, and **Place Order**.

The cart is plain in-memory state: `state.cart` maps item id → qty; `addToCart`/`setQty` re-render the cart bar and lines; `cartTotal()` prices from the live `MENU` array.

## Placing the order

<!-- openwiki: broken internal link [/openwiki/architecture/data-model.md] link "/openwiki/architecture/data-model.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
`placeOrder` refuses to run with an empty cart and, if no table is chosen yet, bounces to the table step. It snapshots the cart into items of `{ id, bn, en, price, qty }`, builds the order document with a client-generated `c_…` id, `status: 'pending'`, `source: 'customer'`, `seen: false`, and writes it with one `setDoc` to `orders/{id}` (see [Firestore Data Model](/openwiki/architecture/data-model.md)). There is no payment step — payment still happens in person; the rules' validation (1–40 items, total ≤ 100000, `status === 'pending'`) is the only gate the write passes through.

On success the confirmation modal shows table, zone, total and a time-formatted summary, the cart is cleared, `navigator.vibrate` pulses the phone, and `trackOrderStatus` subscribes `onSnapshot` to the order document so kitchen progress (`pending → preparing → ready → paid`) streams into the status tracker until the customer dismisses it.

## Connectivity posture

The page degrades explicitly: `initFirebase` sets `state.connected` and every send path re-checks it — Place Order stays disabled until connected, a failed send toasts "Could not send order, check your connection and try again", and a send attempted before the Firestore module finishes importing gets "Not connected yet, try again in a moment". Nothing is queued offline on the customer side; a lost connection simply means the customer retries.

<!-- openwiki: broken internal link [/openwiki/architecture/overview.md] link "/openwiki/architecture/overview.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
<!-- openwiki: broken internal link [/openwiki/workflows/staff-pos.md] link "/openwiki/workflows/staff-pos.md" is root-absolute, which no real consumer resolves against the repository root (not a coding agent reading the page, not GitHub's Markdown renderer, not a local viewer); use a path relative to this file instead. Fix the href or restore the target, then delete this comment. -->
Related: [Architecture Overview](/openwiki/architecture/overview.md), [Staff POS](/openwiki/workflows/staff-pos.md).
