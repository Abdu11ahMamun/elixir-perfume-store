// ─── Currency ─────────────────────────────────────────────
// Format: ৳1,100
export function formatCurrency(value) {
  if (value === null || value === undefined) return "৳0";
  return `৳${Number(value).toLocaleString("en-BD")}`;
}

// ─── Date ─────────────────────────────────────────────────
// Input: "2026-06-03" or ISO string
// Output: "03 Jun 2026"
export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Date + Time ──────────────────────────────────────────
export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("en-GB", {
      day:    "2-digit",
      month:  "short",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}