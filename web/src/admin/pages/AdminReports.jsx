import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminStatCard from "../components/ui/AdminStatCard";
import AdminButton from "../components/ui/AdminButton";
import { monthlyReport, salesChartData } from "../data/mockAdminData";
import { formatCurrency } from "../utils/adminFormat";

const categorySales = [
  { label: "Luxury Oud", value: 18400, percent: 38 },
  { label: "For Her", value: 12600, percent: 26 },
  { label: "For Him", value: 9800, percent: 20 },
  { label: "Gift Sets", value: 8120, percent: 16 },
];

const topProducts = [
  { name: "Golden Oud", category: "Luxury Oud", revenue: 14800, sold: 122 },
  { name: "Noir Ember", category: "For Him", revenue: 10980, sold: 104 },
  { name: "Velvet Bloom", category: "For Her", revenue: 8920, sold: 96 },
  { name: "Discovery Gift Set", category: "Gift Sets", revenue: 6420, sold: 74 },
];

const paymentMethods = [
  { label: "Cash on Delivery", value: 46 },
  { label: "Bkash", value: 32 },
  { label: "Nagad", value: 14 },
  { label: "Card", value: 8 },
];

const luxuryInsights = [
  { label: "Best Collection", value: "Luxury Oud", helper: "38% of revenue" },
  { label: "Highest Conversion", value: "For Her", helper: "Strongest buyer intent" },
  { label: "Fastest Growing", value: "Gift Sets", helper: "+18% month over month" },
  { label: "VIP Revenue", value: "42%", helper: "Private client contribution" },
];

export default function AdminReports() {
  const maxRevenue = Math.max(...salesChartData.map((item) => item.revenue));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Insights"
        title="Reports"
        description="Monthly sales, revenue distribution, product performance, payment behavior, and export-ready business insights."
        action={<AdminButton variant="primary">Export Report</AdminButton>}
      />

      <AdminCard>
        <div className="grid gap-8 lg:grid-cols-3 lg:items-center">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Reporting Period</p>
            <h2 className="text-4xl font-semibold leading-none text-gray-900">February</h2>
            <p className="mt-2 text-lg text-gray-400">2026</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">Revenue</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {formatCurrency(monthlyReport.revenue)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400">Orders</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {monthlyReport.orders}
            </p>
          </div>
        </div>
      </AdminCard>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Monthly Revenue" value={formatCurrency(monthlyReport.revenue)} helper={monthlyReport.month} icon="◈" />
        <AdminStatCard label="Monthly Orders" value={monthlyReport.orders} helper="Completed and pending" icon="◎" />
        <AdminStatCard label="Avg Order Value" value={formatCurrency(monthlyReport.averageOrderValue)} helper="Revenue per order" icon="✦" tone="bronze" />
        <AdminStatCard label="Conversion Rate" value={`${monthlyReport.conversionRate}%`} helper="Storefront conversion" icon="◷" />
      </section>

      <section className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <AdminCard title="Monthly Revenue" description="Revenue trend across the year with seasonality.">
          <div className="h-[260px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => {
                const height = Math.max(30, (item.revenue / maxRevenue) * 190);

                return (
                  <div key={item.month} className="group flex flex-1 flex-col items-center justify-end">
                    <div className="mb-2 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-md bg-gray-900 px-2 py-1 text-[11px] text-white">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>

                    <div
                      className="w-full rounded-t-md bg-[#c9a96e]/70 transition duration-200 group-hover:bg-[var(--gold)]"
                      style={{ height }}
                    />

                    <span className="mt-2.5 block text-xs text-gray-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard title={monthlyReport.month} description="Key business highlights for this reporting period.">
          <div className="space-y-4">
            <InfoRow label="Top Category" value={monthlyReport.topCategory} />
            <InfoRow label="Best Product" value={monthlyReport.bestProduct} />
            <InfoRow label="Revenue" value={formatCurrency(monthlyReport.revenue)} />
            <InfoRow label="Orders" value={monthlyReport.orders} />
            <InfoRow label="Conversion" value={`${monthlyReport.conversionRate}%`} />
          </div>
        </AdminCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AdminCard title="Revenue by Collection">
          <div className="space-y-4">
            {categorySales.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(item.value)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[var(--gold)]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {item.percent}% of total revenue
                </p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Top Products">
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/60 p-3.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {product.category} · {product.sold} sold
                  </p>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      <AdminCard title="Payment Method Breakdown" description="Understand how customers prefer to pay for fragrances.">
        <div className="grid gap-4 md:grid-cols-4">
          {paymentMethods.map((method) => (
            <div
              key={method.label}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9a96e]/12 text-[var(--gold-dark)]">
                ✦
              </div>

              <p className="text-sm text-gray-500">{method.label}</p>

              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {method.value}%
              </p>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[var(--gold)]"
                  style={{ width: `${method.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Executive Signals" description="Curated insights for premium fragrance business decisions.">
        <div className="grid gap-4 md:grid-cols-4">
          {luxuryInsights.map((insight) => (
            <div
              key={insight.label}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
            >
              <p className="text-xs uppercase tracking-wider text-gray-400">
                {insight.label}
              </p>

              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {insight.value}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {insight.helper}
              </p>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 last:border-b-0 last:pb-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
