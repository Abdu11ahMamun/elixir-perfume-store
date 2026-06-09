const badgeStyles = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  INACTIVE: "bg-rose-50 text-rose-700",
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
  PAID: "bg-emerald-50 text-emerald-700",
  UNPAID: "bg-amber-50 text-amber-700",
  BEST_SELLER: "bg-violet-50 text-violet-700",
  NEW: "bg-blue-50 text-blue-700",
  LIMITED: "bg-orange-50 text-orange-700",
  PREMIUM: "bg-yellow-50 text-yellow-700",
};

export default function AdminBadge({ value }) {
  const label = String(value || "-").replaceAll("_", " ");
  const classes = badgeStyles[value] || "bg-slate-100 text-slate-600";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${classes}
      `}
    >
      {label}
    </span>
  );
}