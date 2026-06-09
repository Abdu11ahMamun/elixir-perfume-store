import { useMemo, useState } from "react";

import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar from "../components/ui/AdminSearchBar";
import AdminStatCard from "../components/ui/AdminStatCard";
import { adminProducts } from "../data/mockAdminData";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const categories = ["All", "For Him", "For Her", "Luxury Oud", "Gift Sets"];
const statuses = ["All", "ACTIVE", "INACTIVE"];

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredProducts = useMemo(() => {
    return adminProducts.filter((product) => {
      const query = search.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStatus =
        status === "All" || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const activeCount = adminProducts.filter(
    (product) => product.status === "ACTIVE"
  ).length;

  const lowStockCount = adminProducts.filter(
    (product) => product.stock > 0 && product.stock < 20
  ).length;

  const outOfStockCount = adminProducts.filter(
    (product) => product.stock === 0
  ).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalog Atelier"
        title="Products"
        description="Manage fragrance catalog, pricing, stock, badges, and visibility before connecting the Spring Boot APIs."
        action={
          <button className="rounded-full bg-[var(--warm)] border-b border-[var(--gold)]/20 text-[var(--gold-dark)] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            + Add Product
          </button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Products"
          value={adminProducts.length}
          helper="All catalog items"
          icon="◈"
        />

        <AdminStatCard
          label="Active Products"
          value={activeCount}
          helper="Visible in storefront"
          icon="✦"
        />

        <AdminStatCard
          label="Low Stock"
          value={lowStockCount}
          helper="Needs restock soon"
          icon="!"
          tone="bronze"
        />

        <AdminStatCard
          label="Out of Stock"
          value={outOfStockCount}
          helper="Unavailable items"
          icon="×"
          tone="dark"
        />
      </section>

      <AdminCard>
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by perfume, SKU, or category..."
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

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
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Badge</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {filteredProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}

            {filteredProducts.length === 0 && (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-[var(--mist)]">
                  Try changing search or filter options.
                </p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function ProductRow({ product }) {
  return (
    <div className="grid gap-5 px-6 py-5 xl:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
      <div className="flex items-center gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 rounded-2xl object-cover shadow-md"
        />

        <div>
          <p className="font-semibold text-[var(--ink)]">
            {product.name}
          </p>

          <p className="mt-1 text-xs text-[var(--mist)]">
            {product.sku} · Added {formatDate(product.createdAt)}
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--mist)]">
        {product.category}
      </p>

      <p className="font-semibold text-[var(--gold-dark)]">
        {formatCurrency(product.price)}
      </p>

      <p
        className={`font-semibold ${
          product.stock === 0
            ? "text-[#0b0805]"
            : product.stock < 20
            ? "text-[#8f5f24]"
            : "text-[var(--gold-dark)]"
        }`}
      >
        {product.stock}
      </p>

      <AdminBadge value={product.status} />

      <AdminBadge value={product.badge} />

      <div className="flex justify-end gap-2">
        <button className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
          View
        </button>

        <button className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5">
          Edit
        </button>
      </div>
    </div>
  );
}