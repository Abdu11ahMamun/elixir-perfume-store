import apiClient from "./apiClient";

const TOKEN_KEY = "elixir_admin_token";
const USER_KEY  = "elixir_admin_user";

// ─── Admin Login ──────────────────────────────────────────
/**
 * Login with email + password
 * Only ADMIN role can access admin panel
 */
export async function adminLogin(email, password) {
  const res = await apiClient.post("/api/v1/auth/login", { email, password });
  const { accessToken, user } = res.data.data;

  // Verify admin role before storing
  if (user.role !== "ADMIN") {
    throw new Error("Access denied. Admin credentials required.");
  }

  // Store token and user info
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { accessToken, user };
}

// ─── Logout ───────────────────────────────────────────────
export function adminLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new CustomEvent("auth:logout"));
}

// ─── Get stored token ─────────────────────────────────────
export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ─── Get stored user ──────────────────────────────────────
export function getAdminUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Check if logged in ───────────────────────────────────
export function isAdminLoggedIn() {
  const token = getAdminToken();
  const user  = getAdminUser();
  if (!token || !user) return false;

  // Basic JWT expiry check (without library)
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      adminLogout(); // clear expired token
      return false;
    }
  } catch {
    adminLogout();
    return false;
  }

  return user.role === "ADMIN";
}