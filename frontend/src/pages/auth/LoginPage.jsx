import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { clearAuthError, loginUser } from "../../store/authSlice";
import { AuthShell, AuthTabs, SocialButtons } from "../../components/AuthShell";
import { getDashboardPath } from "../../utils/roleNavigation";
import { supabase } from "../../lib/supabase";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const canSubmit = Boolean(formData.email.trim() && formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate(getDashboardPath(result.payload.user), { replace: true });
    } else if (result.payload === "ACCOUNT_NOT_FOUND") {
      dispatch(clearAuthError());
      navigate("/register", {
        state: {
          email: formData.email,
          message: "No account was found for that email. Create an account to continue.",
        },
      });
    }
  };

  const handleGoogleContinue = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google sign-in failed", error);
      navigate("/login", {
        state: {
          email: formData.email,
          message: "Google sign-in could not start. Please try again or log in with email.",
        },
      });
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-sm border border-gray-200 p-8">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Log in to book your next space.</p>

        {location.state?.message && (
          <p className="mt-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            {location.state.message}
          </p>
        )}

        <div className="mt-5">
          <AuthTabs active="login" />
        </div>

        <SocialButtons onClick={handleGoogleContinue} />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500">Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@email.com"
            required
            className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
          </div>

          <div>
            <label className="block text-xs text-gray-500">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
          />
          </div>

          {error && error !== "ACCOUNT_NOT_FOUND" && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "pending" || status === "loading" || !canSubmit}
            className="w-full bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "pending" || status === "loading" ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          <Link to="/forgot-password" className="font-medium text-black hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          No account?{" "}
          <Link to="/register" className="font-medium text-black hover:underline">
            Register
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default LoginPage;
