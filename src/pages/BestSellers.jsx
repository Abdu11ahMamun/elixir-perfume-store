import { PRODUCTS } from "../constants/brand";

import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

export default function BestSellers({
  addToCart,
  openProductDetails,
}) {
  const bestSellers = PRODUCTS.filter(
    (product) =>
      product.badge === "Best Seller" ||
      product.rating >= 4.9
  ).sort((a, b) => b.rating - a.rating);

  return (
    <main>
      <section className="bg-[var(--ink)] px-6 py-24 text-center">
        <Eyebrow>Customer Favorites</Eyebrow>

        <h1
          className="
            font-display
            text-6xl
            md:text-8xl
            font-light
            text-[var(--parchment)]
            mt-5
          "
        >
          Best Sellers
        </h1>

        <p className="text-white/45 max-w-2xl mx-auto leading-8 mt-6">
          Discover the fragrances our customers love the most.
          These are the highest-rated and most frequently purchased
          scents from the ÉLIXIR collection.
        </p>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Top 3 spotlight */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {bestSellers.slice(0, 3).map((product, index) => (
              <div
                key={product.id}
                className="
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  bg-[var(--warm)]
                  p-8
                "
              >
                <div
                  className="
                    absolute
                    top-5
                    right-5
                    w-12
                    h-12
                    rounded-full
                    bg-[var(--gold)]
                    flex
                    items-center
                    justify-center
                    font-medium
                  "
                >
                  #{index + 1}
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    w-full
                    h-[320px]
                    object-cover
                    rounded-[1.5rem]
                    mb-6
                  "
                />

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.22em]
                    text-[var(--gold-dark)]
                    mb-2
                  "
                >
                  {product.category}
                </p>

                <h2
                  className="
                    font-display
                    text-4xl
                    font-light
                    mb-2
                  "
                >
                  {product.name}
                </h2>

                <p className="text-[var(--mist)] mb-4">
                  {product.note}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-[var(--gold)]">
                    ★★★★★
                  </span>

                  <span>
                    {product.rating}
                  </span>

                  <span className="text-[var(--mist)]">
                    ({product.reviews})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Full grid */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                openProductDetails={openProductDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}