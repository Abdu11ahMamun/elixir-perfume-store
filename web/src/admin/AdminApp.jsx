import { useEffect, useState } from "react";

import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin  from "./pages/AdminLogin";
import Cursor      from "../components/ui/Cursor";

import AdminDashboard       from "./pages/AdminDashboard";
import AdminProducts        from "./pages/AdminProducts";
import AdminProductForm     from "./pages/AdminProductForm";
import AdminOrders          from "./pages/AdminOrders";
import AdminOrderDetails    from "./pages/AdminOrderDetails";
import AdminCustomers       from "./pages/AdminCustomers";
import AdminCustomerProfile from "./pages/AdminCustomerProfile";
import AdminReports         from "./pages/AdminReports";
import AdminMarketing       from "./pages/AdminMarketing";

import { isAdminLoggedIn, getAdminUser, adminLogout } from "../services/authService";

export default function AdminApp() {
  const [activePage, setActivePage] = useState("dashboard");
  const [admin, setAdmin]           = useState(null);
  const [checking, setChecking]     = useState(true);

  // ── Check auth on mount ──
  useEffect(() => {
    if (isAdminLoggedIn()) {
      setAdmin(getAdminUser());
    }
    setChecking(false);
  }, []);

  // ── Listen for global logout event (token expired) ──
  useEffect(() => {
    const handleLogout = () => setAdmin(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  // ── Handlers ──
  const handleLoginSuccess = (user) => setAdmin(user);

  const handleLogout = () => {
    adminLogout();
    setAdmin(null);
  };

  // ── Loading check ──
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--ink)" }}>
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(201,169,110,0.3)", borderTopColor: "var(--gold)" }}
        />
      </div>
    );
  }

  // ── Not logged in → show login page ──
  if (!admin) {
    return (
      <>
        <Cursor />
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  // ── Logged in → show admin panel ──
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />;
      case "products":
        return <AdminProducts setActivePage={setActivePage} />;
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
      case "marketing":
        return <AdminMarketing />;
      default:
        return (
          <div className="rounded-3xl border border-[var(--gold)]/20 bg-white p-10">
            <h1 className="font-display text-5xl font-light">{activePage}</h1>
            <p className="mt-3 text-[var(--mist)]">This module is under construction.</p>
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
        admin={admin}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>
    </>
  );
}