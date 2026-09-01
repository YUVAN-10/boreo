import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { isAuthenticated, authError, setAuthError, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Automatically navigate away if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Reset submitting state if an authentication error occurs in AuthContext
  useEffect(() => {
    if (authError) {
      setIsSubmitting(false);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setAuthError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
    } catch (error) {
      setLocalError(error.message);
      setIsSubmitting(false);
    }
  };

  const displayError = localError || authError;
  const isLoading = isSubmitting || authLoading;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-200/80 bg-white p-8 shadow-xl animate-fade-in">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center p-3 rounded-2xl bg-white shadow-xs border border-gray-100 mb-4 w-full">
            <img
              src="/boreo-logo.jpg"
              alt="BOREO Logo"
              className="h-20 w-auto max-w-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
            BOREO Admin Panel
          </h2>
          <p className="mt-1.5 text-xs font-semibold text-gray-500">
            Business Owners Referral Exchange Organisation
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[#1E3A8A] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-3 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all"
                placeholder="admin@boreo.org"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                  setAuthError("");
                }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#1E3A8A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Lock className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-3 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#EA580C] focus:outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLocalError("");
                  setAuthError("");
                }}
              />
            </div>
            {displayError && (
              <p className="mt-2 text-xs font-semibold text-red-600 animate-fade-in">{displayError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-[#c2410c] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In to Admin Panel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
