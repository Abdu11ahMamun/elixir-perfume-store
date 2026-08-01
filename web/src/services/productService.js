import apiClient, { buildImageUrl } from "./apiClient";

// ─── Public Product APIs ──────────────────────────────────

/**
 * Get paginated product list
 * @param {object} params - { page, size, sort, categoryId, search }
 */
export async function getProducts(params = {}) {
  const {
    page = 0,
    size = 20,
    sort = "createdAt,desc",
    categoryId,
    search,
  } = params;

  const query = new URLSearchParams({ page, size, sort });
  if (search?.trim()) query.set("search", search.trim());

  // If filtering by category, use category endpoint
  if (categoryId && categoryId !== "all") {
    const res = await apiClient.get(
      `/api/v1/public/products/category/${categoryId}?${query}`
    );
    return res.data.data; // { content, page, size, totalElements, totalPages }
  }

  const res = await apiClient.get(`/api/v1/public/products?${query}`);
  return res.data.data;
}

/**
 * Get single product by ID
 * @param {number} id
 */
export async function getProductById(id) {
  const res = await apiClient.get(`/api/v1/public/products/${id}`);
  return res.data.data;
}

/**
 * Get featured products (homepage)
 *
 * The backend has no dedicated "featured" endpoint or flag on ProductResponse
 * (confirmed against PublicProductController — only list/by-id/by-category
 * exist). This fetches a small batch of the most recent active products from
 * the real public products endpoint; the caller selects the first N that are
 * actually suitable to display (i.e. have at least one active size).
 */
export async function getFeaturedProducts() {
  const res = await apiClient.get("/api/v1/public/products", {
    params: { page: 0, size: 12, sort: "createdAt,desc" },
  });
  return res.data.data; // { content, page, size, totalElements, totalPages }
}

/**
 * Get combo/offer products
 */
export async function getOfferProducts() {
  const res = await apiClient.get("/api/v1/public/products/offers");
  return res.data.data;
}

/**
 * Get paginated best-seller products
 */
export async function getBestSellers(params = {}) {
  const { page = 0, size = 6, sort = "createdAt,desc" } = params;
  const query = new URLSearchParams({ page, size, sort });
  const res = await apiClient.get(`/api/v1/public/products/best-sellers?${query}`);
  return res.data.data; // { content, page, size, totalElements, totalPages }
}

/**
 * Get all active categories
 */
export async function getCategories() {
  const res = await apiClient.get("/api/v1/public/categories");
  return res.data.data; // array of { id, name, slug, ... }
}

// ─── Data adapter ─────────────────────────────────────────
// Backend product shape → Frontend product shape
// This keeps all transformation in one place
export function adaptProduct(backendProduct) {
  if (!backendProduct) return null;

  return {
    // Core identity
    id:          backendProduct.id,
    name:        backendProduct.name,
    inspiredBy:  backendProduct.inspiredBy || "",
    category:    backendProduct.categoryName || "",
    categoryId:  backendProduct.categoryId,
    note:        backendProduct.note || "",
    description: backendProduct.description || "",
    isCombo:     backendProduct.combo || false,
    offerTag:    backendProduct.offerTagName || null,
    status:      backendProduct.status,

    // Sizes — map imageUrls to images for existing components
    // Backend returns relative paths ("/uploads/products/x.png"); resolve
    // to absolute URLs here so every consumer (cards, detail, cart) gets a
    // working <img src> the same way the admin panel does.
    sizes: (backendProduct.sizes || []).map((s) => ({
      id:       s.id,           // productSizeId — needed for order
      ml:       s.ml,
      price:    s.price,
      stock:    s.stock,
      sku:      s.sku,
      images:   (s.imageUrls || []).map(buildImageUrl), // renamed + resolved to absolute URL
    })),
  };
}

/**
 * Adapt a list of products
 */
export function adaptProducts(backendList) {
  return (backendList || []).map(adaptProduct);
}