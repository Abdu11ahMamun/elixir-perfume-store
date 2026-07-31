// ─── Status → tone mapping ──────────────────────────────────
// Soft, low-contrast badges (Stripe/Linear style): tinted background,
// matching text, no border noise.
const tones = {
  green:  "bg-green-50 text-green-700",
  red:    "bg-red-50 text-red-600",
  amber:  "bg-amber-50 text-amber-700",
  gray:   "bg-gray-100 text-gray-600",
  blue:   "bg-blue-50 text-blue-700",
  ink:    "bg-gray-900 text-white",
  gold:   "bg-[#c9a96e]/15 text-[var(--gold-dark)]",
};

const statusTone = {
  ACTIVE: "green",
  CONFIRMED: "blue",
  PROCESSING: "blue",
  DELIVERED: "green",
  PAID: "green",
  BEST_SELLER: "gold",
  PREMIUM: "ink",
  PRIVATE_CLIENT: "ink",
  ADMIN: "ink",
  GOLD_COLLECTOR: "gold",
  NEW: "blue",

  PENDING: "amber",
  UNPAID: "amber",
  DRAFT: "amber",
  LOW_STOCK: "amber",
  LIMITED: "amber",

  INACTIVE: "gray",
  CUSTOMER: "gray",
  NEW_DISCOVERY: "gray",
  EMERALD_MEMBER: "gray",

  CANCELLED: "red",
  BLOCKED: "red",
  DELETED: "red",
  OUT_OF_STOCK: "red",
  FAILED: "red",
  REFUNDED: "red",
  ARCHIVED: "red",
  SHIPPED: "blue",
};

export default function AdminBadge({ value, tone }) {
  const label = String(value || "-").replaceAll("_", " ");
  const resolvedTone = tone || statusTone[value] || "gray";
  const classes = tones[resolvedTone] || tones.gray;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
