import { useMemo, useState } from "react";

import { CATEGORIES, PRODUCTS } from "../constants/brand";
import ProductCard from "../components/ui/ProductCard";
import Eyebrow from "../components/ui/Eyebrow";

const PAGE_SIZE = 8;

export default function Products({
  activeCategory,
  setActiveCategory,
  addToCart,
  openProductDetails,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "All"
        ? PRODUCTS
        : PRODUCTS.filter(
            (product) => product.category === activeCategory
          );

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.note.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
          )
        );
      });
    }

    if (sort === "price-low") {
      result = [...result].sort(
        (a, b) =>
          Number(a.price.replace("$", "")) -
          Number(b.price.replace("$", ""))
      );
    }

    if (sort === "price-high") {
      result = [...result].sort(
        (a, b) =>
          Number(b.price.replace("$", "")) -
          Number(a.price.replace("$", ""))
      );
    }

    if (sort === "rating") {
      result = [...result].sort(
        (a, b) => b.rating - a.rating
      );
    }

    return result;
  }, [activeCategory, search, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const productsToShow = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1);
  };

  return (
    <main>
      <section className="bg-[var(--ink)] px-6 py-24 text-center">
        <Eyebrow>Perfume Shop</Eyebrow>

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
          All Perfumes
        </h1>

        <p className="text-white/45 leading-8 max-w-2xl mx-auto mt-6">
          Browse luxury fragrances by mood, category, price, and performance.
        </p>
      </section>

      <section className="px-6 py-14 border-b border-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    handleCategoryChange(category)
                  }
                  className={`
                    shrink-0
                    px-5
                    py-3
                    rounded-full
                    border
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    transition
                    ${
                      activeCategory === category
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "border-black/10 hover:border-[var(--gold)]"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                type="text"
                placeholder="Search perfumes..."
                className="
                  px-5
                  py-3
                  rounded-full
                  bg-white
                  border
                  border-black/10
                  outline-none
                  min-w-[260px]
                "
              />

              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="
                  px-5
                  py-3
                  rounded-full
                  bg-white
                  border
                  border-black/10
                  outline-none
                "
              >
                <option value="featured">
                  Sort: Featured
                </option>
                <option value="price-low">
                  Price: Low to High
                </option>
                <option value="price-high">
                  Price: High to Low
                </option>
                <option value="rating">
                  Top Rated
                </option>
              </select>
            </div>
          </div>

          <p className="mt-6 text-sm text-[var(--mist)]">
            Showing {filteredProducts.length} products
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {productsToShow.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {productsToShow.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  openProductDetails={openProductDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <h2 className="font-display text-5xl font-light mb-4">
                No perfumes found
              </h2>

              <p className="text-[var(--mist)]">
                Try changing your search or category.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-16">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`
                    w-11
                    h-11
                    rounded-full
                    border
                    transition
                    ${
                      page === number
                        ? "bg-[var(--ink)] text-white border-[var(--ink)]"
                        : "border-black/10 hover:border-[var(--gold)]"
                    }
                  `}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}