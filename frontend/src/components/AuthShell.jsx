import { Link, useNavigate } from "react-router-dom";

export function AuthShell({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-5 md:px-12">
        <Link to="/" className="text-sm font-semibold tracking-[0.2em] hover:text-gray-600">
          SPACER
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/spaces" className="text-gray-600 transition-colors hover:text-black">
            Browse spaces
          </Link>
          <Link to="/" className="font-medium transition-colors hover:text-gray-600">
            Home
          </Link>
        </div>
      </nav>

      <div className="px-6 pt-6 md:px-12">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 transition-colors hover:text-black"
        >
          &larr; Previous
        </button>
      </div>

      <main className="flex justify-center px-6 py-10">{children}</main>

      <footer className="border-t border-gray-200 px-6 py-8 md:px-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="text-sm font-semibold tracking-[0.2em]">SPACER</span>
          <p className="max-w-xs text-xs text-gray-500 sm:text-right">
            Connecting people with open spaces and like-minded people.
          </p>
        </div>
        <p className="mt-6 text-xs text-gray-400">Spacer &copy; 2026</p>
      </footer>
    </div>
  );
}

export function AuthTabs({ active }) {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      <Link
        to="/login"
        className={`pb-2 text-sm transition-colors ${
          active === "login" ? "border-b-2 border-black font-medium" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`pb-2 text-sm transition-colors ${
          active === "register" ? "border-b-2 border-black font-medium" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        Register
      </Link>
    </div>
  );
}

export function SocialButtons({ onClick }) {
  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={onClick}
        className="w-full border border-gray-300 py-2.5 text-sm transition-colors hover:border-black hover:bg-gray-50"
      >
        Continue with Google
      </button>
    </div>
  );
}
