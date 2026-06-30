export default function AdminTopbar({ title, description, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--gold)]/15 bg-[var(--cream)]/90 backdrop-blur-xl">
      <div className="flex h-24 items-center justify-between gap-4 px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--gold)]/30 bg-white text-[var(--ink)] lg:hidden"
          >
            ☰
          </button>

          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--gold)]">
              ÉLIXIR Backoffice
            </p>

            <h2 className="mt-1 font-display text-4xl font-light text-[var(--ink)]">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-[var(--mist)]">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <input
            type="text"
            placeholder="Search orders, products..."
            className="w-80 rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
          />

          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--gold)]/25 bg-white text-[var(--gold-dark)]">
            ✦
          </button>

          <button className="flex items-center gap-3 rounded-full border border-[var(--gold)]/25 bg-white px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0805] font-display text-lg text-[var(--gold)]">
              A
            </div>

            <div className="hidden text-left xl:block">
              <p className="text-sm font-medium text-[var(--ink)]">
                Abdullah
              </p>
              <p className="text-xs text-[var(--mist)]">
                Super Admin
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}