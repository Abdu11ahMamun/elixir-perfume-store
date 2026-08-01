import { FALLBACK_IMAGE } from "../../constants/brand";

/* ─── ProductImage ───────────────────────────────────────
   Shared aspect-ratio product image frame — one place
   controlling crop strategy, sizing, loading behavior, and
   broken/missing-image fallback for product images across
   the storefront.
   Props:
   - src           : resolved image URL (already run through buildImageUrl if needed)
   - alt           : alt text
   - aspectRatio   : CSS aspect-ratio for the wrapper (default "3 / 4")
   - loading       : "lazy" (default) or "eager" for above-the-fold usage
   - decoding      : image decoding hint (default "async")
   - objectPosition: optional CSS object-position override
   - width, height : optional numeric intrinsic size hints
   - imgClassName  : extra classes for the <img> itself (e.g. "card-img" for hover zoom)
   - className     : extra classes for the aspect-ratio wrapper
   - children      : optional overlay content (badges, CTAs) absolutely
                     positioned against this same wrapper
─────────────────────────────────────────────────────────── */
export default function ProductImage({
  src,
  alt,
  aspectRatio = "3 / 4",
  loading = "lazy",
  decoding = "async",
  objectPosition,
  width,
  height,
  className = "",
  imgClassName = "",
  children,
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <img
        src={src || FALLBACK_IMAGE}
        alt={alt}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
        className={`w-full h-full object-cover ${imgClassName}`}
        style={objectPosition ? { objectPosition } : undefined}
        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
      />
      {children}
    </div>
  );
}
