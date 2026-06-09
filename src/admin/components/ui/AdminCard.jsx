export default function AdminCard({
  children,
  className = "",
  title,
  description,
  action,
}) {
  return (
    <section
      className={`
        rounded-[2rem]
        border
        border-[var(--gold)]/15
        bg-[#fffcf8]
        shadow-[0_24px_80px_rgba(14,12,10,0.06)]
        backdrop-blur
        ${className}
      `}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-[var(--gold)]/10 px-7 py-6">
          <div>
            {title && (
              <h3 className="font-display text-3xl font-light text-[var(--ink)]">
                {title}
              </h3>
            )}

            {description && (
              <p className="mt-1 text-sm text-[var(--mist)]">
                {description}
              </p>
            )}
          </div>

          {action}
        </div>
      )}

      <div className="p-7">{children}</div>
    </section>
  );
}