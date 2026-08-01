import { useEffect, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton     from "../components/ui/AdminButton";
import { AdminField, AdminTextArea, AdminSelectField } from "../components/ui/AdminInput";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
import {
  getAdminOrderByNumber,
  updateOrderDetails,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";

// Mirrors the backend's transition map (OrderServiceImpl) purely so the
// dropdown only ever offers moves the API will actually accept. The
// backend remains the source of truth and re-validates on save.
// DELIVERED is deliberately never offered as a target — the client asked
// for it to be removed from every selectable status control — even though
// it's still a technically valid backend transition for data completeness.
const ORDER_STATUS_TRANSITIONS = {
  PENDING:    ["CONFIRMED", "CANCELLED"],
  CONFIRMED:  ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED:    ["CANCELLED"], // DELIVERED intentionally excluded
  DELIVERED:  [],
  CANCELLED:  [],
};

const PAYMENT_STATUS_TRANSITIONS = {
  UNPAID:   ["PAID", "FAILED"],
  PAID:     ["REFUNDED"],
  FAILED:   ["UNPAID", "PAID"],
  REFUNDED: [],
};

const buildOptions = (current, transitions) => {
  if (!current) return [];
  const next = transitions[current] || [];
  return [...new Set([current, ...next])];
};

export default function AdminOrderEdit({ orderNumber, onSaved, onCancel }) {
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // ── Editable buyer/contact fields ──
  const [customerName,    setCustomerName]    = useState("");
  const [customerPhone,   setCustomerPhone]   = useState("");
  const [customerEmail,   setCustomerEmail]   = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // ── Editable status fields ──
  const [orderStatus,   setOrderStatus]   = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!orderNumber) {
      setLoadError("No order selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    getAdminOrderByNumber(orderNumber)
      .then((data) => {
        setOrder(data);
        setCustomerName(data.customerName || "");
        setCustomerPhone(data.customerPhone || "");
        setCustomerEmail(data.customerEmail || "");
        setDeliveryAddress(data.deliveryAddress || "");
        setOrderStatus(data.orderStatus || "");
        setPaymentStatus(data.paymentStatus || "");
      })
      .catch(() => setLoadError("Order not found"))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      // Buyer/contact details — only re-sent if actually changed, so we
      // never overwrite fields the admin didn't touch.
      if (
        customerName !== order.customerName ||
        customerPhone !== order.customerPhone ||
        customerEmail !== (order.customerEmail || "") ||
        deliveryAddress !== order.deliveryAddress
      ) {
        await updateOrderDetails(orderNumber, {
          customerName, customerPhone,
          customerEmail: customerEmail || null,
          deliveryAddress,
        });
      }

      if (orderStatus !== order.orderStatus) {
        await updateOrderStatus(orderNumber, orderStatus);
      }

      if (paymentStatus !== order.paymentStatus) {
        await updatePaymentStatus(orderNumber, paymentStatus);
      }

      setSuccess("Order updated successfully!");
      onSaved?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save order.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCardSkeleton className="h-20" />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <AdminCardSkeleton className="h-64" />
            <AdminCardSkeleton className="h-40" />
          </div>
          <AdminCardSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-lg font-medium text-gray-400">{loadError || "No order selected"}</p>
        <AdminButton variant="secondary" className="mt-4" onClick={() => onCancel?.()}>Back to Orders</AdminButton>
      </div>
    );
  }

  const items = order.items || [];
  const orderStatusOptions   = buildOptions(order.orderStatus, ORDER_STATUS_TRANSITIONS);
  const paymentStatusOptions = buildOptions(order.paymentStatus, PAYMENT_STATUS_TRANSITIONS);

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Order"
          title={`Edit ${order.orderNumber || orderNumber}`}
          description="Update buyer details, delivery address, order status, and payment status."
          action={
            <div className="flex items-center gap-2">
              <AdminButton type="button" variant="secondary" onClick={() => onCancel?.()}>Cancel</AdminButton>
              <AdminButton type="submit" variant="primary" loading={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </AdminButton>
            </div>
          }
        />

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            {/* Editable buyer/contact info */}
            <AdminCard title="Buyer & Delivery" description="Only fields the backend supports editing are shown.">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Customer Name"  value={customerName}  onChange={e => setCustomerName(e.target.value)} required />
                <AdminField label="Phone"          value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} required />
              </div>
              <div className="mt-4">
                <AdminField label="Email (optional)" type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
              </div>
              <div className="mt-4">
                <AdminTextArea label="Delivery Address" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} required />
              </div>
            </AdminCard>

            {/* Read-only order items for context */}
            <AdminCard title="Order Items" description="Items are set at order time and aren't editable here.">
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div key={item.id || i}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.productNameSnapshot}</p>
                        <p className="text-xs text-gray-500">{item.selectedMlSnapshot}ml · Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No item details available.</p>
              )}
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span><span>{formatCurrency(order.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total</span><span>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </AdminCard>
          </div>

          {/* Right column — status */}
          <div className="space-y-6">
            <AdminCard title="Order Status" description="Delivered isn't selectable here — see order history for terminal state.">
              <p className="mb-3 text-xs text-gray-400">Order date: {formatDate(order.createdAt)}</p>
              {orderStatusOptions.length > 1 ? (
                <AdminSelectField
                  label="Status"
                  value={orderStatus}
                  onChange={e => setOrderStatus(e.target.value)}
                  options={orderStatusOptions}
                />
              ) : (
                <div>
                  <span className="mb-1.5 block text-xs font-medium text-gray-600">Status</span>
                  <AdminBadge value={order.orderStatus} />
                  <p className="mt-2 text-xs text-gray-400">This order is in a final state and can no longer change status.</p>
                </div>
              )}
            </AdminCard>

            <AdminCard title="Payment Status">
              {paymentStatusOptions.length > 1 ? (
                <AdminSelectField
                  label="Payment Status"
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value)}
                  options={paymentStatusOptions}
                />
              ) : (
                <div>
                  <span className="mb-1.5 block text-xs font-medium text-gray-600">Payment Status</span>
                  <AdminBadge value={order.paymentStatus} />
                  <p className="mt-2 text-xs text-gray-400">This payment is in a final state and can no longer change.</p>
                </div>
              )}
              <div className="mt-4 text-xs text-gray-400">
                Payment Method: <span className="font-medium text-gray-600">{order.paymentMethod}</span>
              </div>
            </AdminCard>
          </div>
        </section>
      </div>
    </form>
  );
}
