import AdminCard from "./AdminCard";

export default function AdminStatCard({
  label,
  value,
  helper,
  icon = "✦",
  tone = "gold",
}) {
  const toneClass =
    tone === "dark"
      ? "bg-[#0b0805] text-[var(--gold)]"
      : tone === "bronze"
      ? "bg-[#b88545]/15 text-[#8f5f24]"
      : "bg-[var(--gold)]/15 text-[var(--gold-dark)]";

  return (
    <AdminCard>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm text-[var(--mist)]">{label}</p>

          <h3 className="mt-3 font-display text-5xl font-light text-[var(--gold-dark)]">
            {value}
          </h3>

          {helper && (
            <p className="mt-3 text-xs text-[var(--mist)]">
              {helper}
            </p>
          )}
        </div>

        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}
        >
          {icon}
        </span>
      </div>
    </AdminCard>
  );
}