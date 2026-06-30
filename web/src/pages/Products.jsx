import { useMemo, useState } from "react";
import { CATEGORIES, REGULAR_PRODUCTS } from "../constants/brand";
import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

/* ─── PAGE_SIZE ──────────────────────────────────────────
   BACKEND NOTE: replace local slice with
   GET /api/products?category=X&search=Y&sort=Z&page=N&limit=8
   and replace totalPages with Math.ceil(apiRes.total / PAGE_SIZE)
─────────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

export default function Products({
  activeCategory,
  setActiveCategory,
  onOpen,                  // (product) => void — opens ProductDetails modal
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort]     = useState("featured");
  const [page, setPage]     = useState(1);

  const filteredProducts = useMemo(() => {
    // Base list — regular products only (no combos)
    let result =
      activeCategory === "All"
        ? REGULAR_PRODUCTS
        : REGULAR_PRODUCTS.filter((p) => p.category === activeCategory);

    // Search: name, note, category, inspiredBy
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.note.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.inspiredBy.toLowerCase().includes(q)
      );
    }

    // Sort — uses sizes[] prices (not a flat price string)
    if (sort === "price-low") {
      result = [...result].sort(
        (a, b) =>
          Math.min(...a.sizes.map((s) => s.price)) -
          Math.min(...b.sizes.map((s) => s.price))
      );
    }
    if (sort === "price-high") {
      result = [...result].sort(
        (a, b) =>
          Math.max(...b.sizes.map((s) => s.price)) -
          Math.max(...a.sizes.map((s) => s.price))
      );
    }
    if (sort === "name-az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, search, sort]);

  const totalPages     = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const productsToShow = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategory = (cat) => { setActiveCategory(cat); setPage(1); };
  const handleSearch   = (e)   => { setSearch(e.target.value); setPage(1); };
  const handleSort     = (e)   => { setSort(e.target.value); setPage(1); };

  return (
    <main>
      {/* ── Hero header ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: "40vh", background: "var(--ink)" }}
      >
        <img
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1800&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.2, filter: "saturate(0.5)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--ink) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pb-12 pt-20 w-full">
          <Eyebrow>Perfume Shop</Eyebrow>
          <h1
            className="font-display mt-3"
            style={{ fontSize: "clamp(3rem,8vw,7rem)", fontWeight: 300, color: "var(--parchment)", lineHeight: 0.9 }}
          >
            All Perfumes
          </h1>
        </div>
      </section>

      {/* ── Toolbar: search + sort + categories ── */}
      <section
        className="px-6 lg:px-12 py-8 max-w-[1400px] mx-auto"
        style={{ background: "var(--cream)" }}
      >
        {/* Search + Sort row */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-6 pb-6"
          style={{ borderBottom: "1px solid var(--warm)" }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ color: "var(--mist)" }}
            >
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1"/>
              <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, note, or inspired by…"
              className="cart-input"
              style={{ paddingLeft: "2.2rem", background: "var(--warm)" }}
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
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
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name-az">Name: A → Z</option>
          </select>

          {/* Count */}
          <span
            className="self-center ml-auto shrink-0"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--mist)" }}
          >
            {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.55rem 1.3rem",
                border: "1px solid",
                whiteSpace: "nowrap",
                transition: "all 0.3s var(--ease-luxury)",
                cursor: "none",
                borderColor: activeCategory === cat ? "var(--ink)" : "rgba(14,12,10,0.14)",
                background: activeCategory === cat ? "var(--ink)" : "transparent",
                color: activeCategory === cat ? "var(--parchment)" : "var(--mist)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Product grid ── */}
        {productsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {productsToShow.map((product) => (
              <div key={product.id} className="animate-fade-up">
                <ProductCard product={product} onOpen={onOpen} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="font-display italic text-5xl mb-4" style={{ color: "var(--warm)" }}>∅</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--mist)" }}>
              No results for <em>"{search}"</em>
            </p>
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="btn-ghost mt-6"
              style={{ fontSize: "0.68rem" }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
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
      </section>
    </main>
  );
}

/* ─── Pagination button ───────────────────────────────── */
function PageBtn({ onClick, disabled, active, label }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "36px", height: "36px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid",
        transition: "all 0.3s var(--ease-luxury)",
        cursor: disabled ? "not-allowed" : "none",
        fontFamily: "var(--font-body)", fontSize: "0.78rem",
        borderColor: active ? "var(--ink)" : disabled ? "rgba(14,12,10,0.08)" : "rgba(14,12,10,0.18)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--parchment)" : disabled ? "rgba(14,12,10,0.2)" : "var(--mist)",
      }}
    >
      {label}
    </button>
  );
}