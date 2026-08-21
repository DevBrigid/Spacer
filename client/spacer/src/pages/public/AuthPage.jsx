import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Fixed path: Navigate up two levels from 'src/pages/public/' to reach 'src/store/'
import { loginUser, socialLoginUser, addUser } from "../../store/usersSlice";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.users || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }))
        .unwrap()
        .then(() => navigate("/dashboard"))
        .catch((err) => console.error("Login failed:", err));
    } else {
      dispatch(addUser(formData))
        .unwrap()
        .then(() => setIsLogin(true))
        .catch((err) => console.error("Registration failed:", err));
    }
  };

  const handleSocialAuth = (provider) => {
    dispatch(socialLoginUser(provider))
      .unwrap()
      .then(() => navigate("/dashboard"))
      .catch((err) => console.error(`${provider} login failed:`, err));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
            {typeof error === "string" ? error : "An error occurred. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-gray-300"></div>
            <span className="bg-white px-2 text-xs text-gray-500">OR</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialAuth("google")}
              type="button"
              className="flex items-center justify-center rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Google
            </button>
            <button
              onClick={() => handleSocialAuth("github")}
              type="button"
              className="flex items-center justify-center rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;