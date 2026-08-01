import { useMemo, useState } from "react";
import { FINDER_OPTIONS, PRODUCTS, FALLBACK_IMAGE } from "../../constants/brand";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";

export default function FragranceFinder({
  openProductDetails,
}) {
  const [mood, setMood] = useState("");
  const [occasion, setOccasion] = useState("");

  const recommendations = useMemo(() => {
    if (!mood && !occasion) return [];

    return PRODUCTS.filter((product) => {
      const moodMatch =
        !mood ||
        product.tags?.some((tag) =>
          tag.toLowerCase().includes(mood.toLowerCase())
        );

      const occasionMatch =
        !occasion ||
        product.occasion
          .toLowerCase()
          .includes(occasion.toLowerCase());

      return moodMatch || occasionMatch;
    }).slice(0, 3);
  }, [mood, occasion]);

  return (
    <section className="py-28 px-6 bg-[var(--warm)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Eyebrow>Signature Experience</Eyebrow>

          <h2
            className="
              font-display
              text-5xl
              md:text-7xl
              font-light
              mt-4
              mb-6
            "
          >
            Find Your Perfect Scent
          </h2>

          <p
            className="
              max-w-2xl
              mx-auto
              text-[var(--mist)]
              leading-8
            "
          >
            Answer a few simple questions and discover the fragrance
            that best matches your style and occasion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm">
            <div className="mb-8">
              <label className="block mb-3 text-sm uppercase tracking-[0.2em]">
                Preferred Mood
              </label>

              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="
                  w-full
                  p-4
                  border
                  border-black/10
                  bg-white
                  rounded-xl
                "
              >
                <option value="">Choose Mood</option>

                {FINDER_OPTIONS.mood.map((option) => (
                  <option key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-10">
              <label className="block mb-3 text-sm uppercase tracking-[0.2em]">
                Occasion
              </label>

              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="
                  w-full
                  p-4
                  border
                  border-black/10
                  bg-white
                  rounded-xl
                "
              >
                <option value="">Choose Occasion</option>

                {FINDER_OPTIONS.occasion.map((option) => (
                  <option key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Button className="w-full justify-center">
              Discover Matches
            </Button>
          </div>

          <div>
            <div className="grid gap-6">
              {recommendations.length === 0 ? (
                <div
                  className="
                    bg-white
                    rounded-[2rem]
                    p-10
                    text-center
                    shadow-sm
                  "
                >
                  <p className="text-[var(--mist)]">
                    Select preferences to receive recommendations.
                  </p>
                </div>
              ) : (
                recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="
                      bg-white
                      rounded-[2rem]
                      p-6
                      flex
                      gap-5
                      items-center
                      shadow-sm
                    "
                  >
                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      className="
                        w-28
                        h-28
                        object-cover
                        rounded-2xl
                      "
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    />

                    <div className="flex-1">
                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          text-[var(--gold)]
                          mb-2
                        "
                      >
                        {product.category}
                      </p>

                      <h3
                        className="
                          font-display
                          text-3xl
                          font-light
                          mb-2
                        "
                      >
                        {product.name}
                      </h3>

                      <p className="text-[var(--mist)] mb-4">
                        {product.note}
                      </p>

                      <Button
                        variant="ghost"
                        onClick={() =>
                          openProductDetails(product)
                        }
                      >
                        Explore
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}