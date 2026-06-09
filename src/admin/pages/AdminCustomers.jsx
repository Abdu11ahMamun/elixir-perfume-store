import { useMemo, useState } from "react";

import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar from "../components/ui/AdminSearchBar";
import AdminStatCard from "../components/ui/AdminStatCard";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const customers = [
  {
    id: "cus-1001",
    name: "Araf Rahman",
    email: "araf.rahman@email.com",
    phone: "+8801712345678",
    tier: "PRIVATE_CLIENT",
    orders: 18,
    spent: 1420,
    lastOrder: "2026-02-18",
    status: "ACTIVE",
    favorite: "Golden Oud",
  },
  {
    id: "cus-1002",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@email.com",
    phone: "+8801811122233",
    tier: "GOLD_COLLECTOR",
    orders: 12,
    spent: 980,
    lastOrder: "2026-02-16",
    status: "ACTIVE",
    favorite: "Velvet Bloom",
  },
  {
    id: "cus-1003",
    name: "Sakib Hasan",
    email: "sakib.hasan@email.com",
    phone: "+8801919988877",
    tier: "EMERALD_MEMBER",
    orders: 7,
    spent: 520,
    lastOrder: "2026-02-10",
    status: "ACTIVE",
    favorite: "Noir Ember",
  },
  {
    id: "cus-1004",
    name: "Maliha Khan",
    email: "maliha.khan@email.com",
    phone: "+8801612349876",
    tier: "NEW_DISCOVERY",
    orders: 1,
    spent: 89,
    lastOrder: "2026-02-02",
    status: "INACTIVE",
    favorite: "Rose Dusk",
  },
];

const tiers = [
  "All",
  "PRIVATE_CLIENT",
  "GOLD_COLLECTOR",
  "EMERALD_MEMBER",
  "NEW_DISCOVERY",
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("All");

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const query = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.favorite.toLowerCase().includes(query);

      const matchesTier = tier === "All" || customer.tier === tier;

      return matchesSearch && matchesTier;
    });
  }, [search, tier]);

  const vipCustomers = customers.filter(
    (customer) =>
      customer.tier === "PRIVATE_CLIENT" ||
      customer.tier === "GOLD_COLLECTOR"
  ).length;

  const returningCustomers = customers.filter(
    (customer) => customer.orders > 1
  ).length;

  const lifetimeValue =
    customers.reduce((sum, customer) => sum + customer.spent, 0) /
    customers.length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Client Atelier"
        title="Customers"
        description="Understand buyers, VIP collectors, purchase behavior, favorite fragrances, and customer lifetime value."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Export Clients
          </button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Customers"
          value={customers.length}
          helper="All registered buyers"
          icon="☉"
        />

        <AdminStatCard
          label="VIP Collectors"
          value={vipCustomers}
          helper="Private and gold clients"
          icon="✦"
        />

        <AdminStatCard
          label="Returning Buyers"
          value={returningCustomers}
          helper="More than one order"
          icon="↺"
          tone="bronze"
        />

        <AdminStatCard
          label="Average LTV"
          value={formatCurrency(lifetimeValue)}
          helper="Lifetime value per customer"
          icon="◈"
        />
      </section>

      <AdminCard>
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by customer, email, phone, or favorite scent..."
          />

          <select
            value={tier}
            onChange={(event) => setTier(event.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
          >
            {tiers.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Customer</span>
            <span>Favorite</span>
            <span>Orders</span>
            <span>Spent</span>
            <span>Tier</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {filteredCustomers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}

            {filteredCustomers.length === 0 && (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">
                  No customers found
                </h3>

                <p className="mt-2 text-sm text-[var(--mist)]">
                  Try changing your search or tier filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function CustomerRow({ customer }) {
  const initials = customer.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="grid gap-5 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-2xl text-[var(--gold-dark)] shadow-sm">
          {initials}
        </div>

        <div>
          <p className="font-semibold text-[var(--ink)]">
            {customer.name}
          </p>

          <p className="mt-1 text-xs text-[var(--mist)]">
            {customer.email}
          </p>

          <p className="mt-1 text-xs text-[var(--mist)]">
            {customer.phone}
          </p>
        </div>
      </div>

      <div>
        <p className="font-semibold text-[var(--gold-dark)]">
          {customer.favorite}
        </p>

        <p className="mt-1 text-xs text-[var(--mist)]">
          Last order {formatDate(customer.lastOrder)}
        </p>
      </div>

      <p className="font-semibold text-[var(--ink)]">
        {customer.orders}
      </p>

      <p className="font-semibold text-[var(--gold-dark)]">
        {formatCurrency(customer.spent)}
      </p>

      <AdminBadge value={customer.tier} />

      <div className="flex justify-end gap-2">
        <button className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
          View
        </button>

        <button className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5">
          Notes
        </button>
      </div>
    </div>
  );
}