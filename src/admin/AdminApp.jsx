import { useState } from "react";

import AdminLayout from "./components/layout/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminReports from "./pages/AdminReports";
import AdminProductForm from "./pages/AdminProductForm";

export default function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />;

      case "products":
        return <AdminProducts />;

      case "orders":
        return <AdminOrders />;

      case "reports":
        return <AdminReports />;
        
      case "addProduct":
        return <AdminProductForm />;

      default:
        return (
          <div className="rounded-3xl border border-slate-200 bg-white p-10">
            <h1 className="text-3xl font-bold">
              {activePage}
            </h1>

            <p className="mt-3 text-slate-500">
              This module is under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {renderPage()}
    </AdminLayout>
  );
}