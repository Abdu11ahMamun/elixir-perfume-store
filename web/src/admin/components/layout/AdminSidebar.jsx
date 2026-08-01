import compactIcon from "../../../assets/branding/aurvior-compact-icon.png";

// ─── Minimal line icons (inline SVG, no dependency) ─────────
const icons = {
  dashboard: (
    <svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="2.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="2.5" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="11" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg>
  ),
  reports: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M3 17V9M10 17V3M17 17v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  products: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M3 6.5l7-3.5 7 3.5-7 3.5-7-3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M3 6.5V14l7 3.5 7-3.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  addProduct: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  categories: (
    <svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M2.5 8h15" stroke="currentColor" strokeWidth="1.5" /></svg>
  ),
  orders: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M5 3h10l-.7 12.2a1 1 0 01-1 .8H6.7a1 1 0 01-1-.8L5 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7.5 3a2.5 2.5 0 015 0" stroke="currentColor" strokeWidth="1.5" /></svg>
  ),
  customers: (
    <svg viewBox="0 0 20 20" fill="none"><circle cx="7.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M2 17c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="14.5" cy="7.5" r="2.3" stroke="currentColor" strokeWidth="1.4" /><path d="M13 17c.3-2.6 1.8-4.2 3.5-4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none"><rect x="4" y="8.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M6.5 8.5V6a3.5 3.5 0 017 0v2.5" stroke="currentColor" strokeWidth="1.5" /></svg>
  ),
  marketing: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M3 8v4l4 1V7l-4 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M7 7.5l7-3.5v12l-7-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5.5 13.5L6.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  deliveryAreas: (
    <svg viewBox="0 0 20 20" fill="none"><path d="M3 15.5V8.2a1 1 0 01.45-.83l6-4a1 1 0 011.1 0l6 4a1 1 0 01.45.83v7.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M2 15.5h16M7.5 15.5V11h5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  customerTypes: (
    <svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3" width="15" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" /><rect x="2.5" y="9.5" width="15" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 5.25h.01M6 11.75h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" /><path d="M10 3v1.6M10 15.4V17M17 10h-1.6M4.6 10H3M14.8 5.2l-1.1 1.1M6.3 13.7l-1.1 1.1M14.8 14.8l-1.1-1.1M6.3 6.3L5.2 5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
};

const navGroups = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "dashboard" },
      { id: "reports", label: "Reports", icon: "reports" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: "products", label: "Products", icon: "products" },
      { id: "addProduct", label: "Add Product", icon: "addProduct" },
      { id: "categories", label: "Categories", icon: "categories" },
      { id: "orders", label: "Orders", icon: "orders" },
      { id: "customers", label: "Customers", icon: "customers" },
      { id: "customerTypes", label: "Customer Types", icon: "customerTypes" },
      { id: "deliveryAreas", label: "Delivery Areas", icon: "deliveryAreas" },
    ],
  },
  {
    label: "Access",
    items: [{ id: "users", label: "Users", icon: "users" }],
  },
  {
    label: "Workspace",
    items: [
      { id: "marketing", label: "Marketing", icon: "marketing" },
      { id: "settings", label: "Settings", icon: "settings" },
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
        className={`fixed inset-0 z-40 bg-gray-900/40 lg:hidden ${isOpen ? "block" : "hidden"}`}
      />

      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-64 border-r border-gray-200 bg-white
          transition-transform duration-200 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          onClick={() => handleClick("dashboard")}
          className="flex h-16 w-full items-center gap-3 border-b border-gray-100 px-5 text-left transition-colors hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--ink)]">
            <img src={compactIcon} alt="AURVIOR" className="h-full w-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">AURVIOR</p>
            <p className="text-[11px] text-gray-400">Admin</p>
          </div>
        </button>

        <nav className="h-[calc(100%-4rem)] overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = activePage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`
                        flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors
                        ${
                          active
                            ? "bg-[#c9a96e]/12 font-medium text-[var(--gold-dark)]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <span className={`h-4 w-4 shrink-0 ${active ? "text-[var(--gold-dark)]" : "text-gray-400"}`}>
                        {icons[item.icon]}
                      </span>
                      <span>{item.label}</span>
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
