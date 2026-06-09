import { BRAND, CATEGORIES } from "../../constants/brand";

export default function Footer({ openPage, openProductsPage }) {
  const year = new Date().getFullYear();

  const shopLinks = CATEGORIES.filter((category) => category !== "All");

  return (
    <footer className="relative overflow-hidden bg-[#080604] text-[var(--parchment)]">
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <span className="font-display text-[18vw] tracking-[0.2em] text-white/[0.025] leading-none">
          {BRAND.name}
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
          <div>
            <h2 className="font-display text-4xl tracking-[0.28em] font-light mb-3">
              {BRAND.name}
            </h2>

            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] mb-6">
              {BRAND.tagline}
            </p>

            <p className="text-[var(--mist)] leading-8 max-w-sm">
              {BRAND.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-[var(--gold)] mb-6">
              Shop
            </h3>

            <ul className="space-y-4">
              {shopLinks.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => openProductsPage(category)}
                    className="text-[var(--mist)] hover:text-[var(--gold)] transition"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-[var(--gold)] mb-6">
              Company
            </h3>

            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => openPage("about")}
                  className="text-[var(--mist)] hover:text-[var(--gold)] transition"
                >
                  About
                </button>
              </li>

              <li>
                <button
                  onClick={() => openPage("bestSellers")}
                  className="text-[var(--mist)] hover:text-[var(--gold)] transition"
                >
                  Best Sellers
                </button>
              </li>

              <li>
                <button
                  onClick={() => openProductsPage("All")}
                  className="text-[var(--mist)] hover:text-[var(--gold)] transition"
                >
                  All Perfumes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-[var(--gold)] mb-6">
              Support
            </h3>

            <ul className="space-y-4 text-[var(--mist)]">
              <li>Fast Delivery</li>
              <li>Cash On Delivery</li>
              <li>Gift Packaging</li>
              <li>Customer Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs tracking-[0.18em] uppercase text-white/30">
            © {year} {BRAND.name}. All rights reserved.
          </p>

          <p className="font-display italic text-[var(--gold)]/60">
            Wear Your Signature.
          </p>
        </div>
      </div>
    </footer>
  );
}