import { AnimatePresence, motion } from "framer-motion";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";


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
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60"
        />

        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="cart-drawer absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto"
        >

        <div
          className="fixed inset-0 z-[100]"
          style={{
            pointerEvents: isCartOpen ? "auto" : "none",
          }}
        >
          <div
            onClick={() => setIsCartOpen(false)}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${
              isCartOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <aside
            className={`cart-drawer absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto transition-transform duration-500 ${
              isCartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-7 md:p-10">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <Eyebrow>Checkout</Eyebrow>
                  <h2 className="font-display text-5xl font-light mt-3">
                    Your Bag
                  </h2>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-11 h-11 rounded-full border border-black/10 hover:bg-[var(--ink)] hover:text-white transition"
                >
                  ×
                </button>
              </div>

              {orderPlaced && (
                <div className="mb-6 rounded-[1.5rem] border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-5">
                  <p className="font-display text-2xl text-[var(--gold-dark)]">
                    Order placed successfully.
                  </p>
                  <p className="text-sm text-[var(--mist)] mt-1">
                    We will contact you soon.
                  </p>
                </div>
              )}

              {cart.length === 0 && !orderPlaced && (
                <div className="text-center py-20">
                  <p className="font-display text-6xl text-[var(--warm)] mb-5">
                    ∅
                  </p>
                  <p className="text-[var(--mist)] mb-8">
                    Your bag is currently empty.
                  </p>
                  <Button onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className="space-y-5 mb-8">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-5 border-b border-black/10 pb-5"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-28 object-cover rounded-2xl"
                        />

                        <div className="flex-1">
                          <div className="flex justify-between gap-4">
                            <div>
                              <h3 className="font-display text-2xl font-light">
                                {item.name}
                              </h3>
                              <p className="text-sm text-[var(--mist)]">
                                {item.note}
                              </p>
                              <p className="font-medium mt-2">{item.price}</p>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs uppercase tracking-[0.18em] text-[var(--mist)] hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="flex items-center gap-3 mt-5">
                            <button
                              onClick={() => updateQuantity(item.id, "decrease")}
                              className="w-8 h-8 rounded-full border border-black/10 hover:bg-[var(--ink)] hover:text-white"
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() => updateQuantity(item.id, "increase")}
                              className="w-8 h-8 rounded-full border border-black/10 hover:bg-[var(--ink)] hover:text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-[2rem] overflow-hidden mb-8">
                    <div className="bg-[var(--warm)] p-6 space-y-3">
                      <Row label="Subtotal" value={`$${subtotal}`} />
                      <Row label="Delivery" value={`$${deliveryFee}`} />
                    </div>

                    <div className="bg-[var(--ink)] text-white p-6 flex justify-between items-center">
                      <span className="font-display text-3xl">Total</span>
                      <span className="font-display text-4xl">${total}</span>
                    </div>
                  </div>

                  <form onSubmit={onSubmitOrder}>
                    <Eyebrow>Customer Information</Eyebrow>

                    <div className="space-y-3 mt-5 mb-6">
                      <input required className="cart-input" placeholder="Full Name" />
                      <input required className="cart-input" placeholder="Phone Number" />
                      <input className="cart-input" placeholder="Email optional" />
                      <textarea required rows="3" className="cart-input" placeholder="Delivery Address" />
                      <select required className="cart-input">
                        <option value="">Payment Method</option>
                        <option>Cash on Delivery</option>
                        <option>Bkash</option>
                        <option>Nagad</option>
                        <option>Card Payment</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full justify-center">
                      Submit Order
                    </Button>
                  </form>
                </>
              )}
            </div>
          </aside>
        </div>
           </motion.aside>
      </div>
    )}
  </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--mist)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}