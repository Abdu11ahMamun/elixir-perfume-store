import axios from "axios";

// ─── Base URL from env ────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://160.25.226.124:8080";

// ─── Axios instance ───────────────────────────────────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach token ──────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("elixir_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle errors globally ───────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear and redirect to admin login
      localStorage.removeItem("elixir_admin_token");
      localStorage.removeItem("elixir_admin_user");
      // Trigger re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }

    return Promise.reject(error);
  }
);

// ─── Helper: image URL builder ────────────────────────────
// Backend returns relative paths like "/uploads/products/file.png"
// This converts to full URL for display
export function buildImageUrl(relativePath) {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath; // already full URL
  return `${BASE_URL}${relativePath}`;
}

export { BASE_URL };
export default apiClient;