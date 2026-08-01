import { BRAND, STATS } from "../constants/brand";
import { useBestSellers, useOfferProducts, useHomeCategories } from "../hooks/useProducts";
import { buildImageUrl } from "../services/apiClient";
import TrustBar    from "../components/ui/TrustBar";
import CollectionCard from "../components/ui/CollectionCard";
import ProductCard  from "../components/ui/ProductCard";
import Newsletter   from "../components/ui/Newsletter";
import Marquee      from "../components/Marquee";
import Eyebrow      from "../components/ui/Eyebrow";
import Button       from "../components/ui/Button";

/* ─── Home ───────────────────────────────────────────────
   Props:
   - openProductsPage(category)  — navigates to /perfumes
   - openPage(pageName)          — navigates to named page
   - onOpen(product)             — opens ProductDetails modal
─────────────────────────────────────────────────────────── */
export default function Home({ openProductsPage, openPage, onOpen }) {
  const { products: bestSellerProducts, loading: bestSellersLoading, error: bestSellersError } = useBestSellers({ page: 0, size: 8 });
  // Backend already excludes products with no active/in-stock sizes; this is a defensive display filter
  // matching the same "suitable" convention used elsewhere in the storefront.
  const featuredProducts = bestSellerProducts.filter((p) => p.sizes.length > 0).slice(0, 4);
  const featuredLoading = bestSellersLoading;
  const featuredError = bestSellersError;
  const { products: offerProducts, loading: offersLoading, error: offersError } = useOfferProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useHomeCategories();
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "var(--ink)", minHeight: "95vh", display: "flex", alignItems: "stretch" }}>
        <div className="relative w-full grid lg:grid-cols-[1fr_1fr] min-h-[95vh]">

          {/* Left: Text */}
          <div
            className="relative z-10 flex flex-col justify-end px-8 sm:px-14 lg:px-20 py-16 lg:py-24"
            style={{ background: "var(--ink)" }}
          >
            <div className="max-w-md">
              <div className="animate-fade-up">
                <Eyebrow>Luxury Perfume Collection</Eyebrow>
                <div className="divider" />
              </div>

              <h1
                className="font-display animate-fade-up"
                style={{ fontSize: "clamp(3.5rem,8vw,7rem)", fontWeight: 300, lineHeight: 0.95, color: "var(--parchment)", marginBottom: "0.15em", animationDelay: "0.2s" }}
              >
                Wear Your
              </h1>
              <h1
                className="font-display italic animate-fade-up"
                style={{ fontSize: "clamp(3.5rem,8vw,7rem)", fontWeight: 300, lineHeight: 0.95, color: "var(--gold)", marginBottom: "1.4rem", animationDelay: "0.3s" }}
              >
                Signature
              </h1>

              <p
                className="animate-fade-up"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.9, color: "rgba(245,240,232,0.55)", marginBottom: "2.5rem", animationDelay: "0.4s" }}
              >
                {BRAND.description}
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
                <Button onClick={() => openProductsPage("All")}>
                  Explore Collection
                </Button>
                <Button
                  variant="ghost-light"
                  onClick={() => openPage("offers")}
                >
                  View Offers
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div
              className="flex gap-8 mt-14 pt-8 animate-fade-up"
              style={{ borderTop: "1px solid rgba(245,240,232,0.08)", animationDelay: "0.6s" }}
            >
              {STATS.slice(0, 3).map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl font-light" style={{ color: "var(--gold)" }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(245,240,232,0.28)", textTransform: "uppercase", marginTop: "0.2rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero image */}
          <div className="relative overflow-hidden h-[55vw] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
              alt="Signature fragrance"
              className="animate-slow-zoom absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.88) saturate(0.85)" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--ink) 0%, transparent 35%)" }} />

            {/* Floating badge */}
            <div
              className="absolute bottom-8 right-8 text-center animate-float"
              style={{
                width: "96px", height: "96px",
                border: "1px solid rgba(201,169,110,0.5)", borderRadius: "50%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "rgba(14,12,10,0.65)", backdropFilter: "blur(10px)",
              }}
            >
              <span className="font-display italic text-sm" style={{ color: "var(--gold)" }}>New</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.48rem", letterSpacing: "0.28em", color: "var(--parchment)", textTransform: "uppercase", marginTop: "2px" }}>
                Collection
              </span>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <Marquee />

      {/* ── COLLECTIONS ── */}
      <section className="py-24 lg:py-32" style={{ background: "var(--cream)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
            <div>
              <Eyebrow>Collections</Eyebrow>
              <h2
                className="font-display mt-3"
                style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 300, lineHeight: 1.05, color: "var(--ink)" }}
              >
                Explore<br />
                <em style={{ color: "var(--gold-dark)", fontStyle: "italic" }}>Categories</em>
              </h2>
            </div>
            <Button variant="ghost" onClick={() => openProductsPage("All")}>
              View All
            </Button>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-[2rem]"
                  style={{ minHeight: "520px", background: "var(--warm)" }} />
              ))}
            </div>
          ) : categoriesError ? (
            <div className="text-center py-16" style={{ border: "1px solid var(--warm)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--mist)" }}>
                Categories couldn't be loaded right now. Please try again shortly.
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16" style={{ border: "1px solid var(--warm)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--mist)" }}>
                No categories available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category) => (
                <CollectionCard
                  key={category.id}
                  collection={{
                    title: category.name,
                    subtitle: category.description || "",
                    image: buildImageUrl(category.imageUrl), // relative "/uploads/..." path or absolute URL → resolved; CollectionCard falls back if empty/broken
                  }}
                  openProductsPage={openProductsPage}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED FRAGRANCES ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "var(--ink)" }}>
        {/* Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display italic"
            style={{ fontSize: "clamp(8rem,26vw,26rem)", fontWeight: 300, color: "rgba(245,240,232,0.02)", lineHeight: 1, whiteSpace: "nowrap" }}
          >
            Scent
          </span>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Best Sellers</Eyebrow>
              <h2
                className="font-display mt-3"
                style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.0 }}
              >
                Featured<br />
                <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Fragrances</em>
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.85rem", lineHeight: 1.9, color: "rgba(245,240,232,0.38)", maxWidth: "22rem" }}>
              Inspired by the great perfume houses while maintaining a modern, premium identity.
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse"
                  style={{ aspectRatio: "3/4", background: "rgba(245,240,232,0.1)" }} />
              ))}
            </div>
          ) : featuredError ? (
            <div className="text-center py-16" style={{ border: "1px solid rgba(245,240,232,0.1)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,240,232,0.5)" }}>
                Featured fragrances couldn't be loaded right now. Please try again shortly.
              </p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16" style={{ border: "1px solid rgba(245,240,232,0.1)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,240,232,0.5)" }}>
                No fragrances available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-fade-up">
                  <ProductCard product={product} onOpen={onOpen} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── OFFERS / COMBO SECTION ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "var(--plum)" }}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-display italic"
            style={{ fontSize: "clamp(6rem,20vw,20rem)", fontWeight: 300, color: "rgba(245,240,232,0.025)", lineHeight: 1, whiteSpace: "nowrap" }}>
            Offers
          </span>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Special Occasions</Eyebrow>
              <h2 className="font-display mt-3"
                style={{ fontSize: "clamp(2.8rem,5.5vw,4.5rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.0 }}>
                Combos &<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Offers</em>
              </h2>
            </div>
            {offerProducts.length > 0 && (
              <Button variant="ghost-light" onClick={() => openPage("offers")}>
                View All Offers
              </Button>
            )}
          </div>

          {offersLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse" style={{ aspectRatio: "3/4", background: "rgba(245,240,232,0.1)" }} />
              ))}
            </div>
          ) : offersError ? (
            <div className="text-center py-16" style={{ border: "1px solid rgba(245,240,232,0.15)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,240,232,0.6)" }}>
                Offers couldn't be loaded right now. Please try again shortly.
              </p>
            </div>
          ) : offerProducts.length === 0 ? (
            <div className="text-center py-16" style={{ border: "1px solid rgba(245,240,232,0.15)" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "rgba(245,240,232,0.6)" }}>
                No combo offers available right now — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {offerProducts.map((product) => (
                <div key={product.id} className="animate-fade-up">
                  <ProductCard product={product} onOpen={onOpen} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="grid lg:grid-cols-2">

        {/* Image — hidden on mobile, shows on lg */}
        <div className="relative overflow-hidden hidden lg:block" style={{ minHeight: "600px" }}>
          <img
            src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1400&auto=format&fit=crop"
            alt="Luxury perfume"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(0.78) brightness(0.92)" }}
          />
          <div className="absolute pointer-events-none" style={{ inset: "1.8rem", border: "1px solid rgba(201,169,110,0.25)" }} />
          {/* Quote card */}
          <div
            className="absolute bottom-8 left-8"
            style={{ maxWidth: "210px", padding: "1.4rem 1.5rem", background: "var(--plum)", border: "1px solid rgba(201,169,110,0.22)" }}
          >
            <p className="font-display italic leading-relaxed" style={{ fontSize: "1rem", color: "var(--parchment)" }}>
              "Scent is the closest thing to memory."
            </p>
            <p className="eyebrow mt-3" style={{ fontSize: "0.48rem", color: "var(--gold)" }}>— AURVIOR</p>
          </div>
        </div>

        {/* Text — full width on mobile */}
        <div
          className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-24"
          style={{ background: "linear-gradient(145deg, var(--plum) 0%, #0d051f 100%)" }}
        >
          {/* Mobile only: small image strip */}
          <div className="lg:hidden w-full h-52 overflow-hidden mb-8 relative">
            <img
              src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=800&auto=format&fit=crop"
              alt="Luxury perfume"
              className="w-full h-full object-cover object-top"
              style={{ filter: "saturate(0.8)" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, var(--plum) 100%)" }} />
          </div>

          <Eyebrow>Our Philosophy</Eyebrow>
          <div className="divider" />

          <h2
            className="font-display mb-6"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.1 }}
          >
            Crafted For<br />
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Perfume Lovers</em>
          </h2>

          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1rem", lineHeight: 1.9, color: "rgba(245,240,232,0.75)", marginBottom: "1rem" }}>
            We believe a fragrance is more than a scent — it is a mood, a memory, an invisible signature you leave on the world.
          </p>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.9, color: "rgba(245,240,232,0.55)", marginBottom: "2rem" }}>
            AURVIOR combines the elegance of luxury perfume houses with the clarity of modern commerce.
          </p>

          {/* Stats — 2 col always, readable */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ value, label }) => (
              <div key={label} className="p-4 sm:p-5"
                style={{ border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.08)" }}>
                <div className="font-display font-light" style={{ fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: "var(--gold)" }}>{value}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245,240,232,0.5)", marginTop: "0.3rem" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}