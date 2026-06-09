import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BRAND, FEATURED, PRODUCTS, COLLECTIONS, STATS, CATEGORIES, NAV_LINKS } from "./constants/brand";

/* ─── Micro Components ────────────────────────────────── */
const Eyebrow = ({ children, light = false, className = "" }) => (
  <span className={`eyebrow ${light ? "text-[var(--gold)]" : "text-[var(--gold)]"} ${className}`}>
    {children}
  </span>
);

const Divider = ({ light = false }) => (
  <div className={`divider ${light ? "bg-[var(--gold)]" : "bg-[var(--gold)]"}`} />
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ─── Custom Cursor ───────────────────────────────────── */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const hover = (e) => {
      const isLink = e.target.closest("button, a, [data-cursor]");
      document.body.classList.toggle("cursor-hover", !!isLink);
    };

    const tick = () => {
      if (dot.current)  { dot.current.style.left  = pos.current.x + "px"; dot.current.style.top  = pos.current.y + "px"; }
      if (ring.current) { ring.current.style.left = pos.current.x + "px"; ring.current.style.top = pos.current.y + "px"; }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", hover);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ─── Marquee Strip ───────────────────────────────────── */
const MARQUEE_ITEMS = ["Noir Ember", "Velvet Bloom", "Azure Mist", "Golden Oud", "Rose Dusk", "Midnight Leather", "Oud Royale"];

function MarqueeStrip() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-strip py-4 overflow-hidden">
      <div className="marquee-track animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            {item} <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Nav ─────────────────────────────────────────────── */
function Nav({ activePage, openPage, openProductsPage, cartCount, setIsCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHome = () => { openPage("home"); setMenuOpen(false); };
  const goProducts = () => { openProductsPage("All"); setMenuOpen(false); };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(250,247,242,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.2)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
        {/* Logo */}
        <button onClick={goHome} className="text-left group">
          <div
            className="font-display text-2xl sm:text-3xl tracking-[0.35em] font-light"
            style={{ color: "var(--ink)" }}
          >
            ÉLIXIR
          </div>
          <div className="eyebrow" style={{ fontSize: "0.52rem", letterSpacing: "0.4em", color: "var(--mist)" }}>
            Signature Fragrances
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => page === "products" ? openProductsPage("All") : openPage(page)}
              className={`nav-link ${activePage === page ? "active" : ""}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative group flex items-center gap-2"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            <span
              className="w-8 h-8 flex items-center justify-center border transition-colors duration-300"
              style={{ borderColor: "var(--ink)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
            >
              {cartCount}
            </span>
            <span className="hidden sm:block" style={{ color: "var(--ink)" }}>Bag</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px transition-all duration-300" style={{ background: "var(--ink)", transform: menuOpen ? "rotate(45deg) translateY(3px)" : "none" }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: "var(--ink)", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: "var(--ink)", transform: menuOpen ? "rotate(-45deg) translateY(-3px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{ maxHeight: menuOpen ? "280px" : "0", borderTop: menuOpen ? "1px solid var(--warm)" : "none" }}
      >
        <nav className="px-6 py-6 flex flex-col gap-5" style={{ background: "var(--cream)" }}>
          {NAV_LINKS.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { page === "products" ? openProductsPage("All") : openPage(page); setMenuOpen(false); }}
              className="nav-link text-left"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ─── Product Card ────────────────────────────────────── */
function ProductCard({ item, rank, addToCart }) {
  return (
    <div className="product-card group" style={{ background: "var(--cream)" }}>
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={item.image}
          alt={item.name}
          className="card-img w-full h-full object-cover"
        />
        <div className="card-overlay" />

        {rank && (
          <div
            className="absolute top-4 left-4 eyebrow px-3 py-1.5"
            style={{ background: "var(--ink)", color: "var(--parchment)", fontSize: "0.55rem" }}
          >
            No. {rank}
          </div>
        )}
        {item.stock === "Sold out" && (
          <div
            className="absolute top-4 right-4 eyebrow px-3 py-1.5"
            style={{ background: "rgba(250,247,242,0.92)", color: "var(--mist)", fontSize: "0.55rem" }}
          >
            Sold Out
          </div>
        )}

        {/* Hover CTA */}
        <div className="card-cta">
          <button
            disabled={item.stock === "Sold out"}
            onClick={() => addToCart(item)}
            className="w-full btn-ghost-light text-center justify-center"
          >
            {item.stock === "Sold out" ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-1 pt-4 pb-5">
        <div className="eyebrow mb-2" style={{ fontSize: "0.55rem" }}>{item.category}</div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-light leading-tight">{item.name}</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--mist)", marginTop: "0.2rem" }}>
              {item.note}
            </p>
          </div>
          <span
            className="font-display text-lg font-light shrink-0"
            style={{ color: "var(--ink)" }}
          >
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ───────────────────────────────────────── */
function HomePage({ openPage, openProductsPage, addToCart }) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative" style={{ background: "var(--ink)", minHeight: "92vh", display: "flex", alignItems: "stretch" }}>
        <div className="relative w-full grid lg:grid-cols-[1fr_1fr] min-h-[92vh]">
          {/* Left: Text */}
          <div
            className="relative z-10 flex flex-col justify-end px-8 sm:px-14 lg:px-20 py-16 lg:py-24"
            style={{ background: "var(--ink)" }}
          >
            <div className="max-w-md">
              <div className="animate-fade-up">
                <Eyebrow>Luxury Perfume Collection</Eyebrow>
                <Divider />
              </div>

              <h1
                className="font-display animate-fade-up delay-200"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 300, lineHeight: 1.02, color: "var(--parchment)", marginBottom: "0.2em" }}
              >
                Wear Your
                <br />
                <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Signature</em>
              </h1>

              <p
                className="animate-fade-up delay-300"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.9, color: "rgba(245,240,232,0.6)", marginBottom: "2.5rem", maxWidth: "30rem" }}
              >
                A premium perfume destination designed only for fragrance lovers.
                Elegant, modern, and deeply luxurious.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
                <button onClick={() => openProductsPage("All")} className="btn-primary">
                  Explore Collection <ArrowRight />
                </button>
                <button onClick={() => openPage("bestSellers")} className="btn-ghost" style={{ color: "var(--parchment)", borderColor: "rgba(245,240,232,0.3)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,240,232,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  Best Sellers
                </button>
              </div>
            </div>

            {/* Bottom stat strip */}
            <div
              className="flex gap-8 mt-16 pt-8 animate-fade-up delay-500"
              style={{ borderTop: "1px solid rgba(245,240,232,0.1)" }}
            >
              {STATS.slice(0, 3).map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display text-2xl font-light" style={{ color: "var(--gold)" }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--mist)", textTransform: "uppercase", marginTop: "0.2rem" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative overflow-hidden h-[55vw] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
              alt="Signature fragrance"
              className="animate-slow-zoom absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.85) saturate(0.9)" }}
            />
            {/* Gold vignette edge */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--ink) 0%, transparent 30%)" }} />

            {/* Floating badge */}
            <div
              className="absolute bottom-8 right-8 text-center animate-float"
              style={{
                width: "100px", height: "100px",
                border: "1px solid rgba(201,169,110,0.5)",
                borderRadius: "50%",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "rgba(14,12,10,0.6)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="font-display italic text-sm" style={{ color: "var(--gold)" }}>New</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.5rem", letterSpacing: "0.25em", color: "var(--parchment)", textTransform: "uppercase", marginTop: "2px" }}>
                Collection
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeStrip />

      {/* ── Collections ── */}
      <section className="py-24 lg:py-36" style={{ background: "var(--cream)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <Eyebrow>Collections</Eyebrow>
              <h2 className="font-display mt-3" style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 300, lineHeight: 1.05 }}>
                Explore Categories
              </h2>
            </div>
            <button onClick={() => openProductsPage("All")} className="btn-ghost shrink-0">
              View All <ArrowRight />
            </button>
          </div>

          {/* Uniform grid — all cards same aspect ratio */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {COLLECTIONS.map((item) => (
              <div
                key={item.title}
                className="collection-card relative overflow-hidden group cursor-none"
                style={{ aspectRatio: "2/3" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,12,10,0.85) 0%, rgba(14,12,10,0.15) 55%, transparent 100%)" }} />

                {/* Gold tint on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "rgba(201,169,110,0.1)" }}
                />

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <div className="eyebrow mb-1.5" style={{ fontSize: "0.52rem", color: "rgba(201,169,110,0.75)" }}>
                    {item.subtitle}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-light mb-3" style={{ color: "var(--parchment)" }}>
                    {item.title}
                  </h3>
                  {/* CTA: always visible, slides up on hover via transform */}
                  <div
                    className="transition-all duration-500"
                    style={{ transform: "translateY(4px)", opacity: 0.7 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.transform = "translateY(4px)"; }}
                  >
                    <button
                      onClick={() => openProductsPage(item.title)}
                      className="btn-ghost-light"
                      style={{ fontSize: "0.62rem", padding: "0.5rem 1.2rem" }}
                    >
                      Discover <ArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Fragrances ── */}
      <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: "var(--ink)" }}>
        {/* Subtle background texture: large faded serif characters */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display italic"
            style={{ fontSize: "32vw", fontWeight: 300, color: "rgba(245,240,232,0.025)", lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}
          >
            Scent
          </span>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <Eyebrow>Best Sellers</Eyebrow>
            <h2
              className="font-display mt-3 mb-5"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.05 }}
            >
              Featured Fragrances
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "rgba(245,240,232,0.45)", maxWidth: "30rem", margin: "0 auto", lineHeight: 1.9 }}>
              Inspired by luxury perfume houses while maintaining a modern, premium identity.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURED.map((item, i) => (
              <div key={item.name} className={`animate-fade-up delay-${(i + 1) * 100}`}>
                <ProductCard item={item} addToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy / Brand Story ── */}
      <section className="py-24 lg:py-36 overflow-hidden" style={{ background: "var(--cream)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
            {/* Image block */}
            <div className="relative">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/5" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1400&auto=format&fit=crop"
                  alt="Luxury perfume"
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(0.85)" }}
                />
                {/* Gold frame accent */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ border: "1px solid rgba(201,169,110,0.3)", margin: "1.5rem" }}
                />
              </div>
              {/* Floating quote card */}
              <div
                className="absolute -bottom-6 -right-4 sm:-right-8 max-w-[220px] p-5"
                style={{
                  background: "var(--ink)",
                  border: "1px solid rgba(201,169,110,0.3)",
                }}
              >
                <p className="font-display italic text-sm leading-relaxed" style={{ color: "var(--parchment)" }}>
                  "Scent is the closest thing to memory."
                </p>
                <p className="mt-2 eyebrow" style={{ fontSize: "0.5rem", color: "var(--gold)" }}>
                  — ÉLIXIR
                </p>
              </div>
            </div>

            {/* Text block */}
            <div className="lg:pl-8">
              <Eyebrow>Our Philosophy</Eyebrow>
              <Divider />
              <h2 className="font-display mb-6" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1 }}>
                Crafted For<br />
                <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Perfume Lovers</em>
              </h2>

              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.95, color: "var(--mist)", marginBottom: "1.5rem" }}>
                We believe a fragrance is more than a scent — it is a mood, a memory, an
                invisible signature you leave on the world. Every bottle in our collection
                is chosen for its depth, its longevity, and its ability to move you.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.95, color: "var(--mist)", marginBottom: "2.5rem" }}>
                ÉLIXIR combines the elegance of luxury perfume houses with the clarity of
                modern ecommerce — refined typography, cleaner spacing, and a visual
                hierarchy that honors the product.
              </p>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-4">
                {STATS.map(({ value, label }) => (
                  <div
                    key={label}
                    className="p-5"
                    style={{ border: "1px solid var(--warm)", background: "var(--warm)" }}
                  >
                    <div className="font-display text-3xl font-light" style={{ color: "var(--ink)" }}>{value}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", letterSpacing: "0.12em", color: "var(--mist)", textTransform: "uppercase", marginTop: "0.3rem" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <Newsletter />
    </>
  );
}

/* ─── PRODUCTS PAGE ───────────────────────────────────── */
// Backend-ready: swap the useMemo filter for an API call (useQuery / axios.get)
// and replace PAGE_SIZE + local slice with server-side { page, limit, total } response.
const PAGE_SIZE = 8;

function ProductsPage({ activeCategory, setActiveCategory, addToCart }) {
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [sort, setSort]       = useState("default"); // ready for backend: ?sort=price_asc etc.

  // Reset to page 1 whenever filter/search changes
  const resetPage = () => setPage(1);

  // ── Local filter (replace this block with an API call when backend is ready) ──
  const filtered = useMemo(() => {
    let result = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc")  result = [...result].sort((a, b) => Number(a.price.replace("$","")) - Number(b.price.replace("$","")));
    if (sort === "price_desc") result = [...result].sort((a, b) => Number(b.price.replace("$","")) - Number(a.price.replace("$","")));
    if (sort === "name_asc")   result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [activeCategory, search, sort]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasResults  = paginated.length > 0;

  const handleCategory = (cat) => { setActiveCategory(cat); resetPage(); };
  const handleSearch   = (e)   => { setSearch(e.target.value); resetPage(); };
  const handleSort     = (e)   => { setSort(e.target.value); resetPage(); };

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
      {/* ── Page Header ── */}
      <div className="mb-10">
        <Eyebrow>Perfume Shop</Eyebrow>
        <h2
          className="font-display mt-3"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", fontWeight: 300, lineHeight: 1, color: "var(--ink)" }}
        >
          All Perfumes
        </h2>
      </div>

      {/* ── Search + Sort toolbar ── */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-6 pb-6"
        style={{ borderBottom: "1px solid var(--warm)" }}
      >
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            width="13" height="13" viewBox="0 0 13 13" fill="none"
            style={{ color: "var(--mist)" }}
          >
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1"/>
            <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search fragrances…"
            className="cart-input"
            style={{ paddingLeft: "2.2rem", background: "var(--warm)" }}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); resetPage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--mist)", fontSize: "1rem", lineHeight: 1, cursor: "none" }}
            >
              ×
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={handleSort}
          className="cart-input"
          style={{ background: "var(--warm)", maxWidth: "200px", cursor: "none" }}
        >
          <option value="default">Sort: Featured</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name_asc">Name: A → Z</option>
        </select>

        {/* Result count */}
        <span
          className="self-center ml-auto shrink-0"
          style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)" }}
        >
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.55rem 1.4rem",
              border: "1px solid",
              borderColor: activeCategory === cat ? "var(--ink)" : "rgba(14,12,10,0.15)",
              background: activeCategory === cat ? "var(--ink)" : "transparent",
              color: activeCategory === cat ? "var(--parchment)" : "var(--mist)",
              transition: "all 0.3s var(--ease-luxury)",
              whiteSpace: "nowrap",
              cursor: "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      {hasResults ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">
          {paginated.map((item, i) => (
            <div key={item.name} className={`animate-fade-up delay-${Math.min((i + 1) * 100, 700)}`}>
              <ProductCard item={item} addToCart={addToCart} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="font-display italic text-5xl mb-4" style={{ color: "var(--warm)" }}>∅</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--mist)" }}>
            No fragrances found for <em>"{search}"</em>
          </p>
          <button
            onClick={() => { setSearch(""); resetPage(); }}
            className="btn-ghost mt-6"
            style={{ fontSize: "0.68rem" }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {/* Backend note: replace totalPages with Math.ceil(apiResponse.total / PAGE_SIZE) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14">
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
            style={{
              border: "1px solid",
              borderColor: page === 1 ? "rgba(14,12,10,0.1)" : "var(--ink)",
              color: page === 1 ? "rgba(14,12,10,0.25)" : "var(--ink)",
              cursor: page === 1 ? "not-allowed" : "none",
            }}
          >
            ‹
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: "36px", height: "36px",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid",
                borderColor: page === n ? "var(--ink)" : "rgba(14,12,10,0.12)",
                background: page === n ? "var(--ink)" : "transparent",
                color: page === n ? "var(--parchment)" : "var(--mist)",
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                transition: "all 0.3s var(--ease-luxury)",
                cursor: "none",
              }}
            >
              {n}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center transition-colors duration-300"
            style={{
              border: "1px solid",
              borderColor: page === totalPages ? "rgba(14,12,10,0.1)" : "var(--ink)",
              color: page === totalPages ? "rgba(14,12,10,0.25)" : "var(--ink)",
              cursor: page === totalPages ? "not-allowed" : "none",
            }}
          >
            ›
          </button>

          {/* Page indicator */}
          <span
            className="ml-3"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)" }}
          >
            {page} / {totalPages}
          </span>
        </div>
      )}
    </main>
  );
}

/* ─── BEST SELLERS PAGE ───────────────────────────────── */
function BestSellersPage({ addToCart }) {
  return (
    <main>
      {/* Cinematic header */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "50vh", background: "var(--ink)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop"
          alt="Best Sellers"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.35, filter: "saturate(0.6)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 pt-24">
          <Eyebrow>Customer Favorites</Eyebrow>
          <h2
            className="font-display mt-3"
            style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1 }}
          >
            Best Sellers
          </h2>
        </div>
      </div>

      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20"
        style={{ background: "var(--cream)" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {PRODUCTS.slice(0, 6).map((item, i) => (
            <ProductCard key={item.name} item={item} rank={i + 1} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </main>
  );
}

/* ─── ABOUT PAGE ──────────────────────────────────────── */
function AboutPage() {
  return (
    <main>
      {/* Split hero */}
      <section className="grid lg:grid-cols-2 min-h-[70vh]">
        <div
          className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-20"
          style={{ background: "var(--ink)" }}
        >
          <Eyebrow>About ÉLIXIR</Eyebrow>
          <Divider />
          <h2
            className="font-display mt-2 mb-8"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.05 }}
          >
            Made For<br />
            <em style={{ color: "var(--gold)" }}>Everyday Luxury</em>
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.92rem", lineHeight: 1.95, color: "rgba(245,240,232,0.6)", maxWidth: "30rem" }}>
            ÉLIXIR is a perfume-only shopping experience built for people who
            love elegant, memorable, and long-lasting fragrances. Our goal is
            to make premium perfume shopping simple, beautiful, and trustworthy.
          </p>
        </div>

        <div className="relative overflow-hidden h-[60vw] lg:h-auto">
          <img
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop"
            alt="About"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(0.85)" }}
          />
        </div>
      </section>

      {/* Values */}
      <section className="py-24" style={{ background: "var(--cream)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <Eyebrow>Our Values</Eyebrow>
            <h3 className="font-display mt-3" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300 }}>
              Why Choose ÉLIXIR
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Premium Feel", text: "Clean design, luxury presentation, and a focused perfume-only store experience that honors each fragrance.", icon: "✦" },
              { title: "Easy Shopping", text: "Browse collections, filter by category, and add your favorites to cart with a seamless, refined checkout.", icon: "◈" },
              { title: "Fast Delivery", text: "Designed for smooth local perfume orders with same-day dispatch and flexible payment options.", icon: "◇" },
            ].map(({ title, text, icon }) => (
              <div
                key={title}
                className="p-8 group transition-colors duration-500"
                style={{ border: "1px solid var(--warm)", background: "var(--warm)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.querySelectorAll("[data-invert]").forEach(el => { el.style.color = "var(--parchment)"; }); e.currentTarget.querySelector("[data-icon]").style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--warm)"; e.currentTarget.style.borderColor = "var(--warm)"; e.currentTarget.querySelectorAll("[data-invert]").forEach(el => { el.style.color = "var(--ink)"; }); e.currentTarget.querySelector("[data-icon]").style.color = "var(--gold)"; }}
              >
                <div className="font-display text-3xl mb-4" data-icon style={{ color: "var(--gold)" }}>{icon}</div>
                <h3 className="font-display text-2xl font-light mb-3 transition-colors duration-500" data-invert style={{ color: "var(--ink)" }}>{title}</h3>
                <p className="transition-colors duration-500" data-invert style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", lineHeight: 1.9, color: "var(--mist)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

/* ─── NEWSLETTER ──────────────────────────────────────── */
function Newsletter() {
  return (
    <section
      className="relative overflow-hidden py-28 lg:py-40"
      style={{ background: "var(--ink)" }}
    >
      {/* Large watermark serif word — always visible */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display italic"
          style={{
            fontSize: "clamp(8rem, 22vw, 22rem)",
            fontWeight: 300,
            color: "rgba(245,240,232,0.03)",
            lineHeight: 1,
            whiteSpace: "nowrap",
            userSelect: "none",
            letterSpacing: "-0.02em",
          }}
        >
          Fragrance
        </span>
      </div>

      {/* Concentric rings — larger, more opacity so they render visibly */}
      {[320, 520, 720, 920].map((size) => (
        <div
          key={size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: `${size}px`, height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid rgba(201,169,110,${0.14 - size * 0.00012})`,
          }}
        />
      ))}

      <div className="relative max-w-xl mx-auto px-6 text-center">
        <Eyebrow>Stay Updated</Eyebrow>

        {/* Gold divider line */}
        <div className="flex items-center justify-center gap-4 my-5">
          <div style={{ flex: 1, height: "1px", background: "rgba(201,169,110,0.2)", maxWidth: "60px" }} />
          <span className="font-display italic text-sm" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>✦</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(201,169,110,0.2)", maxWidth: "60px" }} />
        </div>

        <h2
          className="font-display mb-6"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.2rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
        >
          Join The<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Fragrance Club</em>
        </h2>

        <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.9, color: "rgba(245,240,232,0.45)", marginBottom: "2.8rem", maxWidth: "28rem", margin: "0 auto 2.8rem" }}>
          Exclusive launches, special discounts, and curated perfume recommendations
          delivered directly to your inbox.
        </p>

        {/* Input group — seamless luxury style */}
        <div
          className="flex flex-col sm:flex-row max-w-md mx-auto"
          style={{ border: "1px solid rgba(201,169,110,0.35)" }}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-5 py-4 outline-none"
            style={{
              background: "rgba(245,240,232,0.06)",
              color: "var(--parchment)",
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.85rem",
              border: "none",
              minWidth: 0,
            }}
            onFocus={e => { e.currentTarget.parentElement.style.borderColor = "rgba(201,169,110,0.7)"; }}
            onBlur={e => { e.currentTarget.parentElement.style.borderColor = "rgba(201,169,110,0.35)"; }}
          />
          <button
            className="shrink-0 px-7 py-4 transition-colors duration-300"
            style={{
              background: "var(--gold)",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              border: "none",
              cursor: "none",
              borderLeft: "1px solid rgba(201,169,110,0.35)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#d4a96a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--gold)"; }}
          >
            Subscribe
          </button>
        </div>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(245,240,232,0.2)", marginTop: "1.2rem", textTransform: "uppercase" }}>
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────── */
function Footer({ openPage, openProductsPage }) {
  return (
    <footer style={{ background: "#080604", borderTop: "1px solid rgba(201,169,110,0.15)" }}>
      <div className="relative overflow-hidden max-w-[1400px] mx-auto px-6 lg:px-12 py-16">

        {/* Large faded ÉLIXIR wordmark watermark */}
        <div
          className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display"
            style={{
              fontSize: "clamp(6rem, 16vw, 14rem)",
              fontWeight: 300,
              letterSpacing: "0.25em",
              color: "rgba(245,240,232,0.022)",
              lineHeight: 1,
              whiteSpace: "nowrap",
              userSelect: "none",
              paddingLeft: "1rem",
            }}
          >
            ÉLIXIR
          </span>
        </div>

        <div className="relative grid md:grid-cols-[2fr_1px_1fr_1fr] gap-0 mb-12 items-start">
          {/* Brand col */}
          <div className="pr-10 pb-10 md:pb-0">
            <div className="font-display text-2xl tracking-[0.35em] font-light mb-1" style={{ color: "var(--parchment)" }}>ÉLIXIR</div>
            <div className="eyebrow mb-5" style={{ fontSize: "0.5rem", color: "var(--mist)" }}>Signature Fragrances</div>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", lineHeight: 1.9, color: "var(--mist)", maxWidth: "22rem" }}>
              A premium perfume-only concept focused on luxury, aesthetics, and
              elevated shopping experiences.
            </p>
          </div>

          {/* Gold vertical rule */}
          <div className="hidden md:block self-stretch" style={{ background: "rgba(201,169,110,0.15)", width: "1px" }} />

          {/* Link columns */}
          {[
            { heading: "Shop", links: [["Men", "For Him"], ["Women", "For Her"], ["Luxury Oud", "Luxury Oud"], ["Gift Sets", "Gift Sets"]] },
            { heading: "Support", links: [["Contact", null], ["Shipping", null], ["Returns", null], ["FAQ", null]] },
          ].map(({ heading, links }) => (
            <div key={heading} className="pl-0 md:pl-10 pt-10 md:pt-0">
              <div className="eyebrow mb-5" style={{ fontSize: "0.6rem", color: "var(--parchment)" }}>{heading}</div>
              <ul className="space-y-3">
                {links.map(([label, cat]) => (
                  <li key={label}>
                    <button
                      onClick={() => cat ? openProductsPage(cat) : null}
                      style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.82rem", color: "var(--mist)", transition: "color 0.3s", cursor: "none" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--mist)"; }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(138,128,117,0.45)" }}>
            © 2025 ÉLIXIR. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "0.82rem", color: "rgba(201,169,110,0.35)", letterSpacing: "0.05em" }}>
            Wear Your Signature.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── CART DRAWER ─────────────────────────────────────── */
function CartDrawer({ cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, deliveryFee, total, onSubmitOrder, orderPlaced }) {
  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: isCartOpen ? "all" : "none" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: "rgba(14,12,10,0.6)", opacity: isCartOpen ? 1 : 0 }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        className="cart-drawer absolute right-0 top-0 h-full w-full sm:max-w-[500px] overflow-y-auto transition-transform duration-500 ease-in-out"
        style={{ transform: isCartOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="p-7 sm:p-9">
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <Eyebrow>Checkout</Eyebrow>
              <h3 className="font-display text-4xl font-light mt-2">Your Bag</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-1 w-9 h-9 flex items-center justify-center transition-colors duration-300"
              style={{ border: "1px solid var(--warm)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; }}
            >
              ×
            </button>
          </div>

          {/* Success */}
          {orderPlaced && (
            <div className="mb-6 p-5" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)" }}>
              <p className="font-display italic text-lg" style={{ color: "var(--gold-dark)" }}>Order placed. Thank you.</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--mist)", marginTop: "0.3rem" }}>
                We'll be in touch soon.
              </p>
            </div>
          )}

          {/* Empty */}
          {cart.length === 0 && !orderPlaced && (
            <div className="text-center py-16">
              <div className="font-display italic text-5xl mb-4" style={{ color: "var(--warm)" }}>∅</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--mist)", marginBottom: "2rem" }}>
                Your bag is empty.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn-primary">
                Continue Shopping
              </button>
            </div>
          )}

          {/* Items */}
          {cart.length > 0 && (
            <>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div
                    key={item.name}
                    className="flex gap-4 py-4"
                    style={{ borderBottom: "1px solid var(--warm)" }}
                  >
                    <div className="w-16 h-20 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-lg font-light">{item.name}</h4>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--mist)", marginTop: "2px" }}>{item.note}</p>
                          <p className="font-display text-base mt-1" style={{ color: "var(--ink)", fontWeight: 400 }}>{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)", cursor: "none" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "var(--ink)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--mist)"; }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        {["−", "+"].map((sym, idx) => (
                          <button
                            key={sym}
                            onClick={() => updateQuantity(item.name, idx === 0 ? "decrease" : "increase")}
                            className="w-7 h-7 flex items-center justify-center transition-colors duration-300"
                            style={{ border: "1px solid var(--warm)", cursor: "none" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; e.currentTarget.style.borderColor = "var(--ink)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--warm)"; }}
                          >
                            {sym}
                          </button>
                        ))}
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mb-8">
                {/* Subtotal + Delivery rows */}
                <div
                  className="py-4 px-5 space-y-2.5"
                  style={{ background: "var(--warm)", borderTop: "1px solid rgba(14,12,10,0.08)" }}
                >
                  {[["Subtotal", `$${subtotal}`], ["Delivery", `$${deliveryFee}`]].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--mist)" }}>{k}</span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", fontWeight: 400, color: "var(--ink)" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Total — high-contrast dark block, impossible to miss */}
                <div
                  className="flex justify-between items-center px-5 py-5"
                  style={{ background: "var(--ink)" }}
                >
                  <div>
                    <span
                      style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(201,169,110,0.7)", display: "block", marginBottom: "0.3rem" }}
                    >
                      Order Total
                    </span>
                    <span className="font-display text-2xl font-light" style={{ color: "var(--parchment)" }}>
                      Total
                    </span>
                  </div>
                  <span
                    className="font-display"
                    style={{ fontSize: "2rem", fontWeight: 300, color: "var(--parchment)", letterSpacing: "-0.01em" }}
                  >
                    ${total}
                  </span>
                </div>
              </div>

              {/* Order form */}
              <form onSubmit={onSubmitOrder}>
                <div
                  className="flex items-center gap-3 mb-5 pt-2"
                >
                  <div className="eyebrow" style={{ fontSize: "0.6rem" }}>Customer Information</div>
                  <div style={{ flex: 1, height: "1px", background: "var(--warm)" }} />
                </div>
                <div className="space-y-2.5 mb-6">
                  {[
                    { type: "text",  placeholder: "Full Name",        required: true },
                    { type: "tel",   placeholder: "Phone Number",     required: true },
                    { type: "email", placeholder: "Email (optional)", required: false },
                  ].map(({ type, placeholder, required }) => (
                    <input
                      key={placeholder}
                      type={type}
                      placeholder={placeholder}
                      required={required}
                      className="cart-input"
                    />
                  ))}
                  <textarea
                    required
                    placeholder="Delivery Address"
                    rows={3}
                    className="cart-input"
                    style={{ resize: "none" }}
                  />
                  <select required className="cart-input">
                    <option value="">Payment Method</option>
                    <option>Cash on Delivery</option>
                    <option>Bkash</option>
                    <option>Nagad</option>
                    <option>Card Payment</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Place Order <ArrowRight />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ────────────────────────────────────────── */
export default function PerfumeStorefront() {
  const [cart, setCart]               = useState([]);
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activePage, setActivePage]   = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");

  const openPage = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openProductsPage = useCallback((category = "All") => {
    setActiveCategory(category);
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback((product) => {
    if (product.stock === "Sold out") return;
    setCart(prev => {
      const existing = prev.find(i => i.name === product.name);
      return existing
        ? prev.map(i => i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setOrderPlaced(false);
  }, []);

  const removeFromCart = useCallback((name) =>
    setCart(prev => prev.filter(i => i.name !== name)), []);

  const updateQuantity = useCallback((name, type) =>
    setCart(prev =>
      prev.map(i => i.name === name ? { ...i, quantity: i.quantity + (type === "increase" ? 1 : -1) } : i)
          .filter(i => i.quantity > 0)
    ), []);

  const handleSubmitOrder = useCallback((e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setCart([]);
  }, []);

  const getPriceNum = (p) => Number(p.replace("$", ""));
  const subtotal    = cart.reduce((s, i) => s + getPriceNum(i.price) * i.quantity, 0);
  const deliveryFee = cart.length > 0 ? 6 : 0;
  const total       = subtotal + deliveryFee;
  const cartCount   = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="grain min-h-screen overflow-x-hidden" style={{ background: "var(--cream)", color: "var(--ink)" }}>
      <Cursor />

      <Nav
        activePage={activePage}
        openPage={openPage}
        openProductsPage={openProductsPage}
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
      />

      {activePage === "home"         && <HomePage openPage={openPage} openProductsPage={openProductsPage} addToCart={addToCart} />}
      {activePage === "products"     && <ProductsPage activeCategory={activeCategory} setActiveCategory={setActiveCategory} addToCart={addToCart} />}
      {activePage === "bestSellers"  && <BestSellersPage addToCart={addToCart} />}
      {activePage === "about"        && <AboutPage />}

      <Footer openPage={openPage} openProductsPage={openProductsPage} />

      <CartDrawer
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        total={total}
        onSubmitOrder={handleSubmitOrder}
        orderPlaced={orderPlaced}
      />
    </div>
  );
}