import { useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import AdminButton     from "../components/ui/AdminButton";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { AdminRowSkeleton } from "../components/ui/AdminSkeleton";
import { AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import { getAdminOrders, updateOrderStatus, updatePaymentStatus } from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const ORDER_STATUSES  = ["All","PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];
const PAYMENT_STATUSES = ["All","UNPAID","PAID","FAILED","REFUNDED"];
const COLUMNS = "0.9fr 1.6fr 1fr 0.9fr 1fr 1fr auto";

function PriorityBadge({ ml }) {
  const map = { 30: "P1 · 30ml", 15: "P2 · 15ml", 6: "P3 · 6ml" };
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
      {map[ml] || `${ml}ml`}
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Track customer purchases sorted by priority — 30ml orders appear first."
        action={<AdminButton variant="primary">Export Orders</AdminButton>}
      />

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Orders"  value={orders.length}             helper="All customer orders"   icon="◎" />
        <AdminStatCard label="Pending"       value={pendingCount}              helper="Awaiting confirmation" icon="!" tone="bronze" />
        <AdminStatCard label="Delivered"     value={deliveredCount}            helper="Completed orders"      icon="✦" />
        <AdminStatCard label="Revenue"       value={formatCurrency(totalRevenue)} helper="From listed orders" icon="◈" />
      </section>

      <AdminCard>
        {/* Filters */}
        <div className="mb-5 space-y-3">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
            <AdminSearchBar value={search} onChange={setSearch} placeholder="Search by order ID, customer, phone…" />
            <AdminSelect value={status} onChange={e => setStatus(e.target.value)} options={ORDER_STATUSES} />
            <AdminSelect value={payment} onChange={e => setPayment(e.target.value)} options={PAYMENT_STATUSES} />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Date Range:</span>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20" />
            <span className="text-gray-400">→</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20" />
            {hasFilter && (
              <AdminButton size="sm" variant="ghost" onClick={clearFilters}>Clear filters</AdminButton>
            )}
            <span className="ml-auto text-xs text-gray-400">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Table */}
        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Priority</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
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
              <AdminEmptyState icon="◎" title="No orders found" description="Try adjusting your filters." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}

function OrderRow({ order, setActivePage, updating, onStatusUpdate }) {
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
    <AdminTableRow columns={COLUMNS}>
      {/* Order ID */}
      <div>
        <p className="font-mono text-sm font-medium text-gray-900">{orderNum}</p>
        <p className="mt-0.5 text-[11px] text-gray-400">Online order</p>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{order.customerName}</p>
          <p className="text-xs text-gray-400">{order.customerPhone || order.phone}</p>
        </div>
      </div>

      {/* Total */}
      <p className="text-sm font-semibold text-gray-900">
        {formatCurrency(order.grandTotal || order.total)}
      </p>

      {/* Priority / ML */}
      <PriorityBadge ml={order.orderedMl || order.priority} />

      {/* Status */}
      <AdminBadge value={order.orderStatus} />

      {/* Date */}
      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={() => setActivePage("orderDetails")}>
          View
        </AdminButton>
        {nextStatus && (
          <AdminButton
            size="sm"
            variant="primary"
            loading={updating === orderNum}
            onClick={() => onStatusUpdate(orderNum, nextStatus)}
          >
            {updating === orderNum ? "" : `→ ${nextStatus}`}
          </AdminButton>
        )}
      </div>
    </AdminTableRow>
  );
}
