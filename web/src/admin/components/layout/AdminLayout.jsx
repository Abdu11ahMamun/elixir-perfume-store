import { useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar  from "./AdminTopbar";

const pageMeta = {
  dashboard:  { title: "Dashboard",  description: "Store performance, sales, orders, and inventory." },
  categories: { title: "Categories", description: "Manage storefront categories, descriptions, and their display image." },
  products:   { title: "Products",   description: "Manage fragrance catalog, stock, pricing, and visibility." },
  addProduct: { title: "Add Product",description: "Create a new perfume with notes, gallery, pricing, and SEO." },
  orders:     { title: "Orders",     description: "Track purchases, payment, delivery, and customer requests." },
  orderDetails: { title: "Order Details", description: "Read-only order review." },
  editOrder:  { title: "Edit Order", description: "Update buyer details, address, and status." },
  deliveryAreas: { title: "Delivery Areas", description: "Configure districts, upazilas, and delivery charges." },
  customers:  { title: "Customers",  description: "Understand buyers, repeat customers, and fragrance preferences." },
  customerProfile: { title: "Customer Profile", description: "Read-only customer review." },
  editCustomer: { title: "Edit Customer", description: "Update profile details and customer type." },
  customerTypes: { title: "Customer Types", description: "Configure customer-type options." },
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
  onExit,      // ← () => void — return to the public storefront
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const meta = useMemo(() => pageMeta[activePage] || pageMeta.dashboard, [activePage]);

  return (
    <div className="admin-area min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="lg:pl-64">
        <AdminTopbar
          title={meta.title}
          description={meta.description}
          setSidebarOpen={setSidebarOpen}
          setActivePage={setActivePage}
          onExit={onExit}
          admin={admin}
          onLogout={onLogout}
        />
        <main className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
