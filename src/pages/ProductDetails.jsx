import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../components/ui/Button";
import Eyebrow from "../components/ui/Eyebrow";

export default function ProductDetails({
  product,
  addToCart,
  openProductsPage,
}) {
  const [lightboxImage, setLightboxImage] = useState(null);

  return (
    <main>
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="grid grid-cols-2 gap-5">
            {product.gallery?.map((image) => (
              <button
                key={image}
                onClick={() => setLightboxImage(image)}
                className="rounded-[2rem] overflow-hidden bg-[var(--warm)]"
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full min-h-[360px] object-cover hover:scale-105 transition duration-700"
                />
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-32">
            <Eyebrow>{product.category}</Eyebrow>

            <h1 className="font-display text-6xl md:text-8xl font-light mt-5 mb-5 leading-none">
              {product.name}
            </h1>

            <p className="text-[var(--mist)] text-lg leading-8 mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-[var(--gold)]">★★★★★</span>
              <span>{product.rating}</span>
              <span className="text-[var(--mist)]">
                ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {product.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full bg-[var(--warm)] text-xs uppercase tracking-[0.18em]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-10">
              <span className="font-display text-5xl">
                {product.price}
              </span>

              {product.oldPrice && (
                <span className="text-xl line-through text-[var(--mist)]">
                  {product.oldPrice}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                disabled={product.stock === "Sold out"}
                onClick={() => addToCart(product)}
                className="justify-center"
              >
                {product.stock === "Sold out"
                  ? "Sold Out"
                  : "Add To Cart"}
              </Button>

              <Button
                variant="ghost"
                onClick={() => openProductsPage(product.category)}
                className="justify-center"
              >
                View Similar
              </Button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-12">
              <InfoCard title="Longevity" value={product.longevity} />
              <InfoCard title="Projection" value={product.projection} />
              <InfoCard title="Season" value={product.season} />
            </div>

            <div className="bg-[var(--warm)] rounded-[2rem] p-8">
              <h2 className="font-display text-4xl font-light mb-6">
                Fragrance Notes
              </h2>

              <Notes title="Top Notes" items={product.topNotes} />
              <Notes title="Heart Notes" items={product.heartNotes} />
              <Notes title="Base Notes" items={product.baseNotes} />
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[1000] bg-black/85 flex items-center justify-center p-6"
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              src={lightboxImage}
              alt={product.name}
              className="max-w-5xl max-h-[85vh] object-contain rounded-[2rem]"
              onClick={(event) => event.stopPropagation()}
            />

            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white text-black"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="bg-white rounded-[1.5rem] p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)] mb-2">
        {title}
      </p>
      <p className="text-sm text-[var(--mist)] leading-6">
        {value}
      </p>
    </div>
  );
}

function Notes({ title, items }) {
  return (
    <div className="border-b border-black/10 last:border-b-0 py-5 first:pt-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)] mb-3">
        {title}
      </p>

      <p className="font-display text-2xl font-light">
        {items?.join(", ")}
      </p>
    </div>
  );
}