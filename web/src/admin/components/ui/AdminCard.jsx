export default function AdminCard({
  children,
  className = "",
  title,
  description,
  action,
  padding = true,
}) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900">
                {title}
              </h3>
            )}

            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {action}
        </div>
      )}

      <div className={padding ? "p-6" : ""}>{children}</div>
    </section>
  );
}
