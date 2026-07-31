import { useEffect, useState } from "react";
import AdminCard  from "../components/ui/AdminCard";
import AdminBadge from "../components/ui/AdminBadge";
import AdminStatCard from "../components/ui/AdminStatCard";
import { AdminRowSkeleton } from "../components/ui/AdminSkeleton";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import {
  getDashboardSummary,
  getAdminOrders,
  getAdminProducts,
} from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";
import { formatCurrency, formatDate } from "../utils/adminFormat";
import { salesChartData, adminStats as fallbackStats } from "../data/mockAdminData";

// Same resolution as AdminProducts.jsx — backend returns relative paths on sizes[].imageUrls
const primaryImg = (p) => {
  const first = (p.sizes || [])[0];
  const url   = first?.imageUrls?.[0] || first?.images?.[0] || p.image || p.primaryImage || "";
  return buildImageUrl(url);
};

/* ─── Hooks ─── */
function useDashboard() {
  const [summary,  setSummary]  = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      getDashboardSummary(),
      getAdminOrders({ page: 0, size: 5, sort: "createdAt,desc" }),
      getAdminProducts({ page: 0, size: 20 }),
    ]).then(([sumRes, ordRes, proRes]) => {
      if (cancelled) return;

      if (sumRes.status === "fulfilled") setSummary(sumRes.value);
      if (ordRes.status === "fulfilled") {
        const content = ordRes.value?.content || ordRes.value || [];
        setOrders(content.slice(0, 5));
      }
      if (proRes.status === "fulfilled") {
        const content = proRes.value?.content || proRes.value || [];
        // Low stock = any size with stock < 10
        const low = content.filter((p) =>
          p.sizes?.some((s) => s.stock > 0 && s.stock < 10) ||
          (p.stock !== undefined && p.stock > 0 && p.stock < 20)
        );
        setProducts(low.slice(0, 5));
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { summary, orders, products, loading };
}

/* ─── Main component ─── */
export default function AdminDashboard() {
  const { summary, orders, products, loading } = useDashboard();
  const maxRevenue = Math.max(...salesChartData.map((d) => d.revenue));

  // Build stat cards from API or fallback
  const stats = summary ? [
    { id: "products", label: "Total Products", value: summary.totalProducts,  helper: "All catalog items",     icon: "◈" },
    { id: "orders",   label: "Total Orders",   value: summary.totalOrders,    helper: "All time orders",       icon: "◎" },
    { id: "pending",  label: "Pending Orders", value: summary.pendingOrders,  helper: "Awaiting confirmation", icon: "!", tone: "bronze" },
    { id: "revenue",  label: "Total Revenue",  value: formatCurrency(summary.totalRevenue), helper: "Lifetime revenue", icon: "✦" },
  ] : fallbackStats.map((s) => ({ id: s.id, label: s.label, value: s.value, helper: s.description, icon: "✦" }));

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-xl border border-gray-200 bg-[var(--ink)] p-7 text-white lg:p-9">
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--gold)]">Store Overview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {loading ? "Loading..." : "Welcome back"}
            </h1>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <p className="text-4xl font-semibold text-[var(--gold)] md:text-5xl">
                {loading ? "—" : summary ? formatCurrency(summary.totalRevenue) : "৳0"}
              </p>
              <span className="mb-1.5 rounded-md bg-white/10 px-3 py-1 text-xs text-white/80">
                Total Revenue
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroMiniMetric label="Total Orders"    value={loading ? "—" : summary?.totalOrders    ?? "—"} />
            <HeroMiniMetric label="Pending Orders"  value={loading ? "—" : summary?.pendingOrders  ?? "—"} />
            <HeroMiniMetric label="Total Products"  value={loading ? "—" : summary?.totalProducts  ?? "—"} />
            <HeroMiniMetric label="Total Customers" value={loading ? "—" : summary?.totalCustomers ?? "—"} />
          </div>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <AdminCard key={stat.id} padding={false}>
            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                    {loading ? "—" : stat.value}
                  </h3>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9a96e]/12 text-[var(--gold-dark)]">✦</span>
              </div>
              <Sparkline variant={i} />
              <p className="text-xs text-gray-400">{stat.helper}</p>
            </div>
          </AdminCard>
        ))}
      </section>

      {/* ── Chart + metrics ── */}
      <section className="grid gap-5 xl:grid-cols-3">
        <AdminCard
          className="xl:col-span-2"
          title="Revenue Overview"
          description="Monthly sales performance (sample data)."
        >
          <div className="h-[300px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => {
                const height = Math.max(36, (item.revenue / maxRevenue) * 260);
                return (
                  <div key={item.month} className="group flex flex-1 flex-col items-center justify-end">
                    <div className="mb-2 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-md bg-gray-900 px-2 py-1 text-[11px] text-white">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                    <div className="w-full rounded-t-md bg-[#c9a96e]/70 transition duration-200 group-hover:bg-[var(--gold)]"
                      style={{ height }} />
                    <span className="mt-2.5 text-xs text-gray-400">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Top Metrics">
          <div className="space-y-4">
            <MetricRow label="Total Products"  value={loading ? "—" : summary?.totalProducts  ?? "—"} />
            <MetricRow label="Active Products" value={loading ? "—" : summary?.activeProducts ?? "—"} />
            <MetricRow label="Total Orders"    value={loading ? "—" : summary?.totalOrders    ?? "—"} />
            <MetricRow label="Pending Orders"  value={loading ? "—" : summary?.pendingOrders  ?? "—"} />
            <MetricRow label="Total Customers" value={loading ? "—" : summary?.totalCustomers ?? "—"} />
          </div>
        </AdminCard>
      </section>

      {/* ── Tables ── */}
      <section className="grid gap-5 xl:grid-cols-2">
        {/* Recent orders */}
        <AdminCard title="Recent Orders" description="Latest customer purchases.">
          {loading ? (
            <div className="-mx-6 -mb-6"><AdminRowSkeleton count={3} /></div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.orderNumber || order.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3.5 transition hover:border-gray-200">
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900">
                      {order.orderNumber || order.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.grandTotal || order.total)}
                    </p>
                    <div className="mt-1.5">
                      <AdminBadge value={order.orderStatus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AdminEmptyState icon="◎" title="No orders yet" />
          )}
        </AdminCard>

        {/* Low stock */}
        <AdminCard title="Low Stock Products" description="Fragrances requiring immediate restock.">
          {loading ? (
            <div className="-mx-6 -mb-6"><AdminRowSkeleton count={3} /></div>
          ) : products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => {
                // Find lowest stock size
                const minStock = product.sizes
                  ? Math.min(...product.sizes.map(s => s.stock))
                  : product.stock;
                return (
                  <div key={product.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5 transition hover:border-gray-200">
                    <img src={primaryImg(product)}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover bg-gray-100"
                      onError={(e) => { e.target.src = ""; e.target.style.background = "#f3f4f6"; }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.categoryName || product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-amber-600">{minStock}</p>
                      <p className="text-[11px] text-gray-400">remaining</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <AdminEmptyState icon="✦" title="All stock levels are good" />
          )}
        </AdminCard>
      </section>
    </div>
  );
}

function HeroMiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 last:border-b-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function Sparkline({ variant = 0 }) {
  const paths = [
    "M2 26 L16 18 L29 22 L42 10 L55 16 L68 7 L82 14 L96 4",
    "M2 20 L16 22 L30 14 L44 16 L58 8 L72 12 L96 6",
    "M2 12 L18 16 L34 10 L50 18 L66 14 L82 24 L96 20",
    "M2 24 L18 14 L34 18 L50 10 L66 16 L82 8 L96 12",
  ];
  return (
    <svg viewBox="0 0 100 32" className="h-10 w-full overflow-visible" preserveAspectRatio="none">
      <path d={paths[variant % paths.length]} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${paths[variant % paths.length]} L96 32 L2 32 Z`} fill="rgba(201,169,110,0.08)" />
    </svg>
  );
}
