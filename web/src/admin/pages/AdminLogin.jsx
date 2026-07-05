import { useState } from "react";
import { adminLogin } from "../../services/authService";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await adminLogin(email, password);
      onLoginSuccess(user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--ink)" }}
    >
      {/* Background grain */}
      <div className="grain fixed inset-0 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-display tracking-[0.42em] font-light"
            style={{ fontSize: "2rem", color: "var(--parchment)" }}
          >
            ÉLIXIR
          </h1>
          <p
            className="eyebrow mt-1"
            style={{ fontSize: "0.5rem", letterSpacing: "0.45em", color: "var(--mist)" }}
          >
            Admin Panel
          </p>
        </div>

        {/* Card */}
        <div
          className="p-8"
          style={{ background: "var(--cream)", border: "1px solid rgba(201,169,110,0.2)" }}
        >
          <h2
            className="font-display font-light mb-6"
            style={{ fontSize: "1.8rem", color: "var(--ink)" }}
          >
            Sign In
          </h2>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 p-4 text-sm"
              style={{
                background: "rgba(185,28,28,0.08)",
                border: "1px solid rgba(185,28,28,0.25)",
                color: "#b91c1c",
                fontFamily: "var(--font-body)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block mb-2"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elixir.com"
                required
                className="cart-input"
                style={{ background: "var(--warm)" }}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block mb-2"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="cart-input"
                style={{ background: "var(--warm)" }}
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 transition-all duration-300"
              style={{
                background: loading ? "var(--mist)" : "var(--ink)",
                color: "var(--parchment)",
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(245,240,232,0.3)", borderTopColor: "var(--gold)" }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p
          className="text-center mt-6"
          style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "rgba(245,240,232,0.25)" }}
        >
          ÉLIXIR Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}