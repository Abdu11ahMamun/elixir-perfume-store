import { useCallback, useEffect, useMemo, useState } from "react";

import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminSearchBar from "../components/ui/AdminSearchBar";
import AdminStatCard from "../components/ui/AdminStatCard";
import AdminButton from "../components/ui/AdminButton";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { AdminRowSkeleton } from "../components/ui/AdminSkeleton";
import { AdminSelect } from "../components/ui/AdminInput";
import { AdminTable, AdminTableHead, AdminTableBody, AdminTableRow } from "../components/ui/AdminTable";
import { getAdminCustomers } from "../../services/adminService";
import { formatCurrency, formatDate } from "../utils/adminFormat";

const STATUSES = ["All", "ACTIVE", "INACTIVE"];
const COLUMNS = "1.6fr 1fr 1fr 0.7fr 1fr 0.9fr 1fr auto";

function getErrorMessage(err) {
  const status = err.response?.status;
  const data   = err.response?.data;
  if (typeof data?.message === "string" && data.message) return data.message;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status >= 500)  return "Something went wrong on the server. Please try again.";
  if (typeof err.message === "string" && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

export default function AdminCustomers({ onView, onEdit }) {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    setLoadError("");
    getAdminCustomers()
      .then((data) => setCustomers(data || []))
      .catch((err) => {
        setCustomers([]);
        setLoadError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchSearch = !q ||
        (c.name  || "").toLowerCase().includes(q) ||
        (c.phone || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q);
      const status = c.active ? "ACTIVE" : "INACTIVE";
      const matchStatus = statusFilter === "All" || status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [customers, search, statusFilter]);

  const activeCount     = customers.filter((c) => c.active).length;
  const returningCount  = customers.filter((c) => (c.totalOrders || 0) > 1).length;
  const avgLtv = customers.length
    ? customers.reduce((sum, c) => sum + Number(c.totalSpent || 0), 0) / customers.length
    : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Clientele"
        title="Customers"
        description="Buyers generated from placed orders — purchase history, location, and customer type."
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Customers" value={customers.length} helper="All buyers on record" icon="☉" />
        <AdminStatCard label="Active"          value={activeCount}     helper="Have a non-terminal order" icon="✦" />
        <AdminStatCard label="Returning"       value={returningCount}  helper="More than one order" icon="↺" tone="bronze" />
        <AdminStatCard label="Average LTV"     value={formatCurrency(avgLtv)} helper="Lifetime value per customer" icon="◈" />
      </section>

      <AdminCard>
        <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <AdminSearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, phone, or email..."
          />
          <AdminSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={STATUSES} />
        </div>

        <AdminTable>
          <AdminTableHead columns={COLUMNS}>
            <span>Customer</span>
            <span>Location</span>
            <span>Type</span>
            <span>Orders</span>
            <span>Total Spent</span>
            <span>Status</span>
            <span>Last Order</span>
            <span className="text-right">Actions</span>
          </AdminTableHead>

          <AdminTableBody>
            {loading ? (
              <AdminRowSkeleton count={3} />
            ) : loadError ? (
              <AdminEmptyState
                icon="!"
                title="Couldn't load customers"
                description={loadError}
                actionLabel="Try again"
                onAction={fetchCustomers}
              />
            ) : filtered.length > 0 ? (
              filtered.map((customer) => (
                <CustomerRow key={customer.id} customer={customer} onView={onView} onEdit={onEdit} />
              ))
            ) : customers.length === 0 ? (
              <AdminEmptyState icon="☉" title="No customers yet" description="Customers appear here automatically once orders are placed." />
            ) : (
              <AdminEmptyState icon="☉" title="No customers found" description="Try changing your search or status filter." />
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>
    </div>
  );
}

function CustomerRow({ customer, onView, onEdit }) {
  const initials = (customer.name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const location = [customer.upazila, customer.district].filter(Boolean).join(", ") || "—";

  return (
    <AdminTableRow columns={COLUMNS}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{customer.name}</p>
          <p className="truncate text-xs text-gray-400">{customer.phone}</p>
        </div>
      </div>

      <p className="truncate text-sm text-gray-500">{location}</p>

      <div>
        {customer.customerTypeName
          ? <AdminBadge value={customer.customerTypeName} tone="gold" />
          : <span className="text-xs text-gray-400">—</span>}
      </div>

      <p className="text-sm font-medium text-gray-900">{customer.totalOrders ?? 0}</p>

      <p className="text-sm font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>

      <div><AdminBadge value={customer.active ? "ACTIVE" : "INACTIVE"} /></div>

      <p className="text-sm text-gray-500">{customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"}</p>

      <div className="flex items-center justify-end gap-1.5">
        <AdminButton size="sm" variant="secondary" onClick={() => onView?.(customer.id)}>View</AdminButton>
        <AdminButton size="sm" variant="outline" onClick={() => onEdit?.(customer.id)}>Edit</AdminButton>
      </div>
    </AdminTableRow>
  );
}
