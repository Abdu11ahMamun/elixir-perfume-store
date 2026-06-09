import { useMemo, useState } from "react";

import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar from "../components/ui/AdminSearchBar";
import AdminStatCard from "../components/ui/AdminStatCard";
import { adminOrders } from "../data/mockAdminData";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const statuses = [
  "All",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredOrders = useMemo(() => {
    return adminOrders.filter((order) => {
      const query = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query) ||
        order.paymentMethod.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const pendingCount = adminOrders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;

  const deliveredCount = adminOrders.filter(
    (order) => order.orderStatus === "DELIVERED"
  ).length;

  const totalRevenue = adminOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Atelier"
        title="Orders"
        description="Track customer purchases, payment status, delivery progress, and fulfillment workflow."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Export Orders
          </button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Orders"
          value={adminOrders.length}
          helper="All customer orders"
          icon="◎"
        />

        <AdminStatCard
          label="Pending"
          value={pendingCount}
          helper="Awaiting confirmation"
          icon="!"
          tone="bronze"
        />

        <AdminStatCard
          label="Delivered"
          value={deliveredCount}
          helper="Completed orders"
          icon="✦"
        />

        <AdminStatCard
          label="Revenue"
          value={formatCurrency(totalRevenue)}
          helper="From listed orders"
          icon="◈"
        />
      </section>

      <AdminCard>
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by order ID, customer, phone, or payment..."
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1.1fr_1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Order</span>
            <span>Customer</span>
            <span>Payment</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {filteredOrders.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}

            {filteredOrders.length === 0 && (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">
                  No orders found
                </h3>

                <p className="mt-2 text-sm text-[var(--mist)]">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function OrderRow({ order }) {
  const initials = order.customerName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="grid gap-5 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1.1fr_1.4fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
      <div>
        <p className="font-semibold text-[var(--ink)]">
          {order.id}
        </p>

        <p className="mt-1 text-xs text-[var(--mist)]">
          Online order
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-xl text-[var(--gold-dark)]">
          {initials}
        </div>

        <div>
          <p className="font-semibold text-[var(--ink)]">
            {order.customerName}
          </p>

          <p className="mt-1 text-xs text-[var(--mist)]">
            {order.phone}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm text-[var(--ink)]">
          {order.paymentMethod}
        </p>

        <div className="mt-2">
          <AdminBadge value={order.paymentStatus} />
        </div>
      </div>

      <p className="font-semibold text-[var(--gold-dark)]">
        {formatCurrency(order.total)}
      </p>

      <AdminBadge value={order.orderStatus} />

      <p className="text-sm text-[var(--mist)]">
        {formatDate(order.createdAt)}
      </p>

      <div className="flex justify-end gap-2">
        <button className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
          View
        </button>

        <button className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5">
          Update
        </button>
      </div>
    </div>
  );
}