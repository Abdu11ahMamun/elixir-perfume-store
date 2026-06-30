import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminStatCard from "../components/ui/AdminStatCard";
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
      <div className="mx-auto max-w-[1480px] space-y-8">
      <AdminPageHeader
        eyebrow="Business Intelligence"
        title="Reports"
        description="Monthly sales, revenue distribution, product performance, payment behavior, and export-ready business insights."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Export Report
          </button>
        }
      />

      <AdminCard className="overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-center">
          <div>
            <p className="eyebrow mb-4">Reporting Period</p>

            <h2 className="font-display text-7xl font-light leading-none">
              February
            </h2>

            <p className="mt-2 text-xl text-[var(--mist)]">2026</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--mist)]">
              Revenue
            </p>

            <p className="mt-3 font-display text-6xl font-light text-[var(--gold-dark)]">
              {formatCurrency(monthlyReport.revenue)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--mist)]">
              Orders
            </p>

            <p className="mt-3 font-display text-6xl font-light text-[var(--gold-dark)]">
              {monthlyReport.orders}
            </p>
          </div>
        </div>
      </AdminCard>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Monthly Revenue"
          value={formatCurrency(monthlyReport.revenue)}
          helper={monthlyReport.month}
          icon="◈"
        />

        <AdminStatCard
          label="Monthly Orders"
          value={monthlyReport.orders}
          helper="Completed and pending"
          icon="◎"
        />

        <AdminStatCard
          label="Avg Order Value"
          value={formatCurrency(monthlyReport.averageOrderValue)}
          helper="Revenue per order"
          icon="✦"
          tone="bronze"
        />

        <AdminStatCard
          label="Conversion Rate"
          value={`${monthlyReport.conversionRate}%`}
          helper="Storefront conversion"
          icon="◷"
        />
      </section>
        <section className="grid items-stretch gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <AdminCard className="h-[430px] overflow-hidden">
          <div className="mb-8">
            <p className="eyebrow mb-3">Sales Intelligence</p>

            <h2 className="font-display text-5xl font-light leading-none">
              Monthly Revenue
            </h2>

            <p className="mt-3 text-sm text-[var(--mist)]">
              Revenue trend across the year with luxury campaign seasonality.
            </p>

            <div className="mt-5 h-px w-24 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>

          <div className="h-[260px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => {
                const height = Math.max(34, (item.revenue / maxRevenue) * 190);

                return (
                  <div
                    key={item.month}
                    className="group flex flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-3 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-[#0b0805] px-3 py-1 text-xs text-[var(--gold)]">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>

                    <div
                      className="w-full rounded-t-[3rem] bg-gradient-to-t from-[#8f6a32] via-[#c9a96e] to-[#f1ddad] shadow-[0_10px_30px_rgba(201,169,110,0.28)] transition duration-300 group-hover:-translate-y-2"
                      style={{ height }}
                    />

                   <span className="mt-4 block text-xs text-[var(--mist)]">
                    {item.month}
                  </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard className="h-[430px] overflow-hidden">
          <div className="mb-8">
            <p className="eyebrow mb-3">Executive Summary</p>

            <h2 className="font-display text-5xl font-light leading-none">
              {monthlyReport.month}
            </h2>

            <p className="mt-3 text-sm text-[var(--mist)]">
              Key business highlights for this reporting period.
            </p>

            <div className="mt-5 h-px w-20 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>

          <div className="space-y-5">
            <InfoRow label="Top Category" value={monthlyReport.topCategory} />
            <InfoRow label="Best Product" value={monthlyReport.bestProduct} />
            <InfoRow label="Revenue" value={formatCurrency(monthlyReport.revenue)} />
            <InfoRow label="Orders" value={monthlyReport.orders} />
            <InfoRow label="Conversion" value={`${monthlyReport.conversionRate}%`} />
          </div>
        </AdminCard>
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Category Revenue</p>

            <h2 className="font-display text-4xl font-light">
              Revenue by Collection
            </h2>
          </div>

          <div className="space-y-5">
            {categorySales.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">
                    {item.label}
                  </span>

                  <span className="text-sm font-semibold text-[var(--gold-dark)]">
                    {formatCurrency(item.value)}
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-[var(--warm)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8f6a32] to-[#e6d0a4]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <p className="mt-1 text-xs text-[var(--mist)]">
                  {item.percent}% of total revenue
                </p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Product Performance</p>

            <h2 className="font-display text-4xl font-light">
              Top Products
            </h2>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--warm)] font-display text-xl text-[var(--gold-dark)]">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-[var(--ink)]">
                    {product.name}
                  </p>

                  <p className="text-sm text-[var(--mist)]">
                    {product.category} · {product.sold} sold
                  </p>
                </div>

                <p className="font-semibold text-[var(--gold-dark)]">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      <AdminCard>
        <div className="mb-7">
          <p className="eyebrow mb-3">Payment Intelligence</p>

          <h2 className="font-display text-4xl font-light">
            Payment Method Breakdown
          </h2>

          <p className="mt-2 text-sm text-[var(--mist)]">
            Understand how customers prefer to pay for fragrances.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {paymentMethods.map((method) => (
            <div
              key={method.label}
              className="rounded-[2rem] border border-[var(--gold)]/10 bg-[#fffcf8] p-5"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--warm)] text-[var(--gold-dark)]">
                ✦
              </div>

              <p className="text-sm text-[var(--mist)]">{method.label}</p>

              <p className="mt-3 font-display text-5xl font-light text-[var(--gold-dark)]">
                {method.value}%
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--warm)]">
                <div
                  className="h-full rounded-full bg-[var(--gold)]"
                  style={{ width: `${method.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <div className="mb-7">
          <p className="eyebrow mb-3">Luxury Insights</p>

          <h2 className="font-display text-4xl font-light">
            Executive Signals
          </h2>

          <p className="mt-2 text-sm text-[var(--mist)]">
            Curated insights for premium fragrance business decisions.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {luxuryInsights.map((insight) => (
            <div
              key={insight.label}
              className="rounded-[2rem] border border-[var(--gold)]/10 bg-[#fffcf8] p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--mist)]">
                {insight.label}
              </p>

              <p className="mt-4 font-display text-4xl font-light text-[var(--gold-dark)]">
                {insight.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-[var(--mist)]">
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
    <div className="flex items-center justify-between border-b border-[var(--gold)]/10 pb-4 last:border-b-0">
      <span className="text-sm text-[var(--mist)]">{label}</span>
      <span className="font-semibold text-[var(--gold-dark)]">{value}</span>
    </div>
  );
}