import { useCallback, useEffect, useState } from "react";

import Navbar      from "./components/layout/Navbar";
import Footer      from "./components/layout/Footer";
import Cursor      from "./components/ui/Cursor";
import CartDrawer  from "./components/cart/CartDrawer";

import Home           from "./pages/Home";
import Products       from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import BestSellers    from "./pages/BestSellers";
import Offers         from "./pages/Offers";
import About          from "./pages/About";

import AdminApp from "./admin/AdminApp";
import { useCart } from "./hooks/useCart";

export default function App() {
  const [activePage, setActivePage]     = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen]     = useState(false);

  // ── Product detail modal state ──
  // Instead of a separate page, ProductDetails renders as a modal overlay
  const [modalProduct, setModalProduct] = useState(null);

  const cart = useCart();

  // ── Navigation helpers ──
  const openPage = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openProductsPage = useCallback((category = "All") => {
    setActiveCategory(category);
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Modal helpers ──
  const openModal  = useCallback((product) => {
    setModalProduct(product);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setModalProduct(null);
    document.body.style.overflow = "";
  }, []);

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
        {activePage === "home" && (
          <Home
            openPage={openPage}
            openProductsPage={openProductsPage}
            onOpen={openModal}
          />
        )}

        {activePage === "products" && (
          <Products
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onOpen={openModal}
          />
        )}

        {activePage === "bestSellers" && (
          <BestSellers onOpen={openModal} />
        )}

        {activePage === "offers" && (
          <Offers onOpen={openModal} />
        )}

        {activePage === "about" && (
          <About />
        )}
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
        total={cart.total}
        onSubmitOrder={cart.handleSubmitOrder}
        orderPlaced={cart.orderPlaced}
      />

      {/* Product detail modal */}
      {modalProduct && (
        <ProductDetails
          product={modalProduct}
          addToCart={cart.addToCart}
          onClose={closeModal}
        />
      )}
    </div>
  );
}