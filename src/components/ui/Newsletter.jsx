import Button from "./Button";
import Eyebrow from "./Eyebrow";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)] py-28 px-6">
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          select-none
        "
      >
        <span
          className="
            font-display
            italic
            text-[20vw]
            leading-none
            text-white/[0.025]
          "
        >
          Fragrance
        </span>
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <Eyebrow>Stay Updated</Eyebrow>

        <h2
          className="
            font-display
            text-5xl
            md:text-7xl
            font-light
            text-[var(--parchment)]
            mt-5
            mb-6
            leading-tight
          "
        >
          Join The{" "}
          <em className="text-[var(--gold)]">Fragrance Club</em>
        </h2>

        <p className="text-[var(--mist)] leading-8 max-w-xl mx-auto mb-10">
          Get exclusive launches, limited offers, and curated perfume
          recommendations delivered directly to your inbox.
        </p>

        <form className="max-w-xl mx-auto flex flex-col sm:flex-row border border-[var(--gold)]/40">
          <input
            type="email"
            placeholder="Enter your email"
            className="
              flex-1
              bg-white/5
              px-6
              py-4
              outline-none
              text-[var(--parchment)]
              placeholder:text-white/30
            "
          />

          <Button type="submit" className="justify-center">
            Subscribe
          </Button>
        </form>

        <p className="text-white/25 text-xs uppercase tracking-[0.25em] mt-5">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}