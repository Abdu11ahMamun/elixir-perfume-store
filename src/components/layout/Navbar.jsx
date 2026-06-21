import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND, NAV_LINKS, REGULAR_PRODUCTS } from "../../constants/brand";
import { getPrimaryImage } from "../../utils/price";

/* ─── Navbar ─────────────────────────────────────────────
   Props:
   - activePage
   - openPage(name)
   - openProductsPage(category)
   - onOpen(product)      — opens ProductDetails modal
   - cartCount
   - setIsCartOpen
─────────────────────────────────────────────────────────── */
export default function Navbar({
  activePage,
  openPage,
  openProductsPage,
  onOpen,
  cartCount,
  setIsCartOpen,
}) {
  const [search, setSearch]       = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  // Scroll-aware styling
  useState(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Search suggestions — searches name, note, category, inspiredBy
  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return REGULAR_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.inspiredBy.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [search]);

  const handleNav = (page) => {
    setMobileOpen(false);
    if (page === "products") { openProductsPage("All"); return; }
    openPage(page);
  };

  const handleProductClick = (product) => {
    setSearch("");
    setMobileOpen(false);
    onOpen(product);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-500 ${scrolled ? "nav-scrolled" : ""}`}
      style={{
        backdropFilter: "blur(16px)",
        background: scrolled ? "rgba(250,247,242,0.97)" : "rgba(250,247,242,0.92)",
        borderBottom: "1px solid rgba(14,12,10,0.06)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="h-20 flex items-center justify-between gap-6">

          {/* Logo */}
          <button onClick={() => openPage("home")} className="text-left shrink-0">
            <h1 className="font-display tracking-[0.35em] font-light" style={{ fontSize: "1.6rem", color: "var(--ink)" }}>
              {BRAND.name}
            </h1>
            <p className="eyebrow mt-0.5" style={{ fontSize: "0.48rem", letterSpacing: "0.5em", color: "var(--mist)" }}>
              {BRAND.tagline}
            </p>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`nav-link ${activePage === link.page ? "active" : ""}`}
                style={{ color: "var(--ink)" }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Search + Cart + Burger */}
          <div className="flex items-center gap-3">

            {/* Desktop search */}
            <div className="relative hidden md:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fragrances…"
                className="cart-input"
                style={{
                  width: "260px",
                  background: "var(--warm)",
                  border: "1px solid rgba(14,12,10,0.1)",
                  padding: "0.6rem 1.1rem",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--mist)", fontSize: "1rem", lineHeight: 1, cursor: "none" }}
                >
                  ×
                </button>
              )}

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-[340px] overflow-hidden"
                    style={{
                      background: "var(--cream)",
                      border: "1px solid var(--warm)",
                      boxShadow: "0 20px 40px rgba(14,12,10,0.12)",
                    }}
                  >
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex gap-4 p-4 text-left transition-colors duration-200"
                        style={{ borderBottom: "1px solid var(--warm)", cursor: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--warm)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div className="w-12 h-14 overflow-hidden shrink-0">
                          <img
                            src={getPrimaryImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="block font-display text-lg font-light">{product.name}</span>
                          <span className="block" style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--mist)", marginTop: "2px" }}>
                            {product.note}
                          </span>
                          <span className="block" style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", color: "var(--gold-dark)", fontStyle: "italic", marginTop: "2px" }}>
                            Inspired by {product.inspiredBy.split("—")[0].trim()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 transition-all duration-300"
              style={{
                border: `1px solid ${cartCount > 0 ? "var(--gold)" : "rgba(14,12,10,0.15)"}`,
                background: cartCount > 0 ? "rgba(201,169,110,0.08)" : "transparent",
                cursor: "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink)" }}>
                Bag
              </span>
              <span
                className="w-6 h-6 flex items-center justify-center transition-all duration-300"
                style={{
                  background: cartCount > 0 ? "var(--gold)" : "var(--warm)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.68rem",
                  color: cartCount > 0 ? "var(--ink)" : "var(--mist)",
                  fontWeight: cartCount > 0 ? 500 : 300,
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden flex flex-col justify-center gap-[5px] p-2"
              aria-label="Menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block transition-all duration-300"
                  style={{
                    width: i === 1 ? (mobileOpen ? "0" : "18px") : "18px",
                    height: "1px",
                    background: "var(--ink)",
                    transform: mobileOpen
                      ? i === 0 ? "rotate(45deg) translateY(6px)"
                      : i === 2 ? "rotate(-45deg) translateY(-6px)"
                      : "none"
                      : "none",
                    opacity: i === 1 && mobileOpen ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: "1px solid var(--warm)" }}
            >
              <div className="py-6 flex flex-col gap-5">
                {/* Mobile search */}
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search fragrances…"
                    className="cart-input"
                    style={{ background: "var(--warm)" }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--mist)", fontSize: "1rem", lineHeight: 1, cursor: "none" }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Mobile suggestions */}
                {suggestions.length > 0 && (
                  <div style={{ border: "1px solid var(--warm)", overflow: "hidden" }}>
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex gap-4 p-4 text-left transition-colors duration-200"
                        style={{ borderBottom: "1px solid var(--warm)", cursor: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--warm)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <div className="w-10 h-12 overflow-hidden shrink-0">
                          <img src={getPrimaryImage(product)} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="block font-display text-base font-light">{product.name}</span>
                          <span className="block" style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--mist)" }}>{product.note}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile nav links */}
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`nav-link text-left ${activePage === link.page ? "active" : ""}`}
                    style={{ color: "var(--ink)", fontSize: "0.85rem" }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}