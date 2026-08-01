import { useCallback, useEffect, useRef, useState } from "react";

import Navbar      from "./components/layout/Navbar";
import Footer      from "./components/layout/Footer";
import Cursor      from "./components/ui/Cursor";
import CartDrawer  from "./components/cart/CartDrawer";
import CartToast   from "./components/ui/CartToast";

import Home           from "./pages/Home";
import Products       from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import BestSellers    from "./pages/BestSellers";
import Offers         from "./pages/Offers";
import About          from "./pages/About";

import AdminApp from "./admin/AdminApp";
import { useCart } from "./hooks/useCart";
import { getProductById, adaptProduct } from "./services/productService";

// ── URL <-> app-state mapping ─────────────────────────────
// Small History API layer (no router dependency) so the storefront gets
// real back/forward support without a larger architectural rewrite.
// The app is served from a sub-path (Vite `base`), so every built/parsed
// path has to account for it or a refresh on a deep link would 404.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // e.g. "/elixir-perfume-store" or ""

const buildPath = ({ page, category, productId }) => {
  let path;
  if (productId) path = `/perfumes/${productId}`;
  else switch (page) {
    case "products":    path = category && category !== "All" ? `/perfumes?category=${encodeURIComponent(category)}` : "/perfumes"; break;
    case "bestSellers": path = "/best-sellers"; break;
    case "offers":      path = "/offers"; break;
    case "about":       path = "/about"; break;
    case "admin":       path = "/admin"; break;
    default:            path = "/";
  }
  return BASE + path;
};

const parseLocation = () => {
  let path = window.location.pathname;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || "/";
  const params = new URLSearchParams(window.location.search);
  const productMatch = path.match(/^\/perfumes\/(.+)$/);

  if (productMatch) return { page: "products", productId: productMatch[1], category: params.get("category") || "All" };
  if (path === "/perfumes")    return { page: "products", category: params.get("category") || "All" };
  if (path === "/best-sellers") return { page: "bestSellers" };
  if (path === "/offers")      return { page: "offers" };
  if (path === "/about")       return { page: "about" };
  if (path === "/admin")       return { page: "admin" };
  return { page: "home" };
};

export default function App() {
  const [activePage, setActivePage]     = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen]     = useState(false);

  // ── Product detail modal state ──
  // Instead of a separate page, ProductDetails renders as a modal overlay
  const [modalProduct, setModalProduct] = useState(null);

  // ── Toast state ──
  const [toast, setToast]     = useState({ visible: false, product: null });
  const toastTimer            = useRef(null);

  const cart = useCart();

  // Wrap addToCart to show toast
  const addToCartWithToast = useCallback((item) => {
    cart.addToCart(item);

    // Show toast
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, product: item });
    toastTimer.current = setTimeout(() => {
      setToast({ visible: false, product: null });
    }, 3000);
  }, [cart.addToCart]);

  // ── History sync helper ──
  // Pushes a history entry for a real forward navigation; skipped when the
  // target URL already matches (avoids duplicate consecutive entries).
  const pushHistory = useCallback((state, { replace = false } = {}) => {
    const path    = buildPath(state);
    const current = window.location.pathname + window.location.search;
    if (!replace && path === current) return;
    window.history[replace ? "replaceState" : "pushState"](state, "", path);
  }, []);

  // ── Navigation helpers ──
  const openPage = useCallback((page) => {
    setActivePage(page);
    setModalProduct(null);
    document.body.style.overflow = "";
    pushHistory({ page, category: activeCategory });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory, pushHistory]);

  const openProductsPage = useCallback((category = "All") => {
    setActiveCategory(category);
    setActivePage("products");
    setModalProduct(null);
    document.body.style.overflow = "";
    pushHistory({ page: "products", category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pushHistory]);

  // ── Modal helpers ──
  const openModal  = useCallback((product) => {
    setModalProduct(product);
    document.body.style.overflow = "hidden";
    pushHistory({ page: activePage, category: activeCategory, productId: product.id });
  }, [activePage, activeCategory, pushHistory]);

  const closeModal = useCallback(() => {
    // Go back rather than clearing state directly, so the URL stays in
    // sync — the popstate handler below applies the resulting state.
    window.history.back();
  }, []);

  // ── Browser history sync ──
  // Applies a parsed/pushed location to app state. Used for both the
  // initial page load and every popstate (back/forward) event.
  const applyLocation = useCallback(async (state) => {
    const parsed = state || parseLocation();
    setActivePage(parsed.page || "home");
    if (parsed.category) setActiveCategory(parsed.category);

    if (parsed.productId) {
      try {
        const raw = await getProductById(parsed.productId);
        setModalProduct(adaptProduct(raw));
        document.body.style.overflow = "hidden";
      } catch {
        setModalProduct(null);
        document.body.style.overflow = "";
      }
    } else {
      setModalProduct(null);
      document.body.style.overflow = "";
    }
  }, []);

  useEffect(() => {
    // Normalize whatever URL the app was loaded on into a proper history
    // entry (so a first Back press has somewhere real to go), then apply it.
    const initial = parseLocation();
    if (initial.productId) {
      const basePage = { page: "products", category: initial.category || "All" };
      window.history.replaceState(basePage, "", buildPath(basePage));
      window.history.pushState(initial, "", buildPath(initial));
    } else {
      window.history.replaceState(initial, "", buildPath(initial));
    }
    applyLocation(initial);

    const onPopState = (e) => applyLocation(e.state);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [applyLocation]);

  // ── Admin keyboard shortcut: Ctrl+Shift+A ──
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        openPage("admin");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openPage]);

  // Admin — full page takeover
  if (activePage === "admin") {
    return <AdminApp onExit={() => openPage("home")} />;
  }

  return (
    <div
      className="grain min-h-screen overflow-x-hidden"
      style={{ background: "var(--cream)", color: "var(--ink)" }}
    >
      <Cursor />

      <Navbar
        activePage={activePage}
        openPage={openPage}
        openProductsPage={openProductsPage}
        onOpen={openModal}
        cartCount={cart.cartCount}
        setIsCartOpen={setIsCartOpen}
      />

      {/* pt-20 to clear fixed navbar */}
      <div className="pt-20">
      {activePage === "home"        && <Home openPage={openPage} openProductsPage={openProductsPage} onOpen={openModal}/>}
      {activePage === "products"    && <Products activeCategory={activeCategory} setActiveCategory={setActiveCategory} onOpen={openModal}/>}
      {activePage === "bestSellers" && <BestSellers onOpen={openModal}/>}
      {activePage === "offers"      && <Offers onOpen={openModal}/>}
      {activePage === "about"       && <About/>}
      </div>

      <Footer openPage={openPage} openProductsPage={openProductsPage} />

      {/* ── Hidden Admin Access ── */}
      {/* Click 3× quickly to go to admin, or use the tiny button bottom-left */}
      <button
        onClick={() => openPage("admin")}
        title="Admin Panel"
        className="fixed bottom-6 left-6 z-50 transition-all duration-300 opacity-0 hover:opacity-100"
        style={{
          width: "10px", height: "10px",
          background: "var(--gold)",
          borderRadius: "50%",
          cursor: "none",
        }}
      />

      {/* Sticky cart bubble */}
      {cart.cartCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 transition-all duration-300"
          style={{
            background: "var(--ink)",
            color: "var(--parchment)",
            border: "1px solid rgba(201,169,110,0.3)",
            cursor: "none",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--ink)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "var(--parchment)"; }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Bag
          </span>
          <span
            className="w-6 h-6 flex items-center justify-center"
            style={{ background: "var(--gold)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 500 }}
          >
            {cart.cartCount}
          </span>
        </button>
      )}

      {/* Cart drawer */}
      <CartDrawer
        cart={cart.cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        removeFromCart={cart.removeFromCart}
        updateQuantity={cart.updateQuantity}
        subtotal={cart.subtotal}
        deliveryFee={cart.deliveryFee}
        setDeliveryFee={cart.setDeliveryFee}
        total={cart.total}
        clearCart={cart.clearCart}
      />

      {/* Product detail modal */}
      {modalProduct && (
        <ProductDetails
          product={modalProduct}
          addToCart={addToCartWithToast}
          onClose={closeModal}
        />
      )}

      {/* Cart add toast */}
      <CartToast
        toast={toast}
        onViewBag={() => {
          setToast({ visible: false, product: null });
          setIsCartOpen(true);
        }}
      />
    </div>
  );
}