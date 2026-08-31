import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-5 md:px-12">
      <Link to="/" className="text-sm font-semibold tracking-[0.2em] transition-colors hover:text-gray-600">
        SPACER
      </Link>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <Link to="/spaces" className="text-gray-600 transition-colors hover:text-black">Browse</Link>
        {isAuthenticated ? (
          <>
            <Link to="/spacer" className="text-gray-600 transition-colors hover:text-black">Dashboard</Link>
            <Link to="/spacer/bookings" className="text-gray-600 transition-colors hover:text-black">My Bookings</Link>
            <Link to="/spacer/profile" className="font-medium transition-colors hover:text-gray-600">{currentUser?.name || "Profile"}</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 transition-colors hover:text-black">Log in</Link>
            <Link to="/register" className="border border-black px-3 py-1.5 font-medium transition-colors hover:bg-black hover:text-white">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
