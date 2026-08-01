import { useCallback, useEffect, useRef, useState } from "react";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminStatCard from "../components/ui/AdminStatCard";
import AdminButton from "../components/ui/AdminButton";
import { AdminSelect } from "../components/ui/AdminInput";
import { AdminCardSkeleton } from "../components/ui/AdminSkeleton";
import AdminEmptyState from "../components/ui/AdminEmptyState";
import { getAdminReportSummary } from "../../services/adminService";
import { formatCurrency } from "../utils/adminFormat";

const PRESET_OPTIONS = [
  { value: "THIS_WEEK", label: "This Week" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "PREVIOUS_MONTH", label: "Previous Month" },
  { value: "CUSTOM", label: "Custom Range" },
];

const dateInputClass =
  "rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none " +
  "focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20";

// ─── Extract a clean, user-facing message from any API error ──
function getErrorMessage(err) {
  const status = err.response?.status;
  const data = err.response?.data;

  if (typeof data?.message === "string" && data.message) return data.message;
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to view reports.";
  if (status >= 500) return "Something went wrong on the server. Please try again.";
  if (typeof err.message === "string" && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISODate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function resolvePeriod(preset, customStart, customEnd) {
  const today = new Date();

  if (preset === "THIS_WEEK") {
    const day = today.getDay(); // 0 = Sunday .. 6 = Saturday
    const diffToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    return { startDate: toISODate(monday), endDate: toISODate(today) };
  }
  if (preset === "PREVIOUS_MONTH") {
    const firstOfPrev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastOfPrev = new Date(today.getFullYear(), today.getMonth(), 0);
    return { startDate: toISODate(firstOfPrev), endDate: toISODate(lastOfPrev) };
  }
  if (preset === "CUSTOM") {
    return { startDate: customStart, endDate: customEnd };
  }
  // THIS_MONTH (default)
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return { startDate: toISODate(firstOfMonth), endDate: toISODate(today) };
}

function trendProp(pct) {
  if (pct === null || pct === undefined) return undefined;
  return { direction: pct < 0 ? "down" : "up", label: `${Math.abs(pct).toFixed(2)}%` };
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildCsv(data) {
  const lines = [];
  lines.push(`Report Period,${csvEscape(data.period.label)}`);
  lines.push(`Revenue Rule,${csvEscape(data.revenueRuleNote)}`);
  lines.push("");
  lines.push("Summary");
  lines.push("Metric,Value");
  lines.push(`Total Revenue,${data.summary.totalRevenue}`);
  lines.push(`Total Orders,${data.summary.totalOrders}`);
  lines.push(`Completed Orders,${data.summary.completedOrders}`);
  lines.push(`Pending Orders,${data.summary.pendingOrders}`);
  lines.push(`Cancelled Orders,${data.summary.cancelledOrders}`);
  lines.push(`Total Customers,${data.summary.totalCustomers}`);
  lines.push(`Average Order Value,${data.summary.averageOrderValue}`);
  lines.push("");
  lines.push(`Revenue Trend (grouped by ${data.period.grouping})`);
  lines.push("Label,Date,Revenue,Orders");
  data.revenueTrend.forEach((p) => lines.push(`${csvEscape(p.label)},${p.date},${p.revenue},${p.orders}`));
  lines.push("");
  lines.push("Revenue by Collection");
  lines.push("Category,Revenue,Units Sold,Revenue %");
  data.revenueByCategory.forEach((c) =>
    lines.push(`${csvEscape(c.categoryName)},${c.revenue},${c.unitsSold},${c.revenuePercentage}`)
  );
  lines.push("");
  lines.push("Top Products");
  lines.push("Rank,Product,Category,Units Sold,Revenue");
  data.topProducts.forEach((p) =>
    lines.push(`${p.rank},${csvEscape(p.productName)},${csvEscape(p.categoryName)},${p.unitsSold},${p.revenue}`)
  );
  lines.push("");
  lines.push("Payment Method Breakdown");
  lines.push("Method,Order Count,Revenue,Percentage");
  data.paymentMethods.forEach((p) =>
    lines.push(`${csvEscape(p.paymentMethod)},${p.orderCount},${p.revenue},${p.percentage}`)
  );
  return lines.join("\n");
}

function downloadCsv(data) {
  const csv = buildCsv(data);
  // UTF-8 BOM so Excel correctly detects encoding and renders ৳/Bangla text
  // instead of mojibake.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `aurvior-sales-report-${data.period.startDate}-to-${data.period.endDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function useReport(range) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(() => {
    if (!range.startDate || !range.endDate) return;

    // Cancel any in-flight request so a slow, stale response can never
    // overwrite the result of a newer one fired by a rapid period change.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    getAdminReportSummary({ ...range, signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setLastRefreshedAt(new Date());
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });
  }, [range.startDate, range.endDate]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, lastRefreshedAt, refetch: fetchData };
}

export default function AdminReports() {
  const [preset, setPreset] = useState("THIS_MONTH");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [appliedRange, setAppliedRange] = useState(() => resolvePeriod("THIS_MONTH"));

  const { data, loading, error, lastRefreshedAt, refetch } = useReport(appliedRange);

  function handlePresetChange(next) {
    setPreset(next);
    if (next !== "CUSTOM") {
      setAppliedRange(resolvePeriod(next));
    }
  }

  function handleApply() {
    if (preset !== "CUSTOM" || !customStart || !customEnd) return;
    setAppliedRange({ startDate: customStart, endDate: customEnd });
  }

  function handleReset() {
    setPreset("THIS_MONTH");
    setCustomStart("");
    setCustomEnd("");
    setAppliedRange(resolvePeriod("THIS_MONTH"));
  }

  const isEmptyPeriod = data && Number(data.summary.totalOrders) === 0;
  const trend = data?.revenueTrend || [];
  const maxRevenue = Math.max(1, ...trend.map((p) => Number(p.revenue) || 0));
  const labelStep = trend.length > 20 ? 3 : trend.length > 10 ? 2 : 1;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Insights"
        title="Reports"
        description="Real sales, revenue, and product performance calculated from your order data."
        action={
          <div className="flex gap-2 report-print-hide">
            <AdminButton variant="secondary" disabled={!data} onClick={() => data && downloadCsv(data)}>
              Download Report
            </AdminButton>
            <AdminButton variant="primary" disabled={!data} onClick={() => window.print()}>
              Print Report
            </AdminButton>
          </div>
        }
      />

      <AdminCard>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Reporting Period</p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900">
              {loading && !data ? "Loading…" : data?.period.label || "—"}
            </h2>
            {lastRefreshedAt && (
              <p className="mt-1 text-xs text-gray-400">
                Report generated {lastRefreshedAt.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3 report-print-hide">
            <div className="w-44">
              <span className="mb-1.5 block text-xs font-medium text-gray-600">Period</span>
              <AdminSelect value={preset} onChange={(e) => handlePresetChange(e.target.value)} options={PRESET_OPTIONS} className="w-full" />
            </div>

            {preset === "CUSTOM" && (
              <>
                <div>
                  <span className="mb-1.5 block text-xs font-medium text-gray-600">Start Date</span>
                  <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className={dateInputClass} />
                </div>
                <div>
                  <span className="mb-1.5 block text-xs font-medium text-gray-600">End Date</span>
                  <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className={dateInputClass} />
                </div>
                <AdminButton variant="primary" onClick={handleApply} disabled={!customStart || !customEnd}>
                  Apply
                </AdminButton>
              </>
            )}

            <AdminButton variant="ghost" onClick={handleReset}>
              Reset
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {loading && !data ? (
        <div className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AdminCardSkeleton className="h-32" />
            <AdminCardSkeleton className="h-32" />
            <AdminCardSkeleton className="h-32" />
            <AdminCardSkeleton className="h-32" />
          </div>
          <AdminCardSkeleton className="h-72" />
        </div>
      ) : error ? (
        <AdminCard>
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-lg font-medium text-gray-400">{error}</p>
            <AdminButton variant="secondary" className="mt-4" onClick={refetch}>
              Retry
            </AdminButton>
          </div>
        </AdminCard>
      ) : data ? (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Total Revenue" value={formatCurrency(data.summary.totalRevenue)} helper="For selected period" icon="◈" trend={trendProp(data.comparison.revenueChangePercent)} />
            <AdminStatCard label="Total Orders" value={data.summary.totalOrders} helper="Placed in period" icon="◎" trend={trendProp(data.comparison.orderChangePercent)} />
            <AdminStatCard label="Average Order Value" value={formatCurrency(data.summary.averageOrderValue)} helper="Completed orders only" icon="✦" tone="bronze" trend={trendProp(data.comparison.averageOrderValueChangePercent)} />
            <AdminStatCard label="Total Customers" value={data.summary.totalCustomers} helper="Distinct buyers in period" icon="◷" trend={trendProp(data.comparison.customerChangePercent)} />
            <AdminStatCard label="Completed Orders" value={data.summary.completedOrders} helper="Delivered" icon="✓" tone="green" />
            <AdminStatCard label="Pending Orders" value={data.summary.pendingOrders} helper="Awaiting fulfillment" icon="!" tone="bronze" />
            <AdminStatCard label="Cancelled Orders" value={data.summary.cancelledOrders} helper="Not fulfilled" icon="×" tone="red" />
          </section>

          {isEmptyPeriod ? (
            <AdminCard>
              <AdminEmptyState icon="◎" title="No sales data for this period" description="Try a different date range to see revenue, product, and payment breakdowns." />
            </AdminCard>
          ) : (
            <>
              <AdminCard title="Revenue Trend" description={data.revenueRuleNote}>
                <div className="w-full overflow-x-auto">
                  <div className="flex h-64 min-w-0 items-end gap-1 pt-8 sm:gap-2">
                    {trend.map((point, i) => {
                      const height = Math.max(4, (Number(point.revenue) / maxRevenue) * 180);
                      return (
                        <div key={point.date} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                          <div className="absolute -top-8 hidden whitespace-nowrap opacity-0 transition group-hover:opacity-100 sm:block">
                            <span className="rounded-md bg-gray-900 px-2 py-1 text-[11px] text-white">
                              {formatCurrency(point.revenue)}
                            </span>
                          </div>
                          <div
                            className="w-full min-w-0 rounded-t-md bg-[#c9a96e]/70 transition duration-200 group-hover:bg-[var(--gold)]"
                            style={{ height }}
                          />
                          {i % labelStep === 0 && (
                            // Bar columns can get very narrow on small screens
                            // or wide date ranges — show just the leading
                            // token (e.g. "01" from "01 Jul") so it always
                            // fits without truncating to something unreadable.
                            // The full label is still on the hover tooltip.
                            <span className="mt-2.5 block w-full truncate text-center text-[10px] text-gray-400 sm:text-xs" title={point.label}>
                              {point.label.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AdminCard>

              <section className="grid gap-6 xl:grid-cols-2">
                <AdminCard title="Revenue by Collection">
                  {data.revenueByCategory.length > 0 ? (
                    <div className="space-y-4">
                      {data.revenueByCategory.map((item) => (
                        <div key={item.categoryId}>
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium text-gray-900">{item.categoryName}</span>
                            <span className="shrink-0 text-sm font-semibold text-gray-900">{formatCurrency(item.revenue)}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${item.revenuePercentage}%` }} />
                          </div>
                          <p className="mt-1 text-xs text-gray-400">
                            {item.revenuePercentage}% of total revenue · {item.unitsSold} units
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AdminEmptyState icon="◈" title="No category sales in this period" />
                  )}
                </AdminCard>

                <AdminCard title="Top Products">
                  {data.topProducts.length > 0 ? (
                    <div className="space-y-3">
                      {data.topProducts.map((product) => (
                        <div key={product.rank} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                            {product.rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{product.productName}</p>
                            <p className="truncate text-xs text-gray-500">{product.categoryName} · {product.unitsSold} sold</p>
                          </div>
                          <p className="shrink-0 text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AdminEmptyState icon="✦" title="No product sales in this period" />
                  )}
                </AdminCard>
              </section>

              <AdminCard title="Payment Method Breakdown" description="Order distribution by payment method for the selected period.">
                {data.paymentMethods.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {data.paymentMethods.map((method) => (
                      <div key={method.paymentMethod} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96e]/12 text-[var(--gold-dark)]">✦</div>
                        <p className="truncate text-sm text-gray-500">{method.paymentMethod}</p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{method.percentage}%</p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${method.percentage}%` }} />
                        </div>
                        <p className="mt-2 truncate text-xs text-gray-400">{method.orderCount} orders · {formatCurrency(method.revenue)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <AdminEmptyState icon="✦" title="No payment data in this period" />
                )}
              </AdminCard>

              {data.signals.length > 0 && (
                <AdminCard title="Executive Signals" description="Real, data-backed highlights for this reporting period.">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {data.signals.map((signal) => (
                      <div key={signal.label} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                        <p className="truncate text-xs uppercase tracking-wider text-gray-400">{signal.label}</p>
                        <p className="mt-3 truncate text-2xl font-semibold text-gray-900">{signal.value}</p>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{signal.helper}</p>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              )}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}
