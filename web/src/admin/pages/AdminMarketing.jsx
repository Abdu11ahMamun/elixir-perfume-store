import AdminBadge from "../components/ui/AdminBadge";
import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminStatCard from "../components/ui/AdminStatCard";

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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Brand Atelier"
        title="Marketing"
        description="Manage promotional banners, featured fragrances, coupons, campaigns, and luxury storefront storytelling."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            + New Campaign
          </button>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Active Campaigns"
          value="2"
          helper="Currently visible"
          icon="✺"
        />

        <AdminStatCard
          label="Campaign Reach"
          value="24.4K"
          helper="Visitors touched"
          icon="◷"
        />

        <AdminStatCard
          label="Avg Conversion"
          value="4.3%"
          helper="Across campaigns"
          icon="✦"
        />

        <AdminStatCard
          label="Featured Slots"
          value="3"
          helper="Storefront placements"
          icon="◈"
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Campaigns</p>
            <h2 className="font-display text-4xl font-light">
              Promotional Campaigns
            </h2>
            <p className="mt-2 text-sm text-[var(--mist)]">
              Track active promotions and storefront conversion signals.
            </p>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-5 transition hover:bg-[var(--warm)]/40"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {campaign.name}
                    </p>

                    <p className="mt-1 text-sm text-[var(--mist)]">
                      {campaign.type}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <AdminBadge value={campaign.status} />

                    <span className="rounded-full bg-[var(--warm)] px-3 py-1 text-xs text-[var(--gold-dark)]">
                      Reach {campaign.reach}
                    </span>

                    <span className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-xs text-[var(--gold-dark)]">
                      CVR {campaign.conversion}
                    </span>

                    <button className="rounded-full bg-[#0b0805] px-4 py-2 text-xs text-[var(--gold)] transition hover:-translate-y-0.5">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="mb-7">
            <p className="eyebrow mb-3">Storefront</p>
            <h2 className="font-display text-4xl font-light">
              Featured Slots
            </h2>
            <p className="mt-2 text-sm text-[var(--mist)]">
              Control which fragrances appear in premium storefront placements.
            </p>
          </div>

          <div className="space-y-4">
            {featuredSlots.map((slot) => (
              <div
                key={slot.title}
                className="rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {slot.title}
                    </p>

                    <p className="mt-1 text-sm text-[var(--mist)]">
                      {slot.product}
                    </p>

                    <p className="mt-2 text-xs text-[var(--gold-dark)]">
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
            <p className="eyebrow mb-3">Luxury Storytelling</p>

            <h2 className="font-display text-5xl font-light leading-none">
              Homepage Banner Preview
            </h2>

            <p className="mt-4 text-sm leading-7 text-[var(--mist)]">
              Preview how a campaign banner could appear before publishing to
              the storefront.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#0b0805] p-8 text-[var(--parchment)]">
            <div
              className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full blur-[90px] opacity-30"
              style={{ background: "var(--gold)" }}
            />

            <div className="relative">
              <p className="eyebrow mb-4">Weekend Ritual</p>

              <h3 className="font-display text-6xl font-light leading-none">
                Luxury Oud
                <br />
                <span className="italic text-[var(--gold)]">Collection</span>
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                A curated campaign for collectors who prefer rich, warm, and
                unforgettable oud fragrances.
              </p>

              <button className="mt-7 rounded-full border border-[var(--gold)]/40 px-5 py-3 text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                Preview Banner
              </button>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}