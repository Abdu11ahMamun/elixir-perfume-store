import { FALLBACK_IMAGE } from "../../constants/brand";

/* ─── ProductImage ───────────────────────────────────────
   Shared fixed-aspect-ratio product image frame — one place
   controlling crop strategy, sizing, and broken/missing-image
   fallback for every product image on the storefront.
   Props:
   - src        : resolved image URL (already run through buildImageUrl if needed)
   - alt        : alt text
   - imgClassName : extra classes for the <img> itself (e.g. "card-img" for hover zoom)
   - className  : extra classes for the aspect-ratio wrapper
   - children   : optional overlay content (badges, CTAs) absolutely
                  positioned against this same wrapper, matching the
                  original inline markup this component replaces
─────────────────────────────────────────────────────────── */
export default function ProductImage({ src, alt, className = "", imgClassName = "", children }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: "3/4" }}>
      <img
        src={src || FALLBACK_IMAGE}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
      />
      {children}
    </div>
  );
}
