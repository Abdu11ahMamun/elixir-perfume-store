import { useCallback, useMemo, useState } from "react";
import { generateOrderId, getOrderPriority } from "../utils/price";

/**
 * useCart — manages cart state for size-aware products
 *
 * Cart item shape:
 * {
 *   ...product,        — full product object
 *   selectedMl,        — which size was chosen (6 | 15 | 30)
 *   price,             — price for the selected size (number)
 *   image,             — first image of selected size
 *   quantity,          — item count
 *   cartKey,           — unique key: `${product.id}-${selectedMl}`
 *   orderId,           — generated order ID e.g. "30101"
 *   priority,          — 1 (30ml) | 2 (15ml) | 3 (6ml)
 * }
 *
 * BACKEND NOTE:
 * Replace useState with server state (React Query / SWR) when ready.
 * addToCart → POST /api/cart
 * removeFromCart → DELETE /api/cart/:cartKey
 * updateQuantity → PATCH /api/cart/:cartKey
 */

export function useCart() {
  const [cart, setCart]           = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // ─── ADD ──────────────────────────────────────────────
  // Expects: { ...product, selectedMl, price, image, quantity? }
  const addToCart = useCallback((item) => {
    if (!item) return;

    const { id, selectedMl, price, image, quantity = 1, sizeId } = item;

    if (!selectedMl) {
      console.warn("useCart.addToCart: selectedMl is required");
      return;
    }

    const cartKey  = `${id}-${selectedMl}`;
    const orderId  = generateOrderId(selectedMl);
    const priority = getOrderPriority(selectedMl);

    setCart((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        // sizeId stored for backend order placement
        { ...item, cartKey, orderId, priority, price, image, quantity, sizeId },
      ];
    });

    setOrderPlaced(false);
  }, []);

  // ─── REMOVE ───────────────────────────────────────────
  const removeFromCart = useCallback((cartKey) => {
    setCart((prev) => prev.filter((i) => i.cartKey !== cartKey));
  }, []);

  // ─── UPDATE QTY ───────────────────────────────────────
  const updateQuantity = useCallback((cartKey, type) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.cartKey === cartKey
            ? { ...i, quantity: i.quantity + (type === "increase" ? 1 : -1) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  // ─── CLEAR ────────────────────────────────────────────
  const clearCart = useCallback(() => setCart([]), []);

  // ─── SUBMIT ───────────────────────────────────────────
  const handleSubmitOrder = useCallback((e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setCart([]);
  }, []);

  // ─── COMPUTED ─────────────────────────────────────────
  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );

  const deliveryFee = cart.length > 0 ? 100 : 0; // ৳100 flat delivery

  const total = subtotal + deliveryFee;

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  // Cart sorted by priority: 30ml items first
  const sortedCart = useMemo(
    () => [...cart].sort((a, b) => a.priority - b.priority),
    [cart]
  );

  return {
    cart: sortedCart,       // always priority-sorted
    rawCart: cart,          // unsorted, if needed
    cartCount,
    subtotal,
    deliveryFee,
    total,
    orderPlaced,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    handleSubmitOrder,
  };
}