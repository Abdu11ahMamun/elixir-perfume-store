import apiClient from "./apiClient";

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════

export async function getDashboardSummary() {
  const res = await apiClient.get("/api/v1/admin/dashboard/summary");
  return res.data.data;
  // { totalProducts, activeProducts, totalOrders, pendingOrders, totalRevenue, totalCustomers }
}

// ═══════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════

export async function getAdminCategories() {
  const res = await apiClient.get("/api/v1/admin/categories");
  return res.data.data;
}

export async function getCategoryById(id) {
  const res = await apiClient.get(`/api/v1/admin/categories/${id}`);
  return res.data.data;
}

export async function createCategory(data) {
  // data: { name, slug, description, active }
  const res = await apiClient.post("/api/v1/admin/categories", data);
  return res.data.data;
}

export async function updateCategory(id, data) {
  const res = await apiClient.put(`/api/v1/admin/categories/${id}`, data);
  return res.data.data;
}

export async function toggleCategoryStatus(id) {
  const res = await apiClient.patch(`/api/v1/admin/categories/${id}/toggle-status`);
  return res.data.data;
}

export async function deleteCategory(id) {
  const res = await apiClient.delete(`/api/v1/admin/categories/${id}`);
  return res.data;
}

// ═══════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════

export async function getAdminProducts(params = {}) {
  const { page = 0, size = 20, sort = "createdAt,desc", search, category, status } = params;
  const query = new URLSearchParams({ page, size, sort });
  if (search)   query.set("search", search);
  if (category) query.set("category", category);
  if (status)   query.set("status", status);

  const res = await apiClient.get(`/api/v1/admin/products?${query}`);
  return res.data.data;
}

export async function getAdminProductById(id) {
  const res = await apiClient.get(`/api/v1/admin/products/${id}`);
  return res.data.data;
}

export async function createProduct(data) {
  // data: { name, inspiredBy, description, note, combo, status, categoryId, offerTagId }
  const res = await apiClient.post("/api/v1/admin/products", data);
  return res.data.data;
}

export async function updateProduct(id, data) {
  const res = await apiClient.put(`/api/v1/admin/products/${id}`, data);
  return res.data.data;
}

export async function updateProductStatus(id, status) {
  const res = await apiClient.patch(`/api/v1/admin/products/${id}/status`, { status });
  return res.data.data;
}

export async function deleteProduct(id) {
  const res = await apiClient.delete(`/api/v1/admin/products/${id}`);
  return res.data;
}

// ═══════════════════════════════════════════
// PRODUCT SIZES
// ═══════════════════════════════════════════

export async function addProductSize(productId, data) {
  // data: { ml, price, stock, sku, imageUrls, active }
  const res = await apiClient.post(`/api/v1/admin/products/${productId}/sizes`, data);
  return res.data.data;
}

export async function updateProductSize(sizeId, data) {
  const res = await apiClient.put(`/api/v1/admin/products/sizes/${sizeId}`, data);
  return res.data.data;
}

export async function deleteProductSize(sizeId) {
  const res = await apiClient.delete(`/api/v1/admin/products/sizes/${sizeId}`);
  return res.data;
}

// ═══════════════════════════════════════════
// IMAGE UPLOAD
// ═══════════════════════════════════════════

/**
 * Upload a product image
 * @param {File} file — image file (jpeg/png/webp, max 5MB)
 * @returns {string} relative path — e.g. "/uploads/products/abc.png"
 */
export async function uploadImage(file) {
  // Validate before upload
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/api/v1/admin/media/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data; // "/uploads/products/generated-name.png"
}

// ═══════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════

export async function getAdminOrders(params = {}) {
  const {
    page = 0, size = 20, sort = "createdAt,desc",
    orderStatus, paymentStatus, customerPhone,
    dateFrom, dateTo,
  } = params;

  const query = new URLSearchParams({ page, size, sort });
  if (orderStatus)   query.set("orderStatus", orderStatus);
  if (paymentStatus) query.set("paymentStatus", paymentStatus);
  if (customerPhone) query.set("customerPhone", customerPhone);
  if (dateFrom)      query.set("dateFrom", dateFrom);
  if (dateTo)        query.set("dateTo", dateTo);

  const res = await apiClient.get(`/api/v1/admin/orders?${query}`);
  return res.data.data;
}

export async function getAdminOrderByNumber(orderNumber) {
  const res = await apiClient.get(`/api/v1/admin/orders/${orderNumber}`);
  return res.data.data;
}

export async function updateOrderStatus(orderNumber, orderStatus) {
  const res = await apiClient.patch(
    `/api/v1/admin/orders/${orderNumber}/status`,
    { orderStatus }
  );
  return res.data.data;
}

export async function updatePaymentStatus(orderNumber, paymentStatus) {
  const res = await apiClient.patch(
    `/api/v1/admin/orders/${orderNumber}/payment-status`,
    { paymentStatus }
  );
  return res.data.data;
}