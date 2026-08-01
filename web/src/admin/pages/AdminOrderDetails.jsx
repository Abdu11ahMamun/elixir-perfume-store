import { useEffect, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton     from "../components/ui/AdminButton";
import AdminCopyButton from "../components/ui/AdminCopyButton";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
import { getAdminOrderByNumber } from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";
import { formatCurrency, formatDate } from "../utils/adminFormat";

// Status flow for the read-only progress timeline
const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

/**
 * Read-only order view. No text input, select, editable status, or save
 * button belongs here — all mutation happens on AdminOrderEdit.
 */
export default function AdminOrderDetails({ orderNumber, onEdit, onBack }) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!orderNumber) {
      setError("No order selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getAdminOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

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
        <AdminButton variant="secondary" className="mt-4" onClick={() => onBack?.()}>Back to Orders</AdminButton>
      </div>
    );
  }

  const orderNum  = order.orderNumber || order.id;
  const items     = order.items || [];
  const initials  = (order.customerName || "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  const addressSummary = order.deliveryAddress || order.address || "—";
  const buyerSummary = [
    order.customerName,
    order.customerPhone,
    order.customerEmail,
    addressSummary,
  ].filter(Boolean).join("\n");

  const orderSummary = [
    `Order ${orderNum}`,
    `Date: ${formatDate(order.createdAt)}`,
    `Customer: ${order.customerName} · ${order.customerPhone}${order.customerEmail ? ` · ${order.customerEmail}` : ""}`,
    `Address: ${addressSummary}`,
    "",
    ...items.map((item) => `${item.productNameSnapshot} (${item.selectedMlSnapshot}ml) × ${item.quantity} — ${formatCurrency(item.lineTotal)}`),
    "",
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Delivery: ${formatCurrency(order.deliveryCharge)}`,
    `Total: ${formatCurrency(order.grandTotal)}`,
    `Payment: ${order.paymentMethod} · ${order.paymentStatus}`,
    `Status: ${order.orderStatus}`,
  ].join("\n");

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
        description="Read-only order review. Use Edit Order to change buyer details, address, or status."
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" onClick={() => onBack?.()}>Back to Orders</AdminButton>
            <AdminButton variant="outline" onClick={() => window.print()}>Print Invoice</AdminButton>
            <AdminButton variant="primary" onClick={() => onEdit?.(orderNum)}>Edit Order</AdminButton>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">

          {/* Order items */}
          <AdminCard>
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
                <AdminCopyButton value={orderNum} label="Copy order #" />
              </div>
              <AdminBadge value={order.orderStatus} />
            </div>

            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={item.id || i}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
                    {item.imageUrl && (
                      <img src={buildImageUrl(item.imageUrl)} alt={item.productNameSnapshot}
                        loading="lazy" decoding="async"
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

          {/* Timeline (read-only) */}
          <AdminCard title="Order Progress">
            <div className="space-y-5">
              {timeline.map((event, index) => (
                <div key={event.title} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors ${
                      event.cancelled ? "border-red-300 bg-red-50 text-red-600"
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
          </AdminCard>
        </div>

        <div className="space-y-6">
          {/* Buyer details */}
          <AdminCard
            title="Buyer Details"
            action={<AdminCopyButton value={buyerSummary} label="Copy details" />}
          >
            <div className="flex items-center gap-3 rounded-lg bg-gray-50/60 p-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-500">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  <AdminCopyButton value={order.customerPhone} label="" copiedLabel="✓" className="px-1 py-0.5" />
                </div>
                {order.customerEmail && (
                  <p className="text-xs text-gray-500">{order.customerEmail}</p>
                )}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <InfoRow label="Order Date"     value={formatDate(order.createdAt)} />
              <InfoRow
                label="Address"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <span>{addressSummary}</span>
                    <AdminCopyButton value={addressSummary} label="" copiedLabel="✓" className="px-1 py-0.5" />
                  </span>
                }
              />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
              <InfoRow label="Payment Status" value={<AdminBadge value={order.paymentStatus} />} />
            </div>
          </AdminCard>

          {/* Payment summary */}
          <AdminCard
            title="Payment Summary"
            action={<AdminCopyButton value={orderSummary} label="Copy summary" />}
          >
            <div className="space-y-3">
              <InfoRow label="Subtotal"      value={formatCurrency(order.subtotal)} />
              <InfoRow label="Delivery"      value={formatCurrency(order.deliveryCharge)} />
              {order.discount > 0 && (
                <InfoRow label="Discount" value={`-${formatCurrency(order.discount)}`} />
              )}
              <div className="border-t border-gray-100 pt-3">
                <InfoRow label="Total" value={formatCurrency(order.grandTotal)} strong />
              </div>
            </div>
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
