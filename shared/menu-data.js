// ============================================================
// Belasheshe — shared menu data (v2)
// Single source of truth for both the staff app (index.html)
// and the customer QR menu (menu.html). Also used as the
// initial seed that gets pushed to Firestore config/menu on
// first run — after that, the live Firestore copy wins and
// is editable from the staff Menu Editor screen.
// ============================================================

export const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'drink', label: 'Drinks' },
  { id: 'maggi', label: 'Maggi' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'sandwich', label: 'Sandwich' },
  { id: 'snack', label: 'Snacks' },
  { id: 'pizza', label: 'Pizza & Burger' },
  { id: 'cig', label: 'Cigarettes' },
  { id: 'other', label: 'Others' },
];

// Categories shown on the customer-facing "Browse Menu" (picture-style)
// tab. Cigarettes are intentionally excluded there but still orderable
// from the "Place Order" tab and the staff app.
export const PUBLIC_MENU_CATEGORIES = DEFAULT_CATEGORIES.filter(
  (c) => c.id !== 'cig' && c.id !== 'all'
);

// This mirrors the cafe's real, currently-live menu (matches what's actually
// been in use), cleaned up: duplicate entries removed, and every item given
// a proper Bengali name paired with its English name (some had been added
// with only an English placeholder, e.g. "Pizaaa" / "Burger").
export const DEFAULT_MENU = [
  // ---- Drinks ----
  { id: 'drink-tea', cat: 'drink', bn: 'চা', en: 'Tea', price: 10 },
  { id: 'drink-darjeeling-tea', cat: 'drink', bn: 'দার্জিলিং চা', en: 'Darjeeling Tea', price: 20 },
  { id: 'drink-green-tea', cat: 'drink', bn: 'গ্রিন টি', en: 'Green Tea', price: 15 },
  { id: 'drink-coffee', cat: 'drink', bn: 'কফি', en: 'Coffee', price: 20 },
  { id: 'drink-cold-coffee', cat: 'drink', bn: 'কোল্ড কফি', en: 'Cold Coffee', price: 40 },
  { id: 'drink-special-cold-coffee', cat: 'drink', bn: 'স্পেশাল কোল্ড কফি', en: 'Special Cold Coffee', price: 60 },
  { id: 'drink-cold-drink', cat: 'drink', bn: 'কোল্ড ড্রিংকস', en: 'Cold Drink', price: 25 },

  // ---- Maggi ----
  { id: 'maggi-veg', cat: 'maggi', bn: 'ভেজ ম্যাগি', en: 'Veg Maggi', price: 30 },
  { id: 'maggi-chicken', cat: 'maggi', bn: 'চিকেন ম্যাগি', en: 'Chicken Maggi', price: 40 },
  { id: 'maggi-egg-chicken', cat: 'maggi', bn: 'এগ চিকেন ম্যাগি', en: 'Egg Chicken Maggi', price: 55 },
  { id: 'maggi-chilli-chicken-combo', cat: 'maggi', bn: 'ম্যাগি ও চিলি চিকেন কম্বো', en: 'Maggi & Chilli Chicken Combo', price: 99 },

  // ---- Pasta ----
  { id: 'pasta-veg', cat: 'pasta', bn: 'ভেজ হোয়াইট সস পাস্তা', en: 'Veg White Sauce Pasta', price: 50 },
  { id: 'pasta-chicken', cat: 'pasta', bn: 'চিকেন হোয়াইট সস পাস্তা', en: 'Chicken White Sauce Pasta', price: 75 },

  // ---- Sandwich ----
  { id: 'sandwich-egg-mayo', cat: 'sandwich', bn: 'এগ মেয়ো স্যান্ডউইচ', en: 'Egg Mayo Sandwich', price: 29 },
  { id: 'sandwich-egg-chicken-mayo', cat: 'sandwich', bn: 'এগ চিকেন মেয়ো স্যান্ডউইচ', en: 'Egg Chicken Mayo Sandwich', price: 45 },

  // ---- Snacks ----
  { id: 'snack-chilli-chicken-dry', cat: 'snack', bn: 'চিলি চিকেন ড্রাই', en: 'Chilli Chicken Dry', price: 69 },
  { id: 'snack-crispy-chicken', cat: 'snack', bn: 'ক্রিস্পি চিকেন', en: 'Crispy Chicken', price: 69 },
  { id: 'snack-kurkure-chicken', cat: 'snack', bn: 'কুরকুরে চিকেন', en: 'Kurkure Chicken', price: 99 },
  { id: 'snack-chatpata-chicken', cat: 'snack', bn: 'চাটপাটা চিকেন', en: 'Chatpata Chicken', price: 99 },
  { id: 'snack-butter-garlic-chicken', cat: 'snack', bn: 'বাটার গার্লিক চিকেন', en: 'Butter Garlic Chicken', price: 99 },
  { id: 'snack-chicken-wings', cat: 'snack', bn: 'চিকেন উইংস', en: 'Chicken Wings', price: 99 },

  // ---- Pizza & Burger ----
  { id: 'pizza-cheese-corn-small', cat: 'pizza', bn: 'চিকেন পিৎজা (ছোট)', en: 'Chicken Cheese Corn Pizza (Small)', price: 100 },
  { id: 'pizza-cheese-corn-regular', cat: 'pizza', bn: 'চিকেন পিৎজা (রেগুলার)', en: 'Chicken Cheese Corn Pizza (Regular)', price: 180 },
  { id: 'pizza-chicken-burger', cat: 'pizza', bn: 'চিকেন বার্গার', en: 'Chicken Burger', price: 79 },

  // ---- Cigarettes (staff + interactive order menu only, not on the public picture menu) ----
  { id: 'cig-gold-flake-small', cat: 'cig', bn: 'গোল্ড ফ্লেক স্মল', en: 'Gold Flake Small', price: 10 },
  { id: 'cig-flake', cat: 'cig', bn: 'ফ্লেক', en: 'Flake', price: 12 },
];

// ---- Tables (v2 rooftop expansion) ----
// Rooftop: 5 tables, marked R1-R5. Downstairs: 2 tables, marked D1-D2.
// Keeping zone prefixes avoids "Table 1" existing on both floors.
export const TABLES = {
  rooftop: ['R1', 'R2', 'R3', 'R4', 'R5'],
  downstairs: ['D1', 'D2'],
};

export const ZONE_LABELS = {
  rooftop: 'Rooftop',
  downstairs: 'Downstairs',
};

export function zoneOfTable(table) {
  if (!table) return null;
  if (TABLES.rooftop.includes(table)) return 'rooftop';
  if (TABLES.downstairs.includes(table)) return 'downstairs';
  return null;
}

export function isValidTable(table) {
  return zoneOfTable(table) !== null;
}
