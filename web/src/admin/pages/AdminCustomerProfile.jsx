import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton from "../components/ui/AdminButton";
import { AdminToggle } from "../components/ui/AdminInput";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const customer = {
  id: "cus-1001",
  name: "Araf Rahman",
  email: "araf.rahman@email.com",
  phone: "+8801712345678",
  tier: "PRIVATE_CLIENT",
  status: "ACTIVE",
  favorite: "Golden Oud",
  joinedAt: "2025-11-08",
  orders: 18,
  spent: 1420,
  lastOrder: "2026-02-18",
  address: "Gulshan, Dhaka, Bangladesh",
  preference: "Oud, Woody, Evening fragrances",
};

const orderHistory = [
  { id: "ORD-9001", date: "2026-02-18", total: 163, status: "PENDING" },
  { id: "ORD-8890", date: "2026-01-25", total: 240, status: "DELIVERED" },
  { id: "ORD-8712", date: "2025-12-16", total: 120, status: "DELIVERED" },
  { id: "ORD-8620", date: "2025-11-28", total: 89, status: "DELIVERED" },
];

const favoriteFragrances = [
  "Golden Oud",
  "Noir Ember",
  "Midnight Leather",
];

export default function AdminCustomerProfile() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Customer"
        title={customer.name}
        description="Customer profile, purchase history, fragrance preferences, VIP tier, and private admin notes."
        action={<AdminButton variant="primary">Send Offer</AdminButton>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.4fr]">
        <div className="space-y-6">
          <AdminCard>
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-500">
                AR
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {customer.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {customer.email}
              </p>

              <div className="mt-4 flex justify-center gap-2">
                <AdminBadge value={customer.tier} />
                <AdminBadge value={customer.status} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <InfoRow label="Phone" value={customer.phone} />
              <InfoRow label="Address" value={customer.address} />
              <InfoRow label="Joined" value={formatDate(customer.joinedAt)} />
              <InfoRow label="Last Order" value={formatDate(customer.lastOrder)} />
            </div>
          </AdminCard>

          <AdminCard title="Preferences">
            <p className="text-sm leading-6 text-gray-500">
              {customer.preference}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {favoriteFragrances.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Admin Notes">
            <textarea
              rows="5"
              placeholder="Add private customer note..."
              className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20"
            />

            <AdminButton variant="primary" size="sm" className="mt-3">Save Note</AdminButton>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-3">
            <MiniStat label="Lifetime Spend" value={formatCurrency(customer.spent)} />
            <MiniStat label="Orders" value={customer.orders} />
            <MiniStat label="Favorite" value={customer.favorite} />
          </div>

          <AdminCard title="Orders">
            <div className="space-y-3">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 p-3.5 transition hover:border-gray-200"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.id}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatDate(order.date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total)}
                    </p>

                    <div className="mt-1.5">
                      <AdminBadge value={order.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Marketing Permissions">
            <div className="space-y-3">
              <ToggleRow label="Email campaigns" active />
              <ToggleRow label="SMS offers" active />
              <ToggleRow label="VIP launch invitations" active />
              <ToggleRow label="Birthday fragrance offer" />
            </div>
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
      <span className="max-w-[60%] text-right text-sm font-medium text-gray-900">
        {value}
      </span>
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

function ToggleRow({ label, active = false }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3">
      <span className="text-sm text-gray-600">{label}</span>
      <AdminToggle value={active} onChange={() => {}} />
    </div>
  );
}
