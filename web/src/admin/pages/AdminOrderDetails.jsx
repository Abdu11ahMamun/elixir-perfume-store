import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import { adminOrders } from "../data/mockAdminData";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const mockOrderItems = [
  {
    id: "prd-1001",
    name: "Noir Ember",
    category: "For Him",
    price: 89,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "prd-1002",
    name: "Velvet Bloom",
    category: "For Her",
    price: 74,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=300&auto=format&fit=crop",
  },
];

const timeline = [
  {
    title: "Order placed",
    time: "15 Feb 2026, 10:42 AM",
    description: "Customer submitted the order from storefront checkout.",
  },
  {
    title: "Payment selected",
    time: "15 Feb 2026, 10:43 AM",
    description: "Cash on Delivery selected as payment method.",
  },
  {
    title: "Awaiting confirmation",
    time: "Pending",
    description: "Admin needs to confirm this order before processing.",
  },
];

export default function AdminOrderDetails() {
  const order = adminOrders[0];

  const subtotal = mockOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = 6;
  const total = subtotal + delivery;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Dossier"
        title={order.id}
        description="Review customer details, ordered fragrances, payment state, fulfillment timeline, and internal notes."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Print Invoice
          </button>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <AdminCard>
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow mb-3">Purchased Fragrances</p>
                <h2 className="font-display text-4xl font-light">
                  Order Items
                </h2>
              </div>

              <AdminBadge value={order.orderStatus} />
            </div>

            <div className="space-y-4">
              {mockOrderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover shadow-md"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-[var(--ink)]">
                      {item.name}
                    </p>
                    <p className="text-sm text-[var(--mist)]">
                      {item.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[var(--gold-dark)]">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-xs text-[var(--mist)]">
                      Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Fulfillment Timeline</p>
              <h2 className="font-display text-4xl font-light">
                Order Progress
              </h2>
            </div>

            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={event.title} className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        index === 0
                          ? "border-[var(--gold)] bg-[var(--gold)] text-[#0b0805]"
                          : "border-[var(--gold)]/30 bg-white text-[var(--gold-dark)]"
                      }`}
                    >
                      ✦
                    </span>

                    {index !== timeline.length - 1 && (
                      <span className="h-full w-px bg-[var(--gold)]/20" />
                    )}
                  </div>

                  <div className="pb-6">
                    <p className="font-semibold text-[var(--ink)]">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--gold-dark)]">
                      {event.time}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--mist)]">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-8">
          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Customer</p>
              <h2 className="font-display text-4xl font-light">
                Buyer Details
              </h2>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#fffcf8] p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-2xl text-[var(--gold-dark)]">
                AR
              </div>

              <div>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-[var(--mist)]">
                  {order.phone}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InfoRow label="Order Date" value={formatDate(order.createdAt)} />
              <InfoRow label="Payment Method" value={order.paymentMethod} />
              <InfoRow label="Payment Status" value={order.paymentStatus} />
              <InfoRow label="Delivery Area" value="Dhaka, Bangladesh" />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Payment</p>
              <h2 className="font-display text-4xl font-light">
                Summary
              </h2>
            </div>

            <div className="space-y-4">
              <InfoRow label="Subtotal" value={formatCurrency(subtotal)} />
              <InfoRow label="Delivery" value={formatCurrency(delivery)} />

              <div className="border-t border-[var(--gold)]/10 pt-4">
                <InfoRow label="Total" value={formatCurrency(total)} strong />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Internal Note</p>
              <h2 className="font-display text-4xl font-light">
                Admin Notes
              </h2>
            </div>

            <textarea
              rows="5"
              placeholder="Add a private note for this order..."
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
    <div className="flex items-center justify-between gap-5">
      <span className="text-sm text-[var(--mist)]">{label}</span>
      <span
        className={`text-right ${
          strong
            ? "font-display text-3xl text-[var(--gold-dark)]"
            : "text-sm font-medium text-[var(--ink)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}