import { useOfferProducts } from "../hooks/useProducts";
import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

export default function Offers({ onOpen }) {
  const { products: offerProducts, loading, error } = useOfferProducts();
  return (
    <main>
      {/* ── Cinematic header ── */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "45vh", background: "var(--plum)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1800&auto=format&fit=crop"
          alt=""
          className="animate-slow-zoom absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.22, filter: "saturate(0.6)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--plum) 0%, transparent 60%)" }}
        />

        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display italic"
            style={{
              fontSize: "clamp(6rem,18vw,18rem)",
              fontWeight: 300,
              color: "rgba(245,240,232,0.03)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Offers
          </span>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pb-12 pt-20 w-full">
          <Eyebrow>Special Occasions</Eyebrow>
          <h1
            className="font-display mt-3"
            style={{
              fontSize: "clamp(3rem,8vw,7rem)",
              fontWeight: 300,
              color: "var(--parchment)",
              lineHeight: 0.9,
            }}
          >
            Combos &<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Offers</em>
          </h1>
          <p
            className="mt-4 max-w-md"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.88rem",
              lineHeight: 1.85,
              color: "rgba(245,240,232,0.45)",
            }}
          >
            Curated sets for every special occasion — Valentine's, Eid,
            anniversaries, and gifting.
          </p>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20"
        style={{ background: "var(--cream)" }}
      >
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse" style={{ aspectRatio: "3/4", background: "var(--warm)" }} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p
              className="font-display italic"
              style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--mist)" }}
            >
              Unable to Load Offers
            </p>
            <p
              className="mt-4"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                color: "var(--mist)",
              }}
            >
              Please try again shortly.
            </p>
          </div>
        ) : offerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {offerProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <ProductCard product={product} onOpen={onOpen} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p
              className="font-display italic"
              style={{ fontSize: "clamp(2rem,4vw,3.5rem)", color: "var(--mist)" }}
            >
              Coming Soon
            </p>
            <p
              className="mt-4"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                color: "var(--mist)",
              }}
            >
              Special offers and combo sets are on their way.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}