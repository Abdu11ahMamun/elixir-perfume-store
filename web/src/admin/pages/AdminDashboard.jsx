import AdminCard from "../components/ui/AdminCard";
import AdminBadge from "../components/ui/AdminBadge";
import {
  adminStats,
  salesChartData,
  adminOrders,
  adminProducts,
} from "../data/mockAdminData";

export default function AdminDashboard() {
  const maxRevenue = Math.max(...salesChartData.map((item) => item.revenue));

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--gold)]/20 bg-[#0b0805] p-8 text-[var(--parchment)] shadow-[0_32px_100px_rgba(14,12,10,0.22)] lg:p-10">
        <div
          className="absolute right-[-140px] top-[-180px] h-[420px] w-[420px] rounded-full blur-[120px] opacity-30"
          style={{ background: "var(--gold)" }}
        />

        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow mb-5">ÉLIXIR Atelier</p>

            <h1 className="font-display text-6xl font-light leading-none md:text-7xl">
              Revenue This Month
            </h1>

            <div className="mt-8 flex flex-wrap items-end gap-5">
              <p className="font-display text-7xl font-light text-[var(--gold)]">
                $48,920
              </p>

              <span className="mb-3 rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-2 text-sm text-[var(--gold)]">
                +12.4% vs last month
              </span>
            </div>

            <div className="mt-8 h-px w-full bg-gradient-to-r from-[var(--gold)] via-[var(--gold)]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <HeroMiniMetric label="Orders" value="1,284" />
            <HeroMiniMetric label="AOV" value="$38.10" />
            <HeroMiniMetric label="Repeat Buyers" value="42%" />
            <HeroMiniMetric label="Conversion" value="4.8%" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat, index) => (
          <AdminCard key={stat.id}>
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--mist)]">{stat.label}</p>

                  <h3 className="mt-3 font-display text-5xl font-light text-[var(--gold-dark)]">
                    {stat.value}
                  </h3>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--warm)] text-[var(--gold-dark)]">
                  ✦
                </span>
              </div>

              <Sparkline variant={index} />

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    stat.trend === "up"
                      ? "bg-[var(--gold)]/15 text-[var(--gold-dark)]"
                      : stat.trend === "down"
                      ? "bg-[#b88545]/15 text-[#8f5f24]"
                      : "bg-[#0b0805]/10 text-[#0b0805]"
                  }`}
                >
                  {stat.change}
                </span>

                <span className="text-xs text-[var(--mist)]">
                  {stat.description}
                </span>
              </div>
            </div>
          </AdminCard>
        ))}
      </section>

      {/* Charts */}
      <section className="grid gap-6 xl:grid-cols-3">
        <AdminCard className="xl:col-span-2">
          <div className="mb-8">
            <p className="eyebrow mb-3">Revenue Intelligence</p>

            <h2 className="font-display text-5xl leading-none text-[var(--ink)]">
              Revenue Overview
            </h2>

            <p className="mt-3 text-sm text-[var(--mist)]">
              Monthly sales performance and growth trajectory.
            </p>

            <div className="mt-5 h-px w-24 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>

          <div className="h-[350px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => {
                const height = Math.max(42, (item.revenue / maxRevenue) * 300);

                return (
                  <div
                    key={item.month}
                    className="group flex flex-1 flex-col items-center justify-end"
                  >
                    <div className="mb-3 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-[#0b0805] px-3 py-1 text-xs text-[var(--gold)]">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </div>

                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-[#8f6a32] via-[#c9a96e] to-[#f1ddad] shadow-[0_10px_30px_rgba(201,169,110,0.35)] transition duration-300 group-hover:scale-y-105"
                      style={{ height }}
                    />

                    <span className="mt-3 text-xs text-[var(--mist)]">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-8">
            <p className="eyebrow mb-3">Atelier Metrics</p>

            <h2 className="font-display text-5xl leading-none text-[var(--ink)]">
              Top Metrics
            </h2>

            <p className="mt-3 text-sm text-[var(--mist)]">
              Luxury commerce signals for fragrance performance.
            </p>

            <div className="mt-5 h-px w-20 bg-gradient-to-r from-[var(--gold)] to-transparent" />
          </div>

          <div className="space-y-5">
            <MetricRow label="Fragrance Conversion" value="4.8%" />
            <MetricRow label="Average Basket" value="$38.10" />
            <MetricRow label="Returning Collectors" value="42%" />
            <MetricRow label="Discovery Views" value="18.4K" />
            <MetricRow label="VIP Client Ratio" value="12.2%" />
          </div>
        </AdminCard>
      </section>

      {/* Tables */}
      <section className="grid gap-6 xl:grid-cols-2">
        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Order Atelier</p>

            <h2 className="font-display text-4xl font-light">
              Recent Orders
            </h2>

            <p className="mt-2 text-sm text-[var(--mist)]">
              Latest customer purchases and fulfillment states.
            </p>
          </div>

          <div className="space-y-4">
            {adminOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4 transition hover:border-[var(--gold)]/30 hover:shadow-lg"
              >
                <div>
                  <p className="font-semibold text-[var(--ink)]">{order.id}</p>
                  <p className="text-sm text-[var(--mist)]">
                    {order.customerName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-[var(--gold-dark)]">
                    ${order.total}
                  </p>

                  <div className="mt-2">
                    <AdminBadge value={order.orderStatus} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Inventory Watch</p>

            <h2 className="font-display text-4xl font-light">
              Low Stock Products
            </h2>

            <p className="mt-2 text-sm text-[var(--mist)]">
              Fragrances requiring immediate restock attention.
            </p>
          </div>

          <div className="space-y-4">
            {adminProducts
              .filter((product) => product.stock < 20)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-4 transition hover:border-[var(--gold)]/30 hover:shadow-lg"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-2xl object-cover shadow-md"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-[var(--ink)]">
                      {product.name}
                    </p>

                    <p className="text-sm text-[var(--mist)]">
                      {product.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-3xl text-[var(--gold-dark)]">
                      {product.stock}
                    </p>

                    <p className="text-xs text-[var(--mist)]">
                      remaining
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </AdminCard>
      </section>
    </div>
  );
}

function HeroMiniMetric({ label, value }) {
  return (
    <div className="rounded-3xl border border-[var(--gold)]/15 bg-white/5 p-5 backdrop-blur">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)]">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl font-light text-[var(--parchment)]">
        {value}
      </p>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--gold)]/10 pb-4 last:border-b-0">
      <span className="text-sm text-[var(--mist)]">{label}</span>

      <span className="font-semibold text-[var(--gold-dark)]">
        {value}
      </span>
    </div>
  );
}

function Sparkline({ variant = 0 }) {
  const paths = [
    "M2 26 L16 18 L29 22 L42 10 L55 16 L68 7 L82 14 L96 4",
    "M2 20 L16 22 L30 14 L44 16 L58 8 L72 12 L96 6",
    "M2 12 L18 16 L34 10 L50 18 L66 14 L82 24 L96 20",
    "M2 24 L18 14 L34 18 L50 10 L66 16 L82 8 L96 12",
  ];

  return (
    <svg
      viewBox="0 0 100 32"
      className="h-10 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <path
        d={paths[variant % paths.length]}
        fill="none"
        stroke="rgba(201,169,110,0.85)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`${paths[variant % paths.length]} L96 32 L2 32 Z`}
        fill="rgba(201,169,110,0.08)"
      />
    </svg>
  );
}