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
import { AdminField, AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import {
  getAdminCustomerTypes,
  createCustomerType,
  updateCustomerType,
  toggleCustomerTypeStatus,
  deleteCustomerType,
} from "../../services/adminService";

const STATUSES = ["All", "ACTIVE", "INACTIVE"];
const COLUMNS = "1.6fr 1fr 1fr auto";

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

const emptyCreateForm = { name: "", displayOrder: "0" };

export default function AdminCustomerTypes() {
  const [types,     setTypes]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalMode,  setModalMode]  = useState(null); // null | "create" | "edit"
  const [editingType, setEditingType] = useState(null);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError,   setRowError]   = useState("");

  const fetchTypes = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAdminCustomerTypes()
      .then((data) => setTypes((data || []).sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))))
      .catch((err) => {
        setTypes([]);
        setLoadError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return types.filter((t) => {
      const matchSearch = !q || (t.name || "").toLowerCase().includes(q);
      const status = t.active ? "ACTIVE" : "INACTIVE";
      const matchStatus = statusFilter === "All" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [types, search, statusFilter]);

  const activeCount   = types.filter((t) => t.active).length;
  const inactiveCount = types.filter((t) => !t.active).length;

  const openCreate = () => { setEditingType(null); setModalMode("create"); };
  const openEdit   = (type) => { setEditingType(type); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditingType(null); };

  const handleSaved = () => {
    closeModal();
    fetchTypes();
  };

  const handleToggleStatus = async (type) => {
    const deactivating = type.active;
    if (!window.confirm(`${deactivating ? "Deactivate" : "Activate"} "${type.name}"? ${deactivating ? "It will no longer be selectable when editing a customer." : "It will become selectable when editing a customer."}`)) {
      return;
    }
    setRowError("");
    setTogglingId(type.id);
    try {
      const updated = await toggleCustomerTypeStatus(type.id);
      setTypes((prev) => prev.map((t) => (t.id === type.id ? { ...t, active: updated?.active ?? !deactivating } : t)));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`Delete "${type.name}"? Customers already assigned this type will keep showing it until reassigned. This cannot be undone.`)) {
      return;
    }
    setRowError("");
    setDeletingId(type.id);
    try {
      await deleteCustomerType(type.id);
      setTypes((prev) => prev.filter((t) => t.id !== type.id));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Clientele"
        title="Customer Types"
        description="Configure the customer-type options available when editing a customer."
        action={
          <AdminButton variant="primary" onClick={openCreate}>
            + Add Customer Type
          </AdminButton>
        }
      />

      <section className="grid gap-5 md:grid-cols-3">
        <AdminStatCard label="Total Types" value={types.length}   helper="All configured types" icon="◈" />
        <AdminStatCard label="Active"      value={activeCount}    helper="Selectable in Edit"   icon="✦" />
        <AdminStatCard label="Inactive"    value={inactiveCount}  helper="Hidden from Edit"     icon="!" tone="bronze" />
      </section>

      <AdminCard>
        {rowError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {rowError}
          </div>
        )}

        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
          <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUSES} />
        </div>

        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Name</span>
            <span>Display Order</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
            ) : loadError ? (
              <AdminEmptyState icon="!" title="Couldn't load customer types" description={loadError} actionLabel="Try again" onAction={fetchTypes} />
            ) : filtered.length > 0 ? (
              filtered.map((type) => (
                <AdminTableRow key={type.id} columns={COLUMNS}>
                  <p className="truncate text-sm font-medium text-gray-900">{type.name}</p>
                  <p className="text-sm text-gray-500">{type.displayOrder ?? 0}</p>
                  <div><AdminBadge value={type.active ? "ACTIVE" : "INACTIVE"} /></div>
                  <div className="flex items-center justify-end gap-1.5">
                    <AdminButton size="sm" variant="secondary" onClick={() => openEdit(type)}>Edit</AdminButton>
                    <AdminActionMenu
                      items={[
                        { label: togglingId === type.id ? "Working…" : type.active ? "Deactivate" : "Activate", onClick: () => handleToggleStatus(type), disabled: togglingId === type.id },
                        { label: deletingId === type.id ? "Working…" : "Delete", onClick: () => handleDelete(type), disabled: deletingId === type.id, danger: true },
                      ]}
                    />
                  </div>
                </AdminTableRow>
              ))
            ) : types.length === 0 ? (
              <AdminEmptyState icon="◈" title="No customer types yet" description="Add the first type to make it available in Customer Edit." />
            ) : (
              <AdminEmptyState icon="◈" title="No customer types found" description="Try changing your search or filter options." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>

      {modalMode && (
        <TypeFormModal
          mode={modalMode}
          type={editingType}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function TypeFormModal({ mode, type, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    isEdit
      ? { name: type?.name || "", displayOrder: String(type?.displayOrder ?? 0) }
      : emptyCreateForm
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError,   setFormError]   = useState("");
  const [saving,        setSaving]     = useState(false);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.displayOrder !== "" && Number.isNaN(Number(form.displayOrder))) errors.displayOrder = "Must be a number";
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
        name: form.name.trim(),
        displayOrder: form.displayOrder === "" ? 0 : Number(form.displayOrder),
      };

      if (isEdit) {
        await updateCustomerType(type.id, payload);
      } else {
        await createCustomerType(payload);
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
      title={isEdit ? "Edit Customer Type" : "Add Customer Type"}
      description={isEdit ? `Update ${type?.name}.` : "Add a new customer-type option."}
      onClose={onClose}
      closeDisabled={saving}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <AdminField label="Name" value={form.name} onChange={setField("name")} placeholder="e.g. Wholesale" required error={fieldErrors.name} />

        <AdminField label="Display Order" type="number" value={form.displayOrder} onChange={setField("displayOrder")} placeholder="0" error={fieldErrors.displayOrder} />

        <div className="flex justify-end gap-3 pt-2">
          <AdminButton type="button" variant="secondary" onClick={onClose} disabled={saving}>Cancel</AdminButton>
          <AdminButton type="submit" variant="primary" loading={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Customer Type"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
