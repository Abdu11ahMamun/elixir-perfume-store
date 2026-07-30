import { useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar  from "./AdminTopbar";

const pageMeta = {
  dashboard:  { title: "Dashboard",  description: "Luxury store performance, sales, orders, and inventory." },
  categories: { title: "Categories", description: "Manage storefront categories, descriptions, and their display image." },
  products:   { title: "Products",   description: "Manage fragrance catalog, stock, pricing, and visibility." },
  addProduct: { title: "Add Product",description: "Create a new perfume with notes, gallery, pricing, and SEO." },
  orders:     { title: "Orders",     description: "Track purchases, payment, delivery, and customer requests." },
  customers:  { title: "Customers",  description: "Understand buyers, repeat customers, and fragrance preferences." },
  users:      { title: "Users",      description: "Manage admin and customer accounts, roles, and access status." },
  reports:    { title: "Reports",    description: "Monthly sales, top fragrances, revenue, and growth insights." },
  marketing:  { title: "Marketing",  description: "Feature products, campaigns, banners, and promotions." },
  settings:   { title: "Settings",   description: "Configure store, delivery, payment, and admin preferences." },
};

export default function AdminLayout({
  activePage,
  setActivePage,
  children,
  admin,       // ← { name, email, role }
  onLogout,    // ← () => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = useMemo(() => pageMeta[activePage] || pageMeta.dashboard, [activePage]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--cream)] text-[var(--ink)]">
      {/* Gold ambient blobs */}
      <div className="fixed top-[-220px] right-[-140px] h-[720px] w-[720px] rounded-full pointer-events-none blur-[180px] opacity-20"
        style={{ background: "var(--gold)" }} />
      <div className="fixed bottom-[-260px] left-[20%] h-[560px] w-[560px] rounded-full pointer-events-none blur-[160px] opacity-10"
        style={{ background: "var(--gold-dark)" }} />

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="lg:pl-72">
        <AdminTopbar
          title={meta.title}
          description={meta.description}
          setSidebarOpen={setSidebarOpen}
          admin={admin}
          onLogout={onLogout}
        />
        <main className="px-6 py-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}