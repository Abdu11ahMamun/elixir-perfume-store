import { useCallback, useEffect, useMemo, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar  from "../components/ui/AdminSearchBar";
import AdminStatCard   from "../components/ui/AdminStatCard";
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
    const verb = blocking ? "block" : "unblock";
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Access Atelier"
        title="Users"
        description="Manage admin and customer accounts, roles, and access status."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5"
          >
            + Create User
          </button>
        }
      />

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Users" value={users.length}    helper="All non-deleted accounts" icon="☉" />
        <AdminStatCard label="Admins"      value={adminCount}      helper="Staff with panel access"  icon="✦" tone="dark" />
        <AdminStatCard label="Customers"   value={customerCount}   helper="Registered buyers"        icon="◈" />
        <AdminStatCard label="Blocked"     value={blockedCount}    helper="Access currently revoked" icon="!" tone="bronze" />
      </section>

      <AdminCard>
        {/* Row-action error banner (block/delete failures — self-lockout, last-admin protection, etc.) */}
        {rowError && (
          <div className="mb-6 rounded-2xl p-4 text-sm" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", color: "#b91c1c" }}>
            {rowError}
          </div>
        )}

        {/* Filters */}
        <div className="mb-7 grid gap-4 xl:grid-cols-[1fr_auto_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or phone..."
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-full border border-[var(--gold)]/20 bg-white px-5 py-3 text-sm outline-none focus:border-[var(--gold)]">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[2rem] border border-[var(--gold)]/10">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] gap-4 bg-[#0b0805] px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)] xl:grid">
            <span>User</span>
            <span>Phone</span>
            <span>Role</span>
            <span>Status</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-[var(--gold)]/10 bg-[#fffcf8]">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4 px-6 py-5">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--warm)]" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-[var(--warm)] rounded w-1/3" />
                    <div className="h-3 bg-[var(--warm)] rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : loadError ? (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">Couldn't load users</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">{loadError}</p>
                <button
                  onClick={fetchUsers}
                  className="mt-5 rounded-full bg-[#0b0805] px-6 py-2.5 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
                >
                  Try again
                </button>
              </div>
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
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No users yet</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Create the first admin or customer account to get started.</p>
              </div>
            ) : (
              <div className="p-10 text-center">
                <h3 className="font-display text-4xl font-light">No users found</h3>
                <p className="mt-2 text-sm text-[var(--mist)]">Try changing your search or filter options.</p>
              </div>
            )}
          </div>
        </div>
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
    <div className="grid gap-4 px-6 py-5 transition hover:bg-[var(--warm)]/40 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
      {/* User */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--warm)] font-display text-xl text-[var(--gold-dark)]">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--ink)] truncate">{user.name}</p>
          <p className="mt-0.5 text-xs text-[var(--mist)] truncate">{user.email || "—"}</p>
        </div>
      </div>

      {/* Phone */}
      <p className="text-sm text-[var(--mist)]">{user.phone || "—"}</p>

      {/* Role */}
      <div><AdminBadge value={user.role} /></div>

      {/* Status */}
      <div><AdminBadge value={user.status} /></div>

      {/* Created */}
      <p className="text-sm text-[var(--mist)]">{formatDate(user.createdAt)}</p>

      {/* Actions */}
      <div className="flex justify-end gap-2 flex-wrap">
        <button
          onClick={onEdit}
          disabled={isDeleted}
          className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Edit
        </button>

        <button
          disabled={toggling || isDeleted}
          onClick={onToggleStatus}
          className="rounded-full border border-[var(--gold)]/20 px-4 py-2 text-xs text-[var(--mist)] transition hover:border-[var(--gold)] hover:text-[var(--gold-dark)] disabled:opacity-50"
        >
          {toggling ? "…" : user.status === "ACTIVE" ? "Block" : "Unblock"}
        </button>

        <button
          disabled={deleting || isDeleted}
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
              {isEdit ? "Edit User" : "Create User"}
            </h3>
            <p className="mt-1 text-sm text-[var(--mist)]">
              {isEdit ? `Update details for ${user?.name}.` : "Add a new admin or customer account."}
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

          <Field label="Name" value={form.name} onChange={set("name")} placeholder="Jane Doe" required error={fieldErrors.name} />

          <Field
            label={`Email${form.role === "ADMIN" ? " (required for admins)" : " (optional)"}`}
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@elixir.com"
            error={fieldErrors.email}
          />

          <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+8801700000000" required error={fieldErrors.phone} />

          {!isEdit && (
            <Field label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Minimum 8 characters" required error={fieldErrors.password} />
          )}

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">Role</span>
            <select
              value={form.role}
              onChange={set("role")}
              className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
            >
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {fieldErrors.role && <p className="mt-1.5 text-xs text-red-500">{fieldErrors.role}</p>}
          </label>

          {isEdit && (
            <p className="text-xs text-[var(--mist)]">
              Password and account status are managed separately — use Block/Unblock in the user list to change status.
            </p>
          )}

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
              disabled={saving}
              className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === "password" ? "new-password" : "off"}
        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
        style={{ borderColor: error ? "#e08a8a" : "rgba(201,169,110,0.2)" }}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </label>
  );
}
