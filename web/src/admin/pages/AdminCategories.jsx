import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
import AdminButton     from "../components/ui/AdminButton";
import AdminModal      from "../components/ui/AdminModal";
import AdminActionMenu from "../components/ui/AdminActionMenu";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { AdminRowSkeleton } from "../components/ui/AdminSkeleton";
import { AdminField, AdminTextArea, AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
  uploadImage,
} from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";
import { formatDate } from "../utils/adminFormat";

const STATUSES = ["All", "ACTIVE", "INACTIVE"];
const COLUMNS = "1.8fr 1.2fr 0.9fr 0.9fr auto";

// ─── Extract a clean, user-facing message from any API error ──
function getErrorMessage(err) {
  const status = err.response?.status;
  const data   = err.response?.data;

  if (data?.validationErrors) {
    const first = Object.values(data.validationErrors).find(Boolean);
    if (first) return first;
  }
  if (typeof data?.message === "string" && data.message) return data.message;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 409) return "This request conflicts with an existing record.";
  if (status >= 500)  return "Something went wrong on the server. Please try again.";
  if (typeof err.message === "string" && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

const slugify = (value) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyCreateForm = { name: "", slug: "", description: "", imageUrl: "" };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState("");

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalMode,    setModalMode]    = useState(null); // null | "create" | "edit"
  const [editingCategory, setEditingCategory] = useState(null);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError,   setRowError]   = useState("");

  const fetchCategories = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAdminCategories()
      .then((data) => setCategories(data || []))
      .catch((err) => {
        setCategories([]);
        setLoadError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ── Client-side search + status filter (this page shows all categories,
  //    including soft-deleted ones the backend still returns via getAll) ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((c) => {
      const matchSearch = !q ||
        (c.name || "").toLowerCase().includes(q) ||
        (c.slug || "").toLowerCase().includes(q);
      const status = c.active ? "ACTIVE" : "INACTIVE";
      const matchStatus = statusFilter === "All" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount   = categories.filter((c) => c.active).length;
  const inactiveCount = categories.filter((c) => !c.active).length;
  const withImageCount = categories.filter((c) => c.imageUrl).length;

  // ── Create / Edit modal ──
  const openCreate = () => { setEditingCategory(null); setModalMode("create"); };
  const openEdit   = (category) => { setEditingCategory(category); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditingCategory(null); };

  const handleSaved = () => {
    closeModal();
    fetchCategories();
  };

  // ── Toggle active/inactive ──
  const handleToggleStatus = async (category) => {
    const deactivating = category.active;
    if (!window.confirm(`${deactivating ? "Deactivate" : "Activate"} "${category.name}"? ${deactivating ? "It will be hidden from the storefront." : "It will become visible on the storefront."}`)) {
      return;
    }

    setRowError("");
    setTogglingId(category.id);
    try {
      const updated = await toggleCategoryStatus(category.id);
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, active: updated?.active ?? !deactivating } : c)));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? It will no longer appear on the storefront. This cannot be undone.`)) {
      return;
    }

    setRowError("");
    setDeletingId(category.id);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Manage storefront categories, descriptions, and their display image."
        action={
          <AdminButton variant="primary" onClick={openCreate}>
            + Create Category
          </AdminButton>
        }
      />

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Categories" value={categories.length} helper="All categories"        icon="◈" />
        <AdminStatCard label="Active"           value={activeCount}      helper="Visible in storefront"  icon="✦" />
        <AdminStatCard label="Inactive"         value={inactiveCount}    helper="Hidden from storefront" icon="!" tone="bronze" />
        <AdminStatCard label="With Image"       value={withImageCount}   helper="Have a display image"   icon="☉" tone="dark" />
      </section>

      <AdminCard>
        {rowError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {rowError}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or slug..."
          />
          <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUSES} />
        </div>

        {/* Table */}
        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Category</span>
            <span>Slug</span>
            <span>Status</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
            ) : loadError ? (
              <AdminEmptyState
                icon="!"
                title="Couldn't load categories"
                description={loadError}
                actionLabel="Try again"
                onAction={fetchCategories}
              />
            ) : filtered.length > 0 ? (
              filtered.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  toggling={togglingId === category.id}
                  deleting={deletingId === category.id}
                  onEdit={() => openEdit(category)}
                  onToggleStatus={() => handleToggleStatus(category)}
                  onDelete={() => handleDelete(category)}
                />
              ))
            ) : categories.length === 0 ? (
              <AdminEmptyState icon="◈" title="No categories yet" description="Create the first category to get started." />
            ) : (
              <AdminEmptyState icon="◈" title="No categories found" description="Try changing your search or filter options." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>

      {modalMode && (
        <CategoryFormModal
          mode={modalMode}
          category={editingCategory}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function CategoryRow({ category, toggling, deleting, onEdit, onToggleStatus, onDelete }) {
  return (
    <AdminTableRow columns={COLUMNS}>
      {/* Category */}
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={buildImageUrl(category.imageUrl)}
          alt={category.name}
          className="h-11 w-11 shrink-0 rounded-lg bg-gray-100 object-cover"
          onError={(e) => { e.target.src = ""; e.target.style.background = "#f3f4f6"; }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{category.name}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{category.description || "—"}</p>
        </div>
      </div>

      {/* Slug */}
      <p className="truncate font-mono text-sm text-gray-500">{category.slug}</p>

      {/* Status */}
      <div><AdminBadge value={category.active ? "ACTIVE" : "INACTIVE"} /></div>

      {/* Created */}
      <p className="text-sm text-gray-500">{formatDate(category.createdAt)}</p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={onEdit}>Edit</AdminButton>
        <AdminActionMenu
          items={[
            { label: toggling ? "Working…" : category.active ? "Deactivate" : "Activate", onClick: onToggleStatus, disabled: toggling },
            { label: deleting ? "Working…" : "Delete", onClick: onDelete, disabled: deleting, danger: true },
          ]}
        />
      </div>
    </AdminTableRow>
  );
}

/* ─── Create / Edit modal ──────────────────────────────── */

function CategoryFormModal({ mode, category, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    isEdit
      ? {
          name: category?.name || "",
          slug: category?.slug || "",
          description: category?.description || "",
          imageUrl: category?.imageUrl || "",
        }
      : emptyCreateForm
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [preview,      setPreview]     = useState(category?.imageUrl ? buildImageUrl(category.imageUrl) : "");
  const [uploading,    setUploading]   = useState(false);
  const [fieldErrors,  setFieldErrors] = useState({});
  const [formError,    setFormError]   = useState("");
  const [saving,        setSaving]     = useState(false);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }));
  };

  const handleSlugChange = (e) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setFormError("");

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const relativePath = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: relativePath }));
      setPreview(buildImageUrl(relativePath));
    } catch (err) {
      setFormError(err.message || "Image upload failed");
      setPreview(category?.imageUrl ? buildImageUrl(category.imageUrl) : "");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: "" }));
    setPreview("");
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.slug.trim()) errors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
      };

      if (isEdit) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors) {
        setFieldErrors((prev) => ({ ...prev, ...data.validationErrors }));
        setFormError("Please fix the errors below.");
      } else {
        setFormError(getErrorMessage(err));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      title={isEdit ? "Edit Category" : "Create Category"}
      description={isEdit ? `Update details for ${category?.name}.` : "Add a new storefront category."}
      onClose={onClose}
      closeDisabled={saving}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <AdminField label="Name" value={form.name} onChange={handleNameChange} placeholder="For Him" required error={fieldErrors.name} />

        <AdminField label="Slug" value={form.slug} onChange={handleSlugChange} placeholder="for-him" required error={fieldErrors.slug} />

        <AdminTextArea label="Description (optional)" rows={3} value={form.description} onChange={setField("description")} placeholder="Perfumes for men" />

        {/* Image upload */}
        <div>
          <span className="mb-1.5 block text-xs font-medium text-gray-600">Category Image</span>

          {preview && (
            <div className="relative mb-3 inline-block">
              <img src={preview} alt="" className="h-20 w-20 rounded-lg object-cover" />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </div>
              )}
              {!uploading && (
                <button type="button" onClick={removeImage}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  ×
                </button>
              )}
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-500 transition hover:border-gray-400">
              {uploading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c9a96e]/30 border-t-[var(--gold)]" />
              ) : "📎"}
              {uploading ? "Uploading…" : preview ? "Replace Image" : "Upload Image"}
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
            />
          </label>
          <p className="mt-1.5 text-[11px] text-gray-400">
            JPG, PNG, WebP · Max 5MB · Falls back to a default image when omitted
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <AdminButton type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" variant="primary" loading={saving} disabled={uploading}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
