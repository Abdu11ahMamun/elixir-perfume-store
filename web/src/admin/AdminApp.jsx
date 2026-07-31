import { useEffect, useState } from "react";

import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin  from "./pages/AdminLogin";
import Cursor      from "../components/ui/Cursor";

import AdminDashboard       from "./pages/AdminDashboard";
import AdminCategories      from "./pages/AdminCategories";
import AdminProducts        from "./pages/AdminProducts";
import AdminProductForm     from "./pages/AdminProductForm";
import AdminOrders          from "./pages/AdminOrders";
import AdminOrderDetails    from "./pages/AdminOrderDetails";
import AdminCustomers       from "./pages/AdminCustomers";
import AdminCustomerProfile from "./pages/AdminCustomerProfile";
import AdminUsers           from "./pages/AdminUsers";
import AdminReports         from "./pages/AdminReports";
import AdminMarketing       from "./pages/AdminMarketing";

import { isAdminLoggedIn, getAdminUser, adminLogout } from "../services/authService";

export default function AdminApp() {
  const [activePage, setActivePage]         = useState("dashboard");
  const [admin, setAdmin]                   = useState(null);
  const [checking, setChecking]             = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);

  // Generic navigation (sidebar, "+ Add Product", etc.) — always clears any
  // pending edit target so "Add Product" never silently reopens in edit mode.
  const navigate = (page) => {
    setEditingProductId(null);
    setActivePage(page);
  };

  // Opens the product form pre-loaded for a specific product.
  const editProduct = (id) => {
    setEditingProductId(id);
    setActivePage("addProduct");
  };

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
      <div className="admin-area flex min-h-screen items-center justify-center bg-gray-50">
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
      case "categories":
        return <AdminCategories />;
      case "products":
        return <AdminProducts setActivePage={navigate} onEdit={editProduct} />;
      case "addProduct":
        return (
          <AdminProductForm
            productId={editingProductId}
            onSaved={() => navigate("products")}
            onCancel={() => navigate("products")}
          />
        );
      case "orders":
        return <AdminOrders setActivePage={setActivePage} />;
      case "orderDetails":
        return <AdminOrderDetails />;
      case "customers":
        return <AdminCustomers setActivePage={setActivePage} />;
      case "customerProfile":
        return <AdminCustomerProfile />;
      case "users":
        return <AdminUsers />;
      case "reports":
        return <AdminReports />;
      case "marketing":
        return <AdminMarketing />;
      default:
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-10">
            <h1 className="text-2xl font-semibold capitalize text-gray-900">{activePage}</h1>
            <p className="mt-2 text-sm text-gray-500">This module is under construction.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Cursor />
      <AdminLayout
        activePage={activePage}
        setActivePage={navigate}
        admin={admin}
        onLogout={handleLogout}
      >
        {renderPage()}
      </AdminLayout>
    </>
  );
}