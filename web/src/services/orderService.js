import apiClient from "./apiClient";

// ─── Payment method mapping ───────────────────────────────
// Frontend label → Backend enum
const PAYMENT_METHOD_MAP = {
  "Cash on Delivery": "COD",
  "Bkash":            "BKASH",
  "Nagad":            "NAGAD",
  "Card Payment":     "CARD",
  // Also accept direct values
  "COD":    "COD",
  "BKASH":  "BKASH",
  "NAGAD":  "NAGAD",
  "CARD":   "CARD",
};

/**
 * Place a new order (guest checkout — no auth required)
 *
 * @param {object} orderData
 * @param {string} orderData.customerName
 * @param {string} orderData.customerPhone
 * @param {string} [orderData.customerEmail]
 * @param {string} orderData.deliveryAddress
 * @param {string} orderData.deliveryDistrict
 * @param {string} [orderData.deliveryUpazila]
 * @param {string} orderData.paymentMethod  — frontend label or backend enum
 * @param {Array}  orderData.items          — cart items from useCart
 *
 * Cart item shape (from useCart):
 * { id, selectedMl, price, image, quantity, cartKey, orderId, ... }
 * We need to find the productSizeId from the product sizes
 *
 * Delivery charge is NEVER sent — the backend resolves and validates it
 * server-side from deliveryDistrict/deliveryUpazila.
 */
export async function placeOrder(orderData) {
  const {
    customerName, customerPhone, customerEmail,
    deliveryAddress, deliveryDistrict, deliveryUpazila,
    paymentMethod, items,
  } = orderData;

  // Map payment method to backend enum
  const mappedPayment = PAYMENT_METHOD_MAP[paymentMethod] || "COD";

  // Build order items — send productSizeId + quantity only
  // DO NOT send price (backend calculates)
  const orderItems = items.map((item) => ({
    productSizeId: item.sizeId, // must be stored in cart item
    quantity:      item.quantity,
  }));

  const payload = {
    customerName,
    customerPhone,
    customerEmail:   customerEmail || undefined,
    deliveryAddress,
    deliveryDistrict,
    deliveryUpazila: deliveryUpazila || undefined,
    paymentMethod:   mappedPayment,
    items:           orderItems,
  };

  const res = await apiClient.post("/api/v1/public/orders", payload);
  return res.data.data; // { orderNumber, grandTotal, items, ... }
}

/**
 * Track order by order number
 * @param {string} orderNumber — e.g. "30101"
 */
export async function trackOrder(orderNumber) {
  const res = await apiClient.get(`/api/v1/public/orders/${orderNumber}`);
  return res.data.data;
}