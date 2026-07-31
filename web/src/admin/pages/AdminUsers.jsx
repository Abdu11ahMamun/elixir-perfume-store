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
import { AdminField, AdminSelectField, AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import {
  getAdminUsers,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../../services/adminService";
import { formatDate } from "../utils/adminFormat";

const ROLES    = ["All", "ADMIN", "CUSTOMER"];
const STATUSES = ["All", "ACTIVE", "BLOCKED", "DELETED"];
const COLUMNS  = "1.6fr 1fr 0.8fr 0.9fr 1fr auto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const emptyCreateForm = { name: "", email: "", phone: "", password: "", role: "CUSTOMER" };

export default function AdminUsers() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [loadError,  setLoadError]  = useState("");

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modalMode,  setModalMode]  = useState(null); // null | "create" | "edit"
  const [editingUser, setEditingUser] = useState(null);

  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [rowError,   setRowError]   = useState(""); // block/delete errors surfaced above the table

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAdminUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => {
        setUsers([]);
        setLoadError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Client-side search + filters ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q ||
        (u.name  || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q);
      const matchRole   = roleFilter   === "All" || u.role   === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const adminCount    = users.filter((u) => u.role === "ADMIN").length;
  const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
  const blockedCount  = users.filter((u) => u.status === "BLOCKED").length;

  // ── Create / Edit modal ──
  const openCreate = () => { setEditingUser(null); setModalMode("create"); };
  const openEdit   = (user) => { setEditingUser(user); setModalMode("edit"); };
  const closeModal = () => { setModalMode(null); setEditingUser(null); };

  const handleSaved = () => {
    closeModal();
    fetchUsers();
  };

  // ── Block / Unblock ──
  const handleToggleStatus = async (user) => {
    const blocking = user.status === "ACTIVE";
    if (!window.confirm(`${blocking ? "Block" : "Unblock"} "${user.name}"? ${blocking ? "They will immediately lose access to their account." : "They will regain access to their account."}`)) {
      return;
    }

    setRowError("");
    setTogglingId(user.id);
    try {
      const updated = await toggleUserStatus(user.id);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: updated?.status ?? (blocking ? "BLOCKED" : "ACTIVE") } : u)));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──
  const handleDelete = async (user) => {
    if (!window.confirm(`Delete "${user.name}"? They will permanently lose access to their account. This cannot be undone.`)) {
      return;
    }

    setRowError("");
    setDeletingId(user.id);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setRowError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Access"
        title="Users"
        description="Manage admin and customer accounts, roles, and access status."
        action={
          <AdminButton variant="primary" onClick={openCreate}>
            + Create User
          </AdminButton>
        }
      />

      {/* Stats */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Users" value={users.length}    helper="All non-deleted accounts" icon="☉" />
        <AdminStatCard label="Admins"      value={adminCount}      helper="Staff with panel access"  icon="✦" tone="dark" />
        <AdminStatCard label="Customers"   value={customerCount}   helper="Registered buyers"        icon="◈" />
        <AdminStatCard label="Blocked"     value={blockedCount}    helper="Access currently revoked" icon="!" tone="bronze" />
      </section>

      <AdminCard>
        {/* Row-action error banner (block/delete failures — self-lockout, last-admin protection, etc.) */}
        {rowError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {rowError}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or phone..."
          />
          <AdminSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} options={ROLES} />
          <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUSES} />
        </div>

        {/* Table */}
        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>User</span>
            <span>Phone</span>
            <span>Role</span>
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
                title="Couldn't load users"
                description={loadError}
                actionLabel="Try again"
                onAction={fetchUsers}
              />
            ) : filtered.length > 0 ? (
              filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  toggling={togglingId === user.id}
                  deleting={deletingId === user.id}
                  onEdit={() => openEdit(user)}
                  onToggleStatus={() => handleToggleStatus(user)}
                  onDelete={() => handleDelete(user)}
                />
              ))
            ) : users.length === 0 ? (
              <AdminEmptyState icon="☉" title="No users yet" description="Create the first admin or customer account to get started." />
            ) : (
              <AdminEmptyState icon="☉" title="No users found" description="Try changing your search or filter options." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>

      {modalMode && (
        <UserFormModal
          mode={modalMode}
          user={editingUser}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function UserRow({ user, toggling, deleting, onEdit, onToggleStatus, onDelete }) {
  const initials = (user.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("");
  const isDeleted = user.status === "DELETED";

  return (
    <AdminTableRow columns={COLUMNS}>
      {/* User */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{user.email || "—"}</p>
        </div>
      </div>

      {/* Phone */}
      <p className="text-sm text-gray-500">{user.phone || "—"}</p>

      {/* Role */}
      <div><AdminBadge value={user.role} /></div>

      {/* Status */}
      <div><AdminBadge value={user.status} /></div>

      {/* Created */}
      <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={onEdit} disabled={isDeleted}>
          Edit
        </AdminButton>
        <AdminActionMenu
          items={[
            { label: toggling ? "Working…" : user.status === "ACTIVE" ? "Block" : "Unblock", onClick: onToggleStatus, disabled: toggling || isDeleted },
            { label: deleting ? "Working…" : "Delete", onClick: onDelete, disabled: deleting || isDeleted, danger: true },
          ]}
        />
      </div>
    </AdminTableRow>
  );
}

/* ─── Create / Edit modal ──────────────────────────────── */

function UserFormModal({ mode, user, onClose, onSaved }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    isEdit
      ? { name: user?.name || "", email: user?.email || "", phone: user?.phone || "", role: user?.role || "CUSTOMER" }
      : emptyCreateForm
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError,   setFormError]   = useState("");
  const [saving,       setSaving]     = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errors = {};
    if (!form.name.trim())  errors.name  = "Name is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    if (!form.role)         errors.role  = "Role is required";
    if (form.email && !EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address";
    if (form.role === "ADMIN" && !form.email.trim()) errors.email = "Email is required for admin users";
    if (!isEdit) {
      if (!form.password || form.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }
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
      if (isEdit) {
        // Only editable fields — password and status are handled elsewhere / not supported here.
        await updateUser(user.id, {
          name:  form.name,
          email: form.email || null,
          phone: form.phone,
          role:  form.role,
        });
      } else {
        await createUser({
          name:     form.name,
          email:    form.email || null,
          phone:    form.phone,
          password: form.password,
          role:     form.role,
        });
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
      title={isEdit ? "Edit User" : "Create User"}
      description={isEdit ? `Update details for ${user?.name}.` : "Add a new admin or customer account."}
      onClose={onClose}
      closeDisabled={saving}
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </div>
        )}

        <AdminField label="Name" value={form.name} onChange={set("name")} placeholder="Jane Doe" required error={fieldErrors.name} />

        <AdminField
          label={`Email${form.role === "ADMIN" ? " (required for admins)" : " (optional)"}`}
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="jane@elixir.com"
          error={fieldErrors.email}
        />

        <AdminField label="Phone" value={form.phone} onChange={set("phone")} placeholder="+8801700000000" required error={fieldErrors.phone} />

        {!isEdit && (
          <AdminField label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Minimum 8 characters" required error={fieldErrors.password} />
        )}

        <AdminSelectField
          label="Role"
          value={form.role}
          onChange={set("role")}
          options={[{ value: "CUSTOMER", label: "CUSTOMER" }, { value: "ADMIN", label: "ADMIN" }]}
          error={fieldErrors.role}
        />

        {isEdit && (
          <p className="text-xs text-gray-400">
            Password and account status are managed separately — use Block/Unblock in the user list to change status.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <AdminButton type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" variant="primary" loading={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
}
