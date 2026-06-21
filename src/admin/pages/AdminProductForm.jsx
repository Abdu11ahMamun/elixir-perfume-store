import { useState } from "react";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";

const CATEGORIES  = ["For Him", "For Her", "Luxury Oud", "Gift Sets"];
const STATUSES    = ["ACTIVE", "INACTIVE"];
const SIZE_OPTIONS = [6, 15, 30]; // available ML sizes

// ─── Default size entry ───────────────────────────────────
const defaultSizeEntry = (ml) => ({ ml, enabled: false, price: "", stock: "", images: [] });

export default function AdminProductForm() {
  // ── Basic fields ──
  const [name, setName]             = useState("");
  const [inspiredBy, setInspiredBy] = useState("");
  const [category, setCategory]     = useState("");
  const [status, setStatus]         = useState("ACTIVE");
  const [description, setDescription] = useState("");
  const [note, setNote]             = useState("");
  const [isCombo, setIsCombo]       = useState(false);
  const [offerTag, setOfferTag]     = useState("");

  // ── Size entries ──
  const [sizes, setSizes] = useState(
    SIZE_OPTIONS.map(defaultSizeEntry)
  );

  // ── Publishing toggles ──
  const [visible, setVisible]         = useState(true);
  const [featuredHome, setFeaturedHome] = useState(false);

  // ── Size helpers ──────────────────────────────────────
  const toggleSize = (ml) => {
    setSizes((prev) =>
      prev.map((s) => s.ml === ml ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const updateSizeField = (ml, field, value) => {
    setSizes((prev) =>
      prev.map((s) => s.ml === ml ? { ...s, [field]: value } : s)
    );
  };

  const addImageUrl = (ml, url) => {
    if (!url.trim()) return;
    setSizes((prev) =>
      prev.map((s) =>
        s.ml === ml ? { ...s, images: [...s.images, url.trim()] } : s
      )
    );
  };

  const removeImage = (ml, idx) => {
    setSizes((prev) =>
      prev.map((s) =>
        s.ml === ml ? { ...s, images: s.images.filter((_, i) => i !== idx) } : s
      )
    );
  };

  const enabledSizes = sizes.filter((s) => s.enabled);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name, inspiredBy, category, status, description, note, isCombo,
      offerTag: isCombo ? offerTag : undefined,
      sizes: enabledSizes.map((s) => ({
        ml: s.ml,
        price: Number(s.price),
        stock: Number(s.stock),
        images: s.images,
      })),
      visible, featuredHome,
    };
    // BACKEND NOTE: POST /api/admin/products
    console.log("Save product →", payload);
    alert("Product saved! (Connect to backend API)");
  };

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Product Atelier"
          title="Add Product"
          description="Create a fragrance with sizes (6ml / 15ml / 30ml), ML stock, inspired-by, and media."
          action={
            <button
              type="submit"
              className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl shadow-black/10 transition hover:-translate-y-0.5"
            >
              Save Product
            </button>
          }
        />

        <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">

            {/* ── Basic Info ── */}
            <AdminCard title="Product Information" description="Core catalog identity">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product Name"  value={name}       onChange={setName}       placeholder="Noir Ember" required />
                <Field label="Inspired By"   value={inspiredBy} onChange={setInspiredBy} placeholder="Bleu de Chanel" required />
                <SelectField label="Category" value={category} onChange={setCategory} options={CATEGORIES} required />
                <SelectField label="Status"   value={status}   onChange={setStatus}   options={STATUSES} />
              </div>
              <div className="mt-5">
                <Field label="Scent Note (short)" value={note} onChange={setNote} placeholder="Woody · Smoky · Bold" />
              </div>
              <div className="mt-5">
                <TextArea label="Description" value={description} onChange={setDescription}
                  placeholder="A deep, smoky signature fragrance crafted for confident evenings..." />
              </div>

              {/* Combo toggle */}
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Combo / Special Offer</p>
                  <p className="text-xs text-[var(--mist)] mt-0.5">Appears in the Offers section</p>
                </div>
                <Toggle value={isCombo} onChange={setIsCombo} />
              </div>

              {isCombo && (
                <div className="mt-3">
                  <Field label="Offer Tag" value={offerTag} onChange={setOfferTag}
                    placeholder="Valentine's Special, Eid Special..." />
                </div>
              )}
            </AdminCard>

            {/* ── Sizes & Stock ── */}
            <AdminCard title="Sizes, Pricing & Stock" description="Enable each size variant and set price + stock">
              <p className="mb-5 text-xs text-[var(--mist)]">
                Toggle the sizes this product comes in. Each size has its own price, stock, and images.
              </p>

              <div className="space-y-6">
                {sizes.map((s) => (
                  <div key={s.ml}
                    className="rounded-2xl border transition-all duration-300"
                    style={{ borderColor: s.enabled ? "var(--gold)" : "rgba(201,169,110,0.15)", background: s.enabled ? "#fffcf8" : "#faf7f2" }}>

                    {/* Size header */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-lg" style={{ color: "var(--ink)" }}>{s.ml}ml</span>
                        {s.ml === 30 && <span style={{ fontSize: "0.55rem", padding: "2px 8px", background: "var(--gold)", color: "var(--ink)", letterSpacing: "0.15em" }}>PRIORITY 1</span>}
                        {s.ml === 15 && <span style={{ fontSize: "0.55rem", padding: "2px 8px", background: "rgba(201,169,110,0.2)", color: "var(--gold-dark)", letterSpacing: "0.15em" }}>PRIORITY 2</span>}
                        {s.ml === 6  && <span style={{ fontSize: "0.55rem", padding: "2px 8px", background: "rgba(14,12,10,0.08)", color: "var(--mist)", letterSpacing: "0.15em" }}>PRIORITY 3</span>}
                      </div>
                      <Toggle value={s.enabled} onChange={() => toggleSize(s.ml)} />
                    </div>

                    {/* Size fields — only when enabled */}
                    {s.enabled && (
                      <div className="border-t border-[var(--gold)]/10 px-5 pb-5 pt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label={`Price (৳) — ${s.ml}ml`}
                            value={s.price}
                            onChange={(v) => updateSizeField(s.ml, "price", v)}
                            placeholder="650"
                            type="number"
                            required
                          />
                          <Field
                            label={`Stock (units) — ${s.ml}ml`}
                            value={s.stock}
                            onChange={(v) => updateSizeField(s.ml, "stock", v)}
                            placeholder="24"
                            type="number"
                            required
                          />
                        </div>

                        {/* Image URLs for this size */}
                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">
                            Images — {s.ml}ml
                          </label>

                          {/* Existing images */}
                          {s.images.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {s.images.map((img, i) => (
                                <div key={i} className="relative group">
                                  <img src={img} alt="" className="w-16 h-20 object-cover rounded-xl" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(s.ml, i)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add image URL */}
                          <ImageUrlInput onAdd={(url) => addImageUrl(s.ml, url)} />

                          <p className="mt-1.5 text-[10px] text-[var(--mist)]">
                            Add Unsplash URLs or your hosted image URLs. Multiple images enable the slider.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              {enabledSizes.length > 0 && (
                <div className="mt-6 rounded-2xl bg-[var(--warm)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)] mb-2">Enabled sizes summary</p>
                  <div className="flex flex-wrap gap-3">
                    {enabledSizes.map((s) => (
                      <div key={s.ml} className="text-sm" style={{ color: "var(--ink)" }}>
                        <span className="font-mono font-bold">{s.ml}ml</span>
                        {s.price && <span className="text-[var(--mist)]"> · ৳{s.price}</span>}
                        {s.stock && <span className="text-[var(--mist)]"> · {s.stock} units</span>}
                        {s.images.length > 0 && <span className="text-[var(--mist)]"> · {s.images.length} img</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AdminCard>

          </div>

          {/* ── Right column ── */}
          <div className="space-y-8">

            {/* Publishing */}
            <AdminCard title="Publishing" description="Storefront visibility controls">
              <div className="space-y-4">
                <ToggleRow label="Visible in storefront"   value={visible}      onChange={setVisible} />
                <ToggleRow label="Feature on homepage"     value={featuredHome} onChange={setFeaturedHome} />
              </div>
            </AdminCard>

            {/* SEO preview */}
            <AdminCard title="SEO Preview" description="How this perfume may appear in search">
              <div className="rounded-[1.5rem] border border-[var(--gold)]/10 bg-[#fffcf8] p-5">
                <p className="text-xs text-[var(--gold-dark)]">elixir.com/perfume/{name.toLowerCase().replace(/\s+/g, "-") || "product-name"}</p>
                <h3 className="mt-2 font-display text-3xl font-light">{name || "Product Name"} — ÉLIXIR</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--mist)]">{description || "Product description will appear here."}</p>
              </div>
            </AdminCard>

            {/* Order ID preview */}
            <AdminCard title="Order ID Preview" description="Generated format for this product's sizes">
              <div className="space-y-2">
                {enabledSizes.length > 0 ? (
                  enabledSizes.map((s) => (
                    <div key={s.ml} className="flex items-center justify-between rounded-xl bg-[var(--warm)] px-4 py-3">
                      <span className="text-xs text-[var(--mist)]">{s.ml}ml orders</span>
                      <span className="font-mono font-bold text-sm" style={{ color: "var(--ink)" }}>
                        {String(s.ml).padStart(2,"0")}101, {String(s.ml).padStart(2,"0")}102...
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--mist)]">Enable at least one size to see the order ID format.</p>
                )}
              </div>
            </AdminCard>

          </div>
        </section>
      </div>
    </form>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative h-7 w-12 rounded-full transition-colors duration-300 shrink-0"
      style={{ background: value ? "var(--gold)" : "rgba(14,12,10,0.15)" }}
    >
      <span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: value ? "calc(100% - 1.25rem - 4px)" : "4px" }}
      />
    </button>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] px-4 py-3">
      <span className="text-sm text-[var(--mist)]">{label}</span>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// Image URL input with add button
function ImageUrlInput({ onAdd }) {
  const [url, setUrl] = useState("");
  return (
    <div className="flex gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://images.unsplash.com/..."
        className="flex-1 rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[var(--gold)]"
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(url); setUrl(""); } }}
      />
      <button
        type="button"
        onClick={() => { onAdd(url); setUrl(""); }}
        className="rounded-2xl bg-[#0b0805] px-4 py-2.5 text-xs text-[var(--gold)] transition hover:-translate-y-0.5"
      >
        Add
      </button>
    </div>
  );
}