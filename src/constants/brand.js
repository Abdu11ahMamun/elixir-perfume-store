export const BRAND = {
  name: "ÉLIXIR",
  tagline: "Signature Fragrances",
  description:
    "A premium perfume-only ecommerce concept focused on luxury, aesthetics, and elegant shopping experiences.",
};

export const FEATURED = [
  {
    name: "Noir Ember",
    note: "Woody · Smoky · Bold",
    category: "For Him",
    price: "$89",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Velvet Bloom",
    note: "Floral · Soft · Feminine",
    category: "For Her",
    price: "$74",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Azure Mist",
    note: "Fresh · Aquatic · Clean",
    category: "For Her",
    price: "$92",
    stock: "Sold out",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Golden Oud",
    note: "Luxury · Oriental · Rich",
    category: "Luxury Oud",
    price: "$120",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
  },
];

export const PRODUCTS = [
  ...FEATURED,
  {
    name: "Rose Dusk",
    note: "Floral · Romantic · Soft",
    category: "For Her",
    price: "$79",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Midnight Leather",
    note: "Leather · Amber · Strong",
    category: "For Him",
    price: "$95",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1595425964071-2c1ecb7d9d67?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Oud Royale",
    note: "Oud · Spicy · Premium",
    category: "Luxury Oud",
    price: "$140",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Discovery Gift Set",
    note: "Mini Perfumes · Gift Box",
    category: "Gift Sets",
    price: "$65",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
  },
];

export const COLLECTIONS = [
  {
    title: "For Him",
    subtitle: "Bold & Commanding",
    image:
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "For Her",
    subtitle: "Soft & Radiant",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury Oud",
    subtitle: "Rich & Timeless",
    image:
      "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Gift Sets",
    subtitle: "Curated & Complete",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
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
  { label: "Home", page: "home" },
  { label: "Perfumes", page: "products" },
  { label: "Best Sellers", page: "bestSellers" },
  { label: "About", page: "about" },
];