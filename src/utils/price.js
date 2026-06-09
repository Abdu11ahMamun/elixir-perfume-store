export function getPriceNumber(price) {
  if (!price) return 0;
  return Number(String(price).replace("$", ""));
}

export function formatPrice(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

export function getDiscountPercentage(price, oldPrice) {
  if (!price || !oldPrice) return null;

  const current = getPriceNumber(price);
  const old = getPriceNumber(oldPrice);

  if (!old || current >= old) return null;

  return Math.round(((old - current) / old) * 100);
}