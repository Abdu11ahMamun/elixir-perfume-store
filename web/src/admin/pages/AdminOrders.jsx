import { useMemo, useState } from "react";

import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import { adminOrders } from "../data/mockAdminData";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const ORDER_STATUSES = ["All", "PENDING", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"];
const ML_SIZES       = ["All", "30ml", "15ml", "6ml"];

// ─── ML priority label ────────────────────────────────────
function PriorityBadge({ ml }) {
  const map = { 30: { label: "P1 · 30ml", color: "#c9a96e" }, 15: { label: "P2 · 15ml", color: "#8a8075" }, 6: { label: "P3 · 6ml", color: "#0e0c0a" } };
  const cfg = map[ml] || { label: `${ml}ml`, color: "#8a8075" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", background: "rgba(14,12,10,0.07)", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: cfg.color, fontWeight: 500 }}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrders({ setActivePage }) {
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("All");
  const [mlFilter, setMlFilter] = useState("All");

  // ── Date range filter ──────────────────────────────────
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  const filteredOrders = useMemo(() => {
    return adminOrders
      .filter((order) => {
        const q = search.toLowerCase();

        const matchSearch =
          order.id.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.phone.toLowerCase().includes(q) ||
          order.productName.toLowerCase().includes(q) ||
          order.paymentMethod.toLowerCase().includes(q);

        const matchStatus = status === "All" || order.orderStatus === status;

        const matchMl = mlFilter === "All" || `${order.orderedMl}ml` === mlFilter;

        // Date range — compare createdAt string (YYYY-MM-DD)
        const matchFrom = !dateFrom || order.createdAt >= dateFrom;
        const matchTo   = !dateTo   || order.createdAt <= dateTo;

        return matchSearch && matchStatus && matchMl && matchFrom && matchTo;
      })
      // Always show higher priority (larger ml) first
      .sort((a, b) => a.priority - b.priority);
  }, [search, status, mlFilter, dateFrom, dateTo]);

  const pendingCount   = adminOrders.filter((o) => o.orderStatus === "PENDING").length;
  const deliveredCount = adminOrders.filter((o) => o.orderStatus === "DELIVERED").length;
  const totalRevenue   = adminOrders.reduce((s, o) => s + o.total, 0);

  const clearFilters = () => {
    setSearch(""); setStatus("All"); setMlFilter("All");
    setDateFrom(""); setDateTo("");
  };

  const hasActiveFilter = search || status !== "All" || mlFilter !== "All" || dateFrom || dateTo;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Atelier"
        title="Orders"
        description="Track customer purchases sorted by size priority — 30ml orders appear first."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Export Orders
          </button>
        }
      />

      {/* ── Stats ── */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Orders"  value={adminOrders.length}          helper="All customer orders"      icon="◎" />
        <AdminStatCard label="Pending"       value={pendingCount}                helper="Awaiting confirmation"    icon="!" tone="bronze" />
        <AdminStatCard label="Delivered"     value={deliveredCount}              helper="Completed orders"         icon="✦" />
        <AdminStatCard label="Revenue"       value={formatCurrency(totalRevenue)} helper="From listed orders"      icon="◈" />
      </section>

      <AdminCard>
        {/* ── Filter toolbar ── */}
        <div className="mb-6 space-y-4">
          {/* Row 1: search + status + ml */}
          <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto]">
            <AdminSearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by order ID, customer, product, phone..."
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
            >
              {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>

            <select
              value={mlFilter}
              onChange={(e) => setMlFilter(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
            >
              {ML_SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Row 2: date range */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--mist)]">Date Range:</span>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--gold)]"
            />

            <span className="text-[var(--mist)]">→</span>

            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--gold)]"
            />

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
              >
                Clear filters
              </button>
            )}

            <span className="ml-auto text-xs text-[var(--mist)]">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1fr_1.4fr_1.2fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Product</span>
            <span>Size / Priority</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} setActivePage={setActivePage} />
            ))}

            {filteredOrders.length === 0 && (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No orders found</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Try adjusting your filters or date range.</p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function OrderRow({ order, setActivePage }) {
  const initials = order.customerName.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="grid gap-4 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1fr_1.4fr_1.2fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
      {/* Order ID */}
      <div>
        <p className="font-mono font-semibold text-[var(--ink)] text-sm tracking-wider">{order.id}</p>
        <p className="mt-0.5 text-[10px] text-[var(--mist)]">Online order</p>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-base text-[var(--gold-dark)]">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-[var(--ink)] text-sm">{order.customerName}</p>
          <p className="mt-0.5 text-xs text-[var(--mist)]">{order.phone}</p>
        </div>
      </div>

      {/* Product */}
      <div>
        <p className="text-sm text-[var(--ink)]">{order.productName}</p>
        <p className="mt-0.5 text-xs text-[var(--mist)]">{order.productId}</p>
      </div>

      {/* Size + priority */}
      <PriorityBadge ml={order.orderedMl} />

      {/* Total */}
      <p className="font-semibold text-[var(--gold-dark)]">{formatCurrency(order.total)}</p>

      {/* Status */}
      <AdminBadge value={order.orderStatus} />

      {/* Date */}
      <p className="text-sm text-[var(--mist)]">{formatDate(order.createdAt)}</p>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setActivePage("orderDetails")}
          className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
        >
          View
        </button>
        <button className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5">
          Update
        </button>
      </div>
    </div>
  );
}