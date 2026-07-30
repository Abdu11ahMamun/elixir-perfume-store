import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalog Atelier"
        title="Categories"
        description="Manage storefront categories, descriptions, and their display image."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5"
          >
            + Create Category
          </button>
        }
      />

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Categories" value={categories.length} helper="All categories"        icon="◈" />
        <AdminStatCard label="Active"           value={activeCount}      helper="Visible in storefront"  icon="✦" />
        <AdminStatCard label="Inactive"         value={inactiveCount}    helper="Hidden from storefront" icon="!" tone="bronze" />
        <AdminStatCard label="With Image"       value={withImageCount}   helper="Have a display image"   icon="☉" tone="dark" />
      </section>

      <AdminCard>
        {rowError && (
          <div className="mb-6 rounded-2xl p-4 text-sm" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", color: "#b91c1c" }}>
            {rowError}
          </div>
        )}

        {/* Filters */}
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or slug..."
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1.8fr_1.4fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>Category</span>
            <span>Slug</span>
            <span>Status</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4 px-6 py-5">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--warm)]" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-[var(--warm)] rounded w-1/3" />
                    <div className="h-3 bg-[var(--warm)] rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : loadError ? (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">Couldn't load categories</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">{loadError}</p>
                <button
                  onClick={fetchCategories}
                  className="mt-5 rounded-full bg-[#0b0805] px-6 py-2.5 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
                >
                  Try again
                </button>
              </div>
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
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No categories yet</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Create the first category to get started.</p>
              </div>
            ) : (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No categories found</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Try changing your search or filter options.</p>
              </div>
            )}
          </div>
        </div>
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
    <div className="grid gap-4 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1.8fr_1.4fr_1fr_1fr_auto] xl:items-center">
      {/* Category */}
      <div className="flex items-center gap-4 min-w-0">
        <img
          src={buildImageUrl(category.imageUrl)}
          alt={category.name}
          className="w-14 h-14 rounded-2xl object-cover shadow-md bg-[var(--warm)] shrink-0"
          onError={(e) => { e.target.src = ""; e.target.style.background = "var(--warm)"; }}
        />
        <div className="min-w-0">
          <p className="font-semibold text-[var(--ink)] truncate">{category.name}</p>
          <p className="mt-0.5 text-xs text-[var(--mist)] truncate">{category.description || "—"}</p>
        </div>
      </div>

      {/* Slug */}
      <p className="text-sm text-[var(--mist)] font-mono">{category.slug}</p>

      {/* Status */}
      <div><AdminBadge value={category.active ? "ACTIVE" : "INACTIVE"} /></div>

      {/* Created */}
      <p className="text-sm text-[var(--mist)]">{formatDate(category.createdAt)}</p>

      {/* Actions */}
      <div className="flex justify-end gap-2 flex-wrap">
        <button
          onClick={onEdit}
          className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
        >
          Edit
        </button>

        <button
          disabled={toggling}
          onClick={onToggleStatus}
          className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)] disabled:opacity-50"
        >
          {toggling ? "…" : category.active ? "Deactivate" : "Activate"}
        </button>

        <button
          disabled={deleting}
          onClick={onDelete}
          className="rounded-full border border-red-200 px-4 py-2 text-xs text-red-400 transition hover:border-red-400 hover:text-red-600 disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={saving ? undefined : onClose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] border border-[var(--gold)]/15 bg-[#fffcf8] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--gold)]/10 px-7 py-6">
          <div>
            <h3 className="font-display text-3xl font-light text-[var(--ink)]">
              {isEdit ? "Edit Category" : "Create Category"}
            </h3>
            <p className="mt-1 text-sm text-[var(--mist)]">
              {isEdit ? `Update details for ${category?.name}.` : "Add a new storefront category."}
            </p>
          </div>
          <button
            type="button"
            onClick={saving ? undefined : onClose}
            className="rounded-full border border-[var(--gold)]/20 w-9 h-9 flex items-center justify-center text-[var(--mist)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)] transition shrink-0"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {formError && (
            <div className="rounded-2xl p-4 text-sm" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", color: "#b91c1c" }}>
              {formError}
            </div>
          )}

          <Field label="Name" value={form.name} onChange={handleNameChange} placeholder="For Him" required error={fieldErrors.name} />

          <Field label="Slug" value={form.slug} onChange={handleSlugChange} placeholder="for-him" required error={fieldErrors.slug} />

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">Description (optional)</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={setField("description")}
              placeholder="Perfumes for men"
              className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
            />
          </label>

          {/* Image upload */}
          <div>
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">Category Image</span>

            {preview && (
              <div className="relative inline-block mb-3">
                <img src={preview} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl">
                    <span className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(245,240,232,0.4)", borderTopColor: "#fff" }} />
                  </div>
                )}
                {!uploading && (
                  <button type="button" onClick={removeImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    ×
                  </button>
                )}
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="flex items-center gap-2 rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-2.5 text-sm text-[var(--mist)] hover:border-[var(--gold)] transition">
                {uploading ? (
                  <span className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(201,169,110,0.3)", borderTopColor: "var(--gold)" }} />
                ) : "📎"}
                {uploading ? "Uploading…" : preview ? "Replace Image" : "Upload Image"}
              </div>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
              />
            </label>
            <p className="mt-1.5 text-[10px] text-[var(--mist)]">
              JPG, PNG, WebP · Max 5MB · Falls back to a default image when omitted
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-[var(--gold)]/20 px-6 py-3 text-sm text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
        style={{ borderColor: error ? "#e08a8a" : "rgba(201,169,110,0.2)" }}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </label>
  );
}
