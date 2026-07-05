import { useEffect, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import {
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";
import { formatCurrency, formatDate } from "../utils/adminFormat";

// Status flow for timeline
const STATUS_FLOW = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"];
const ORDER_STATUSES   = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];
const PAYMENT_STATUSES = ["UNPAID","PAID","FAILED","REFUNDED"];

export default function AdminOrderDetails({ orderNumber: propOrderNumber }) {
  const [order,    setOrder]   = useState(null);
  const [loading,  setLoading] = useState(true);
  const [updating, setUpdating]= useState(false);
  const [error,    setError]   = useState(null);

  // If no orderNumber prop, load the most recent order as demo
  useEffect(() => {
    setLoading(true);
    if (propOrderNumber) {
      // fetch specific order
      // GET /api/v1/admin/orders/{orderNumber}
      import("../../services/adminService")
        .then(({ getAdminOrderByNumber }) => getAdminOrderByNumber(propOrderNumber))
        .then(setOrder)
        .catch(() => setError("Order not found"))
        .finally(() => setLoading(false));
    } else {
      // fallback: load first order from list
      getAdminOrders({ page: 0, size: 1, sort: "createdAt,desc" })
        .then((data) => {
          const first = data?.content?.[0] || data?.[0] || null;
          setOrder(first);
        })
        .catch(() => setError("No orders found"))
        .finally(() => setLoading(false));
    }
  }, [propOrderNumber]);

  const handleOrderStatus = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.orderNumber || order.id, newStatus);
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
    } catch { alert("Failed to update order status"); }
    finally { setUpdating(false); }
  };

  const handlePaymentStatus = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      await updatePaymentStatus(order.orderNumber || order.id, newStatus);
      setOrder(prev => ({ ...prev, paymentStatus: newStatus }));
    } catch { alert("Failed to update payment status"); }
    finally { setUpdating(false); }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-[2rem] bg-[var(--warm)]" />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <div className="h-64 rounded-[2rem] bg-[var(--warm)]" />
            <div className="h-48 rounded-[2rem] bg-[var(--warm)]" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-[2rem] bg-[var(--warm)]" />
            <div className="h-32 rounded-[2rem] bg-[var(--warm)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-[2rem] border border-[var(--gold)]/20 bg-white p-10 text-center">
        <p className="font-display text-4xl font-light text-[var(--mist)]">{error || "No order selected"}</p>
      </div>
    );
  }

  const orderNum  = order.orderNumber || order.id;
  const items     = order.items || [];
  const initials  = (order.customerName || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  // Build timeline from status flow
  const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
  const timeline = STATUS_FLOW.map((s, i) => ({
    title: s.charAt(0) + s.slice(1).toLowerCase(),
    done:  i <= currentIdx,
    active: i === currentIdx,
  }));
  if (order.orderStatus === "CANCELLED") {
    timeline.push({ title: "Cancelled", done: true, active: true, cancelled: true });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Dossier"
        title={orderNum}
        description="Review customer details, ordered fragrances, payment state, and fulfillment timeline."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5">
            Print Invoice
          </button>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">

          {/* Order items */}
          <AdminCard>
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-3">Purchased Fragrances</p>
                <h2 className="font-display text-4xl font-light">Order Items</h2>
              </div>
              <AdminBadge value={order.orderStatus} />
            </div>

            {items.length > 0 ? (
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div key={item.id || i}
                    className="flex items-center gap-5 rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4">
                    {item.imageUrl && (
                      <img src={buildImageUrl(item.imageUrl)} alt={item.productNameSnapshot}
                        className="h-20 w-20 rounded-2xl object-cover shadow-md" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--ink)]">{item.productNameSnapshot}</p>
                      <p className="text-sm text-[var(--mist)]">{item.selectedMlSnapshot}ml</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--gold-dark)]">{formatCurrency(item.lineTotal)}</p>
                      <p className="text-xs text-[var(--mist)]">Qty {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--mist)]">No item details available.</p>
            )}
          </AdminCard>

          {/* Timeline */}
          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Fulfillment Timeline</p>
              <h2 className="font-display text-4xl font-light">Order Progress</h2>
            </div>
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={event.title} className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                      event.cancelled ? "border-red-400 bg-red-50 text-red-500"
                      : event.active  ? "border-[var(--gold)] bg-[var(--gold)] text-[#0b0805]"
                      : event.done    ? "border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--gold-dark)]"
                      : "border-[var(--gold)]/20 bg-white text-[var(--mist)]"
                    }`}>
                      {event.cancelled ? "×" : event.done ? "✦" : "○"}
                    </span>
                    {index !== timeline.length - 1 && (
                      <span className="h-full w-px bg-[var(--gold)]/20" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-semibold ${event.active ? "text-[var(--ink)]" : "text-[var(--mist)]"}`}>
                      {event.title}
                    </p>
                    {event.active && (
                      <p className="mt-1 text-xs text-[var(--gold-dark)]">Current status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status update */}
            <div className="mt-6 pt-6 border-t border-[var(--gold)]/10">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--mist)] mb-3">Update Order Status</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map(s => (
                  <button key={s}
                    disabled={s === order.orderStatus || updating}
                    onClick={() => handleOrderStatus(s)}
                    className={`rounded-full px-4 py-2 text-xs transition ${
                      s === order.orderStatus
                        ? "bg-[#0b0805] text-[var(--gold)] cursor-default"
                        : "border border-[var(--gold)]/20 text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
                    } disabled:opacity-50`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-8">
          {/* Customer */}
          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Customer</p>
              <h2 className="font-display text-4xl font-light">Buyer Details</h2>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-[#fffcf8] p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-2xl text-[var(--gold-dark)]">
                {initials}
              </div>
              <div>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-[var(--mist)]">{order.customerPhone || order.phone}</p>
                {order.customerEmail && (
                  <p className="text-sm text-[var(--mist)]">{order.customerEmail}</p>
                )}
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <InfoRow label="Order Date"     value={formatDate(order.createdAt)} />
              <InfoRow label="Address"        value={order.deliveryAddress || order.address || "—"} />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
              <InfoRow label="Payment Status" value={
                <AdminBadge value={order.paymentStatus} />
              }/>
            </div>

            {/* Payment status update */}
            <div className="mt-5 pt-5 border-t border-[var(--gold)]/10">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--mist)] mb-3">Update Payment</p>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_STATUSES.map(s => (
                  <button key={s}
                    disabled={s === order.paymentStatus || updating}
                    onClick={() => handlePaymentStatus(s)}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${
                      s === order.paymentStatus
                        ? "bg-[#0b0805] text-[var(--gold)] cursor-default"
                        : "border border-[var(--gold)]/20 text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
                    } disabled:opacity-50`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </AdminCard>

          {/* Payment summary */}
          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Payment</p>
              <h2 className="font-display text-4xl font-light">Summary</h2>
            </div>
            <div className="space-y-4">
              <InfoRow label="Subtotal"      value={formatCurrency(order.subtotal)} />
              <InfoRow label="Delivery"      value={formatCurrency(order.deliveryCharge || order.deliveryFee || 100)} />
              {order.discount > 0 && (
                <InfoRow label="Discount" value={`-${formatCurrency(order.discount)}`} />
              )}
              <div className="border-t border-[var(--gold)]/10 pt-4">
                <InfoRow label="Total" value={formatCurrency(order.grandTotal || order.total)} strong />
              </div>
            </div>
          </AdminCard>

          {/* Admin note */}
          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Internal Note</p>
              <h2 className="font-display text-4xl font-light">Admin Notes</h2>
            </div>
            <textarea rows={5} placeholder="Add a private note for this order…"
              className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
            />
            <button className="mt-4 rounded-full bg-[var(--gold)] px-5 py-3 text-sm text-[#0b0805] transition hover:brightness-95">
              Save Note
            </button>
          </AdminCard>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-5">
      <span className="text-sm text-[var(--mist)] shrink-0">{label}</span>
      <span className={`text-right ${strong ? "font-display text-3xl text-[var(--gold-dark)]" : "text-sm font-medium text-[var(--ink)]"}`}>
        {value}
      </span>
    </div>
  );
}