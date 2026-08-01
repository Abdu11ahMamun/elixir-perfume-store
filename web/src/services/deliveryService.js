import apiClient from "./apiClient";

// ─── Public delivery-location APIs ────────────────────────

export async function getDeliveryDistricts() {
  const res = await apiClient.get("/api/v1/public/delivery-areas/districts");
  return res.data.data; // string[]
}

export async function getDeliveryUpazilas(district) {
  const res = await apiClient.get(
    `/api/v1/public/delivery-areas/districts/${encodeURIComponent(district)}/upazilas`
  );
  return res.data.data; // string[]
}

/**
 * Resolve the applicable delivery charge for a district (+ optional upazila).
 * @returns {{ district: string, upazila: string|null, charge: number }}
 */
export async function getDeliveryCharge(district, upazila) {
  const params = new URLSearchParams({ district });
  if (upazila) params.set("upazila", upazila);
  const res = await apiClient.get(`/api/v1/public/delivery-areas/charge?${params}`);
  return res.data.data;
}
