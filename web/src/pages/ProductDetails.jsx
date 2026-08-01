import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REGULAR_PRODUCTS, FALLBACK_IMAGE } from "../constants/brand";
import ProductImage from "../components/ui/ProductImage";
import {
  formatPrice,
  getDefaultSize,
  getStockLabel,
} from "../utils/price";
import Eyebrow from "../components/ui/Eyebrow";
import Button from "../components/ui/Button";

/* ══════════════════════════════════════════════════════
   IMAGE SLIDER
══════════════════════════════════════════════════════ */
function ImageSlider({ images, alt }) {
  const [idx, setIdx] = useState(0);

  // Reset when images array changes (size switch)
  useEffect(() => { setIdx(0); }, [images]);

  if (!images?.length) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: "3/4", background: "var(--warm)" }}
    >
      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx] || FALLBACK_IMAGE}
          alt={`${alt} ${idx + 1}`}
          loading="eager"
          decoding="async"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        />
      </AnimatePresence>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(14,12,10,0.45)", color: "var(--parchment)", backdropFilter: "blur(8px)", cursor: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14,12,10,0.85)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(14,12,10,0.45)"; }}
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(14,12,10,0.45)", color: "var(--parchment)", backdropFilter: "blur(8px)", cursor: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(14,12,10,0.85)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(14,12,10,0.45)"; }}
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === idx ? "var(--gold)" : "rgba(245,240,232,0.5)",
                  transition: "all 0.3s",
                  cursor: "none",
                }}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          <div
            className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 overflow-x-auto"
            style={{ background: "linear-gradient(to top, rgba(14,12,10,0.6), transparent)" }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="shrink-0 transition-all duration-300"
                style={{
                  width: "48px", height: "48px",
                  border: i === idx ? "2px solid var(--gold)" : "2px solid transparent",
                  overflow: "hidden",
                  cursor: "none",
                }}
              >
                <ProductImage
                  src={img}
                  alt=""
                  aspectRatio="1 / 1"
                  loading="lazy"
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Counter */}
          <div
            className="absolute top-3 right-3 eyebrow px-2 py-1"
            style={{ background: "rgba(14,12,10,0.55)", color: "var(--parchment)", fontSize: "0.5rem", backdropFilter: "blur(8px)" }}
          >
            {idx + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRODUCT DETAILS PAGE
   — Works both as a standalone route /perfumes/:id
     and as a modal (product prop passed directly)
══════════════════════════════════════════════════════ */
export default function ProductDetails({ product, addToCart, onClose }) {
  // ── Local state ──
  const [selectedMl, setSelectedMl] = useState(null);
  const [qty, setQty]               = useState(1);

  // Init: select default size on product change
  useEffect(() => {
    if (!product) return;
    const def = getDefaultSize(product);
    setSelectedMl(def?.ml ?? product.sizes[0]?.ml);
    setQty(1);
  }, [product?.id]);

  if (!product) return null;

  const selectedSize = product.sizes.find((s) => s.ml === selectedMl) ?? product.sizes[0];
  const sl           = getStockLabel(selectedSize.stock);
  const isSoldOut    = selectedSize.stock === 0;

  const handleAdd = () => {
    if (isSoldOut || !addToCart) return;
    addToCart({
      ...product,
      selectedMl,
      price:    selectedSize.price,
      image:    selectedSize.images[0],
      quantity: qty,
      sizeId:   selectedSize.id,   // ← backend productSizeId for order API
    });
    if (onClose) onClose();
  };

  const content = (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── LEFT: Image slider ── */}
        <div className="lg:sticky lg:top-28">
          <ImageSlider
            key={selectedMl}
            images={selectedSize.images}
            alt={product.name}
          />
        </div>

        {/* ── RIGHT: Details ── */}
        <div className="flex flex-col">

          {/* Category + offer tag */}
          <div className="flex items-center gap-3 mb-4">
            <Eyebrow>{product.category}</Eyebrow>
            {product.isCombo && product.offerTag && (
              <span
                className="eyebrow px-3 py-1"
                style={{ background: "var(--plum)", color: "var(--gold)", fontSize: "0.5rem" }}
              >
                {product.offerTag}
              </span>
            )}
          </div>

          {/* Name */}
          <h1
            className="font-display font-light leading-none mb-3"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)" }}
          >
            {product.name}
          </h1>

          {/* Inspired by */}
          <p className="mb-5" style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", color: "var(--mist)" }}>
            Inspired by:{" "}
            <em style={{ color: "var(--gold-dark)", fontStyle: "italic" }}>{product.inspiredBy}</em>
          </p>

          {/* Description */}
          <p
            className="mb-6"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.9, color: "var(--mist)" }}
          >
            {product.description}
          </p>

          {/* Scent note */}
          <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--warm)" }}>
            <Eyebrow style={{ fontSize: "0.52rem" }}>Scent Profile</Eyebrow>
            <p className="mt-2" style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>{product.note}</p>
          </div>

          {/* ── Size selector ── */}
          <div className="mb-5">
            <Eyebrow className="mb-3" style={{ fontSize: "0.52rem" }}>Select Size</Eyebrow>
            <div className="flex gap-2 flex-wrap mt-3">
              {product.sizes.map((s) => {
                const active   = selectedMl === s.ml;
                const outStock = s.stock === 0;
                return (
                  <button
                    key={s.ml}
                    onClick={() => { if (!outStock) { setSelectedMl(s.ml); setQty(1); } }}
                    className="relative transition-all duration-300"
                    style={{
                      padding: "0.65rem 1.3rem",
                      border: "1px solid",
                      cursor: outStock ? "not-allowed" : "none",
                      borderColor: active ? "var(--ink)" : outStock ? "rgba(14,12,10,0.12)" : "rgba(14,12,10,0.22)",
                      background: active ? "var(--ink)" : "transparent",
                      color: active ? "var(--parchment)" : outStock ? "rgba(14,12,10,0.3)" : "var(--ink)",
                      opacity: outStock ? 0.55 : 1,
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: active ? 400 : 300, letterSpacing: "0.1em" }}>
                      {s.ml}ml
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", color: active ? "rgba(245,240,232,0.7)" : "var(--mist)", marginTop: "2px" }}>
                      {formatPrice(s.price)}
                    </div>
                    {/* Strikethrough for sold out */}
                    {outStock && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <div style={{ width: "100%", height: "1px", background: "rgba(14,12,10,0.2)", transform: "rotate(-18deg)" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Stock + Price bar ── */}
          <div
            className="flex items-center justify-between mb-5 p-4"
            style={{ background: "var(--warm)", border: "1px solid rgba(14,12,10,0.06)" }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)", marginBottom: "0.2rem" }}>
                Stock ({selectedSize.ml}ml)
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 400, color: sl.color }}>
                {sl.text}
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)", marginBottom: "0.2rem" }}>
                Price
              </div>
              <div className="font-display text-3xl font-light" style={{ color: "var(--ink)" }}>
                {formatPrice(selectedSize.price)}
              </div>
            </div>
          </div>

          {/* ── Quantity ── */}
          {!isSoldOut && (
            <div className="flex items-center gap-4 mb-6">
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mist)" }}>
                Qty
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
                  style={{ border: "1px solid var(--warm)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
                >
                  −
                </button>
                <span className="font-display text-2xl font-light w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(selectedSize.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
                  style={{ border: "1px solid var(--warm)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
                >
                  +
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--mist)" }}>
                Total:{" "}
                <strong style={{ color: "var(--ink)" }}>
                  {formatPrice(selectedSize.price * qty)}
                </strong>
              </div>
            </div>
          )}

          {/* ── CTA buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <Button
              disabled={isSoldOut}
              onClick={handleAdd}
              className="justify-center flex-1"
              style={{
                opacity: isSoldOut ? 0.5 : 1,
                cursor: isSoldOut ? "not-allowed" : "none",
                padding: "1.1rem 2rem",
                fontSize: "0.8rem",
              }}
            >
              {isSoldOut ? "Out of Stock" : "Add to Bag"}
            </Button>
          </div>

          {/* WhatsApp support */}
          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 mb-6 transition-opacity duration-300 hover:opacity-70"
            style={{ cursor: "none" }}
          >
            {/* WhatsApp icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
              <path d="M12 2C6.486 2 2 6.486 2 12c0 1.745.45 3.448 1.304 4.947L2.032 22l5.194-1.253A9.95 9.95 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18a7.946 7.946 0 01-4.031-1.095l-.29-.173-2.994.722.751-2.913-.19-.3A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="#25D366"/>
            </svg>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--mist)" }}>
              অর্ডারে অসুবিধা হলে{" "}
              <strong style={{ color: "#25D366" }}>WhatsApp</strong>
              {" "}এ মেসেজ করুন
            </span>
          </a>

          {/* SKU */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "rgba(14,12,10,0.28)", letterSpacing: "0.1em" }}>
            SKU: {product.id} · {selectedSize.ml}ml
          </p>
        </div>
      </div>
    </div>
  );

  // ── Always renders as modal overlay ──
  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1500] flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={{ background: "rgba(8,7,11,0.75)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full sm:max-w-[900px] max-h-[95vh] overflow-y-auto"
          style={{ background: "var(--cream)" }}
        >
          {/* Close button — sticky so always visible while scrolling */}
          <div
            className="sticky top-0 z-10 flex justify-end p-3"
            style={{ background: "var(--cream)", borderBottom: "1px solid var(--warm)" }}
          >
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
              style={{ border: "1px solid var(--warm)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
            >
              ×
            </button>
          </div>

          <div className="p-6 sm:p-8">{content}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}