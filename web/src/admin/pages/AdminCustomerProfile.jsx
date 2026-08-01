import { useEffect, useState } from "react";
import AdminBadge from "../components/ui/AdminBadge";
import AdminCard  from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton from "../components/ui/AdminButton";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
import { getCustomerById, getAdminOrders } from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";

/**
 * Read-only customer profile. No editable controls belong here — all
 * mutation happens on AdminCustomerEdit.
 */
export default function AdminCustomerProfile({ customerId, onEdit, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!customerId) {
      setError("No customer selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getCustomerById(customerId)
      .then((data) => {
        setCustomer(data);
        return getAdminOrders({ customerPhone: data.phone, size: 100, sort: "createdAt,desc" });
      })
      .then((data) => setOrders(data?.content || data || []))
      .catch(() => setError("Customer not found"))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCardSkeleton className="h-28" />
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.4fr]">
          <AdminCardSkeleton className="h-72" />
          <AdminCardSkeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-lg font-medium text-gray-400">{error || "No customer selected"}</p>
        <AdminButton variant="secondary" className="mt-4" onClick={() => onBack?.()}>Back to Customers</AdminButton>
      </div>
    );
  }

  const initials = (customer.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const location = [customer.upazila, customer.district].filter(Boolean).join(", ") || "—";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customer"
        title={customer.name}
        description="Read-only customer profile. Use Edit Customer to change profile fields or customer type."
        action={
          <div className="flex items-center gap-2">
            <AdminButton variant="secondary" onClick={() => onBack?.()}>Back to Customers</AdminButton>
            <AdminButton variant="primary" onClick={() => onEdit?.(customer.id)}>Edit Customer</AdminButton>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.4fr]">
        <div className="space-y-6">
          <AdminCard>
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-500">
                {initials}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{customer.name}</h2>
              {customer.email && <p className="mt-1 text-sm text-gray-500">{customer.email}</p>}

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {customer.customerTypeName && <AdminBadge value={customer.customerTypeName} tone="gold" />}
                <AdminBadge value={customer.active ? "ACTIVE" : "INACTIVE"} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoRow label="Phone"    value={customer.phone} />
              <InfoRow label="Location" value={location} />
              <InfoRow label="Address"  value={customer.address || "—"} />
              <InfoRow label="Customer Since" value={formatDate(customer.createdAt)} />
              <InfoRow label="First Order"    value={customer.firstOrderAt ? formatDate(customer.firstOrderAt) : "—"} />
              <InfoRow label="Last Order"     value={customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"} />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <MiniStat label="Lifetime Spend" value={formatCurrency(customer.totalSpent)} />
            <MiniStat label="Total Orders"   value={customer.totalOrders ?? 0} />
            <MiniStat label="Status"         value={customer.active ? "Active" : "Inactive"} />
          </div>

          <AdminCard title="Order History" description="All orders placed by this customer.">
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3.5"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.grandTotal)}</p>
                      <div className="mt-1.5 flex justify-end gap-1.5">
                        <AdminBadge value={order.orderStatus} />
                        <AdminBadge value={order.paymentStatus} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No orders on record.</p>
            )}
          </AdminCard>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <AdminCard padding={false}>
      <div className="p-5">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </AdminCard>
  );
}
