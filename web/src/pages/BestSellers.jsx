import { useState } from "react";
import { useBestSellers } from "../hooks/useProducts";
import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

const PAGE_SIZE = 6;

export default function BestSellers({ onOpen }) {
  const [page, setPage] = useState(1);

  const { products, totalPages, loading, error, retry } = useBestSellers({
    page: page - 1, // API is 0-indexed
    size: PAGE_SIZE,
  });

  return (
    <main>
      {/* ── Cinematic header ── */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "50vh", background: "var(--plum)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop"
          alt=""
          className="animate-slow-zoom absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.2, filter: "saturate(0.5)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--plum) 0%, transparent 65%)" }}
        />

        {/* Spinning ring decoration */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            width: "400px", height: "400px",
            border: "1px solid rgba(201,169,110,0.1)",
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            animation: "spin 24s linear infinite",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pb-14 pt-24 w-full">
          <Eyebrow>Customer Favorites</Eyebrow>
          <h1
            className="font-display mt-3"
            style={{
              fontSize: "clamp(3.5rem,9vw,8rem)",
              fontWeight: 300,
              color: "var(--parchment)",
              lineHeight: 0.9,
            }}
          >
            Best<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Sellers</em>
          </h1>
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20"
        style={{ background: "var(--cream)" }}
      >
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="animate-pulse"
                style={{ aspectRatio: "3/4", background: "var(--warm)" }} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-32">
            <p className="font-display italic" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--mist)" }}>
              Unable to Load Best Sellers
            </p>
            <p className="mt-4" style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--mist)" }}>
              Please try again shortly.
            </p>
            <button onClick={retry} className="btn-ghost mt-6" style={{ fontSize: "0.68rem" }}>
              Retry
            </button>
          </div>
        )}

        {/* Data grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                rank={i + 1}
                onOpen={onOpen}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-32">
            <p className="font-display italic" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--mist)" }}>
              No Best Sellers Yet
            </p>
            <p className="mt-4" style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--mist)" }}>
              No best sellers are available right now.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} label="‹" />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PageBtn key={n} onClick={() => setPage(n)} active={page === n} label={n} />
            ))}
            <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} label="›" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)", marginLeft: "8px" }}>
              {page} / {totalPages}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}

function PageBtn({ onClick, disabled, active, label }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid", transition: "all 0.3s var(--ease-luxury)", cursor: disabled ? "not-allowed" : "none",
        fontFamily: "var(--font-body)", fontSize: "0.78rem",
        borderColor: active ? "var(--ink)" : disabled ? "rgba(14,12,10,0.08)" : "rgba(14,12,10,0.18)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--parchment)" : disabled ? "rgba(14,12,10,0.2)" : "var(--mist)",
      }}>
      {label}
    </button>
  );
}
