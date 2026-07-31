import { useEffect, useState } from "react";
import AdminCard       from "../components/ui/AdminCard";
import AdminPageHeader from "../components/ui/AdminPageHeader";
import AdminButton     from "../components/ui/AdminButton";
import { AdminField, AdminTextArea, AdminSelectField, AdminToggle, AdminToggleRow } from "../components/ui/AdminInput";
import {
  createProduct,
  addProductSize,
  uploadImage,
  getAdminCategories,
} from "../../services/adminService";

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
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Catalog"
          title="Add Product"
          description="Create a fragrance with sizes (6ml / 15ml / 30ml), stock, and media."
          action={
            <AdminButton type="submit" variant="primary" loading={saving}>
              {saving ? "Saving…" : "Save Product"}
            </AdminButton>
          }
        />

        {/* Success / Error banners */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">

            {/* Basic info */}
            <AdminCard title="Product Information" description="Core catalog identity">
              <div className="grid gap-4 md:grid-cols-2">
                <AdminField label="Product Name" value={name} onChange={e => setName(e.target.value)} placeholder="Noir Ember" required />
                <AdminField label="Inspired By"  value={inspiredBy} onChange={e => setInspiredBy(e.target.value)} placeholder="Bleu de Chanel" required />

                <AdminSelectField
                  label="Category"
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  options={[{ value: "", label: "Select Category" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                  required
                />

                <AdminSelectField label="Status" value={status} onChange={e => setStatus(e.target.value)} options={STATUSES} />
              </div>

              <div className="mt-4">
                <AdminField label="Scent Note (short)" value={note} onChange={e => setNote(e.target.value)} placeholder="Woody · Smoky · Bold" />
              </div>
              <div className="mt-4">
                <AdminTextArea label="Description" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="A commanding woody-smoky signature..." />
              </div>

              {/* Combo toggle */}
              <div className="mt-4">
                <AdminToggleRow label="Combo / Special Offer" sub="Appears in the Offers section" value={isCombo} onChange={setIsCombo} />
              </div>

              {isCombo && (
                <div className="mt-3">
                  <AdminField label="Offer Tag (optional)" value={offerTagId} onChange={e => setOfferTagId(e.target.value)}
                    placeholder="e.g. Valentine's Special" />
                </div>
              )}
            </AdminCard>

            {/* Sizes */}
            <AdminCard title="Sizes, Pricing & Stock" description="Enable each size and set price, stock, and images">
              <p className="mb-5 text-xs text-gray-500">
                Each size has its own price, stock count, and images. Images are uploaded directly to the server.
              </p>

              <div className="space-y-4">
                {sizes.map(s => (
                  <div key={s.ml}
                    className={`rounded-xl border transition-colors ${s.enabled ? "border-[#c9a96e]/40 bg-white" : "border-gray-200 bg-gray-50/60"}`}
                  >
                    {/* Size header */}
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-base font-semibold text-gray-900">{s.ml}ml</span>
                        {s.ml === 30 && <PriorityTag label="PRIORITY 1" gold />}
                        {s.ml === 15 && <PriorityTag label="PRIORITY 2" />}
                        {s.ml === 6  && <PriorityTag label="PRIORITY 3" muted />}
                      </div>
                      <AdminToggle value={s.enabled} onChange={() => toggleSize(s.ml)} />
                    </div>

                    {s.enabled && (
                      <div className="space-y-4 border-t border-gray-100 px-4 pb-4 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <AdminField label="Price (৳)"     value={s.price} onChange={e => updateSize(s.ml, "price", e.target.value)} placeholder="650" type="number" required />
                          <AdminField label="Stock (units)" value={s.stock} onChange={e => updateSize(s.ml, "stock", e.target.value)} placeholder="24"  type="number" required />
                        </div>
                        <AdminField label="SKU (optional)" value={s.sku} onChange={e => updateSize(s.ml, "sku", e.target.value)} placeholder={`ELX-NK-${s.ml}`} />

                        {/* Image upload */}
                        <div>
                          <span className="mb-1.5 block text-xs font-medium text-gray-600">
                            Images — {s.ml}ml
                          </span>

                          {/* Previews */}
                          {(s.imageUrls.length > 0 || s._previews.length > 0) && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {s._previews.map((preview, i) => (
                                <div key={i} className="group relative">
                                  <img src={preview} alt="" className="h-20 w-16 rounded-lg object-cover" />
                                  {i >= s.imageUrls.length && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
                                      <span className="text-[10px] text-white">Uploading…</span>
                                    </div>
                                  )}
                                  {i < s.imageUrls.length && (
                                    <button type="button" onClick={() => removeImage(s.ml, i)}
                                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100">
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Upload button */}
                          <label className="flex cursor-pointer items-center gap-3">
                            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-500 transition hover:border-gray-400">
                              {s._uploading ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c9a96e]/30 border-t-[var(--gold)]" />
                              ) : "📎"}
                              {s._uploading ? "Uploading…" : "Upload Image"}
                            </div>
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                              onChange={e => e.target.files[0] && handleImageUpload(s.ml, e.target.files[0])}
                            />
                          </label>
                          <p className="mt-1.5 text-[11px] text-gray-400">
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
                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Enabled sizes summary</p>
                  <div className="flex flex-wrap gap-3">
                    {enabledSizes.map(s => (
                      <div key={s.ml} className="text-sm text-gray-700">
                        <span className="font-mono font-semibold">{s.ml}ml</span>
                        {s.price && <span className="text-gray-400"> · ৳{s.price}</span>}
                        {s.stock && <span className="text-gray-400"> · {s.stock} units</span>}
                        {s.imageUrls.length > 0 && <span className="text-gray-400"> · {s.imageUrls.length} img</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AdminCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">

            <AdminCard title="Publishing" description="Storefront visibility controls">
              <AdminToggleRow label="Feature on homepage" value={isFeatured} onChange={setIsFeatured} />
            </AdminCard>

            <AdminCard title="SEO Preview">
              <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
                <p className="text-xs text-[var(--gold-dark)]">
                  elixir.com/perfume/{name.toLowerCase().replace(/\s+/g, "-") || "product-name"}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{name || "Product Name"} — ÉLIXIR</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description || "Product description will appear here."}
                </p>
              </div>
            </AdminCard>

            <AdminCard title="Order ID Preview">
              <div className="space-y-2">
                {enabledSizes.length > 0 ? enabledSizes.map(s => (
                  <div key={s.ml} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <span className="text-xs text-gray-500">{s.ml}ml orders</span>
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {String(s.ml).padStart(2, "0")}101, {String(s.ml).padStart(2, "0")}102…
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400">Enable at least one size.</p>
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

function PriorityTag({ label, gold, muted }) {
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-medium tracking-wide ${
      gold ? "bg-[#c9a96e]/20 text-[var(--gold-dark)]" : muted ? "bg-gray-100 text-gray-400" : "bg-gray-100 text-gray-600"
    }`}>
      {label}
    </span>
  );
}
