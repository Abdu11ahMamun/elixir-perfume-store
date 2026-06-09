import { useState } from "react";

import AdminLayout from "./components/layout/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";
import AdminProductForm from "./pages/AdminProductForm";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminCustomers from "./pages/AdminCustomers";
import AdminCustomerProfile from "./pages/AdminCustomerProfile";
import Cursor from "../components/ui/Cursor";

export default function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
       case "dashboard":
        return <AdminDashboard />;

      case "products":
        return <AdminProducts />;

      case "addProduct":
        return <AdminProductForm />;

      case "orders":
        return <AdminOrders setActivePage={setActivePage} />;

      case "orderDetails":
        return <AdminOrderDetails />;

      case "customers":
        return <AdminCustomers setActivePage={setActivePage} />;

      case "customerProfile":
        return <AdminCustomerProfile />;

      case "reports":
        return <AdminReports />;

      default:
        return (
          <div className="rounded-3xl border border-[var(--gold)]/20 bg-white p-10">
            <h1 className="font-display text-5xl font-light">
              {activePage}
            </h1>

            <p className="mt-3 text-[var(--mist)]">
              This module is under construction.
            </p>
          </div>
        );
    }
  };

return (
  <>
    <Cursor />

    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {renderPage()}
    </AdminLayout>
  </>
);
}