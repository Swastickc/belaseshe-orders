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

export const DEFAULT_MENU = [
  // ---- Drinks ----
  { id: 'drink-tea', cat: 'drink', bn: 'চা', en: 'Tea', price: 10 },
  { id: 'drink-green-tea', cat: 'drink', bn: 'গ্রিন টি', en: 'Green Tea', price: 15 },
  { id: 'drink-coffee', cat: 'drink', bn: 'কফি', en: 'Coffee', price: 20 },
  { id: 'drink-darjeeling', cat: 'drink', bn: 'দার্জিলিং চা', en: 'Darjeeling Tea', price: 20 },
  { id: 'drink-cold-coffee', cat: 'drink', bn: 'কোল্ড কফি', en: 'Cold Coffee', price: 39 },
  { id: 'drink-masala-coke', cat: 'drink', bn: 'মসলা কোক', en: 'Masala Coke', price: 35 },

  // ---- Maggi ----
  { id: 'maggi-veg', cat: 'maggi', bn: 'ভেজ ম্যাগি', en: 'Veg Maggi', price: 30 },
  { id: 'maggi-chicken', cat: 'maggi', bn: 'চিকেন ম্যাগি', en: 'Chicken Maggi', price: 45 },
  { id: 'maggi-egg-chicken', cat: 'maggi', bn: 'এগ চিকেন ম্যাগি', en: 'Egg Chicken Maggi', price: 55 },
  { id: 'maggi-chicken-cheese-garlic', cat: 'maggi', bn: 'চিকেন চিজ গার্লিক ম্যাগি', en: 'Chicken Cheese Garlic Maggi', price: 59 },
  { id: 'maggi-cheese-garlic', cat: 'maggi', bn: 'চিজ গার্লিক ম্যাগি', en: 'Cheese Garlic Maggi', price: 45 },

  // ---- Pasta ----
  { id: 'pasta-veg', cat: 'pasta', bn: 'ভেজ হোয়াইট সস পাস্তা', en: 'Veg White Sauce Pasta', price: 49 },
  { id: 'pasta-chicken', cat: 'pasta', bn: 'চিকেন হোয়াইট সস পাস্তা', en: 'Chicken White Sauce Pasta', price: 75 },

  // ---- Sandwich ----
  { id: 'sandwich-egg-mayo', cat: 'sandwich', bn: 'এগ মেয়ো স্যান্ডউইচ', en: 'Egg Mayo Sandwich', price: 40 },
  { id: 'sandwich-egg-chicken', cat: 'sandwich', bn: 'এগ চিকেন স্যান্ডউইচ', en: 'Egg Chicken Sandwich', price: 50 },

  // ---- Snacks ----
  { id: 'snack-dry-chilli-chicken', cat: 'snack', bn: 'ড্রাই চিলি চিকেন', en: 'Dry Chilli Chicken', price: 80 },
  { id: 'snack-crispy-chicken', cat: 'snack', bn: 'ক্রিস্পি চিকেন', en: 'Crispy Chicken', price: 80 },
  { id: 'snack-chicken-chatpata', cat: 'snack', bn: 'চিকেন চটপটা', en: 'Chicken Chatpata', price: 99 },
  { id: 'snack-chicken-kurkure', cat: 'snack', bn: 'চিকেন কুরকুরে', en: 'Chicken Kurkure', price: 99 },
  { id: 'snack-butter-garlic-chicken', cat: 'snack', bn: 'বাটার গার্লিক চিকেন', en: 'Butter Garlic Chicken', price: 99 },
  { id: 'snack-crispy-honey-chicken', cat: 'snack', bn: 'ক্রিস্পি হানি চিকেন', en: 'Crispy Honey Chicken', price: 99 },

  // ---- Pizza & Burger ----
  { id: 'pizza-chicken-burger', cat: 'pizza', bn: 'চিকেন বার্গার', en: 'Chicken Burger', price: 79 },
  { id: 'pizza-cheesy-corn-small', cat: 'pizza', bn: 'চিকেন চিজি কর্ন পিৎজা (ছোট)', en: 'Chicken Cheesy Corn Pizza (Small)', price: 99 },
  { id: 'pizza-cheesy-corn-regular', cat: 'pizza', bn: 'চিকেন চিজি কর্ন পিৎজা (রেগুলার)', en: 'Chicken Cheesy Corn Pizza (Regular)', price: 180 },

  // ---- Cigarettes (staff + interactive order menu only, not on public picture menu) ----
  { id: 'cig-gold-flake', cat: 'cig', bn: 'গোল্ড ফ্লেক', en: 'Gold Flake', price: 10 },
  { id: 'cig-gold-flake-kings', cat: 'cig', bn: 'গোল্ড ফ্লেক কিংস', en: 'Gold Flake Kings', price: 25 },
  { id: 'cig-gold-flake-small', cat: 'cig', bn: 'গোল্ড ফ্লেক স্মল', en: 'Gold Flake Small', price: 18 },
  { id: 'cig-classic', cat: 'cig', bn: 'ক্লাসিক', en: 'Classic', price: 25 },
  { id: 'cig-marlboro', cat: 'cig', bn: 'মার্লবোরো', en: 'Marlboro', price: 30 },
  { id: 'cig-navy-cut', cat: 'cig', bn: 'নেভি কাট', en: 'Navy Cut', price: 18 },
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
