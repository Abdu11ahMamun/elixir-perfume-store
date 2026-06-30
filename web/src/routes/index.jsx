import { createBrowserRouter } from "react-router-dom";

// ─── Storefront Layout + Pages ────────────────────────────
import App           from "../App";
import Home          from "../pages/Home";
import Products      from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import BestSellers   from "../pages/BestSellers";
import Offers        from "../pages/Offers";
import About         from "../pages/About";

// ─── Admin Layout + Pages ─────────────────────────────────
import AdminApp             from "../admin/AdminApp";
import AdminDashboard       from "../admin/pages/AdminDashboard";
import AdminProducts        from "../admin/pages/AdminProducts";
import AdminProductForm     from "../admin/pages/AdminProductForm";
import AdminOrders          from "../admin/pages/AdminOrders";
import AdminOrderDetails    from "../admin/pages/AdminOrderDetails";
import AdminCustomers       from "../admin/pages/AdminCustomers";
import AdminCustomerProfile from "../admin/pages/AdminCustomerProfile";
import AdminMarketing       from "../admin/pages/AdminMarketing";
import AdminReports         from "../admin/pages/AdminReports";

// ─── Router ───────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── Storefront ──────────────────────────────────────────
  {
    path: "/",
    element: <App />,
    children: [
      { index: true,                element: <Home /> },
      { path: "perfumes",           element: <Products /> },
      { path: "perfumes/:id",       element: <ProductDetails /> },
      { path: "best-sellers",       element: <BestSellers /> },
      { path: "offers",             element: <Offers /> },
      { path: "about",              element: <About /> },
    ],
  },

  // ── Admin ────────────────────────────────────────────────
  {
    path: "/admin",
    element: <AdminApp />,
    children: [
      { index: true,                          element: <AdminDashboard /> },
      { path: "products",                     element: <AdminProducts /> },
      { path: "products/new",                 element: <AdminProductForm /> },
      { path: "products/:id/edit",            element: <AdminProductForm /> },
      { path: "orders",                       element: <AdminOrders /> },
      { path: "orders/:orderId",              element: <AdminOrderDetails /> },
      { path: "customers",                    element: <AdminCustomers /> },
      { path: "customers/:customerId",        element: <AdminCustomerProfile /> },
      { path: "marketing",                    element: <AdminMarketing /> },
      { path: "reports",                      element: <AdminReports /> },
    ],
  },
]);