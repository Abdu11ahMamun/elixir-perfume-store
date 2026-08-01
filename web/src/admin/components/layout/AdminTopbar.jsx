import { useState } from "react";

export default function AdminTopbar({
  title,
  description,
  setSidebarOpen,
  setActivePage, // (page) => void
  onExit,        // () => void — return to the public storefront
  admin,      // { name, email, role }
  onLogout,   // () => void
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Initials from name
  const initials = admin?.name
    ? admin.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">

        {/* Left: title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-gray-900">{title}</h2>
            {description && (
              <p className="hidden truncate text-xs text-gray-400 sm:block">{description}</p>
            )}
          </div>
        </div>

        {/* Right: search + notification + admin menu */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search orders, products..."
              className="w-56 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[var(--gold)] focus:bg-white focus:ring-2 focus:ring-[#c9a96e]/20 xl:w-72"
            />
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 7.2a5 5 0 0110 0c0 3 1 4 1.4 4.4H2.6C3 11.2 4 10.2 4 7.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M7.2 14.4a1.8 1.8 0 003.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--gold)] ring-2 ring-white" />
          </button>

          {/* Admin dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-2.5 rounded-lg border border-gray-200 py-1.5 pl-1.5 pr-2.5 transition hover:bg-gray-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--ink)] text-xs font-semibold text-[var(--gold)]">
                {initials}
              </div>
              <div className="hidden text-left xl:block">
                <p className="text-xs font-medium leading-none text-gray-900">{admin?.name || "Admin"}</p>
                <p className="mt-1 text-[11px] leading-none text-gray-400">{admin?.role || "Super Admin"}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                className="hidden text-gray-400 xl:block"
                style={{ transform: showMenu ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />

                <div className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{admin?.name || "Admin"}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">{admin?.email || ""}</p>
                  </div>

                  <div className="py-1.5">
                    <button
                      onClick={() => { setShowMenu(false); setActivePage?.("settings"); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                      Settings
                    </button>

                    <button
                      onClick={() => { setShowMenu(false); onExit?.(); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-50"
                    >
                      View Storefront
                    </button>

                    <button
                      onClick={() => { setShowMenu(false); onLogout?.(); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
