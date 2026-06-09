const navGroups = [
  {
    label: "Atelier",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "✦" },
      { id: "reports", label: "Reports", icon: "◷" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "products", label: "Products", icon: "◈" },
      { id: "addProduct", label: "Add Product", icon: "+" },
      { id: "orders", label: "Orders", icon: "◎" },
      { id: "customers", label: "Customers", icon: "☉" },
    ],
  },
  {
    label: "Brand",
    items: [
      { id: "marketing", label: "Marketing", icon: "✺" },
      { id: "settings", label: "Settings", icon: "⚙" },
    ],
  },
];

export default function AdminSidebar({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}) {
  const handleClick = (page) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      />

      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-72 border-r border-[var(--gold)]/20
          bg-[#0b0805] text-[var(--parchment)]
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative flex h-24 items-center gap-4 border-b border-[var(--gold)]/15 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 font-display text-2xl text-[var(--gold)]">
            É
          </div>

          <div>
            <h1 className="font-display text-2xl tracking-[0.18em]">
              ÉLIXIR
            </h1>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">
              Admin Atelier
            </p>
          </div>
        </div>

        <nav className="h-[calc(100vh-6rem)] overflow-y-auto px-4 py-8">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-8">
              <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--gold)]/70">
                {group.label}
              </p>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const active = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`
                        flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-300
                        ${
                          active
                            ? "bg-[var(--gold)] text-[#0b0805] shadow-xl shadow-black/30"
                            : "text-[var(--parchment)]/65 hover:bg-white/5 hover:text-[var(--gold)] hover:translate-x-1"
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}