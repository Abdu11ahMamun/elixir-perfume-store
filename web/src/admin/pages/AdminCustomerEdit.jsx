import { useEffect, useState } from "react";
import AdminBadge      from "../components/ui/AdminBadge";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton     from "../components/ui/AdminButton";
import { AdminField, AdminTextArea, AdminSelectField } from "../components/ui/AdminInput";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
import {
  getCustomerById,
  updateCustomer,
  getAdminCustomerTypes,
} from "../../services/adminService";

export default function AdminCustomerEdit({ customerId, onSaved, onCancel }) {
  const [customer, setCustomer] = useState(null);
  const [loading,   setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [customerTypes, setCustomerTypes] = useState([]);

  // ── Editable fields ──
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [district, setDistrict] = useState("");
  const [upazila,  setUpazila]  = useState("");
  const [address,  setAddress]  = useState("");
  const [customerTypeId, setCustomerTypeId] = useState("");

  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // The edit dropdown must only offer active, admin-configured types —
    // never hardcoded values.
    getAdminCustomerTypes()
      .then((data) => setCustomerTypes((data || []).filter((t) => t.active)))
      .catch(() => setCustomerTypes([]));
  }, []);

  useEffect(() => {
    if (!customerId) {
      setLoadError("No customer selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    getCustomerById(customerId)
      .then((data) => {
        setCustomer(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setDistrict(data.district || "");
        setUpazila(data.upazila || "");
        setAddress(data.address || "");
        setCustomerTypeId(data.customerTypeId ?? "");
      })
      .catch(() => setLoadError("Customer not found"))
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSaving(true);
    try {
      await updateCustomer(customerId, {
        name,
        email: email || null,
        district: district || null,
        upazila: upazila || null,
        address: address || null,
        customerTypeId: customerTypeId ? Number(customerTypeId) : null,
      });
      setSuccess("Customer updated successfully!");
      onSaved?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save customer.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminCardSkeleton className="h-20" />
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <AdminCardSkeleton className="h-96" />
          <AdminCardSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (loadError || !customer) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-lg font-medium text-gray-400">{loadError || "No customer selected"}</p>
        <AdminButton variant="secondary" className="mt-4" onClick={() => onCancel?.()}>Back to Customers</AdminButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Customer"
          title={`Edit ${customer.name}`}
          description="Update profile details and customer type. Phone and status aren't editable here."
          action={
            <div className="flex items-center gap-2">
              <AdminButton type="button" variant="secondary" onClick={() => onCancel?.()}>Cancel</AdminButton>
              <AdminButton type="submit" variant="primary" loading={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </AdminButton>
            </div>
          }
        />

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <AdminCard title="Profile" description="Only fields the backend supports editing are shown.">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <AdminField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AdminField label="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
              <AdminField label="Upazila" value={upazila} onChange={(e) => setUpazila(e.target.value)} />
            </div>
            <div className="mt-4">
              <AdminTextArea label="Full Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </AdminCard>

          <div className="space-y-6">
            <AdminCard title="Customer Type">
              <AdminSelectField
                label="Type"
                value={customerTypeId}
                onChange={(e) => setCustomerTypeId(e.target.value)}
                options={[{ value: "", label: "No type assigned" }, ...customerTypes.map((t) => ({ value: t.id, label: t.name }))]}
              />
              {customerTypes.length === 0 && (
                <p className="mt-2 text-xs text-gray-400">No active customer types configured yet.</p>
              )}
            </AdminCard>

            <AdminCard title="Identity & Status" description="Read-only — see rule notes.">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Phone</span>
                  <span className="text-sm text-gray-900">{customer.phone}</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Phone is the customer's identity and links their order history — it can't be changed here.
                </p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-medium text-gray-600">Status</span>
                  <AdminBadge value={customer.active ? "ACTIVE" : "INACTIVE"} />
                </div>
                <p className="text-[11px] text-gray-400">
                  Status is set automatically: active while the customer has any order that isn't delivered or cancelled.
                </p>
              </div>
            </AdminCard>
          </div>
        </section>
      </div>
    </form>
  );
}
