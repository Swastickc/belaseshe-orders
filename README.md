# Belasheshe Orders — v2

Order management for **Belasheshe** cafe: a staff point-of-sale app plus a
QR-code table menu for customers (rooftop 5 tables, downstairs 2 tables).

## Pages

| File | Who uses it | What it does |
|---|---|---|
| `index.html` | Staff (PIN-locked) | Take orders, manage the menu, track payments & history. |
| `menu.html` | Customers (via QR) | Browse the menu and place an order for their table — no login. |
| `print-qr.html` | Staff | Generates the 7 table QR codes to print & laminate. |

All three share the same live menu and orders, synced in real time through
Firebase Firestore (`shared/firebase-config.js`).

## How the QR ordering works

1. Each table has its own QR code (`print-qr.html` → open on the same domain
   the app is deployed to → Print all).
2. Scanning it opens `menu.html?t=R1` (or `D1`, etc.) — that table number is
   locked in automatically.
3. Customer taps **Place Order** → picks items → **Send order to kitchen**.
   This writes straight to Firestore; no payment step here — that part still
   happens in person like before.
4. The staff app (`index.html`) plays a sound and shows a banner the moment a
   new customer order comes in, as long as it's open on screen. Tapping an
   order in the **Orders** tab marks it as seen.

Table codes: Rooftop = `R1`–`R5`, Downstairs = `D1`–`D2` (see
`shared/menu-data.js`).

## Local development

Any static file server works (ES modules need `http://`, not `file://`):

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080/index.html` (staff) or
`http://localhost:8080/menu.html?t=R1` (customer).

## Deploying (Firebase Hosting)

```powershell
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore:rules
```

This project is already wired to the `belaseshe-orders` Firebase project via
`.firebaserc`. After deploying, your QR codes should point at
`https://belaseshe-orders.web.app/menu.html?t=R1` — regenerate them from
`print-qr.html` opened on that live URL so they encode the right domain.

## Security note

There's no login system — the staff PIN only locks the screen on that phone,
it doesn't protect the database. `firestore.rules` validates that customer
orders look real (valid table, sane total, starts as "pending") and prevents
editing another order's items/table/total after the fact, but a determined
person with the project's public config could still spam order creations.
That's an accepted trade-off for a small single-location cafe; if it ever
becomes a real problem, add Firebase App Check (free) or real Firebase Auth
for staff.

