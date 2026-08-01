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
import AdminOrderEdit       from "./pages/AdminOrderEdit";
import AdminCustomers       from "./pages/AdminCustomers";
import AdminCustomerProfile from "./pages/AdminCustomerProfile";
import AdminCustomerEdit    from "./pages/AdminCustomerEdit";
import AdminCustomerTypes   from "./pages/AdminCustomerTypes";
import AdminUsers           from "./pages/AdminUsers";
import AdminReports         from "./pages/AdminReports";
import AdminMarketing       from "./pages/AdminMarketing";
import AdminDeliveryAreas   from "./pages/AdminDeliveryAreas";

import { isAdminLoggedIn, getAdminUser, adminLogout } from "../services/authService";

export default function AdminApp({ onExit }) {
  const [activePage, setActivePage]         = useState("dashboard");
  const [admin, setAdmin]                   = useState(null);
  const [checking, setChecking]             = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [viewingOrderNumber, setViewingOrderNumber] = useState(null);
  const [editingOrderNumber, setEditingOrderNumber] = useState(null);
  const [viewingCustomerId, setViewingCustomerId] = useState(null);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Generic navigation (sidebar, "+ Add Product", etc.) — always clears any
  // pending edit/view target so a fresh nav click never silently reopens a
  // stale product edit or order/customer view/edit.
  const navigate = (page) => {
    setEditingProductId(null);
    setViewingOrderNumber(null);
    setEditingOrderNumber(null);
    setViewingCustomerId(null);
    setEditingCustomerId(null);
    setActivePage(page);
  };

  // Opens the product form pre-loaded for a specific product.
  const editProduct = (id) => {
    setEditingProductId(id);
    setActivePage("addProduct");
  };

  // Opens the read-only order view for a specific order.
  const viewOrder = (orderNumber) => {
    setViewingOrderNumber(orderNumber);
    setActivePage("orderDetails");
  };

  // Opens the dedicated order edit form for a specific order.
  const editOrder = (orderNumber) => {
    setEditingOrderNumber(orderNumber);
    setActivePage("editOrder");
  };

  // Opens the read-only customer profile for a specific customer.
  const viewCustomer = (id) => {
    setViewingCustomerId(id);
    setActivePage("customerProfile");
  };

  // Opens the dedicated customer edit form for a specific customer.
  const editCustomer = (id) => {
    setEditingCustomerId(id);
    setActivePage("editCustomer");
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
        return <AdminOrders onView={viewOrder} onEdit={editOrder} />;
      case "orderDetails":
        return (
          <AdminOrderDetails
            orderNumber={viewingOrderNumber}
            onEdit={editOrder}
            onBack={() => navigate("orders")}
          />
        );
      case "editOrder":
        return (
          <AdminOrderEdit
            orderNumber={editingOrderNumber}
            onSaved={() => viewOrder(editingOrderNumber)}
            onCancel={() => navigate("orders")}
          />
        );
      case "deliveryAreas":
        return <AdminDeliveryAreas />;
      case "customers":
        return <AdminCustomers onView={viewCustomer} onEdit={editCustomer} />;
      case "customerProfile":
        return (
          <AdminCustomerProfile
            customerId={viewingCustomerId}
            onEdit={editCustomer}
            onBack={() => navigate("customers")}
          />
        );
      case "editCustomer":
        return (
          <AdminCustomerEdit
            customerId={editingCustomerId}
            onSaved={() => viewCustomer(editingCustomerId)}
            onCancel={() => navigate("customers")}
          />
        );
      case "customerTypes":
        return <AdminCustomerTypes />;
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
        onExit={onExit}
      >
        {renderPage()}
      </AdminLayout>
    </>
  );
}