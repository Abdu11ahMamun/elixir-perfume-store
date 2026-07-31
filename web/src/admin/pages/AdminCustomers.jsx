import { useMemo, useState } from "react";

import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar from "../components/ui/AdminSearchBar";
import AdminStatCard from "../components/ui/AdminStatCard";
import AdminButton from "../components/ui/AdminButton";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const COLUMNS = "1.6fr 1fr 0.7fr 1fr 1fr auto";

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

export default function AdminCustomers({setActivePage}) {
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Clientele"
        title="Customers"
        description="Understand buyers, VIP collectors, purchase behavior, favorite fragrances, and customer lifetime value."
        action={<AdminButton variant="primary">Export Clients</AdminButton>}
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Customers" value={customers.length} helper="All registered buyers" icon="☉" />
        <AdminStatCard label="VIP Collectors" value={vipCustomers} helper="Private and gold clients" icon="✦" />
        <AdminStatCard label="Returning Buyers" value={returningCustomers} helper="More than one order" icon="↺" tone="bronze" />
        <AdminStatCard label="Average LTV" value={formatCurrency(lifetimeValue)} helper="Lifetime value per customer" icon="◈" />
      </section>

      <AdminCard>
        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by customer, email, phone, or favorite scent..."
          />
          <AdminSelect value={tier} onChange={(e) => setTier(e.target.value)} options={tiers} />
        </div>

        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Customer</span>
            <span>Favorite</span>
            <span>Orders</span>
            <span>Spent</span>
            <span>Tier</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {filteredCustomers.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} setActivePage={setActivePage} />
            ))}

            {filteredCustomers.length === 0 && (
              <AdminEmptyState icon="☉" title="No customers found" description="Try changing your search or tier filter." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}

function CustomerRow({ customer, setActivePage }) {
  const initials = customer.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <AdminTableRow columns={COLUMNS}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
          {initials}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{customer.name}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{customer.email}</p>
          <p className="truncate text-xs text-gray-400">{customer.phone}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900">{customer.favorite}</p>
        <p className="mt-0.5 text-xs text-gray-400">Last order {formatDate(customer.lastOrder)}</p>
      </div>

      <p className="text-sm font-medium text-gray-900">{customer.orders}</p>

      <p className="text-sm font-semibold text-gray-900">{formatCurrency(customer.spent)}</p>

      <AdminBadge value={customer.tier} />

      <div className="flex items-center justify-end gap-2">
        <AdminButton size="sm" variant="secondary" onClick={() => setActivePage("customerProfile")}>
          View
        </AdminButton>
        <AdminButton size="sm" variant="ghost">Notes</AdminButton>
      </div>
    </AdminTableRow>
  );
}
