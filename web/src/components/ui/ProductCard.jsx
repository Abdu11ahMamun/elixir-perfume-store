import { useRef } from "react";
import { getDefaultSize, getPrimaryImage, getStartingPrice } from "../../utils/price";
import Button from "./Button";

/* ─── ProductCard ────────────────────────────────────────
   Props:
   - product        : full product object (new schema with sizes[])
   - onOpen(product): opens ProductDetails modal/page
   - rank           : optional number — shows "No.01" badge
─────────────────────────────────────────────────────────── */
export default function ProductCard({ product, onOpen, rank }) {
  const ref = useRef(null);

  // ── Derived from new schema ──
  const defaultSize  = getDefaultSize(product);
  const primaryImage = getPrimaryImage(product);
  const startingPrice = getStartingPrice(product);

  // Any size in stock?
  const hasStock = product.sizes.some((s) => s.stock > 0);

  // ── 3D magnetic tilt ──
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  };
  const onMouseLeave = () => {
    if (ref.current)
      ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <article
      ref={ref}
      className="product-card"
      style={{
        background: "var(--cream)",
        transition: "transform 0.15s var(--ease-luxury), box-shadow 0.5s var(--ease-luxury)",
        cursor: "none",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={() => onOpen(product)}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={primaryImage}
          alt={product.name}
          className="card-img w-full h-full object-cover"
        />
        <div className="card-overlay" />

        {/* Rank badge */}
        {rank && (
          <div
            className="absolute top-4 left-4 eyebrow px-3 py-1.5"
            style={{
              background: "var(--ink)",
              color: "var(--parchment)",
              fontSize: "0.5rem",
              letterSpacing: "0.3em",
            }}
          >
            No.{String(rank).padStart(2, "0")}
          </div>
        )}

        {/* ML size badges — top right */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          {product.sizes.map((s) => (
            <div
              key={s.ml}
              className="eyebrow px-2 py-0.5"
              style={{
                background: s.stock === 0
                  ? "rgba(14,12,10,0.45)"
                  : "rgba(14,12,10,0.72)",
                color: s.stock === 0
                  ? "rgba(245,240,232,0.35)"
                  : "var(--gold)",
                fontSize: "0.45rem",
                backdropFilter: "blur(6px)",
              }}
            >
              {s.ml}ml
            </div>
          ))}
        </div>

        {/* Combo / offer tag */}
        {product.isCombo && product.offerTag && (
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <span
              className="eyebrow px-3 py-1"
              style={{
                background: "var(--plum)",
                color: "var(--gold)",
                fontSize: "0.5rem",
              }}
            >
              {product.offerTag}
            </span>
          </div>
        )}

        {/* Hover CTA */}
        <div className="card-cta">
          <Button
            variant="ghost-light"
            onClick={(e) => { e.stopPropagation(); onOpen(product); }}
            className="w-full justify-center"
            style={{ fontSize: "0.6rem", padding: "0.65rem 1rem" }}
          >
            View Details →
          </Button>
        </div>
      </div>

      {/* ── Info area ── */}
      <div className="px-1 pt-4 pb-5">
        {/* Category eyebrow */}
        <div className="eyebrow mb-1" style={{ fontSize: "0.5rem" }}>
          {product.category}
        </div>

        {/* Name */}
        <h3
          className="font-display text-xl font-light"
          style={{ lineHeight: 1.1 }}
        >
          {product.name}
        </h3>

        {/* Note */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.72rem",
            color: "var(--mist)",
            marginTop: "0.15rem",
            marginBottom: "0.5rem",
          }}
        >
          {product.note}
        </p>

        {/* Inspired by + starting price */}
        <div className="flex items-end justify-between gap-2 flex-wrap">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              color: "var(--gold-dark)",
              fontStyle: "italic",
            }}
          >
            Inspired by {product.inspiredBy.split("—")[0].trim()}
          </p>

          <span
            className="font-display font-light"
            style={{ fontSize: "0.95rem", color: "var(--ink)" }}
          >
            {hasStock ? startingPrice : (
              <span style={{ color: "var(--mist)", fontSize: "0.78rem" }}>Sold Out</span>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}