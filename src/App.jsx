import { useCallback, useState } from "react";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Cursor from "./components/ui/Cursor";
import CartDrawer from "./components/cart/CartDrawer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import BestSellers from "./pages/BestSellers";
import About from "./pages/About";

import { useCart } from "./hooks/useCart";

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cart = useCart();

  const openPage = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openProductsPage = useCallback((category = "All") => {
    setActiveCategory(category);
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    setActivePage("productDetails");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div
      className="grain min-h-screen overflow-x-hidden"
      style={{
        background: "var(--cream)",
        color: "var(--ink)",
      }}
    >
      <Cursor />

      <Navbar
        activePage={activePage}
        openPage={openPage}
        openProductsPage={openProductsPage}
        openProductDetails={openProductDetails}
        cartCount={cart.cartCount}
        setIsCartOpen={setIsCartOpen}
      />

      <div className="pt-24">
        {activePage === "home" && (
          <Home
            openPage={openPage}
            openProductsPage={openProductsPage}
            addToCart={cart.addToCart}
            openProductDetails={openProductDetails}
          />
        )}

        {activePage === "products" && (
          <Products
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            addToCart={cart.addToCart}
            openProductDetails={openProductDetails}
          />
        )}

        {activePage === "productDetails" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            addToCart={cart.addToCart}
            openProductsPage={openProductsPage}
          />
        )}

        {activePage === "bestSellers" && (
          <BestSellers
            addToCart={cart.addToCart}
            openProductDetails={openProductDetails}
          />
        )}

        {activePage === "about" && <About />}
      </div>

      <Footer
        openPage={openPage}
        openProductsPage={openProductsPage}
      />

      {cart.cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="
            sticky-cart
            bg-[var(--ink)]
            text-white
            rounded-full
            px-6
            py-4
            flex
            items-center
            gap-3
          "
        >
          <span className="text-xs uppercase tracking-[0.2em]">
            Cart
          </span>

          <span
            className="
              w-7
              h-7
              rounded-full
              bg-[var(--gold)]
              text-[var(--ink)]
              flex
              items-center
              justify-center
              text-xs
            "
          >
            {cart.cartCount}
          </span>
        </button>
      )}

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
    </div>
  );
}