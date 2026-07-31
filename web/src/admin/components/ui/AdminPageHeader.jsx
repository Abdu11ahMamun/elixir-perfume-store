export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  breadcrumbs,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? "text-gray-500" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[var(--gold-dark)]">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
