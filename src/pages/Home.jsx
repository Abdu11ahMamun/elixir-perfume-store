import {
  BRAND,
  FEATURED,
  COLLECTIONS,
  STATS,
} from "../constants/brand";

import TrustBar from "../components/ui/TrustBar";
import CollectionCard from "../components/ui/CollectionCard";
import ProductCard from "../components/ui/ProductCard";
import Newsletter from "../components/ui/Newsletter";
import FragranceFinder from "../components/fragrance/FragranceFinder";
import Marquee from "../components/Marquee";
import Eyebrow from "../components/ui/Eyebrow";
import Button from "../components/ui/Button";

export default function Home({
  openProductsPage,
  addToCart,
  openProductDetails,
}) {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop"
            alt="Luxury perfume"
            className="w-full h-full object-cover animate-slow-zoom"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-[90vh] flex items-center">
          <div className="max-w-2xl text-white">
            <Eyebrow>
              Luxury Perfume Collection
            </Eyebrow>

            <h1
              className="
                font-display
                text-6xl
                md:text-8xl
                font-light
                leading-[0.9]
                mt-6
                mb-8
                animate-fade-up
              "
            >
              Wear Your
              <br />
              <span className="italic text-[var(--gold)]">
                Signature
              </span>
            </h1>

            <p
              className="
                text-lg
                text-white/70
                leading-8
                mb-10
                max-w-xl
              "
            >
              {BRAND.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() =>
                  openProductsPage("All")
                }
              >
                Explore Collection
              </Button>

              <Button
                variant="ghost-light"
                onClick={() =>
                  openProductsPage("All")
                }
              >
                Best Sellers
              </Button>
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <Marquee />

      {/* CATEGORIES */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Eyebrow>Collections</Eyebrow>

          <h2
            className="
              font-display
              text-5xl
              md:text-7xl
              font-light
              mt-4
              mb-14
            "
          >
            Explore Categories
          </h2>

          <div className="grid lg:grid-cols-4 gap-8">
            {COLLECTIONS.map((collection) => (
              <CollectionCard
                key={collection.title}
                collection={collection}
                openProductsPage={openProductsPage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-[var(--ink)] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Eyebrow>Best Sellers</Eyebrow>

            <h2
              className="
                font-display
                text-5xl
                md:text-7xl
                font-light
                text-[var(--parchment)]
                mt-4
              "
            >
              Featured Fragrances
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {FEATURED.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                openProductDetails={
                  openProductDetails
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {STATS.map((item) => (
              <div
                key={item.label}
                className="
                  bg-[var(--warm)]
                  rounded-[2rem]
                  p-10
                  text-center
                "
              >
                <div
                  className="
                    font-display
                    text-6xl
                    text-[var(--gold-dark)]
                    mb-4
                  "
                >
                  {item.value}
                </div>

                <p
                  className="
                    uppercase
                    tracking-[0.2em]
                    text-xs
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FragranceFinder
        openProductDetails={
          openProductDetails
        }
      />

      <Newsletter />
    </>
  );
}