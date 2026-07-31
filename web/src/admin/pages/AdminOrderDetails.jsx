import { useEffect, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton     from "../components/ui/AdminButton";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
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
      <div className="space-y-6">
        <AdminCardSkeleton className="h-28" />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <AdminCardSkeleton className="h-64" />
            <AdminCardSkeleton className="h-48" />
          </div>
          <div className="space-y-6">
            <AdminCardSkeleton className="h-48" />
            <AdminCardSkeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-lg font-medium text-gray-400">{error || "No order selected"}</p>
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Order"
        title={orderNum}
        description="Review customer details, ordered fragrances, payment state, and fulfillment timeline."
        action={<AdminButton variant="primary">Print Invoice</AdminButton>}
      />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">

          {/* Order items */}
          <AdminCard>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
              <AdminBadge value={order.orderStatus} />
            </div>

            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={item.id || i}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
                    {item.imageUrl && (
                      <img src={buildImageUrl(item.imageUrl)} alt={item.productNameSnapshot}
                        className="h-16 w-16 rounded-lg object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.productNameSnapshot}</p>
                      <p className="text-xs text-gray-500">{item.selectedMlSnapshot}ml</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.lineTotal)}</p>
                      <p className="text-xs text-gray-400">Qty {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No item details available.</p>
            )}
          </AdminCard>

          {/* Timeline */}
          <AdminCard title="Order Progress">
            <div className="space-y-5">
              {timeline.map((event, index) => (
                <div key={event.title} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors ${
                      event.cancelled ? "border-red-300 bg-red-50 text-red-500"
                      : event.active  ? "border-[var(--gold)] bg-[var(--gold)] text-[#1a1408]"
                      : event.done    ? "border-[#c9a96e]/50 bg-[#c9a96e]/10 text-[var(--gold-dark)]"
                      : "border-gray-200 bg-white text-gray-400"
                    }`}>
                      {event.cancelled ? "×" : event.done ? "✓" : "○"}
                    </span>
                    {index !== timeline.length - 1 && (
                      <span className="h-full w-px bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className={`text-sm font-medium ${event.active ? "text-gray-900" : "text-gray-400"}`}>
                      {event.title}
                    </p>
                    {event.active && (
                      <p className="mt-0.5 text-xs text-[var(--gold-dark)]">Current status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Status update */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">Update Order Status</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map(s => (
                  <AdminButton
                    key={s}
                    size="sm"
                    variant={s === order.orderStatus ? "primary" : "outline"}
                    disabled={s === order.orderStatus || updating}
                    onClick={() => handleOrderStatus(s)}
                  >
                    {s}
                  </AdminButton>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <AdminCard title="Buyer Details">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50/60 p-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-500">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                <p className="text-xs text-gray-500">{order.customerPhone || order.phone}</p>
                {order.customerEmail && (
                  <p className="text-xs text-gray-500">{order.customerEmail}</p>
                )}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <InfoRow label="Order Date"     value={formatDate(order.createdAt)} />
              <InfoRow label="Address"        value={order.deliveryAddress || order.address || "—"} />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
              <InfoRow label="Payment Status" value={<AdminBadge value={order.paymentStatus} />} />
            </div>

            {/* Payment status update */}
            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">Update Payment</p>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_STATUSES.map(s => (
                  <AdminButton
                    key={s}
                    size="sm"
                    variant={s === order.paymentStatus ? "primary" : "outline"}
                    disabled={s === order.paymentStatus || updating}
                    onClick={() => handlePaymentStatus(s)}
                  >
                    {s}
                  </AdminButton>
                ))}
              </div>
            </div>
          </AdminCard>

          {/* Payment summary */}
          <AdminCard title="Payment Summary">
            <div className="space-y-3">
              <InfoRow label="Subtotal"      value={formatCurrency(order.subtotal)} />
              <InfoRow label="Delivery"      value={formatCurrency(order.deliveryCharge || order.deliveryFee || 100)} />
              {order.discount > 0 && (
                <InfoRow label="Discount" value={`-${formatCurrency(order.discount)}`} />
              )}
              <div className="border-t border-gray-100 pt-3">
                <InfoRow label="Total" value={formatCurrency(order.grandTotal || order.total)} strong />
              </div>
            </div>
          </AdminCard>

          {/* Admin note */}
          <AdminCard title="Admin Notes">
            <textarea rows={5} placeholder="Add a private note for this order…"
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20"
            />
            <AdminButton variant="primary" size="sm" className="mt-3">Save Note</AdminButton>
          </AdminCard>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-5">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className={`text-right ${strong ? "text-xl font-semibold text-gray-900" : "text-sm font-medium text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
