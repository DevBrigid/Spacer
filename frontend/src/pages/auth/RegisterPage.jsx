import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { registerUser } from "../../store/authSlice";
import { AuthShell, AuthTabs, SocialButtons } from "../../components/AuthShell";
import { getDashboardPath } from "../../utils/roleNavigation";

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: location.state?.email || "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      navigate(getDashboardPath(result.payload.user), { replace: true });
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-sm border border-gray-200 p-8">
        <h1 className="text-xl font-semibold">Welcome to Spacer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find a space, or list your own, in a few clicks.
        </p>

        {location.state?.message && (
          <p className="mt-4 border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {location.state.message}
          </p>
        )}

        <div className="mt-5">
          <AuthTabs active="register" />
        </div>

        <SocialButtons />

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
          </div>

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
            <label className="block text-xs text-gray-500">Phone number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+254 7XX XXX XXX"
              required
              className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-gray-400">Used for M-Pesa payment prompts.</p>
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
            disabled={status === "loading"}
            className="w-full bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {status === "loading" ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default RegisterPage;
