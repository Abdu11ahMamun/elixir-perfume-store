import AdminCard from "./AdminCard";

const toneClass = {
  gold:   "bg-[#c9a96e]/15 text-[var(--gold-dark)]",
  dark:   "bg-gray-900 text-white",
  bronze: "bg-amber-50 text-amber-700",
  red:    "bg-red-50 text-red-600",
  green:  "bg-green-50 text-green-700",
};

export default function AdminStatCard({
  label,
  value,
  helper,
  icon = "✦",
  tone = "gold",
  trend, // optional: { direction: "up" | "down", label: "11.01%" }
}) {
  return (
    <AdminCard padding={false}>
      <div className="flex items-start justify-between gap-4 p-6">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{label}</p>

          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            {value}
          </h3>

          {(helper || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    trend.direction === "down" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {trend.direction === "down" ? "↓" : "↑"} {trend.label}
                </span>
              )}
              {helper && <p className="truncate text-xs text-gray-400">{helper}</p>}
            </div>
          )}
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${toneClass[tone] || toneClass.gold}`}
        >
          {icon}
        </span>
      </div>
    </AdminCard>
  );
}
