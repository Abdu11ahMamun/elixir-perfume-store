import Button from "./Button";
import { FALLBACK_IMAGE } from "../../constants/brand";

export default function CollectionCard({ collection, openProductsPage }) {
  const navigate = () => openProductsPage(collection.title);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Discover ${collection.title}`}
      onClick={navigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      }}
      className="
        collection-card
        relative
        overflow-hidden
        rounded-[2rem]
        min-h-[520px]
        group
      "
      style={{ cursor: "none" }}
    >
      <img
        src={collection.image || FALLBACK_IMAGE}
        alt={collection.title}
        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      <div
        className="
          absolute
          inset-0
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-700
          bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.22),transparent_65%)]
        "
      />

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <p
          className="
            text-[11px]
            uppercase
            tracking-[0.3em]
            text-[var(--gold)]
            mb-3
          "
        >
          {collection.subtitle}
        </p>

        <h3
          className="
            font-display
            text-4xl
            font-light
            mb-6
          "
        >
          {collection.title}
        </h3>

        <Button
          variant="ghost-light"
          onClick={(e) => { e.stopPropagation(); navigate(); }}
        >
          Discover
        </Button>
      </div>
    </article>
  );
}