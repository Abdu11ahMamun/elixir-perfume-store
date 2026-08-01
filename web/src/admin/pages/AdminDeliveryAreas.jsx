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
  getAdminDeliveryAreas,
  createDeliveryArea,
  updateDeliveryArea,
  toggleDeliveryAreaStatus,
  deleteDeliveryArea,
} from "../../services/adminService";
import { formatCurrency } from "../utils/adminFormat";

const STATUSES = ["All", "ACTIVE", "INACTIVE"];
const COLUMNS = "1.4fr 1.2fr 1fr 0.9fr auto";

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

const emptyCreateForm = { district: "", upazila: "", charge: "" };

export default function AdminDeliveryAreas() {
  const [areas,     setAreas]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalMode,  setModalMode]  = useState(null); // null | "create" | "edit"
  const [editingArea, setEditingArea] = useState(null);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError,   setRowError]   = useState("");

  const fetchAreas = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAdminDeliveryAreas()
      .then((data) => setAreas(data || []))
      .catch((err) => {
        setAreas([]);
        setLoadError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAreas(); }, [fetchAreas]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return areas.filter((a) => {
      const matchSearch = !q ||
        (a.district || "").toLowerCase().includes(q) ||
        (a.upazila  || "").toLowerCase().includes(q);
      const status = a.active ? "ACTIVE" : "INACTIVE";
      const matchStatus = statusFilter === "All" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [areas, search, statusFilter]);

  const activeCount    = areas.filter((a) => a.active).length;
  const inactiveCount  = areas.filter((a) => !a.active).length;
  const districtCount  = new Set(areas.map((a) => a.district)).size;

  // ── Create / Edit modal ──
  const openCreate = () => { setEditingArea(null); setModalMode("create"); };
  const openEdit   = (area) => { setEditingArea(area); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditingArea(null); };

  const handleSaved = () => {
    closeModal();
    fetchAreas();
  };

  // ── Toggle active/inactive ──
  const handleToggleStatus = async (area) => {
    const deactivating = area.active;
    const label = area.upazila ? `${area.district} / ${area.upazila}` : `${area.district} (district-wide)`;
    if (!window.confirm(`${deactivating ? "Deactivate" : "Activate"} "${label}"? ${deactivating ? "It will become unavailable at checkout." : "It will become available at checkout."}`)) {
      return;
    }

    setRowError("");
    setTogglingId(area.id);
    try {
      const updated = await toggleDeliveryAreaStatus(area.id);
      setAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, active: updated?.active ?? !deactivating } : a)));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (area) => {
    const label = area.upazila ? `${area.district} / ${area.upazila}` : `${area.district} (district-wide)`;
    if (!window.confirm(`Delete "${label}"? It will no longer be available at checkout. This cannot be undone.`)) {
      return;
    }

    setRowError("");
    setDeletingId(area.id);
    try {
      await deleteDeliveryArea(area.id);
      setAreas((prev) => prev.filter((a) => a.id !== area.id));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Commerce"
        title="Delivery Areas"
        description="Configure districts, upazilas, and the delivery charge applied at checkout."
        action={
          <AdminButton variant="primary" onClick={openCreate}>
            + Add Delivery Area
          </AdminButton>
        }
      />

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Areas"  value={areas.length}    helper="All configured areas"    icon="◈" />
        <AdminStatCard label="Active"       value={activeCount}     helper="Available at checkout"   icon="✦" />
        <AdminStatCard label="Inactive"     value={inactiveCount}   helper="Hidden from checkout"    icon="!" tone="bronze" />
        <AdminStatCard label="Districts"    value={districtCount}   helper="Distinct districts"      icon="◎" tone="dark" />
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
            placeholder="Search by district or upazila..."
          />
          <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUSES} />
        </div>

        {/* Table */}
        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>District</span>
            <span>Upazila</span>
            <span>Charge</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
            ) : loadError ? (
              <AdminEmptyState
                icon="!"
                title="Couldn't load delivery areas"
                description={loadError}
                actionLabel="Try again"
                onAction={fetchAreas}
              />
            ) : filtered.length > 0 ? (
              filtered.map((area) => (
                <AreaRow
                  key={area.id}
                  area={area}
                  toggling={togglingId === area.id}
                  deleting={deletingId === area.id}
                  onEdit={() => openEdit(area)}
                  onToggleStatus={() => handleToggleStatus(area)}
                  onDelete={() => handleDelete(area)}
                />
              ))
            ) : areas.length === 0 ? (
              <AdminEmptyState icon="◈" title="No delivery areas yet" description="Add the first delivery area to enable checkout delivery pricing." />
            ) : (
              <AdminEmptyState icon="◈" title="No delivery areas found" description="Try changing your search or filter options." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>

      {modalMode && (
        <AreaFormModal
          mode={modalMode}
          area={editingArea}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function AreaRow({ area, toggling, deleting, onEdit, onToggleStatus, onDelete }) {
  return (
    <AdminTableRow columns={COLUMNS}>
      {/* District */}
      <p className="truncate text-sm font-medium text-gray-900">{area.district}</p>

      {/* Upazila */}
      <p className="truncate text-sm text-gray-500">
        {area.upazila || <span className="italic text-gray-400">District-wide</span>}
      </p>

      {/* Charge */}
      <p className="text-sm font-semibold text-gray-900">{formatCurrency(area.charge)}</p>

      {/* Status */}
      <div><AdminBadge value={area.active ? "ACTIVE" : "INACTIVE"} /></div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={onEdit}>Edit</AdminButton>
        <AdminActionMenu
          items={[
            { label: toggling ? "Working…" : area.active ? "Deactivate" : "Activate", onClick: onToggleStatus, disabled: toggling },
            { label: deleting ? "Working…" : "Delete", onClick: onDelete, disabled: deleting, danger: true },
          ]}
        />
      </div>
    </AdminTableRow>
  );
}

/* ─── Create / Edit modal ──────────────────────────────── */

function AreaFormModal({ mode, area, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    isEdit
      ? {
          district: area?.district || "",
          upazila:  area?.upazila || "",
          charge:   area?.charge ?? "",
        }
      : emptyCreateForm
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError,   setFormError]   = useState("");
  const [saving,       setSaving]     = useState(false);

  const setField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errors = {};
    if (!form.district.trim()) errors.district = "District is required";
    if (form.charge === "" || form.charge === null) errors.charge = "Charge is required";
    else if (Number.isNaN(Number(form.charge)) || Number(form.charge) < 0) errors.charge = "Charge must be a non-negative number";
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
        district: form.district.trim(),
        upazila:  form.upazila.trim() || null,
        charge:   Number(form.charge),
      };

      if (isEdit) {
        await updateDeliveryArea(area.id, payload);
      } else {
        await createDeliveryArea(payload);
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
      title={isEdit ? "Edit Delivery Area" : "Add Delivery Area"}
      description={isEdit ? `Update ${area?.district}${area?.upazila ? ` / ${area.upazila}` : ""}.` : "Add a district or upazila and its delivery charge."}
      onClose={onClose}
      closeDisabled={saving}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <AdminField label="District" value={form.district} onChange={setField("district")} placeholder="Dhaka" required error={fieldErrors.district} />

        <AdminField label="Upazila (optional)" value={form.upazila} onChange={setField("upazila")} placeholder="Leave blank for a district-wide charge" error={fieldErrors.upazila} />

        <AdminField label="Delivery Charge (৳)" type="number" value={form.charge} onChange={setField("charge")} placeholder="60" required error={fieldErrors.charge} />

        <div className="flex justify-end gap-3 pt-2">
          <AdminButton type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" variant="primary" loading={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Delivery Area"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
