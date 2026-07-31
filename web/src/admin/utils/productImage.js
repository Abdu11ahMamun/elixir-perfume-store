import { buildImageUrl } from "../../services/apiClient";

// Single source of truth for resolving a product's thumbnail across the
// admin panel (list, dashboard, etc). Mirrors the storefront's resolution
// (adaptProduct → buildImageUrl) so both surfaces treat backend-relative
// paths the same way.
export function getProductThumbnail(product) {
  const first = (product?.sizes || [])[0];
  const url = first?.imageUrls?.[0] || first?.images?.[0] || product?.image || product?.primaryImage || "";
  return buildImageUrl(url);
}
