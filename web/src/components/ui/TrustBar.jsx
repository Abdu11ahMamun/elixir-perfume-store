import { TRUST_POINTS } from "../../constants/brand";

export default function TrustBar() {
  return (
    <section className="bg-[var(--ink)] border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((item) => (
            <div
              key={item}
              className="
                py-6
                px-4
                text-center
                border-white/10
                lg:border-r
                last:border-r-0
              "
            >
              <div className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                <span
                  className="
                    text-[11px]
                    md:text-xs
                    uppercase
                    tracking-[0.25em]
                    text-[var(--parchment)]
                  "
                >
                  {item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}