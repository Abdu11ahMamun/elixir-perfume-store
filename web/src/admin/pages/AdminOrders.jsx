import { useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import { getAdminOrders, updateOrderStatus, updatePaymentStatus } from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const ORDER_STATUSES  = ["All","PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];
const PAYMENT_STATUSES = ["All","UNPAID","PAID","FAILED","REFUNDED"];

function PriorityBadge({ ml }) {
  const map = { 30: { label: "P1 · 30ml", color: "#c9a96e" }, 15: { label: "P2 · 15ml", color: "#8a8075" }, 6: { label: "P3 · 6ml", color: "#0e0c0a" } };
  const cfg = map[ml] || { label: `${ml}ml`, color: "#8a8075" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"2px 10px", background:"rgba(14,12,10,0.07)", fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color: cfg.color, fontWeight:500 }}>
      {cfg.label}
    </span>
  );
}

export default function AdminOrders({ setActivePage }) {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [payment,  setPayment]  = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    getAdminOrders({
      page: 0, size: 50, sort: "createdAt,desc",
      orderStatus:   status  !== "All" ? status  : undefined,
      paymentStatus: payment !== "All" ? payment : undefined,
      customerPhone: search.startsWith("+880") ? search : undefined,
      dateFrom: dateFrom || undefined,
      dateTo:   dateTo   || undefined,
    })
      .then((data) => setOrders(data?.content || data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [status, payment, dateFrom, dateTo]);

  // Client-side search for name / orderNumber
  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) =>
      (o.orderNumber || o.id || "").toLowerCase().includes(q) ||
      (o.customerName   || "").toLowerCase().includes(q) ||
      (o.customerPhone  || o.phone || "").toLowerCase().includes(q)
    );
  }, [orders, search]);

  const pendingCount   = orders.filter(o => o.orderStatus === "PENDING").length;
  const deliveredCount = orders.filter(o => o.orderStatus === "DELIVERED").length;
  const totalRevenue   = orders.reduce((s, o) => s + (o.grandTotal || o.total || 0), 0);

  const hasFilter = search || status !== "All" || payment !== "All" || dateFrom || dateTo;
  const clearFilters = () => { setSearch(""); setStatus("All"); setPayment("All"); setDateFrom(""); setDateTo(""); };

  const handleStatusUpdate = async (orderNumber, newStatus) => {
    setUpdating(orderNumber);
    try {
      await updateOrderStatus(orderNumber, newStatus);
      setOrders(prev => prev.map(o =>
        (o.orderNumber || o.id) === orderNumber ? { ...o, orderStatus: newStatus } : o
      ));
    } catch (e) { alert("Failed to update status"); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Atelier"
        title="Orders"
        description="Track customer purchases sorted by priority — 30ml orders appear first."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5">
            Export Orders
          </button>
        }
      />

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Orders"  value={orders.length}             helper="All customer orders"   icon="◎" />
        <AdminStatCard label="Pending"       value={pendingCount}              helper="Awaiting confirmation" icon="!" tone="bronze" />
        <AdminStatCard label="Delivered"     value={deliveredCount}            helper="Completed orders"      icon="✦" />
        <AdminStatCard label="Revenue"       value={formatCurrency(totalRevenue)} helper="From listed orders" icon="◈" />
      </section>

      <AdminCard>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto]">
            <AdminSearchBar value={search} onChange={setSearch} placeholder="Search by order ID, customer, phone…" />
            <select value={status} onChange={e => { setStatus(e.target.value); }}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={payment} onChange={e => setPayment(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
              {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--mist)]">Date Range:</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--gold)]" />
            <span className="text-[var(--mist)]">→</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="rounded-full border border-[var(--gold)]/20 bg-white px-4 py-2 text-sm outline-none focus:border-[var(--gold)]" />
            {hasFilter && (
              <button onClick={clearFilters}
                className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
                Clear filters
              </button>
            )}
            <span className="ml-auto text-xs text-[var(--mist)]">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="animate-pulse h-20 px-6 py-4">
                  <div className="h-4 bg-[var(--warm)] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[var(--warm)] rounded w-1/2" />
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map(order => (
                <OrderRow
                  key={order.orderNumber || order.id}
                  order={order}
                  setActivePage={setActivePage}
                  updating={updating}
                  onStatusUpdate={handleStatusUpdate}
                />
              ))
            ) : (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No orders found</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function OrderRow({ order, setActivePage, updating, onStatusUpdate }) {
  const [showUpdate, setShowUpdate] = useState(false);
  const orderNum = order.orderNumber || order.id;
  const initials = (order.customerName || "?").split(" ").map(p => p[0]).slice(0, 2).join("");

  const NEXT_STATUS = {
    PENDING:    "CONFIRMED",
    CONFIRMED:  "PROCESSING",
    PROCESSING: "SHIPPED",
    SHIPPED:    "DELIVERED",
  };
  const nextStatus = NEXT_STATUS[order.orderStatus];

  return (
    <div className="grid gap-4 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_1fr_auto] xl:items-center">
      {/* Order ID */}
      <div>
        <p className="font-mono font-semibold text-sm tracking-wider text-[var(--ink)]">{orderNum}</p>
        <p className="mt-0.5 text-[10px] text-[var(--mist)]">Online order</p>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-base text-[var(--gold-dark)]">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-sm text-[var(--ink)]">{order.customerName}</p>
          <p className="mt-0.5 text-xs text-[var(--mist)]">{order.customerPhone || order.phone}</p>
        </div>
      </div>

      {/* Total */}
      <p className="font-semibold text-[var(--gold-dark)]">
        {formatCurrency(order.grandTotal || order.total)}
      </p>

      {/* Priority / ML */}
      <PriorityBadge ml={order.orderedMl || order.priority} />

      {/* Status */}
      <AdminBadge value={order.orderStatus} />

      {/* Date */}
      <p className="text-sm text-[var(--mist)]">{formatDate(order.createdAt)}</p>

      {/* Actions */}
      <div className="flex justify-end gap-2 flex-wrap">
        <button
          onClick={() => setActivePage("orderDetails")}
          className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
          View
        </button>
        {nextStatus && (
          <button
            disabled={updating === orderNum}
            onClick={() => onStatusUpdate(orderNum, nextStatus)}
            className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5 disabled:opacity-50">
            {updating === orderNum ? "…" : `→ ${nextStatus}`}
          </button>
        )}
      </div>
    </div>
  );
}