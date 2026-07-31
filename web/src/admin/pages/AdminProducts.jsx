import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import AdminButton     from "../components/ui/AdminButton";
import AdminActionMenu from "../components/ui/AdminActionMenu";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { AdminRowSkeleton } from "../components/ui/AdminSkeleton";
import { AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import {
  getAdminProducts,
  updateProductStatus,
  deleteProduct,
} from "../../services/adminService";
import { getProductThumbnail } from "../utils/productImage";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const STATUSES = ["All", "ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED"];
const COLUMNS = "2fr 1fr 1.4fr 1.4fr 1fr auto";

// ─── Helpers ──────────────────────────────────────────────
const getSizes    = (p) => p.sizes || [];
const minPrice    = (p) => getSizes(p).length ? Math.min(...getSizes(p).map(s => s.price)) : 0;
const isLowStock  = (p) => getSizes(p).some(s => s.stock > 0 && s.stock < 10);
const isOutOfStock= (p) => getSizes(p).length > 0 && getSizes(p).every(s => s.stock === 0);
const primaryImg  = getProductThumbnail;

export default function AdminProducts({ setActivePage, onEdit }) {
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
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage fragrance catalog with sizes (6ml / 15ml / 30ml), stock, and inspired-by details."
        action={
          <AdminButton variant="primary" onClick={() => setActivePage?.("addProduct")}>
            + Add Product
          </AdminButton>
        }
      />

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Products" value={products.length}  helper="All catalog items"       icon="◈" />
        <AdminStatCard label="Active"         value={activeCount}      helper="Visible in storefront"   icon="✦" />
        <AdminStatCard label="Low Stock"      value={lowStockCount}    helper="Any size below 10 units" icon="!" tone="bronze" />
        <AdminStatCard label="Out of Stock"   value={outStockCount}    helper="All sizes sold out"      icon="×" tone="dark" />
      </section>

      <AdminCard>
        {/* Filters */}
        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, inspired by, or category..."
          />
          <AdminSelect value={status} onChange={e => setStatus(e.target.value)} options={STATUSES} />
        </div>

        {/* Table */}
        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Product</span>
            <span>Category</span>
            <span>Inspired By</span>
            <span>Sizes & Stock</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
            ) : filtered.length > 0 ? (
              filtered.map(product => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={onEdit}
                  toggling={toggling}
                  deleting={deleting}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <AdminEmptyState icon="◈" title="No products found" description="Try changing search or filter options." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}

function ProductRow({ product, onEdit, toggling, deleting, onToggleStatus, onDelete }) {
  const out  = isOutOfStock(product);
  const low  = isLowStock(product);
  const sizes = getSizes(product);

  return (
    <AdminTableRow columns={COLUMNS}>
      {/* Product info */}
      <div className="flex items-center gap-3">
        <img
          src={primaryImg(product)}
          alt={product.name}
          className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover"
          onError={e => { e.target.src = ""; e.target.style.background = "#f3f4f6"; }}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
            {product.combo && <AdminBadge value="COMBO" tone="gold" />}
          </div>
          <p className="mt-0.5 text-xs text-gray-400">
            #{product.id} · Added {formatDate(product.createdAt)}
          </p>
          {sizes.length > 0 && (
            <p className="mt-0.5 text-xs text-[var(--gold-dark)]">
              from {formatCurrency(minPrice(product))}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <p className="text-sm text-gray-500">
        {product.categoryName || product.category || "—"}
      </p>

      {/* Inspired by */}
      <p className="text-xs italic leading-5 text-gray-500">
        {product.inspiredBy || "—"}
      </p>

      {/* Sizes & stock */}
      <div className="flex flex-col gap-1">
        {sizes.length > 0 ? sizes.map(s => (
          <div key={s.ml || s.id} className="flex items-center gap-2 text-xs">
            <span className="min-w-[28px] font-mono font-semibold text-gray-700">
              {s.ml}ml
            </span>
            <span className={`font-medium ${s.stock === 0 ? "text-red-600" : s.stock < 10 ? "text-amber-600" : "text-gray-600"}`}>
              {s.stock === 0 ? "Sold out" : `${s.stock} units`}
            </span>
            <span className="text-gray-400">
              · {formatCurrency(s.price)}
            </span>
          </div>
        )) : (
          <p className="text-xs text-gray-400">No sizes</p>
        )}
      </div>

      {/* Status badges */}
      <div className="flex flex-col items-start gap-1.5">
        <AdminBadge value={product.status} />
        {out && <AdminBadge value="OUT_OF_STOCK" />}
        {!out && low && <AdminBadge value="LOW_STOCK" />}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={() => onEdit?.(product.id)}>
          Edit
        </AdminButton>
        <AdminActionMenu
          items={[
            { label: toggling === product.id ? "Working…" : product.status === "ACTIVE" ? "Deactivate" : "Activate", onClick: () => onToggleStatus(product), disabled: toggling === product.id },
            { label: deleting === product.id ? "Working…" : "Delete", onClick: () => onDelete(product), disabled: deleting === product.id, danger: true },
          ]}
        />
      </div>
    </AdminTableRow>
  );
}
