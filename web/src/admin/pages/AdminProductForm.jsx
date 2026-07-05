import { useEffect, useState } from "react";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import {
  createProduct,
  addProductSize,
  uploadImage,
  getAdminCategories,
} from "../../services/adminService";
import { buildImageUrl } from "../../services/apiClient";

const STATUSES     = ["ACTIVE", "DRAFT", "INACTIVE"];
const SIZE_OPTIONS = [6, 15, 30];

const defaultSizeEntry = (ml) => ({
  ml,
  enabled:  false,
  price:    "",
  stock:    "",
  sku:      "",
  imageUrls: [],           // relative paths from upload API
  _previews:  [],          // local blob URLs for preview only
  _uploading: false,
});

export default function AdminProductForm({ onSaved }) {
  // ── Basic fields ──
  const [name,        setName]        = useState("");
  const [inspiredBy,  setInspiredBy]  = useState("");
  const [categoryId,  setCategoryId]  = useState("");
  const [status,      setStatus]      = useState("ACTIVE");
  const [description, setDescription] = useState("");
  const [note,        setNote]        = useState("");
  const [isCombo,     setIsCombo]     = useState(false);
  const [offerTagId,  setOfferTagId]  = useState("");
  const [isFeatured,  setIsFeatured]  = useState(false);

  // ── Size entries ──
  const [sizes, setSizes] = useState(SIZE_OPTIONS.map(defaultSizeEntry));

  // ── Categories from API ──
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getAdminCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // ── Submission state ──
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  // ── Size helpers ──
  const toggleSize = (ml) =>
    setSizes(prev => prev.map(s => s.ml === ml ? { ...s, enabled: !s.enabled } : s));

  const updateSize = (ml, field, value) =>
    setSizes(prev => prev.map(s => s.ml === ml ? { ...s, [field]: value } : s));

  const handleImageUpload = async (ml, file) => {
    if (!file) return;
    updateSize(ml, "_uploading", true);

    // Local preview
    const preview = URL.createObjectURL(file);
    setSizes(prev => prev.map(s =>
      s.ml === ml ? { ...s, _previews: [...s._previews, preview] } : s
    ));

    try {
      const relativePath = await uploadImage(file);
      setSizes(prev => prev.map(s =>
        s.ml === ml ? { ...s, imageUrls: [...s.imageUrls, relativePath] } : s
      ));
    } catch (err) {
      alert(err.message || "Image upload failed");
      // Remove preview on failure
      setSizes(prev => prev.map(s =>
        s.ml === ml ? { ...s, _previews: s._previews.filter(p => p !== preview) } : s
      ));
    } finally {
      updateSize(ml, "_uploading", false);
    }
  };

  const removeImage = (ml, idx) => {
    setSizes(prev => prev.map(s =>
      s.ml === ml ? {
        ...s,
        imageUrls: s.imageUrls.filter((_, i) => i !== idx),
        _previews: s._previews.filter((_, i) => i !== idx),
      } : s
    ));
  };

  const enabledSizes = sizes.filter(s => s.enabled);

  // ── Submit ────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (enabledSizes.length === 0) {
      setError("Please enable at least one size.");
      return;
    }

    setSaving(true);
    try {
      // Step 1: Create product
      const product = await createProduct({
        name,
        inspiredBy,
        description,
        note,
        combo:       isCombo,
        status,
        categoryId:  Number(categoryId),
        offerTagId:  offerTagId ? Number(offerTagId) : null,
        isFeatured,
      });

      // Step 2: Add each enabled size
      await Promise.all(
        enabledSizes.map(s =>
          addProductSize(product.id, {
            ml:        s.ml,
            price:     Number(s.price),
            stock:     Number(s.stock),
            sku:       s.sku || `ELX-${product.id}-${s.ml}`,
            imageUrls: s.imageUrls,
            active:    true,
          })
        )
      );

      setSuccess(`"${product.name}" created successfully!`);

      // Reset form
      setName(""); setInspiredBy(""); setCategoryId(""); setDescription("");
      setNote(""); setIsCombo(false); setOfferTagId(""); setIsFeatured(false);
      setSizes(SIZE_OPTIONS.map(defaultSizeEntry));

      onSaved?.();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to save product.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Product Atelier"
          title="Add Product"
          description="Create a fragrance with sizes (6ml / 15ml / 30ml), ML stock, and media."
          action={
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#0b0805] px-6 py-3 text-sm font-medium text-[var(--gold)] shadow-xl transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Product"}
            </button>
          }
        />

        {/* Success / Error banners */}
        {success && (
          <div className="rounded-2xl p-4 text-sm" style={{ background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", color: "var(--gold-dark)" }}>
            ✦ {success}
          </div>
        )}
        {error && (
          <div className="rounded-2xl p-4 text-sm" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid rgba(185,28,28,0.2)", color: "#b91c1c" }}>
            {error}
          </div>
        )}

        <section className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">

            {/* Basic info */}
            <AdminCard title="Product Information" description="Core catalog identity">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product Name"       value={name}        onChange={setName}        placeholder="Noir Ember"      required />
                <Field label="Inspired By"        value={inspiredBy}  onChange={setInspiredBy}  placeholder="Bleu de Chanel"  required />

                {/* Category dropdown — from API */}
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">Category</span>
                  <select
                    required value={categoryId} onChange={e => setCategoryId(e.target.value)}
                    className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </label>

                <SelectField label="Status" value={status} onChange={setStatus} options={STATUSES} />
              </div>

              <div className="mt-5">
                <Field label="Scent Note (short)" value={note} onChange={setNote} placeholder="Woody · Smoky · Bold" />
              </div>
              <div className="mt-5">
                <TextArea label="Description" value={description} onChange={setDescription}
                  placeholder="A commanding woody-smoky signature..." />
              </div>

              {/* Combo toggle */}
              <ToggleRow label="Combo / Special Offer" sub="Appears in the Offers section" value={isCombo} onChange={setIsCombo} />

              {isCombo && (
                <div className="mt-3">
                  <Field label="Offer Tag (optional)" value={offerTagId} onChange={setOfferTagId}
                    placeholder="e.g. Valentine's Special" />
                </div>
              )}
            </AdminCard>

            {/* Sizes */}
            <AdminCard title="Sizes, Pricing & Stock" description="Enable each size and set price, stock, and images">
              <p className="mb-5 text-xs text-[var(--mist)]">
                Each size has its own price, stock count, and images. Images are uploaded directly to the server.
              </p>

              <div className="space-y-6">
                {sizes.map(s => (
                  <div key={s.ml}
                    className="rounded-2xl border transition-all duration-300"
                    style={{
                      borderColor: s.enabled ? "var(--gold)" : "rgba(201,169,110,0.15)",
                      background:  s.enabled ? "#fffcf8" : "#faf7f2",
                    }}
                  >
                    {/* Size header */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-lg" style={{ color: "var(--ink)" }}>{s.ml}ml</span>
                        {s.ml === 30 && <PriorityTag label="PRIORITY 1" gold />}
                        {s.ml === 15 && <PriorityTag label="PRIORITY 2" />}
                        {s.ml === 6  && <PriorityTag label="PRIORITY 3" muted />}
                      </div>
                      <Toggle value={s.enabled} onChange={() => toggleSize(s.ml)} />
                    </div>

                    {s.enabled && (
                      <div className="border-t border-[var(--gold)]/10 px-5 pb-5 pt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label={`Price (৳)`}    value={s.price} onChange={v => updateSize(s.ml, "price", v)} placeholder="650" type="number" required />
                          <Field label={`Stock (units)`} value={s.stock} onChange={v => updateSize(s.ml, "stock", v)} placeholder="24"  type="number" required />
                        </div>
                        <Field label="SKU (optional)" value={s.sku} onChange={v => updateSize(s.ml, "sku", v)} placeholder={`ELX-NK-${s.ml}`} />

                        {/* Image upload */}
                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">
                            Images — {s.ml}ml
                          </label>

                          {/* Previews */}
                          {(s.imageUrls.length > 0 || s._previews.length > 0) && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {s._previews.map((preview, i) => (
                                <div key={i} className="relative group">
                                  <img src={preview} alt="" className="w-16 h-20 object-cover rounded-xl" />
                                  {i >= s.imageUrls.length && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl">
                                      <span className="text-white text-[10px]">Uploading…</span>
                                    </div>
                                  )}
                                  {i < s.imageUrls.length && (
                                    <button type="button" onClick={() => removeImage(s.ml, i)}
                                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Upload button */}
                          <label className="flex items-center gap-3 cursor-pointer">
                            <div className="flex items-center gap-2 rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-2.5 text-sm text-[var(--mist)] hover:border-[var(--gold)] transition">
                              {s._uploading ? (
                                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                                  style={{ borderColor: "rgba(201,169,110,0.3)", borderTopColor: "var(--gold)" }} />
                              ) : "📎"}
                              {s._uploading ? "Uploading…" : "Upload Image"}
                            </div>
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                              onChange={e => e.target.files[0] && handleImageUpload(s.ml, e.target.files[0])}
                            />
                          </label>
                          <p className="mt-1.5 text-[10px] text-[var(--mist)]">
                            JPG, PNG, WebP · Max 5MB · Multiple images enable the slider
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
                    {enabledSizes.map(s => (
                      <div key={s.ml} className="text-sm" style={{ color: "var(--ink)" }}>
                        <span className="font-mono font-bold">{s.ml}ml</span>
                        {s.price && <span className="text-[var(--mist)]"> · ৳{s.price}</span>}
                        {s.stock && <span className="text-[var(--mist)]"> · {s.stock} units</span>}
                        {s.imageUrls.length > 0 && <span className="text-[var(--mist)]"> · {s.imageUrls.length} img</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AdminCard>
          </div>

          {/* Right column */}
          <div className="space-y-8">

            <AdminCard title="Publishing" description="Storefront visibility controls">
              <div className="space-y-4">
                <ToggleRow label="Feature on homepage" value={isFeatured} onChange={setIsFeatured} />
              </div>
            </AdminCard>

            <AdminCard title="SEO Preview">
              <div className="rounded-[1.5rem] border border-[var(--gold)]/10 bg-[#fffcf8] p-5">
                <p className="text-xs text-[var(--gold-dark)]">
                  elixir.com/perfume/{name.toLowerCase().replace(/\s+/g, "-") || "product-name"}
                </p>
                <h3 className="mt-2 font-display text-3xl font-light">{name || "Product Name"} — ÉLIXIR</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--mist)]">
                  {description || "Product description will appear here."}
                </p>
              </div>
            </AdminCard>

            <AdminCard title="Order ID Preview">
              <div className="space-y-2">
                {enabledSizes.length > 0 ? enabledSizes.map(s => (
                  <div key={s.ml} className="flex items-center justify-between rounded-xl bg-[var(--warm)] px-4 py-3">
                    <span className="text-xs text-[var(--mist)]">{s.ml}ml orders</span>
                    <span className="font-mono font-bold text-sm" style={{ color: "var(--ink)" }}>
                      {String(s.ml).padStart(2, "0")}101, {String(s.ml).padStart(2, "0")}102…
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-[var(--mist)]">Enable at least one size.</p>
                )}
              </div>
            </AdminCard>
          </div>
        </section>
      </div>
    </form>
  );
}

/* ─── Sub-components ──────────────────────────────────── */

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-[var(--gold-dark)]">{label}</span>
      <textarea rows={4} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[var(--mist)]/50 focus:border-[var(--gold)]"
      />
    </label>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="relative h-7 w-12 rounded-full transition-colors duration-300 shrink-0"
      style={{ background: value ? "var(--gold)" : "rgba(14,12,10,0.15)" }}>
      <span className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: value ? "calc(100% - 1.25rem - 4px)" : "4px" }} />
    </button>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--gold)]/10 bg-[#fffcf8] px-4 py-3 mt-5">
      <div>
        <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
        {sub && <p className="text-xs text-[var(--mist)] mt-0.5">{sub}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function PriorityTag({ label, gold, muted }) {
  return (
    <span style={{
      fontSize: "0.55rem", padding: "2px 8px", letterSpacing: "0.15em",
      background: gold ? "var(--gold)" : muted ? "rgba(14,12,10,0.08)" : "rgba(201,169,110,0.2)",
      color: gold ? "var(--ink)" : muted ? "var(--mist)" : "var(--gold-dark)",
    }}>
      {label}
    </span>
  );
}