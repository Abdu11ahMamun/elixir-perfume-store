import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "../../utils/price";
import { placeOrder } from "../../services/orderService";
import { getDeliveryDistricts, getDeliveryUpazilas, getDeliveryCharge } from "../../services/deliveryService";
import Button  from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";
import ProductImage from "../ui/ProductImage";

const PAYMENT_OPTIONS = [
  { label: "Cash on Delivery", value: "COD" },
  { label: "Bkash",            value: "BKASH" },
  { label: "Nagad",            value: "NAGAD" },
  { label: "Card Payment",     value: "CARD" },
];

const emptyForm = {
  customerName:    "",
  customerPhone:   "",
  customerEmail:   "",
  deliveryDistrict: "",
  deliveryUpazila:  "",
  deliveryAddress: "",
  paymentMethod:   "",
};

export default function CartDrawer({
  cart,
  isCartOpen,
  setIsCartOpen,
  removeFromCart,
  updateQuantity,
  subtotal,
  deliveryFee,
  setDeliveryFee,
  total,
  clearCart,
}) {
  // ── Form state ──
  const [form, setForm] = useState(emptyForm);
  const [loading,      setLoading]      = useState(false);
  const [orderResult,  setOrderResult]  = useState(null); // placed order data
  const [serverError,  setServerError]  = useState("");
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [showReview,   setShowReview]   = useState(false);

  // ── Delivery location state ──
  const [districts,     setDistricts]     = useState([]);
  const [upazilas,       setUpazilas]      = useState([]);
  const [chargeResolved, setChargeResolved] = useState(false); // has a valid charge been fetched for the current selection?
  const [chargeLoading,  setChargeLoading]  = useState(false);
  const [chargeError,    setChargeError]    = useState("");

  // ── Refs for focus-on-first-invalid-field ──
  const fieldRefs = {
    customerName:     useRef(null),
    customerPhone:    useRef(null),
    customerEmail:    useRef(null),
    deliveryDistrict: useRef(null),
    deliveryUpazila:  useRef(null),
    deliveryAddress:  useRef(null),
    paymentMethod:    useRef(null),
  };
  const FIELD_ORDER = ["customerName", "customerPhone", "customerEmail", "deliveryDistrict", "deliveryUpazila", "deliveryAddress", "paymentMethod"];

  useEffect(() => {
    getDeliveryDistricts().then(setDistricts).catch(() => setDistricts([]));
  }, []);

  const clearFieldError = (field) =>
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    clearFieldError(field);
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setForm((prev) => ({ ...prev, deliveryDistrict: district, deliveryUpazila: "" }));
    setUpazilas([]);
    setChargeResolved(false);
    setChargeError("");
    setDeliveryFee(0);
    clearFieldError("deliveryDistrict");
    clearFieldError("deliveryUpazila");

    if (!district) return;

    setChargeLoading(true);
    try {
      const upazilaList = await getDeliveryUpazilas(district).catch(() => []);
      setUpazilas(upazilaList || []);

      // Try a district-wide charge immediately; a specific upazila (if
      // chosen next) can still narrow/override this.
      const charge = await getDeliveryCharge(district).catch(() => null);
      if (charge) {
        setChargeResolved(true);
        setDeliveryFee(charge.charge);
      } else if (!upazilaList || upazilaList.length === 0) {
        setChargeError("Delivery is not available for this district yet.");
      }
    } finally {
      setChargeLoading(false);
    }
  };

  const handleUpazilaChange = async (e) => {
    const upazila = e.target.value;
    setForm((prev) => ({ ...prev, deliveryUpazila: upazila }));
    clearFieldError("deliveryUpazila");
    setChargeError("");
    setChargeLoading(true);
    try {
      const charge = await getDeliveryCharge(form.deliveryDistrict, upazila || undefined);
      setChargeResolved(true);
      setDeliveryFee(charge.charge);
    } catch {
      setChargeResolved(false);
      setDeliveryFee(0);
      setChargeError("Delivery is not available for this location.");
    } finally {
      setChargeLoading(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  // ── Client-side validation ──
  const validate = () => {
    const errors = {};

    if (!form.customerName.trim()) errors.customerName = "Full name is required";

    const phoneDigits = form.customerPhone.replace(/\D/g, "");
    if (!form.customerPhone.trim()) errors.customerPhone = "Phone number is required";
    else if (phoneDigits.length < 10) errors.customerPhone = "Enter a valid phone number";

    if (form.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
      errors.customerEmail = "Enter a valid email address";
    }

    if (!form.deliveryDistrict) errors.deliveryDistrict = "Please select a district";
    if (upazilas.length > 0 && !form.deliveryUpazila) errors.deliveryUpazila = "Please select an upazila";

    if (!form.deliveryAddress.trim()) errors.deliveryAddress = "Delivery address is required";
    else if (form.deliveryAddress.trim().length < 8) errors.deliveryAddress = "Please provide a more complete address";

    if (!form.paymentMethod) errors.paymentMethod = "Please select a payment method";

    if (form.deliveryDistrict && !chargeResolved && !errors.deliveryDistrict && !errors.deliveryUpazila) {
      errors.deliveryDistrict = "Delivery isn't available for this location yet";
    }

    return errors;
  };

  // Validates and, if everything checks out, opens the invoice review modal
  // — the order isn't sent to the backend until Confirm Order there.
  const handleReview = (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
      fieldRefs[firstInvalid]?.current?.focus();
      return;
    }

    setShowReview(true);
  };

  // Called only from the review modal's Confirm Order button.
  const handleConfirmOrder = async () => {
    setServerError("");
    setLoading(true);

    try {
      const result = await placeOrder({
        ...form,
        items: cart,
      });
      setOrderResult(result);
      setShowReview(false);
      clearCart();          // clear cart on success
      setForm(emptyForm);   // reset form
      setUpazilas([]);
      setChargeResolved(false);
      setChargeError("");
      setFieldErrors({});
    } catch (err) {
      const data = err.response?.data;

      // Map backend validation errors back onto the matching fields —
      // OrderCreateRequest's field names match this form's field names.
      if (data?.validationErrors) {
        setFieldErrors((prev) => ({ ...prev, ...data.validationErrors }));
      } else if (typeof data?.message === "string" && data.message.toLowerCase().includes("delivery")) {
        setFieldErrors((prev) => ({ ...prev, deliveryDistrict: data.message }));
      }

      const msg = data?.message || data?.error || "Order failed. Please try again.";
      setServerError(msg);
      setShowReview(false); // back to editable fields so the error is visible/fixable
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
                  <form onSubmit={handleReview} noValidate>
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
                      <div>
                        <input
                          ref={fieldRefs.customerName}
                          type="text" placeholder="Full Name"
                          value={form.customerName} onChange={update("customerName")}
                          className="cart-input"
                          style={fieldErrors.customerName ? { border: "1px solid #b91c1c" } : undefined}
                        />
                        <FieldError message={fieldErrors.customerName} />
                      </div>

                      <div>
                        <input
                          ref={fieldRefs.customerPhone}
                          type="tel" placeholder="Phone Number (+8801...)"
                          value={form.customerPhone} onChange={update("customerPhone")}
                          className="cart-input"
                          style={fieldErrors.customerPhone ? { border: "1px solid #b91c1c" } : undefined}
                        />
                        <FieldError message={fieldErrors.customerPhone} />
                      </div>

                      <div>
                        <input
                          ref={fieldRefs.customerEmail}
                          type="email" placeholder="Email (optional)"
                          value={form.customerEmail} onChange={update("customerEmail")}
                          className="cart-input"
                          style={fieldErrors.customerEmail ? { border: "1px solid #b91c1c" } : undefined}
                        />
                        <FieldError message={fieldErrors.customerEmail} />
                      </div>

                      <div>
                        <select
                          ref={fieldRefs.deliveryDistrict}
                          value={form.deliveryDistrict} onChange={handleDistrictChange}
                          className="cart-input"
                          style={fieldErrors.deliveryDistrict ? { border: "1px solid #b91c1c" } : undefined}
                        >
                          <option value="">Select District</option>
                          {districts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <FieldError message={fieldErrors.deliveryDistrict} />
                      </div>

                      {form.deliveryDistrict && upazilas.length > 0 && (
                        <div>
                          <select
                            ref={fieldRefs.deliveryUpazila}
                            value={form.deliveryUpazila} onChange={handleUpazilaChange}
                            className="cart-input"
                            style={fieldErrors.deliveryUpazila ? { border: "1px solid #b91c1c" } : undefined}
                          >
                            <option value="">Select Upazila</option>
                            {upazilas.map((u) => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                          <FieldError message={fieldErrors.deliveryUpazila} />
                        </div>
                      )}

                      {/* Delivery charge feedback */}
                      {chargeLoading && (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)" }}>
                          Checking delivery availability…
                        </p>
                      )}
                      {!chargeLoading && chargeError && (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#b91c1c" }}>
                          {chargeError}
                        </p>
                      )}
                      {!chargeLoading && chargeResolved && (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--gold-dark)" }}>
                          Delivery charge: {formatPrice(deliveryFee)}
                        </p>
                      )}

                      <div>
                        <textarea
                          ref={fieldRefs.deliveryAddress}
                          rows={3} placeholder="Full Delivery Address (house, road, area)"
                          value={form.deliveryAddress} onChange={update("deliveryAddress")}
                          className="cart-input" style={{ resize: "none", ...(fieldErrors.deliveryAddress ? { border: "1px solid #b91c1c" } : {}) }}
                        />
                        <FieldError message={fieldErrors.deliveryAddress} />
                      </div>

                      <div>
                        <select
                          ref={fieldRefs.paymentMethod}
                          value={form.paymentMethod} onChange={update("paymentMethod")}
                          className="cart-input"
                          style={fieldErrors.paymentMethod ? { border: "1px solid #b91c1c" } : undefined}
                        >
                          <option value="">Select Payment Method</option>
                          {PAYMENT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <FieldError message={fieldErrors.paymentMethod} />
                      </div>
                    </div>

                    <button
                      type="submit" disabled={loading || chargeLoading}
                      className="w-full flex items-center justify-center gap-2 py-4 transition-all duration-300"
                      style={{
                        background: (loading || chargeLoading) ? "var(--mist)" : "var(--ink)",
                        color: "var(--parchment)",
                        fontFamily: "var(--font-body)", fontSize: "0.72rem",
                        letterSpacing: "0.22em", textTransform: "uppercase",
                        border: "none", cursor: (loading || chargeLoading) ? "not-allowed" : "none",
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 rounded-full animate-spin"
                            style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "var(--gold)" }} />
                          Placing Order…
                        </>
                      ) : "Review Order →"}
                    </button>
                  </form>
                </>
              )}

              {/* ── Invoice review modal ── */}
              <AnimatePresence>
                {showReview && (
                  <OrderReviewModal
                    form={form}
                    cart={cart}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={total}
                    loading={loading}
                    onBack={() => setShowReview(false)}
                    onConfirm={handleConfirmOrder}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── FieldError ─── */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#b91c1c", marginTop: "4px" }}>
      {message}
    </p>
  );
}

/* ─── OrderReviewModal ───────────────────────────────────
   Invoice-style pre-submit confirmation. Nothing is sent to the backend
   until Confirm Order here — Back just closes this and returns to the
   still-editable form underneath.
─────────────────────────────────────────────────────────── */
function OrderReviewModal({ form, cart, subtotal, deliveryFee, total, loading, onBack, onConfirm }) {
  const paymentLabel = PAYMENT_OPTIONS.find((o) => o.value === form.paymentMethod)?.label || form.paymentMethod;

  return (
    <div className="fixed inset-0 z-[2500] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: "rgba(8,7,11,0.8)" }}
        onClick={onBack}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
        style={{ background: "var(--cream)" }}
      >
        <div className="p-6 md:p-8">
          <Eyebrow style={{ fontSize: "0.58rem" }}>Review Before You Confirm</Eyebrow>
          <h2 className="font-display font-light mt-2 mb-6" style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)" }}>
            Order Summary
          </h2>

          {/* Customer information */}
          <div className="mb-6">
            <p className="mb-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)" }}>
              Customer Information
            </p>
            <div className="p-4 space-y-1.5" style={{ background: "var(--warm)" }}>
              <Row label="Name" value={form.customerName} />
              <Row label="Phone" value={form.customerPhone} />
              {form.customerEmail && <Row label="Email" value={form.customerEmail} />}
              <Row label="District" value={form.deliveryDistrict} />
              {form.deliveryUpazila && <Row label="Upazila" value={form.deliveryUpazila} />}
              <Row label="Address" value={form.deliveryAddress} />
            </div>
          </div>

          {/* Bill information */}
          <div className="mb-6">
            <p className="mb-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)" }}>
              Bill Information
            </p>

            <div className="space-y-3 p-4" style={{ background: "var(--warm)" }}>
              {cart.map((item) => (
                <div key={item.cartKey} className="flex items-start justify-between gap-3"
                  style={{ borderBottom: "1px solid rgba(14,12,10,0.08)", paddingBottom: "0.6rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink)" }}>{item.name}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--mist)" }}>
                      {item.selectedMl}ml · Qty {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink)", whiteSpace: "nowrap" }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <PriceRow label="Subtotal" value={formatPrice(subtotal)} />
              <PriceRow label="Delivery Charge" value={formatPrice(deliveryFee)} />
              <PriceRow label="Payment Method" value={paymentLabel} />
            </div>

            <div className="flex justify-between items-center px-4 py-4" style={{ background: "var(--ink)" }}>
              <span className="font-display text-xl font-light" style={{ color: "var(--parchment)" }}>Grand Total</span>
              <span className="font-display" style={{ fontSize: "1.6rem", fontWeight: 300, color: "var(--parchment)" }}>
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Confirmation note */}
          <p className="mb-6" style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)", lineHeight: 1.7 }}>
            After confirming the order, this information can no longer be edited from the checkout page.
            Please review all details carefully.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button" onClick={onBack} disabled={loading}
              className="flex-1 py-3.5 transition-colors duration-300"
              style={{
                border: "1px solid var(--warm)", background: "transparent", color: "var(--ink)",
                fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "none",
              }}
            >
              ← Back
            </button>
            <button
              type="button" onClick={onConfirm} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 transition-colors duration-300"
              style={{
                background: loading ? "var(--mist)" : "var(--ink)", color: "var(--parchment)",
                fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
                border: "none", cursor: loading ? "not-allowed" : "none",
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "var(--gold)" }} />
                  Confirming…
                </>
              ) : "Confirm Order"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── CartItem ─── */
function CartItem({ item, removeFromCart, updateQuantity }) {
  return (
    <div className="flex gap-4 py-5" style={{ borderBottom: "1px solid var(--warm)" }}>
      <ProductImage
        src={item.image}
        alt={item.name}
        aspectRatio="5 / 6"
        loading="lazy"
        className="w-20 h-24 sm:w-16 sm:h-20 shrink-0"
      />
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