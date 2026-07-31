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
    <div className="admin-area flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ink)] text-lg font-semibold text-[var(--gold)]">
            É
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">ÉLIXIR Admin</h1>
          <p className="mt-1 text-sm text-gray-400">Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elixir.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--gold)] focus:ring-2 focus:ring-[#c9a96e]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--gold)] py-2.5 text-sm font-medium text-[#1a1408] transition hover:brightness-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1a1408]/30 border-t-[#1a1408]" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          ÉLIXIR Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
