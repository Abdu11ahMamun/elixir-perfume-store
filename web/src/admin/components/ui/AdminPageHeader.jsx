export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}

        <h1 className="font-display text-5xl font-light leading-none text-[var(--ink)] md:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--mist)]">
            {description}
          </p>
        )}

        <div className="mt-5 h-px w-24 bg-gradient-to-r from-[var(--gold)] to-transparent" />
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}