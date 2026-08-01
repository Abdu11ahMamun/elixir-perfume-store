// ─── PRICE UTILITIES ─────────────────────────────────────
// Currency: BDT (৳)

/**
 * Format a number as BDT price
 * formatPrice(1100) → "৳1,100"
 */
export function formatPrice(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

/**
 * Parse a raw price number (already a number in new schema)
 * Kept for backward compatibility if any string prices exist
 */
export function getPriceNumber(price) {
  if (!price && price !== 0) return 0;
  if (typeof price === "number") return price;
  return Number(String(price).replace(/[৳$,]/g, ""));
}

/**
 * Get discount percentage between two prices
 */
export function getDiscountPercentage(currentPrice, originalPrice) {
  const current  = getPriceNumber(currentPrice);
  const original = getPriceNumber(originalPrice);
  if (!original || current >= original) return null;
  return Math.round(((original - current) / original) * 100);
}

// ─── PRODUCT SIZE HELPERS ─────────────────────────────────

/**
 * Get the default size to display for a product.
 * Priority: largest available (in-stock) size first.
 * Falls back to largest size even if out of stock.
 */
export function getDefaultSize(product) {
  if (!product?.sizes?.length) return null;
  const sorted = [...product.sizes].sort((a, b) => b.ml - a.ml);
  return sorted.find((s) => s.stock > 0) || sorted[0];
}

/**
 * Get the primary display image for a product.
 * Uses first image of the default size.
 */
export function getPrimaryImage(product) {
  const size = getDefaultSize(product);
  return size?.images?.[0] || "";
}

/**
 * Get starting price label — "from ৳270"
 */
export function getStartingPrice(product) {
  if (!product?.sizes?.length) return "";
  const min = Math.min(...product.sizes.map((s) => s.price));
  return `from ${formatPrice(min)}`;
}

/**
 * Stock status label + color for a given size
 * Returns { text, color }
 */
export function getStockLabel(stock) {
  if (stock === 0)  return { text: "Sold Out",           color: "var(--mist)" };
  if (stock <= 5)   return { text: `Only ${stock} left`, color: "var(--ink)" };
  return               { text: `${stock} units`,         color: "var(--gold-dark)" };
}

// ─── ORDER ID ─────────────────────────────────────────────
// Format: {ml zero-padded to 2 digits}{3-digit counter starting at 101}
// 30ml → 30101, 30102 ...
// 15ml → 15101, 15102 ...
//  6ml → 06101, 06102 ...

const _counters = {};

export function generateOrderId(ml) {
  if (!_counters[ml]) _counters[ml] = 100;
  _counters[ml] += 1;
  const pad = String(ml).padStart(2, "0");
  return `${pad}${_counters[ml]}`;
}

/**
 * Priority: larger ml = higher priority (lower number = higher priority)
 * 30ml → 1, 15ml → 2, 6ml → 3
 */
export function getOrderPriority(ml) {
  if (ml === 30) return 1;
  if (ml === 15) return 2;
  return 3;
}