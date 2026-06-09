import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND, NAV_LINKS, PRODUCTS } from "../../constants/brand";

export default function Navbar({
  activePage,
  openPage,
  openProductsPage,
  openProductDetails,
  cartCount,
  setIsCartOpen,
}) {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();

    return PRODUCTS.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.note.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    ).slice(0, 4);
  }, [search]);

  const handleNavigation = (page) => {
    setMobileOpen(false);

    if (page === "products") {
      openProductsPage("All");
      return;
    }

    openPage(page);
  };

  const handleProductClick = (product) => {
    setSearch("");
    setMobileOpen(false);
    openProductDetails(product);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[999] backdrop-blur-xl bg-[rgba(250,247,242,0.92)] border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-24 flex items-center justify-between gap-6">
          <button onClick={() => openPage("home")} className="text-left shrink-0">
            <h1 className="font-display text-4xl tracking-wide">{BRAND.name}</h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--mist)] mt-1">
              {BRAND.tagline}
            </p>
          </button>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNavigation(link.page)}
                className={`nav-link ${activePage === link.page ? "active" : ""}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search fragrances..."
                className="w-72 rounded-full bg-white border border-black/10 px-5 py-3 outline-none text-sm"
              />

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="absolute right-0 top-14 w-[360px] bg-white rounded-[1.5rem] shadow-2xl border border-black/5 overflow-hidden"
                  >
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex gap-4 p-4 text-left hover:bg-[var(--warm)] transition"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-16 object-cover rounded-xl"
                        />
                        <span>
                          <span className="block font-display text-xl">{product.name}</span>
                          <span className="block text-xs text-[var(--mist)]">{product.note}</span>
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`flex items-center gap-3 px-5 py-3 rounded-full bg-white border transition ${
                cartCount > 0 ? "border-[var(--gold)] shadow-lg" : "border-black/10"
              }`}
            >
              <span className="text-xs uppercase tracking-[0.18em]">Cart</span>
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition ${
                  cartCount > 0
                    ? "bg-[var(--gold)] text-[var(--ink)] animate-cart-pop"
                    : "bg-[var(--warm)]"
                }`}
              >
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="lg:hidden w-11 h-11 rounded-full border border-black/10 bg-white"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pb-6 grid gap-5">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search fragrances..."
                  className="w-full rounded-full bg-white border border-black/10 px-5 py-3 outline-none text-sm"
                />

                {NAV_LINKS.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNavigation(link.page)}
                    className="text-left nav-link"
                  >
                    {link.label}
                  </button>
                ))}

                {suggestions.length > 0 && (
                  <div className="bg-white rounded-[1.5rem] overflow-hidden border border-black/5">
                    {suggestions.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex gap-4 p-4 text-left hover:bg-[var(--warm)] transition"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-16 object-cover rounded-xl"
                        />
                        <span>
                          <span className="block font-display text-xl">{product.name}</span>
                          <span className="block text-xs text-[var(--mist)]">{product.note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}