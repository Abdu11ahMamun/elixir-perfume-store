import AdminCard from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";

const categories = ["For Him", "For Her", "Luxury Oud", "Gift Sets"];
const statuses = ["ACTIVE", "INACTIVE"];
const badges = ["BEST_SELLER", "NEW", "LIMITED", "PREMIUM"];

export default function AdminProductForm() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Product Atelier"
        title="Add Product"
        description="Create a fragrance with pricing, inventory, scent notes, media, and storefront visibility. This structure is API-ready for Spring Boot."
        action={
          <button className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5">
            Save Product
          </button>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-8">
          <AdminCard title="Product Information" description="Basic catalog identity">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Product Name" placeholder="Noir Ember" />
              <Field label="SKU" placeholder="ELX-NOIR-30" />
              <SelectField label="Category" options={categories} />
              <SelectField label="Status" options={statuses} />
              <Field label="Slug" placeholder="noir-ember" />
              <SelectField label="Badge" options={badges} />
            </div>

            <div className="mt-5">
              <TextArea
                label="Description"
                placeholder="A deep, smoky signature fragrance crafted for confident evenings..."
              />
            </div>
          </AdminCard>

          <AdminCard title="Pricing & Inventory" description="Commercial and stock details">
            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Price" placeholder="89" />
              <Field label="Old Price" placeholder="110" />
              <Field label="Stock Quantity" placeholder="42" />
            </div>
          </AdminCard>

          <AdminCard title="Fragrance Profile" description="Perfume-specific selling attributes">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Longevity" placeholder="8-10 hours" />
              <Field label="Projection" placeholder="Strong" />
              <Field label="Season" placeholder="Winter / Evening" />
              <Field label="Occasion" placeholder="Date night, formal events" />
              <Field label="Tags" placeholder="Woody, Night, Bold" />
              <Field label="Rating" placeholder="4.9" />
            </div>
          </AdminCard>

          <AdminCard title="Fragrance Notes" description="Top, heart, and base note pyramid">
            <div className="grid gap-5 md:grid-cols-3">
              <TextArea label="Top Notes" placeholder="Bergamot, Black Pepper" />
              <TextArea label="Heart Notes" placeholder="Cedarwood, Incense" />
              <TextArea label="Base Notes" placeholder="Amber, Musk, Patchouli" />
            </div>
          </AdminCard>
        </div>

        <div className="space-y-8">
          <AdminCard title="Product Media" description="Main image and gallery">
            <div className="rounded-[2rem] border border-dashed border-[var(--gold)]/30 bg-[#fffcf8] p-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--warm)] text-3xl text-[var(--gold-dark)]">
                ◈
              </div>

              <h3 className="font-display text-3xl font-light">
                Upload Product Images
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--mist)]">
                Recommended: transparent PNG, centered bottle, 1200×1600.
              </p>

              <button className="mt-6 rounded-full bg-[var(--gold)] px-5 py-3 text-sm text-[#0b0805]">
                Choose Files
              </button>
            </div>
          </AdminCard>

          <AdminCard title="SEO Preview" description="How this perfume may appear in search">
            <div className="rounded-[1.5rem] border border-[var(--gold)]/10 bg-[#fffcf8] p-5">
              <p className="text-xs text-[var(--gold-dark)]">
                elixir.com/perfume/noir-ember
              </p>

              <h3 className="mt-2 font-display text-3xl font-light">
                Noir Ember — ÉLIXIR Signature Fragrances
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--mist)]">
                A deep, smoky signature fragrance crafted for confident evenings and unforgettable presence.
              </p>
            </div>
          </AdminCard>

          <AdminCard title="Publishing" description="Storefront visibility controls">
            <div className="space-y-4">
              <ToggleRow label="Visible in storefront" />
              <ToggleRow label="Feature on homepage" />
              <ToggleRow label="Allow customer reviews" />
              <ToggleRow label="Track inventory" />
            </div>
          </AdminCard>
        </div>
      </section>
    </div>
  );
}

function Field({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">
        {label}
      </span>

      <input
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function SelectField({ label, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">
        {label}
      </span>

      <select className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]">
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">
        {label}
      </span>

      <textarea
        rows="5"
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function ToggleRow({ label }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] px-4 py-3">
      <span className="text-sm text-[var(--mist)]">{label}</span>

      <button className="relative h-7 w-12 rounded-full bg-[var(--gold)]">
        <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow" />
      </button>
    </div>
  );
}