import { useEffect, useState } from "react";
import AdminCard  from "../components/ui/AdminCard";
import AdminBadge from "../components/ui/AdminBadge";
import {
  getDashboardSummary,
  getAdminOrders,
  getAdminProducts,
} from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";
import { salesChartData, adminStats as fallbackStats } from "../data/mockAdminData";

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
    { id: "products", label: "Total Products", value: summary.totalProducts,  description: "All catalog items",     change: "", trend: "up" },
    { id: "orders",   label: "Total Orders",   value: summary.totalOrders,    description: "All time orders",       change: "", trend: "up" },
    { id: "pending",  label: "Pending Orders", value: summary.pendingOrders,  description: "Awaiting confirmation", change: "", trend: "warning" },
    { id: "revenue",  label: "Total Revenue",  value: formatCurrency(summary.totalRevenue), description: "Lifetime revenue", change: "", trend: "up" },
  ] : fallbackStats;

  return (
    <div className="space-y-8">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--gold)]/20 bg-[#0b0805] p-8 text-[var(--parchment)] shadow-[0_32px_100px_rgba(14,12,10,0.22)] lg:p-10">
        <div className="absolute right-[-140px] top-[-180px] h-[420px] w-[420px] rounded-full blur-[120px] opacity-30"
          style={{ background: "var(--gold)" }} />

        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">ÉLIXIR Atelier</p>
            <h1 className="font-display text-6xl font-light leading-none md:text-7xl">
              {loading ? "Loading..." : "Store Overview"}
            </h1>
            <div className="mt-8 flex flex-wrap items-end gap-5">
              <p className="font-display text-7xl font-light text-[var(--gold)]">
                {loading ? "—" : summary ? formatCurrency(summary.totalRevenue) : "৳0"}
              </p>
              <span className="mb-3 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-2 text-sm text-[var(--gold)]">
                Total Revenue
              </span>
            </div>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--gold)] via-[var(--gold)]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <HeroMiniMetric label="Total Orders"    value={loading ? "—" : summary?.totalOrders    ?? "—"} />
            <HeroMiniMetric label="Pending Orders"  value={loading ? "—" : summary?.pendingOrders  ?? "—"} />
            <HeroMiniMetric label="Total Products"  value={loading ? "—" : summary?.totalProducts  ?? "—"} />
            <HeroMiniMetric label="Total Customers" value={loading ? "—" : summary?.totalCustomers ?? "—"} />
          </div>
        </div>
      </section>

      {/* ── Stat cards ── */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <AdminCard key={stat.id}>
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--mist)]">{stat.label}</p>
                  <h3 className="mt-3 font-display text-5xl font-light text-[var(--gold-dark)]">
                    {loading ? "—" : stat.value}
                  </h3>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--warm)] text-[var(--gold-dark)]">✦</span>
              </div>
              <Sparkline variant={i} />
              <p className="text-xs text-[var(--mist)]">{stat.description}</p>
            </div>
          </AdminCard>
        ))}
      </section>

      {/* ── Chart + metrics ── */}
      <section className="grid gap-6 xl:grid-cols-3">
        <AdminCard className="xl:col-span-2">
          <div className="mb-8">
            <p className="eyebrow mb-3">Revenue Intelligence</p>
            <h2 className="font-display text-5xl leading-none text-[var(--ink)]">Revenue Overview</h2>
            <p className="mt-3 text-sm text-[var(--mist)]">Monthly sales performance (sample data).</p>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>
          <div className="h-[350px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => {
                const height = Math.max(42, (item.revenue / maxRevenue) * 300);
                return (
                  <div key={item.month} className="group flex flex-1 flex-col items-center justify-end">
                    <div className="mb-3 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-[#0b0805] px-3 py-1 text-xs text-[var(--gold)]">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                    <div className="w-full rounded-t-2xl bg-gradient-to-t from-[#8f6a32] via-[#c9a96e] to-[#f1ddad] shadow-[0_10px_30px_rgba(201,169,110,0.35)] transition duration-300 group-hover:scale-y-105"
                      style={{ height }} />
                    <span className="mt-3 text-xs text-[var(--mist)]">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-8">
            <p className="eyebrow mb-3">Atelier Metrics</p>
            <h2 className="font-display text-5xl leading-none text-[var(--ink)]">Top Metrics</h2>
            <div className="mt-5 h-px w-20 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>
          <div className="space-y-5">
            <MetricRow label="Total Products"  value={loading ? "—" : summary?.totalProducts  ?? "—"} />
            <MetricRow label="Active Products" value={loading ? "—" : summary?.activeProducts ?? "—"} />
            <MetricRow label="Total Orders"    value={loading ? "—" : summary?.totalOrders    ?? "—"} />
            <MetricRow label="Pending Orders"  value={loading ? "—" : summary?.pendingOrders  ?? "—"} />
            <MetricRow label="Total Customers" value={loading ? "—" : summary?.totalCustomers ?? "—"} />
          </div>
        </AdminCard>
      </section>

      {/* ── Tables ── */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Recent orders */}
        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Order Atelier</p>
            <h2 className="font-display text-4xl font-light">Recent Orders</h2>
            <p className="mt-2 text-sm text-[var(--mist)]">Latest customer purchases.</p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse h-16 rounded-2xl bg-[var(--warm)]" />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.orderNumber || order.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4 transition hover:border-[var(--gold)]/30 hover:shadow-lg">
                  <div>
                    <p className="font-mono font-semibold text-[var(--ink)]">
                      {order.orderNumber || order.id}
                    </p>
                    <p className="text-sm text-[var(--mist)]">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--gold-dark)]">
                      {formatCurrency(order.grandTotal || order.total)}
                    </p>
                    <div className="mt-2">
                      <AdminBadge value={order.orderStatus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--mist)] py-8 text-center">No orders yet.</p>
          )}
        </AdminCard>

        {/* Low stock */}
        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Inventory Watch</p>
            <h2 className="font-display text-4xl font-light">Low Stock Products</h2>
            <p className="mt-2 text-sm text-[var(--mist)]">Fragrances requiring immediate restock.</p>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse h-20 rounded-2xl bg-[var(--warm)]" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => {
                // Find lowest stock size
                const minStock = product.sizes
                  ? Math.min(...product.sizes.map(s => s.stock))
                  : product.stock;
                return (
                  <div key={product.id}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4 transition hover:border-[var(--gold)]/30 hover:shadow-lg">
                    <img src={product.image || product.primaryImage}
                      alt={product.name}
                      className="h-16 w-16 rounded-2xl object-cover shadow-md" />
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--ink)]">{product.name}</p>
                      <p className="text-sm text-[var(--mist)]">{product.categoryName || product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl text-[var(--gold-dark)]">{minStock}</p>
                      <p className="text-xs text-[var(--mist)]">remaining</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--mist)] py-8 text-center">All stock levels are good.</p>
          )}
        </AdminCard>
      </section>
    </div>
  );
}

function HeroMiniMetric({ label, value }) {
  return (
    <div className="rounded-3xl border border-[var(--gold)]/15 bg-white/5 p-5 backdrop-blur">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">{label}</p>
      <p className="mt-3 font-display text-4xl font-light text-[var(--parchment)]">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--gold)]/10 pb-4 last:border-b-0">
      <span className="text-sm text-[var(--mist)]">{label}</span>
      <span className="font-semibold text-[var(--gold-dark)]">{value}</span>
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
      <path d={paths[variant % paths.length]} fill="none" stroke="rgba(201,169,110,0.85)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`${paths[variant % paths.length]} L96 32 L2 32 Z`} fill="rgba(201,169,110,0.08)" />
    </svg>
  );
}