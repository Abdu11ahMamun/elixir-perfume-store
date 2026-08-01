// ─── BRAND ───────────────────────────────────────────────
export const BRAND = {
  name: "ÉLIXIR",
  tagline: "Signature Fragrances",
  description: "A premium perfume-only ecommerce concept focused on luxury, aesthetics, and elegant shopping experiences.",
};

// ─── FALLBACK IMAGE ───────────────────────────────────────
// Used when a category/product image is missing or fails to load.
// No dedicated placeholder asset exists in this project, so this reuses
// an image already displayed elsewhere on the homepage (hero section).
export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop";

// ─── PRODUCT SCHEMA ──────────────────────────────────────
// sizes: array of { ml, price, stock (units), images[] }
// inspiredBy: string — the designer fragrance it references
// category: "For Him" | "For Her" | "Luxury Oud" | "Gift Sets"
// isCombo: boolean — if true, appears in Offers section

export const PRODUCTS = [
  {
    id: "NK-001",
    name: "Noir Ember",
    inspiredBy: "Bleu de Chanel",
    category: "For Him",
    note: "Woody · Smoky · Bold",
    description: "A commanding woody-smoky signature built for the man who leaves a lasting impression. Opens with citrus brightness before settling into a rich, dark amber base.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 290,
        stock: 24,
        images: [
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 15,
        price: 650,
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1100,
        stock: 9,
        images: [
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "VB-002",
    name: "Velvet Bloom",
    inspiredBy: "La Vie Est Belle — Lancôme",
    category: "For Her",
    note: "Floral · Soft · Feminine",
    description: "A delicate floral bouquet with iris and patchouli at the heart. Feminine, romantic, and irresistibly soft — perfect for daily wear or candlelit evenings.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 270,
        stock: 30,
        images: [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 15,
        price: 620,
        stock: 0,
        images: [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1050,
        stock: 14,
        images: [
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "AM-003",
    name: "Azure Mist",
    inspiredBy: "Acqua di Giò — Armani",
    category: "For Him",
    note: "Fresh · Aquatic · Clean",
    description: "Crisp Mediterranean air captured in a bottle. Aquatic freshness with a mineral heart and warm musky drydown — effortless, clean, and timeless.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 260,
        stock: 20,
        images: [
          "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 980,
        stock: 7,
        images: [
          "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "GO-004",
    name: "Golden Oud",
    inspiredBy: "Oud Wood — Tom Ford",
    category: "Luxury Oud",
    note: "Luxury · Oriental · Rich",
    description: "The finest oud accord layered with amber, saffron, and smoky sandalwood. A statement fragrance that demands attention and lingers for hours.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 380,
        stock: 15,
        images: [
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 15,
        price: 850,
        stock: 11,
        images: [
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1450,
        stock: 5,
        images: [
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "RD-005",
    name: "Rose Dusk",
    inspiredBy: "Miss Dior — Dior",
    category: "For Her",
    note: "Floral · Romantic · Soft",
    description: "Bulgarian rose at its finest — dewy, powdery, and deeply romantic. A fragrance for the woman who embraces her femininity with quiet confidence.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 280,
        stock: 18,
        images: [
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 15,
        price: 640,
        stock: 22,
        images: [
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1080,
        stock: 0,
        images: [
          "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "ML-006",
    name: "Midnight Leather",
    inspiredBy: "Tobacco Vanille — Tom Ford",
    category: "For Him",
    note: "Leather · Amber · Strong",
    description: "Dark, bold, and undeniably masculine. Tobacco and leather wrapped in sweet vanilla — the night in a bottle.",
    isCombo: false,
    sizes: [
      {
        ml: 15,
        price: 720,
        stock: 13,
        images: [
          "https://images.unsplash.com/photo-1595425964071-2c1ecb7d9d67?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1250,
        stock: 6,
        images: [
          "https://images.unsplash.com/photo-1595425964071-2c1ecb7d9d67?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "OR-007",
    name: "Oud Royale",
    inspiredBy: "Black Orchid — Tom Ford",
    category: "Luxury Oud",
    note: "Oud · Spicy · Premium",
    description: "A royal blend of oud, black orchid, and spiced rum. Rich, mysterious, and impossible to ignore — this is luxury in its purest form.",
    isCombo: false,
    sizes: [
      {
        ml: 6,
        price: 400,
        stock: 10,
        images: [
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 15,
        price: 900,
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
        ],
      },
      {
        ml: 30,
        price: 1600,
        stock: 3,
        images: [
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },

  // ─── COMBO / OFFER PRODUCTS ───────────────────────────
  {
    id: "CB-008",
    name: "His & Hers Discovery Set",
    inspiredBy: "Noir Ember + Velvet Bloom",
    category: "Gift Sets",
    note: "Duo · Couple · Gift",
    description: "The perfect pair — our bestselling him and her fragrances together in one beautifully presented gift set. Ideal for anniversaries, Valentine's Day, and special occasions.",
    isCombo: true,
    offerTag: "Valentine's Special",
    sizes: [
      {
        ml: 6,
        price: 490,
        stock: 12,
        images: [
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
  {
    id: "CB-009",
    name: "Oud Lovers Trio",
    inspiredBy: "Golden Oud + Oud Royale + Azure Mist",
    category: "Gift Sets",
    note: "Trio · Oud · Premium",
    description: "Three iconic oud-forward signatures in one collector's set. A journey through the ancient art of perfumery — from light to deep, from east to west.",
    isCombo: true,
    offerTag: "Eid Special",
    sizes: [
      {
        ml: 6,
        price: 950,
        stock: 8,
        images: [
          "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
        ],
      },
    ],
  },
];

// ─── DERIVED LISTS ────────────────────────────────────────
// Regular products (non-combo) — for main shop
export const REGULAR_PRODUCTS = PRODUCTS.filter(p => !p.isCombo);

// Featured — first 4 regular products
export const FEATURED = REGULAR_PRODUCTS.slice(0, 4);

// Collections
export const COLLECTIONS = [
  {
    title: "For Him",
    subtitle: "Bold & Commanding",
    image: "https://images.unsplash.com/photo-1595425964071-2c1ecb7d9d67?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "For Her",
    subtitle: "Soft & Radiant",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Oud",
    subtitle: "Rich & Timeless",
    image: "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Gift Sets",
    subtitle: "Curated & Complete",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
  },
];

export const STATS = [
  { value: "50+", label: "Exclusive Fragrances" },
  { value: "24H", label: "Fast Delivery" },
  { value: "4.9★", label: "Customer Rating" },
  { value: "12K+", label: "Happy Clients" },
];

export const CATEGORIES = ["All", "For Him", "For Her", "Luxury Oud", "Gift Sets"];

export const NAV_LINKS = [
  { label: "Home",        page: "home" },
  { label: "Perfumes",   page: "products" },
  { label: "Best Sellers", page: "bestSellers" },
  { label: "Offers",     page: "offers" },
  { label: "About",      page: "about" },
];

// ─── ORDER ID GENERATOR ───────────────────────────────────
// Format: {ml padded to 2 digits}{sequential 3-digit number}
// 30ml → 30101, 30102 ...
// 15ml → 15101, 15102 ...
//  6ml → 06101, 06102 ...
// Max size = Priority 1 in order queue
let orderCounters = { 6: 100, 15: 100, 30: 100 };

export function generateOrderId(ml) {
  const pad = String(ml).padStart(2, "0");
  orderCounters[ml] = (orderCounters[ml] || 100) + 1;
  return `${pad}${orderCounters[ml]}`;
}

// Priority: larger size = higher priority
export function getOrderPriority(ml) {
  if (ml === 30) return 1;
  if (ml === 15) return 2;
  return 3;
}

// ─── TRUST BAR ────────────────────────────────────────────
export const TRUST_POINTS = [
  "100% Authentic Fragrances",
  "Fast 24H Delivery",
  "Easy Returns & Refunds",
  "Secure Payment",
];