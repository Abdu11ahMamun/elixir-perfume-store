import AdminCard from "../components/ui/AdminCard";
import {
  adminStats,
  salesChartData,
  adminOrders,
  adminProducts,
} from "../data/mockAdminData";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat) => (
          <AdminCard key={stat.id}>
            <div className="space-y-3">
              <p className="text-sm text-slate-500">
                {stat.label}
              </p>

              <h3 className="text-4xl font-bold text-slate-900">
                {stat.value}
              </h3>

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    stat.trend === "up"
                      ? "text-emerald-600"
                      : stat.trend === "down"
                      ? "text-amber-600"
                      : "text-rose-600"
                  }`}
                >
                  {stat.change}
                </span>

                <span className="text-xs text-slate-400">
                  {stat.description}
                </span>
              </div>
            </div>
          </AdminCard>
        ))}
      </section>

      {/* Revenue Chart Placeholder */}
      <section className="grid gap-6 xl:grid-cols-3">
        <AdminCard
          title="Revenue Overview"
          description="Monthly sales performance"
          className="xl:col-span-2"
        >
          <div className="h-[350px]">
            <div className="flex h-full items-end gap-3">
              {salesChartData.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center justify-end"
                >
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-[#8f6a32] via-[#c9a96e] to-[#e6d0a4] shadow-[0_10px_30px_rgba(201,169,110,0.35)] transition hover:bg-slate-700"
                    style={{
                      height: `${item.revenue / 180}px`,
                    }}
                  />

                  <span className="mt-3 text-xs text-slate-500">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>

        <AdminCard
          title="Top Metrics"
          description="Quick business overview"
        >
          <div className="space-y-5">
            <MetricRow
              label="Conversion Rate"
              value="4.8%"
            />
            <MetricRow
              label="Avg Order Value"
              value="$38.10"
            />
            <MetricRow
              label="Returning Customers"
              value="42%"
            />
            <MetricRow
              label="Product Views"
              value="18.4K"
            />
            <MetricRow
              label="Cart Conversion"
              value="12.2%"
            />
          </div>
        </AdminCard>
      </section>

      {/* Tables */}
      <section className="grid gap-6 xl:grid-cols-2">
        <AdminCard
          title="Recent Orders"
          description="Latest customer purchases"
        >
          <div className="space-y-4">
            {adminOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.id}
                  </p>

                  <p className="text-sm text-slate-500">
                    {order.customerName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ${order.total}
                  </p>

                  <p className="text-xs text-slate-500">
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Low Stock Products"
          description="Products requiring attention"
        >
          <div className="space-y-4">
            {adminProducts
              .filter((p) => p.stock < 20)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-semibold">
                      {product.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {product.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-amber-600">
                      {product.stock}
                    </p>

                    <p className="text-xs text-slate-500">
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

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
}