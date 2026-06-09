const ITEMS = [
  "Luxury Fragrances",
  "Signature Scents",
  "Authentic Perfumes",
  "Fast Delivery",
  "Premium Collection",
  "Limited Editions",
  "Luxury Oud",
  "Gift Packaging",
];

export default function Marquee() {
  return (
    <section className="marquee-strip py-5">
      <div className="marquee-track animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="marquee-item flex items-center"
          >
            <span>{item}</span>
            <span className="marquee-dot">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}