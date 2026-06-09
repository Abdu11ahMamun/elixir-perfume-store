import { useCallback, useMemo, useState } from "react";
import { getPriceNumber } from "../utils/price";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = useCallback((product) => {
    if (!product || product.stock === "Sold out") return;

    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setOrderPlaced(false);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, type) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.id !== productId) return item;

          return {
            ...item,
            quantity:
              type === "increase" ? item.quantity + 1 : item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleSubmitOrder = useCallback((event) => {
    event.preventDefault();
    setOrderPlaced(true);
    setCart([]);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + getPriceNumber(item.price) * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = cart.length > 0 ? 6 : 0;
  const total = subtotal + deliveryFee;

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return {
    cart,
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