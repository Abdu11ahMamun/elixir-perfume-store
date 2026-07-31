import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminStatCard from "../components/ui/AdminStatCard";
import AdminButton from "../components/ui/AdminButton";

const campaigns = [
  {
    id: "cmp-1001",
    name: "Luxury Oud Weekend",
    type: "Homepage Banner",
    status: "ACTIVE",
    reach: "12.4K",
    conversion: "5.8%",
  },
  {
    id: "cmp-1002",
    name: "Gift Set Discovery",
    type: "Coupon Campaign",
    status: "ACTIVE",
    reach: "8.9K",
    conversion: "4.2%",
  },
  {
    id: "cmp-1003",
    name: "New Collector Welcome",
    type: "Email Offer",
    status: "INACTIVE",
    reach: "3.1K",
    conversion: "2.9%",
  },
];

const featuredSlots = [
  {
    title: "Hero Feature",
    product: "Golden Oud",
    placement: "Homepage hero",
    status: "ACTIVE",
  },
  {
    title: "Best Seller Row",
    product: "Noir Ember",
    placement: "Homepage featured",
    status: "ACTIVE",
  },
  {
    title: "Gift Campaign",
    product: "Discovery Gift Set",
    placement: "Collection banner",
    status: "INACTIVE",
  },
];

export default function AdminMarketing() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Growth"
        title="Marketing"
        description="Manage promotional banners, featured fragrances, coupons, campaigns, and storefront storytelling."
        action={<AdminButton variant="primary">+ New Campaign</AdminButton>}
      />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Active Campaigns" value="2" helper="Currently visible" icon="✺" />
        <AdminStatCard label="Campaign Reach" value="24.4K" helper="Visitors touched" icon="◷" />
        <AdminStatCard label="Avg Conversion" value="4.3%" helper="Across campaigns" icon="✦" />
        <AdminStatCard label="Featured Slots" value="3" helper="Storefront placements" icon="◈" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard title="Promotional Campaigns" description="Track active promotions and storefront conversion signals.">
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 transition hover:border-gray-200"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {campaign.name}
                    </p>

                    <p className="mt-0.5 text-sm text-gray-500">
                      {campaign.type}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <AdminBadge value={campaign.status} />

                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                      Reach {campaign.reach}
                    </span>

                    <span className="rounded-md bg-[#c9a96e]/12 px-2.5 py-1 text-xs text-[var(--gold-dark)]">
                      CVR {campaign.conversion}
                    </span>

                    <AdminButton size="sm" variant="secondary">Edit</AdminButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Featured Slots" description="Control which fragrances appear in premium storefront placements.">
          <div className="space-y-3">
            {featuredSlots.map((slot) => (
              <div
                key={slot.title}
                className="rounded-lg border border-gray-100 bg-gray-50/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {slot.title}
                    </p>

                    <p className="mt-0.5 text-sm text-gray-500">
                      {slot.product}
                    </p>

                    <p className="mt-1.5 text-xs text-[var(--gold-dark)]">
                      {slot.placement}
                    </p>
                  </div>

                  <AdminBadge value={slot.status} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      <AdminCard>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--gold-dark)]">Storytelling</p>

            <h2 className="text-2xl font-semibold leading-tight text-gray-900">
              Homepage Banner Preview
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Preview how a campaign banner could appear before publishing to
              the storefront.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-[var(--ink)] p-8 text-white">
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--gold)]">Weekend Ritual</p>

              <h3 className="mt-3 text-4xl font-semibold leading-none">
                Luxury Oud
                <br />
                <span className="text-[var(--gold)]">Collection</span>
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
                A curated campaign for collectors who prefer rich, warm, and
                unforgettable oud fragrances.
              </p>

              <button className="mt-6 rounded-lg border border-white/20 px-4 py-2.5 text-xs uppercase tracking-wider text-[var(--gold)] transition hover:bg-white/5">
                Preview Banner
              </button>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
