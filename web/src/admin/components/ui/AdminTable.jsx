// ─── Lightweight table primitives ──────────────────────────
// `columns` is a CSS grid-template-columns string shared by the
// header row and every body row, so columns always line up.

export function AdminTable({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">{children}</div>
      </div>
    </div>
  );
}

export function AdminTableHead({ columns, children }) {
  return (
    <div
      className="grid gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}

export function AdminTableBody({ children }) {
  return <div className="divide-y divide-gray-100 bg-white">{children}</div>;
}

export function AdminTableRow({ columns, children, className = "" }) {
  return (
    <div
      className={`grid items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 ${className}`}
      style={{ gridTemplateColumns: columns }}
    >
      {children}
    </div>
  );
}
