import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "../../utils/price";
import { placeOrder } from "../../services/orderService";
import Button  from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";

const PAYMENT_OPTIONS = [
  { label: "Cash on Delivery", value: "COD" },
  { label: "Bkash",            value: "BKASH" },
  { label: "Nagad",            value: "NAGAD" },
  { label: "Card Payment",     value: "CARD" },
];

export default function CartDrawer({
  cart,
  isCartOpen,
  setIsCartOpen,
  removeFromCart,
  updateQuantity,
  subtotal,
  deliveryFee,
  total,
  clearCart,
}) {
  // ── Form state ──
  const [form, setForm] = useState({
    customerName:    "",
    customerPhone:   "",
    customerEmail:   "",
    deliveryAddress: "",
    paymentMethod:   "",
  });
  const [loading,      setLoading]      = useState(false);
  const [orderResult,  setOrderResult]  = useState(null); // placed order data
  const [serverError,  setServerError]  = useState("");

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    try {
      const result = await placeOrder({
        ...form,
        items: cart,
      });
      setOrderResult(result);
      clearCart();          // clear cart on success
      setForm({             // reset form
        customerName: "", customerPhone: "", customerEmail: "",
        deliveryAddress: "", paymentMethod: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Order failed. Please try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[2000]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0"
            style={{ background: "rgba(8,7,11,0.72)" }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cart-drawer absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto"
          >
            <div className="p-6 md:p-10">

              {/* ── Header ── */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <Eyebrow>Checkout</Eyebrow>
                  <h2 className="font-display font-light mt-2"
                    style={{ fontSize: "clamp(2.2rem, 6vw, 3rem)" }}>
                    Your Bag
                  </h2>
                </div>
                <button onClick={handleClose}
                  className="w-11 h-11 flex items-center justify-center border transition-colors duration-300 text-xl"
                  style={{ borderColor: "var(--warm)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}>
                  ×
                </button>
              </div>

              {/* ── Order success ── */}
              {orderResult && (
                <div className="space-y-4">
                  <div className="p-6" style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.3)" }}>
                    <p className="font-display italic text-2xl mb-2" style={{ color: "var(--gold-dark)" }}>
                      Order Placed! 🎉
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--mist)", lineHeight: 1.7 }}>
                      Thank you, <strong style={{ color: "var(--ink)" }}>{orderResult.customerName}</strong>!<br />
                      Your order has been received.
                    </p>
                  </div>

                  {/* Order details */}
                  <div className="p-5" style={{ background: "var(--warm)", border: "1px solid rgba(14,12,10,0.08)" }}>
                    <div className="space-y-2">
                      <Row label="Order Number" value={
                        <span className="font-mono font-bold" style={{ color: "var(--ink)", letterSpacing: "0.1em" }}>
                          {orderResult.orderNumber}
                        </span>
                      }/>
                      <Row label="Total"          value={formatPrice(orderResult.grandTotal)} />
                      <Row label="Payment"        value={orderResult.paymentMethod} />
                      <Row label="Status"         value={orderResult.orderStatus} />
                    </div>
                  </div>

                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--mist)", textAlign: "center" }}>
                    Keep your Order Number to track your delivery.
                  </p>

                  <button onClick={handleClose} className="btn-primary w-full justify-center"
                    style={{ marginTop: "0.5rem" }}>
                    Continue Shopping
                  </button>
                </div>
              )}

              {/* ── Empty bag ── */}
              {!orderResult && cart.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-display italic text-6xl mb-5" style={{ color: "var(--warm)" }}>∅</p>
                  <p className="mb-8" style={{ color: "var(--mist)" }}>Your bag is currently empty.</p>
                  <Button onClick={handleClose}>Continue Shopping</Button>
                </div>
              )}

              {/* ── Items + form ── */}
              {!orderResult && cart.length > 0 && (
                <>
                  {/* Cart items */}
                  <div className="space-y-1 mb-8">
                    {cart.map((item) => (
                      <CartItem key={item.cartKey} item={item}
                        removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mb-8">
                    <div className="py-4 px-5 space-y-2.5" style={{ background: "var(--warm)" }}>
                      <PriceRow label="Subtotal" value={formatPrice(subtotal)} />
                      <PriceRow label="Delivery" value={formatPrice(deliveryFee)} />
                    </div>
                    <div className="flex justify-between items-center px-5 py-5"
                      style={{ background: "var(--ink)" }}>
                      <div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)", display: "block", marginBottom: "0.3rem" }}>
                          Order Total
                        </span>
                        <span className="font-display text-2xl font-light" style={{ color: "var(--parchment)" }}>Total</span>
                      </div>
                      <span className="font-display" style={{ fontSize: "2.2rem", fontWeight: 300, color: "var(--parchment)" }}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Order form */}
                  <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-3 mb-5">
                      <Eyebrow style={{ fontSize: "0.58rem" }}>Customer Information</Eyebrow>
                      <div style={{ flex: 1, height: "1px", background: "var(--warm)" }} />
                    </div>

                    {/* Server error */}
                    {serverError && (
                      <div className="mb-4 p-4 text-sm"
                        style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", color: "#b91c1c", fontFamily: "var(--font-body)" }}>
                        {serverError}
                      </div>
                    )}

                    <div className="space-y-2.5 mb-6">
                      <input
                        required type="text" placeholder="Full Name"
                        value={form.customerName} onChange={update("customerName")}
                        className="cart-input"
                      />
                      <input
                        required type="tel" placeholder="Phone Number (+8801...)"
                        value={form.customerPhone} onChange={update("customerPhone")}
                        className="cart-input"
                      />
                      <input
                        type="email" placeholder="Email (optional)"
                        value={form.customerEmail} onChange={update("customerEmail")}
                        className="cart-input"
                      />
                      <textarea
                        required rows={3} placeholder="Delivery Address"
                        value={form.deliveryAddress} onChange={update("deliveryAddress")}
                        className="cart-input" style={{ resize: "none" }}
                      />
                      <select
                        required
                        value={form.paymentMethod} onChange={update("paymentMethod")}
                        className="cart-input"
                      >
                        <option value="">Select Payment Method</option>
                        {PAYMENT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-4 transition-all duration-300"
                      style={{
                        background: loading ? "var(--mist)" : "var(--ink)",
                        color: "var(--parchment)",
                        fontFamily: "var(--font-body)", fontSize: "0.72rem",
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        border: "none", cursor: loading ? "not-allowed" : "none",
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 rounded-full animate-spin"
                            style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "var(--gold)" }} />
                          Placing Order…
                        </>
                      ) : "Place Order →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── CartItem ─── */
function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <div className="flex gap-4 py-5" style={{ borderBottom: "1px solid var(--warm)" }}>
      <div className="w-20 h-24 sm:w-16 sm:h-20 overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-light" style={{ fontSize: "clamp(1.1rem, 4vw, 1.3rem)" }}>{item.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--mist)", marginTop: "3px" }}>
              {item.selectedMl}ml · {item.note}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--gold-dark)", marginTop: "3px", letterSpacing: "0.1em" }}>
              Order ID: {item.orderId}
            </p>
            <p className="font-display font-light mt-2" style={{ fontSize: "1.2rem", color: "var(--ink)" }}>
              {formatPrice(item.price)}
            </p>
          </div>
          <button onClick={() => removeFromCart(item.cartKey)}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--mist)", cursor: "none", paddingTop: "2px" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--mist)"; }}>
            Remove
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          {[["−", "decrease"], ["＋", "increase"]].map(([sym, type]) => (
            <button key={type} onClick={() => updateQuantity(item.cartKey, type)}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
              style={{ border: "1px solid var(--warm)", fontSize: "1rem", cursor: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; e.currentTarget.style.borderColor = "var(--ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--warm)"; }}>
              {sym}
            </button>
          ))}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 400, minWidth: "1.5rem", textAlign: "center" }}>
            {item.quantity}
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--mist)", marginLeft: "auto" }}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--mist)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink)", fontWeight: 400 }}>{value}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1.5"
      style={{ borderBottom: "1px solid rgba(14,12,10,0.06)" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--mist)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink)", fontWeight: 400 }}>{value}</span>
    </div>
  );
}