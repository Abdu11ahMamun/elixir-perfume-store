import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import {
  getAdminProducts,
  updateProductStatus,
  deleteProduct,
} from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const STATUSES = ["All", "ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"];

// ─── Helpers ──────────────────────────────────────────────
const getSizes    = (p) => p.sizes || [];
const minPrice    = (p) => getSizes(p).length ? Math.min(...getSizes(p).map(s => s.price)) : 0;
const isLowStock  = (p) => getSizes(p).some(s => s.stock > 0 && s.stock < 10);
const isOutOfStock= (p) => getSizes(p).length > 0 && getSizes(p).every(s => s.stock === 0);
const primaryImg  = (p) => {
  const first = getSizes(p)[0];
  const url   = first?.imageUrls?.[0] || first?.images?.[0] || p.image || p.primaryImage || "";
  return buildImageUrl(url);
};

export default function AdminProducts({ setActivePage }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getAdminProducts({ page: 0, size: 100 })
      .then(data => setProducts(data?.content || data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Client-side filter
  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch =
        (p.name        || "").toLowerCase().includes(q) ||
        (p.inspiredBy  || "").toLowerCase().includes(q) ||
        (p.categoryName|| p.category || "").toLowerCase().includes(q);
      const matchStatus = status === "All" || p.status === status;
      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  const activeCount     = products.filter(p => p.status === "ACTIVE").length;
  const lowStockCount   = products.filter(isLowStock).length;
  const outStockCount   = products.filter(isOutOfStock).length;

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setToggling(product.id);
    try {
      await updateProductStatus(product.id, newStatus);
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, status: newStatus } : p
      ));
    } catch { alert("Failed to update status"); }
    finally { setToggling(null); }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product.id);
    try {
      await deleteProduct(product.id);
      setProducts(prev => prev.filter(p => p.id !== product.id));
    } catch { alert("Failed to delete product"); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalog Atelier"
        title="Products"
        description="Manage fragrance catalog with sizes (6ml / 15ml / 30ml), ML stock, and inspired-by details."
        action={
          <button
            onClick={() => setActivePage?.("addProduct")}
            className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5"
          >
            + Add Product
          </button>
        }
      />

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Products" value={products.length}  helper="All catalog items"       icon="◈" />
        <AdminStatCard label="Active"         value={activeCount}      helper="Visible in storefront"   icon="✦" />
        <AdminStatCard label="Low Stock"      value={lowStockCount}    helper="Any size below 10 units" icon="!" tone="bronze" />
        <AdminStatCard label="Out of Stock"   value={outStockCount}    helper="All sizes sold out"      icon="×" tone="dark" />
      </section>

      <AdminCard>
        {/* Filters */}
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, inspired by, or category..."
          />
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
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
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="animate-pulse flex gap-4 px-6 py-5">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--warm)]" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-[var(--warm)] rounded w-1/3" />
                    <div className="h-3 bg-[var(--warm)] rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  setActivePage={setActivePage}
                  toggling={toggling}
                  deleting={deleting}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))
            ) : (
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

function ProductRow({ product, setActivePage, toggling, deleting, onToggleStatus, onDelete }) {
  const out  = isOutOfStock(product);
  const low  = isLowStock(product);
  const sizes = getSizes(product);

  return (
    <div className="grid gap-5 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr_auto] xl:items-center">

      {/* Product info */}
      <div className="flex items-center gap-4">
        <img
          src={primaryImg(product)}
          alt={product.name}
          className="h-16 w-16 rounded-2xl object-cover shadow-md bg-[var(--warm)]"
          onError={e => { e.target.src = ""; e.target.style.background = "var(--warm)"; }}
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-[var(--ink)]">{product.name}</p>
            {product.combo && (
              <span style={{ fontSize: "0.55rem", padding: "1px 7px", background: "var(--plum)", color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Combo
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[var(--mist)]">
            #{product.id} · Added {formatDate(product.createdAt)}
          </p>
          {sizes.length > 0 && (
            <p className="mt-0.5 text-xs italic" style={{ color: "var(--gold-dark)" }}>
              from {formatCurrency(minPrice(product))}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <p className="text-sm text-[var(--mist)]">
        {product.categoryName || product.category || "—"}
      </p>

      {/* Inspired by */}
      <p className="text-xs text-[var(--mist)] italic leading-5">
        {product.inspiredBy || "—"}
      </p>

      {/* Sizes & stock */}
      <div className="flex flex-col gap-1">
        {sizes.length > 0 ? sizes.map(s => (
          <div key={s.ml || s.id} className="flex items-center gap-2">
            <span style={{ fontFamily: "monospace", fontSize: "0.68rem", fontWeight: 600, color: "var(--ink)", minWidth: "28px" }}>
              {s.ml}ml
            </span>
            <span style={{
              fontSize: "0.7rem", fontWeight: 500,
              color: s.stock === 0 ? "#9b3a3a" : s.stock < 10 ? "#8f5f24" : "var(--gold-dark)",
            }}>
              {s.stock === 0 ? "Sold out" : `${s.stock} units`}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--mist)" }}>
              · {formatCurrency(s.price)}
            </span>
          </div>
        )) : (
          <p className="text-xs text-[var(--mist)]">No sizes</p>
        )}
      </div>

      {/* Status badges */}
      <div className="flex flex-col gap-1.5">
        <AdminBadge value={product.status} />
        {out && <AdminBadge value="OUT_OF_STOCK" />}
        {!out && low && <AdminBadge value="LOW_STOCK" />}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 flex-wrap">
        {/* Toggle active/inactive */}
        <button
          disabled={toggling === product.id}
          onClick={() => onToggleStatus(product)}
          className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)] disabled:opacity-50"
        >
          {toggling === product.id ? "…"
            : product.status === "ACTIVE" ? "Deactivate" : "Activate"}
        </button>

        {/* Edit */}
        <button
          onClick={() => setActivePage?.("addProduct")}
          className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
        >
          Edit
        </button>

        {/* Delete */}
        <button
          disabled={deleting === product.id}
          onClick={() => onDelete(product)}
          className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-400 transition hover:border-red-400 hover:text-red-600 disabled:opacity-50"
        >
          {deleting === product.id ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}