import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Client Dossier"
        title={customer.name}
        description="Customer profile, purchase history, fragrance preferences, VIP tier, and private admin notes."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Send Offer
          </button>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[0.85fr_1.4fr]">
        <div className="space-y-8">
          <AdminCard>
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--warm)] font-display text-5xl text-[var(--gold-dark)] shadow-sm">
                AR
              </div>

              <h2 className="mt-5 font-display text-5xl font-light">
                {customer.name}
              </h2>

              <p className="mt-2 text-sm text-[var(--mist)]">
                {customer.email}
              </p>

              <div className="mt-5 flex justify-center gap-2">
                <AdminBadge value={customer.tier} />
                <AdminBadge value={customer.status} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <InfoRow label="Phone" value={customer.phone} />
              <InfoRow label="Address" value={customer.address} />
              <InfoRow label="Joined" value={formatDate(customer.joinedAt)} />
              <InfoRow label="Last Order" value={formatDate(customer.lastOrder)} />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Fragrance Taste</p>
              <h2 className="font-display text-4xl font-light">
                Preferences
              </h2>
            </div>

            <p className="text-sm leading-7 text-[var(--mist)]">
              {customer.preference}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {favoriteFragrances.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--warm)] px-4 py-2 text-xs text-[var(--gold-dark)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Private Note</p>
              <h2 className="font-display text-4xl font-light">
                Admin Notes
              </h2>
            </div>

            <textarea
              rows="5"
              placeholder="Add private customer note..."
              className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
            />

            <button className="mt-4 rounded-full bg-[var(--gold)] px-5 py-3 text-sm text-[#0b0805] transition hover:brightness-95">
              Save Note
            </button>
          </AdminCard>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            <MiniStat label="Lifetime Spend" value={formatCurrency(customer.spent)} />
            <MiniStat label="Orders" value={customer.orders} />
            <MiniStat label="Favorite" value={customer.favorite} />
          </div>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Purchase History</p>
              <h2 className="font-display text-4xl font-light">
                Orders
              </h2>
            </div>

            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4 transition hover:bg-[var(--warm)]/40"
                >
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {order.id}
                    </p>

                    <p className="mt-1 text-xs text-[var(--mist)]">
                      {formatDate(order.date)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[var(--gold-dark)]">
                      {formatCurrency(order.total)}
                    </p>

                    <div className="mt-2">
                      <AdminBadge value={order.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <div className="mb-7">
              <p className="eyebrow mb-3">Clienteling</p>
              <h2 className="font-display text-4xl font-light">
                Marketing Permissions
              </h2>
            </div>

            <div className="space-y-4">
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
    <div className="flex items-start justify-between gap-5 border-b border-[var(--gold)]/10 pb-4 last:border-b-0">
      <span className="text-sm text-[var(--mist)]">{label}</span>
      <span className="max-w-[60%] text-right text-sm font-medium text-[var(--ink)]">
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <AdminCard>
      <p className="text-sm text-[var(--mist)]">{label}</p>
      <p className="mt-3 font-display text-4xl font-light text-[var(--gold-dark)]">
        {value}
      </p>
    </AdminCard>
  );
}

function ToggleRow({ label, active = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] px-4 py-3">
      <span className="text-sm text-[var(--mist)]">{label}</span>

      <button
        className={`relative h-7 w-12 rounded-full transition ${
          active ? "bg-[var(--gold)]" : "bg-[var(--warm)]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            active ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}