import { AnimatePresence, motion } from "framer-motion";
import { formatPrice } from "../../utils/price";
import { FALLBACK_IMAGE } from "../../constants/brand";

/* ─── CartToast ──────────────────────────────────────────
   Shows a brief animated toast when an item is added to bag.

   Props:
   - toast: { visible, product } | null
     product shape: { name, selectedMl, price, image }
─────────────────────────────────────────────────────────── */
export default function CartToast({ toast, onViewBag }) {
  return (
    <AnimatePresence>
      {toast?.visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed left-1/2 z-[3000] w-[calc(100%-2rem)] max-w-sm"
          style={{
            // Raised above the sticky cart bubble (bottom-6 right-6) so the
            // two never overlap, and clears the iOS home-indicator safe area.
            bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="flex items-center gap-4 p-4 shadow-2xl"
            style={{
              background: "var(--ink)",
              border: "1px solid rgba(201,169,110,0.3)",
            }}
          >
            {/* Product image */}
            <div className="w-14 h-16 overflow-hidden shrink-0" style={{ border: "1px solid rgba(201,169,110,0.2)" }}>
              <img
                src={toast.product?.image || FALLBACK_IMAGE}
                alt={toast.product?.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* "Added to bag" label */}
              <div className="flex items-center gap-1.5 mb-1">
                <span style={{ color: "var(--gold)", fontSize: "0.6rem" }}>✦</span>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}>
                  Added to bag
                </span>
              </div>

              <p className="font-display text-lg font-light truncate" style={{ color: "var(--parchment)" }}>
                {toast.product?.name}
              </p>

              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "rgba(245,240,232,0.5)",
                marginTop: "1px",
              }}>
                {toast.product?.selectedMl}ml · {formatPrice(toast.product?.price)}
              </p>
            </div>

            {/* View bag button */}
            <button
              onClick={onViewBag}
              className="shrink-0 px-4 py-2.5 transition-colors duration-300"
              style={{
                background: "var(--gold)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
                fontSize: "0.65rem",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold-lt)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--gold)"; }}
            >
              View Bag
            </button>
          </div>

          {/* Progress bar — auto dismiss indicator */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: "linear" }}
            style={{
              height: "2px",
              background: "var(--gold)",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}