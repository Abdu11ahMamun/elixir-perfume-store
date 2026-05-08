import { useState } from "react";

export default function PerfumeStorefront() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.name === product.name);

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
    setOrderPlaced(false);
  };

  const removeFromCart = (productName) => {
    setCart((currentCart) => currentCart.filter((item) => item.name !== productName));
  };

  const updateQuantity = (productName, type) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.name !== productName) return item;

          return {
            ...item,
            quantity: type === "increase" ? item.quantity + 1 : item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const getPriceNumber = (price) => Number(price.replace("$", ""));

  const subtotal = cart.reduce(
    (total, item) => total + getPriceNumber(item.price) * item.quantity,
    0
  );

  const deliveryFee = cart.length > 0 ? 6 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (event) => {
    event.preventDefault();
    setOrderPlaced(true);
    setCart([]);
  };
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = [
    {
      name: "Noir Ember",
      note: "Woody • Smoky • Bold",
      price: "$89",
      image:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Velvet Bloom",
      note: "Floral • Soft • Feminine",
      price: "$74",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Azure Mist",
      note: "Fresh • Aquatic • Clean",
      price: "$92",
      image:
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Golden Oud",
      note: "Luxury • Oriental • Rich",
      price: "$120",
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const products = [
    ...featured,
    {
      name: "Rose Dusk",
      note: "Floral • Romantic • Soft",
      price: "$79",
      category: "For Her",
      image:
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Midnight Leather",
      note: "Leather • Amber • Strong",
      price: "$95",
      category: "For Him",
      image:
        "https://images.unsplash.com/photo-1595425964071-2c1ecb7d9d67?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Oud Royale",
      note: "Oud • Spicy • Premium",
      price: "$140",
      category: "Luxury Oud",
      image:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Discovery Gift Set",
      note: "Mini Perfumes • Gift Box",
      price: "$65",
      category: "Gift Sets",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
    },
  ].map((item, index) => ({
    ...item,
    category:
      item.category ||
      (index % 3 === 0 ? "For Him" : index % 3 === 1 ? "For Her" : "Luxury Oud"),
    stock: index % 5 === 1 ? "Sold out" : "In stock",
  }));

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  const collections = [
    {
      title: "For Him",
      image:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "For Her",
      image:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Luxury Oud",
      image:
        "https://images.unsplash.com/photo-1615634262417-5bce0f4f6d8c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Gift Sets",
      image:
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const openProductsPage = (category = "All") => {
    setActiveCategory(category);
    setActivePage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openBestSellersPage = () => {
    setActivePage("bestSellers");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAboutPage = () => {
    setActivePage("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bestSellerProducts = products.slice(0, 6);

  return (
    <div className="bg-[#F7F3EF] text-[#1F1F1F] min-h-screen font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#F7F3EF]/90 backdrop-blur border-b border-[#e9dfd7]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-[0.35em] font-light">ÉLIXIR</h1>
            <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
              Signature Fragrances
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide uppercase">
            <button onClick={() => setActivePage("home")} className="hover:text-[#b27b52] transition">
              Home
            </button>
            <button onClick={() => openProductsPage("All")} className="hover:text-[#b27b52] transition">
              Perfumes
            </button>
            <button onClick={openBestSellersPage} className="hover:text-[#b27b52] transition">
              Best Sellers
            </button>
            <button onClick={openAboutPage} className="hover:text-[#b27b52] transition">
              About
            </button>
          </nav>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#1F1F1F] text-white px-5 py-2 rounded-full text-sm hover:bg-[#b27b52] transition"
          >
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>
      </header>

      {activePage === "home" ? (
      <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[85vh]">
          <div className="flex items-center px-8 lg:px-20 py-16 bg-[#efe7df]">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.35em] text-sm text-[#b27b52] mb-5">
                Luxury Perfume Collection
              </p>

              <h2 className="text-5xl md:text-7xl font-light leading-tight mb-6">
                Wear Your
                <span className="block italic text-[#b27b52]">Signature</span>
              </h2>

              <p className="text-gray-600 text-lg leading-8 mb-8">
                A premium perfume destination designed only for fragrance lovers.
                Elegant, modern, and deeply luxurious.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => openProductsPage("All")}
                  className="bg-[#1F1F1F] text-white px-7 py-4 rounded-full hover:bg-[#b27b52] transition"
                >
                  Explore Collection
                </button>
                <button
                  onClick={openBestSellersPage}
                  className="border border-[#1F1F1F] px-7 py-4 rounded-full hover:bg-white transition"
                >
                  View Best Sellers
                </button>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] lg:h-auto">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
              alt="Perfume Hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="uppercase text-sm tracking-[0.3em] text-[#b27b52] mb-3">
              Collections
            </p>
            <h3 className="text-4xl font-light">Explore Categories</h3>
          </div>

          <button
            onClick={() => openProductsPage("All")}
            className="hidden md:block border border-[#1F1F1F] px-5 py-2 rounded-full hover:bg-[#1F1F1F] hover:text-white transition"
          >
            View All
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((item) => (
            <div
              key={item.title}
              className="relative rounded-[2rem] overflow-hidden group h-[450px]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-8 left-8 text-white">
                <h4 className="text-3xl font-light mb-3">{item.title}</h4>
                <button
                  onClick={() => openProductsPage(item.title)}
                  className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition"
                >
                  Discover
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="uppercase text-sm tracking-[0.3em] text-[#b27b52] mb-3">
              Best Sellers
            </p>
            <h3 className="text-5xl font-light mb-4">
              Featured Fragrances
            </h3>
            <p className="text-gray-500 max-w-2xl mx-auto leading-8">
              Inspired by luxury perfume houses while maintaining a modern,
              premium identity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((item) => (
              <div
                key={item.name}
                className="group bg-[#faf7f3] rounded-[2rem] overflow-hidden hover:-translate-y-2 transition duration-500 shadow-sm hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[340px] w-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#b27b52] mb-2">
                    Eau De Parfum
                  </p>
                  <h4 className="text-2xl font-light mb-2">{item.name}</h4>
                  <p className="text-gray-500 mb-5">{item.note}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-[#1F1F1F] text-white px-4 py-2 rounded-full hover:bg-[#b27b52] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative rounded-[2rem] overflow-hidden h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1400&auto=format&fit=crop"
            alt="Luxury perfume"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        <div>
          <p className="uppercase text-sm tracking-[0.3em] text-[#b27b52] mb-4">
            Our Philosophy
          </p>

          <h3 className="text-5xl font-light leading-tight mb-8">
            Crafted For
            <span className="block italic text-[#b27b52]">Perfume Lovers</span>
          </h3>

          <p className="text-gray-600 leading-8 mb-6 text-lg">
            This design combines the elegance of luxury perfume brands with the
            simplicity of modern ecommerce. Inspired by the layouts you shared,
            but redesigned with cleaner spacing, premium typography, and a more
            luxurious visual hierarchy.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h4 className="text-4xl font-light mb-2">50+</h4>
              <p className="text-gray-500">Exclusive Fragrances</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h4 className="text-4xl font-light mb-2">24H</h4>
              <p className="text-gray-500">Fast Delivery</p>
            </div>
          </div>
        </div>
      </section>
      </>
      ) : activePage === "products" ? (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-[#b27b52] mb-4">
              Perfume Shop
            </p>
            <h2 className="text-5xl md:text-6xl font-light mb-4">Products</h2>
            <p className="text-gray-500 max-w-2xl leading-8">
              Browse all perfumes, filter by category, and add your favorites to cart.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {["All", "For Him", "For Her", "Luxury Oud", "Gift Sets"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full border transition ${
                  activeCategory === category
                    ? "bg-[#1F1F1F] text-white border-[#1F1F1F]"
                    : "border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <span>{filteredProducts.length} products</span>
          <span>Sort by: Alphabetically, A-Z</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <div key={item.name} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition">
              <div className="relative h-[300px] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                {item.stock === "Sold out" && (
                  <span className="absolute top-4 left-4 bg-white text-[#1F1F1F] text-xs px-4 py-2 rounded-full shadow">
                    Sold out
                  </span>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#b27b52] mb-2">{item.category}</p>
                <h3 className="text-xl font-light mb-2">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.note}</p>
                <p className="text-lg font-semibold mb-5">{item.price}</p>

                <button
                  disabled={item.stock === "Sold out"}
                  onClick={() => addToCart(item)}
                  className={`w-full border px-5 py-3 rounded-full transition ${
                    item.stock === "Sold out"
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white"
                  }`}
                >
                  {item.stock === "Sold out" ? "Sold out" : "Add to cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      ) : activePage === "bestSellers" ? (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <section className="bg-[#efe7df] rounded-[2rem] px-8 py-16 mb-14 text-center">
          <p className="uppercase tracking-[0.35em] text-sm text-[#b27b52] mb-5">
            Customer Favorites
          </p>
          <h2 className="text-5xl md:text-7xl font-light mb-6">Best Sellers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-8">
            Our most loved perfumes, selected for long-lasting performance, premium scent profile, and elegant presentation.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellerProducts.map((item, index) => (
            <div key={item.name} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition">
              <div className="relative h-[380px] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                <span className="absolute top-4 left-4 bg-[#1F1F1F] text-white text-xs px-4 py-2 rounded-full">
                  #{index + 1} Best Seller
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-[#b27b52] mb-2">{item.category}</p>
                <h3 className="text-2xl font-light mb-2">{item.name}</h3>
                <p className="text-gray-500 mb-5">{item.note}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{item.price}</span>
                  <button
                    disabled={item.stock === "Sold out"}
                    onClick={() => addToCart(item)}
                    className={`px-5 py-2 rounded-full transition ${
                      item.stock === "Sold out"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1F1F1F] text-white hover:bg-[#b27b52]"
                    }`}
                  >
                    {item.stock === "Sold out" ? "Sold out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      ) : (
      <main>
        <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="uppercase tracking-[0.35em] text-sm text-[#b27b52] mb-5">
              About ÉLIXIR
            </p>
            <h2 className="text-5xl md:text-7xl font-light leading-tight mb-8">
              A Perfume Brand Made For Everyday Luxury
            </h2>
            <p className="text-gray-600 text-lg leading-8 mb-6">
              ÉLIXIR is a perfume-only shopping experience built for people who love elegant, memorable, and long-lasting fragrances. Our goal is to make premium perfume shopping simple, beautiful, and trustworthy.
            </p>
            <p className="text-gray-600 text-lg leading-8">
              From fresh daily scents to bold evening perfumes, every collection is organized to help customers quickly find the right fragrance for their personality and occasion.
            </p>
          </div>

          <div className="relative rounded-[2rem] overflow-hidden h-[620px]">
            <img
              src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop"
              alt="About perfume brand"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-[#F7F3EF] rounded-[2rem] p-8">
              <h3 className="text-3xl font-light mb-4">Premium Feel</h3>
              <p className="text-gray-600 leading-7">Clean design, luxury presentation, and a focused perfume-only store experience.</p>
            </div>
            <div className="bg-[#F7F3EF] rounded-[2rem] p-8">
              <h3 className="text-3xl font-light mb-4">Easy Shopping</h3>
              <p className="text-gray-600 leading-7">Customers can browse categories, add to cart, and submit order details easily.</p>
            </div>
            <div className="bg-[#F7F3EF] rounded-[2rem] p-8">
              <h3 className="text-3xl font-light mb-4">Fast Delivery</h3>
              <p className="text-gray-600 leading-7">Designed for smooth local perfume orders with flexible payment options.</p>
            </div>
          </div>
        </section>
      </main>
      )}

      {/* Cart and checkout */}
      {isCartOpen && (
        <section className="fixed inset-0 z-[100] bg-black/50 flex justify-end">
          <div className="bg-[#F7F3EF] w-full max-w-xl h-full overflow-y-auto shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="uppercase tracking-[0.3em] text-xs text-[#b27b52] mb-2">
                  Checkout
                </p>
                <h3 className="text-4xl font-light">Your Cart</h3>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full border border-[#1F1F1F] hover:bg-[#1F1F1F] hover:text-white transition"
              >
                ×
              </button>
            </div>

            {orderPlaced && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-5 mb-6">
                Thank you! Your order has been submitted successfully.
              </div>
            )}

            {cart.length === 0 && !orderPlaced ? (
              <div className="bg-white rounded-[2rem] p-8 text-center shadow-sm">
                <p className="text-gray-500 mb-5">Your cart is empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#1F1F1F] text-white px-6 py-3 rounded-full hover:bg-[#b27b52] transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : cart.length > 0 ? (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-2xl"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.note}</p>
                            <p className="text-[#b27b52] font-semibold mt-2">
                              {item.price}
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => updateQuantity(item.name, "decrease")}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-[#1F1F1F] hover:text-white transition"
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, "increase")}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-[#1F1F1F] hover:text-white transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm mb-8">
                  <div className="flex justify-between mb-3 text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-3 text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-2xl font-semibold">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitOrder} className="bg-white rounded-[2rem] p-6 shadow-sm">
                  <h4 className="text-2xl font-light mb-6">Customer Information</h4>

                  <div className="space-y-4">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EF] outline-none focus:ring-2 focus:ring-[#b27b52]"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EF] outline-none focus:ring-2 focus:ring-[#b27b52]"
                    />
                    <input
                      type="email"
                      placeholder="Email Address optional"
                      className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EF] outline-none focus:ring-2 focus:ring-[#b27b52]"
                    />
                    <textarea
                      required
                      placeholder="Delivery Address"
                      rows="4"
                      className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EF] outline-none focus:ring-2 focus:ring-[#b27b52]"
                    />
                    <select
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-[#F7F3EF] outline-none focus:ring-2 focus:ring-[#b27b52]"
                    >
                      <option value="">Select Payment Method</option>
                      <option>Cash on Delivery</option>
                      <option>Bkash</option>
                      <option>Nagad</option>
                      <option>Card Payment</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1F1F1F] text-white px-6 py-4 rounded-full mt-6 hover:bg-[#b27b52] transition"
                  >
                    Submit Order
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-[#1F1F1F] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-sm text-[#d6b295] mb-4">
            Stay Updated
          </p>

          <h3 className="text-5xl font-light mb-6">
            Join The Fragrance Club
          </h3>

          <p className="text-gray-300 leading-8 mb-10">
            Get exclusive launches, special discounts, and curated perfume
            recommendations directly in your inbox.
          </p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-black outline-none"
            />

            <button className="bg-[#b27b52] px-8 py-4 rounded-full hover:bg-[#d19a6c] transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h4 className="text-2xl tracking-[0.25em] text-white font-light mb-4">
              ÉLIXIR
            </h4>
            <p className="max-w-sm leading-7">
              A premium perfume-only ecommerce concept focused on luxury,
              aesthetics, and elegant shopping experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm">
            <div>
              <h5 className="text-white mb-4 uppercase tracking-wide">
                Shop
              </h5>
              <ul className="space-y-3">
                <li>Men</li>
                <li>Women</li>
                <li>Luxury Oud</li>
                <li>Gift Sets</li>
              </ul>
            </div>

            <div>
              <h5 className="text-white mb-4 uppercase tracking-wide">
                Support
              </h5>
              <ul className="space-y-3">
                <li>Contact</li>
                <li>Shipping</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
