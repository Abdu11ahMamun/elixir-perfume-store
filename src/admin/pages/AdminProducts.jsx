import { useMemo, useState } from "react";

import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import { adminProducts } from "../data/mockAdminData";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const CATEGORIES = ["All", "For Him", "For Her", "Luxury Oud", "Gift Sets"];
const STATUSES   = ["All", "ACTIVE", "INACTIVE"];

// ─── Helpers ─────────────────────────────────────────────
// Total stock across all sizes
const totalStock = (product) => product.sizes.reduce((s, sz) => s + sz.stock, 0);

// Lowest price across sizes
const minPrice = (product) => Math.min(...product.sizes.map((s) => s.price));

// Low stock = any size has stock > 0 but < 10
const isLowStock = (product) => product.sizes.some((s) => s.stock > 0 && s.stock < 10);

// Out of stock = ALL sizes are 0
const isOutOfStock = (product) => product.sizes.every((s) => s.stock === 0);

export default function AdminProducts({ setActivePage }) {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus]     = useState("All");

  const filtered = useMemo(() => {
    return adminProducts.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.inspiredBy.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat    = category === "All" || p.category === category;
      const matchStatus = status === "All"   || p.status === status;
      return matchSearch && matchCat && matchStatus;
    });
  }, [search, category, status]);

  const activeCount    = adminProducts.filter((p) => p.status === "ACTIVE").length;
  const lowStockCount  = adminProducts.filter(isLowStock).length;
  const outOfStockCount = adminProducts.filter(isOutOfStock).length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalog Atelier"
        title="Products"
        description="Manage fragrance catalog with sizes (6ml / 15ml / 30ml), ML stock, and inspired-by details."
        action={
          <button
            onClick={() => setActivePage && setActivePage("addProduct")}
            className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5"
          >
            + Add Product
          </button>
        }
      />

      {/* ── Stats ── */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Products"  value={adminProducts.length} helper="All catalog items"      icon="◈" />
        <AdminStatCard label="Active"          value={activeCount}          helper="Visible in storefront"  icon="✦" />
        <AdminStatCard label="Low Stock"       value={lowStockCount}        helper="Any size below 10 units" icon="!" tone="bronze" />
        <AdminStatCard label="Out of Stock"    value={outOfStockCount}      helper="All sizes sold out"     icon="×" tone="dark" />
      </section>

      <AdminCard>
        {/* ── Filters ── */}
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, ID, inspired by, or category..."
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Inspired By</span>
            <span>Sizes & Stock</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {filtered.map((product) => (
              <ProductRow key={product.id} product={product} setActivePage={setActivePage} />
            ))}
            {filtered.length === 0 && (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No products found</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Try changing search or filter options.</p>
              </div>
            )}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

function ProductRow({ product, setActivePage }) {
  const out = isOutOfStock(product);
  const low = isLowStock(product);

  return (
    <div className="grid gap-5 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr_auto] xl:items-center">
      {/* Product */}
      <div className="flex items-center gap-4">
        <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover shadow-md" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[var(--ink)]">{product.name}</p>
            {product.isCombo && (
              <span style={{ fontSize: "0.55rem", padding: "1px 7px", background: "var(--plum)", color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Combo
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[var(--mist)]">{product.id} · Added {formatDate(product.createdAt)}</p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--gold-dark)", fontStyle: "italic" }}>
            from {formatCurrency(minPrice(product))}
          </p>
        </div>
      </div>

      {/* Category */}
      <p className="text-sm text-[var(--mist)]">{product.category}</p>

      {/* Inspired by */}
      <p className="text-xs text-[var(--mist)] italic leading-5">{product.inspiredBy}</p>

      {/* Sizes & stock */}
      <div className="flex flex-col gap-1">
        {product.sizes.map((s) => (
          <div key={s.ml} className="flex items-center gap-2">
            <span style={{ fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 600, color: "var(--ink)", minWidth: "28px" }}>
              {s.ml}ml
            </span>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 500,
              color: s.stock === 0 ? "#9b3a3a" : s.stock < 10 ? "#8f5f24" : "var(--gold-dark)",
            }}>
              {s.stock === 0 ? "Sold out" : `${s.stock} units`}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--mist)" }}>
              · {formatCurrency(s.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1.5">
        <AdminBadge value={product.status} />
        {out && <AdminBadge value="OUT_OF_STOCK" />}
        {!out && low && <AdminBadge value="LOW_STOCK" />}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)]">
          View
        </button>
        <button
          onClick={() => setActivePage && setActivePage("addProduct")}
          className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
        >
          Edit
        </button>
      </div>
    </div>
  );
}