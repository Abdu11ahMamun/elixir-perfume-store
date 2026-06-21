import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "../../utils/price";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";

/* ─── CartDrawer ─────────────────────────────────────────
   Props:
   - cart          : sorted cart array from useCart (priority-sorted)
   - isCartOpen    : boolean
   - setIsCartOpen : setter
   - removeFromCart(cartKey)
   - updateQuantity(cartKey, "increase" | "decrease")
   - subtotal, deliveryFee, total : numbers (BDT)
   - onSubmitOrder(e)
   - orderPlaced   : boolean
─────────────────────────────────────────────────────────── */
export default function CartDrawer({
  cart,
  isCartOpen,
  setIsCartOpen,
  removeFromCart,
  updateQuantity,
  subtotal,
  deliveryFee,
  total,
  onSubmitOrder,
  orderPlaced,
}) {
  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[2000]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0"
            style={{ background: "rgba(8,7,11,0.72)" }}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="cart-drawer absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto"
          >
            <div className="p-7 md:p-10">

              {/* ── Header ── */}
              <div className="flex items-start justify-between mb-10">
                <div>
                  <Eyebrow>Checkout</Eyebrow>
                  <h2 className="font-display text-5xl font-light mt-3">
                    Your Bag
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 flex items-center justify-center border transition-colors duration-300"
                  style={{ borderColor: "var(--warm)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
                >
                  ×
                </button>
              </div>

              {/* ── Order Success ── */}
              {orderPlaced && (
                <div
                  className="mb-6 p-5"
                  style={{
                    background: "rgba(201,169,110,0.08)",
                    border: "1px solid rgba(201,169,110,0.25)",
                  }}
                >
                  <p className="font-display italic text-xl" style={{ color: "var(--gold-dark)" }}>
                    Order placed. Thank you.
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--mist)" }}>
                    We'll be in touch shortly.
                  </p>
                </div>
              )}

              {/* ── Empty ── */}
              {cart.length === 0 && !orderPlaced && (
                <div className="text-center py-20">
                  <p className="font-display italic text-6xl mb-5" style={{ color: "var(--warm)" }}>∅</p>
                  <p className="mb-8" style={{ color: "var(--mist)" }}>Your bag is currently empty.</p>
                  <Button onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
                </div>
              )}

              {/* ── Items ── */}
              {cart.length > 0 && (
                <>
                  <div className="space-y-5 mb-8">
                    {cart.map((item) => (
                      <CartItem
                        key={item.cartKey}
                        item={item}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                      />
                    ))}
                  </div>

                  {/* ── Totals ── */}
                  <div className="mb-8 overflow-hidden">
                    <div className="p-6 space-y-3" style={{ background: "var(--warm)" }}>
                      <PriceRow label="Subtotal"     value={formatPrice(subtotal)} />
                      <PriceRow label="Delivery"     value={formatPrice(deliveryFee)} />
                    </div>
                    <div
                      className="p-6 flex justify-between items-center"
                      style={{ background: "var(--ink)" }}
                    >
                      <div>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)", display: "block", marginBottom: "0.3rem" }}>
                          Order Total
                        </span>
                        <span className="font-display text-2xl font-light" style={{ color: "var(--parchment)" }}>Total</span>
                      </div>
                      <span className="font-display font-light" style={{ fontSize: "2.2rem", color: "var(--parchment)" }}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* ── Order Form ── */}
                  <form onSubmit={onSubmitOrder}>
                    <div className="flex items-center gap-3 mb-5">
                      <Eyebrow>Customer Information</Eyebrow>
                      <div style={{ flex: 1, height: "1px", background: "var(--warm)" }} />
                    </div>

                    <div className="space-y-2.5 mb-6">
                      <input required type="text"  placeholder="Full Name"         className="cart-input" />
                      <input required type="tel"   placeholder="Phone Number"      className="cart-input" />
                      <input          type="email" placeholder="Email (optional)"  className="cart-input" />
                      <textarea required rows={3} placeholder="Delivery Address"   className="cart-input" style={{ resize: "none" }} />
                      <select required className="cart-input">
                        <option value="">Payment Method</option>
                        <option>Cash on Delivery</option>
                        <option>Bkash</option>
                        <option>Nagad</option>
                        <option>Card Payment</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full justify-center">
                      Place Order
                    </Button>
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

/* ─── CartItem ─────────────────────────────────────────── */
function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <div
      className="flex gap-4 py-4"
      style={{ borderBottom: "1px solid var(--warm)" }}
    >
      {/* Image */}
      <div className="w-16 h-20 overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-light">{item.name}</h3>

            {/* ML size + note */}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--mist)", marginTop: "2px" }}>
              {item.selectedMl}ml · {item.note}
            </p>

            {/* Order ID */}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", color: "var(--gold-dark)", marginTop: "2px", letterSpacing: "0.1em" }}>
              Order ID: {item.orderId}
            </p>

            {/* Price */}
            <p className="font-display text-base mt-1" style={{ color: "var(--ink)", fontWeight: 400 }}>
              {formatPrice(item.price)}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.cartKey)}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)", cursor: "none" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--mist)"; }}
          >
            Remove
          </button>
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-3 mt-3">
          {[["−", "decrease"], ["＋", "increase"]].map(([sym, type]) => (
            <button
              key={type}
              onClick={() => updateQuantity(item.cartKey, type)}
              className="w-7 h-7 flex items-center justify-center transition-colors duration-300"
              style={{ border: "1px solid var(--warm)", cursor: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; e.currentTarget.style.borderColor = "var(--ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--warm)"; }}
            >
              {sym}
            </button>
          ))}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>{item.quantity}</span>

          {/* Line total */}
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--mist)", marginLeft: "auto" }}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── PriceRow ─────────────────────────────────────────── */
function PriceRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--mist)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink)", fontWeight: 400 }}>{value}</span>
    </div>
  );
}