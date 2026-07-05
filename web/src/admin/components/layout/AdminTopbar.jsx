import { useState } from "react";

export default function AdminTopbar({
  title,
  description,
  setSidebarOpen,
  admin,      // { name, email, role }
  onLogout,   // () => void
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Initials from name
  const initials = admin?.name
    ? admin.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--gold)]/15 bg-[var(--cream)]/90 backdrop-blur-xl">
      <div className="flex h-24 items-center justify-between gap-4 px-6 lg:px-10">

        {/* Left: title */}
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
              <p className="mt-1 text-sm text-[var(--mist)]">{description}</p>
            )}
          </div>
        </div>

        {/* Right: search + admin menu */}
        <div className="hidden items-center gap-3 md:flex">
          <input
            type="text"
            placeholder="Search orders, products..."
            className="w-64 xl:w-80 rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
          />

          {/* Admin dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-3 rounded-full border border-[var(--gold)]/25 bg-white px-3 py-2 transition hover:border-[var(--gold)]/50"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b0805] font-display text-lg text-[var(--gold)]">
                {initials}
              </div>
              <div className="hidden text-left xl:block">
                <p className="text-sm font-medium text-[var(--ink)]">
                  {admin?.name || "Admin"}
                </p>
                <p className="text-xs text-[var(--mist)]">
                  {admin?.role || "Super Admin"}
                </p>
              </div>
              {/* Chevron */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                className="hidden xl:block"
                style={{ color: "var(--mist)", transform: showMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <>
                {/* Backdrop to close */}
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />

                <div className="absolute right-0 top-14 z-20 w-56 overflow-hidden border border-[var(--gold)]/15 bg-white shadow-xl"
                  style={{ borderRadius: "1rem" }}>

                  {/* Admin info */}
                  <div className="px-5 py-4 border-b border-[var(--gold)]/10">
                    <p className="text-sm font-medium text-[var(--ink)]">{admin?.name || "Admin"}</p>
                    <p className="text-xs text-[var(--mist)] mt-0.5 truncate">{admin?.email || ""}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      onClick={() => { setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-left text-[var(--mist)] hover:bg-[var(--warm)] transition-colors"
                    >
                      <span>⚙</span> Settings
                    </button>

                    {/* Logout */}
                    <button
                      onClick={() => { setShowMenu(false); onLogout?.(); }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm text-left transition-colors"
                      style={{ color: "#b91c1c" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(185,28,28,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <span>→</span> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile logout button */}
        <button
          onClick={onLogout}
          className="md:hidden flex items-center gap-2 px-4 py-2 text-xs transition-colors"
          style={{ border: "1px solid rgba(185,28,28,0.3)", color: "#b91c1c", borderRadius: "999px" }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}