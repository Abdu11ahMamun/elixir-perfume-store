import { REGULAR_PRODUCTS } from "../constants/brand";
import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

export default function BestSellers({ onOpen }) {
  const bestSellers = REGULAR_PRODUCTS.slice(0, 6);

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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
          {bestSellers.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={i + 1}
              onOpen={onOpen}
            />
          ))}
        </div>
      </div>
    </main>
  );
}