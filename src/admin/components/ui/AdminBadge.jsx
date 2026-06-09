const badgeStyles = {
  ACTIVE: "bg-[var(--gold)]/15 text-[var(--gold-dark)]",
  INACTIVE: "bg-[#0b0805]/10 text-[#0b0805]",
  PENDING: "bg-[#b88545]/15 text-[#8f5f24]",
  CONFIRMED: "bg-[var(--gold)]/15 text-[var(--gold-dark)]",
  PROCESSING: "bg-[#c9a96e]/15 text-[#8f6a32]",
  DELIVERED: "bg-[var(--gold)]/20 text-[var(--gold-dark)]",
  CANCELLED: "bg-[#0b0805]/10 text-[#0b0805]",
  PAID: "bg-[var(--gold)]/20 text-[var(--gold-dark)]",
  UNPAID: "bg-[#b88545]/15 text-[#8f5f24]",
  BEST_SELLER: "bg-[var(--gold)]/20 text-[var(--gold-dark)]",
  NEW: "bg-[#f5f0e8] text-[var(--gold-dark)]",
  LIMITED: "bg-[#b88545]/15 text-[#8f5f24]",
  PREMIUM: "bg-[#0b0805] text-[var(--gold)]",
};

export default function AdminBadge({ value }) {
  const label = String(value || "-").replaceAll("_", " ");
  const classes = badgeStyles[value] || "bg-[var(--warm)] text-[var(--mist)]";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-[11px]
        font-medium
        uppercase
        tracking-[0.14em]
        ${classes}
      `}
    >
      {label}
    </span>
  );
}