import Eyebrow from "../components/ui/Eyebrow";
import Button from "../components/ui/Button";

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--ink)] py-32 px-6">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1800&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <Eyebrow>Our Story</Eyebrow>

          <h1
            className="
              font-display
              text-6xl
              md:text-8xl
              font-light
              text-[var(--parchment)]
              mt-6
              mb-8
            "
          >
            Crafted For
            <br />
            <span className="italic text-[var(--gold)]">
              Signature Moments
            </span>
          </h1>

          <p
            className="
              max-w-3xl
              mx-auto
              text-lg
              leading-8
              text-white/65
            "
          >
            ÉLIXIR is built around a simple idea:
            fragrance should feel personal, memorable,
            and luxurious. Every scent is selected to
            create emotion, confidence, and identity.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <Eyebrow>The Philosophy</Eyebrow>

            <h2
              className="
                font-display
                text-5xl
                md:text-6xl
                font-light
                mt-5
                mb-8
              "
            >
              Perfume Is More Than A Product
            </h2>

            <p className="text-[var(--mist)] leading-8 mb-6">
              We believe fragrance is an extension of
              personality. The right scent can define
              a memory, elevate confidence, and create
              a lasting impression.
            </p>

            <p className="text-[var(--mist)] leading-8">
              Our collections focus on timeless luxury,
              premium ingredients, and elegant
              presentation designed for modern fragrance
              lovers.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop"
              alt="Luxury perfume"
              className="
                rounded-[2rem]
                shadow-2xl
                hover:scale-[1.02]
                transition
                duration-700
              "
            />

            <div
              className="
                absolute
                -bottom-10
                -left-10
                bg-white
                p-8
                rounded-[2rem]
                shadow-xl
              "
            >
              <p className="font-display text-5xl">
                12K+
              </p>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  mt-2
                "
              >
                Happy Customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[var(--warm)] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Eyebrow>Why Choose Us</Eyebrow>

            <h2
              className="
                font-display
                text-5xl
                md:text-7xl
                font-light
                mt-4
              "
            >
              Built Around Quality
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              title="Authentic Fragrances"
              text="Carefully curated luxury scents with premium ingredients and lasting performance."
            />

            <ValueCard
              title="Fast Delivery"
              text="Quick and reliable shipping with secure packaging and tracking."
            />

            <ValueCard
              title="Luxury Experience"
              text="A premium shopping journey from discovery to delivery."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 text-center">
        <Eyebrow>Explore</Eyebrow>

        <h2
          className="
            font-display
            text-5xl
            md:text-7xl
            font-light
            mt-5
            mb-8
          "
        >
          Discover Your Signature Scent
        </h2>

        <Button>
          Explore Collection
        </Button>
      </section>
    </main>
  );
}

function ValueCard({ title, text }) {
  return (
    <div
      className="
        bg-white
        rounded-[2rem]
        p-10
        shadow-sm
        hover:shadow-xl
        transition
      "
    >
      <h3
        className="
          font-display
          text-4xl
          font-light
          mb-5
        "
      >
        {title}
      </h3>

      <p className="text-[var(--mist)] leading-8">
        {text}
      </p>
    </div>
  );
}