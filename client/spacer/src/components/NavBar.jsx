import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  return (
    <nav>
      <Link to="/">Spacer</Link>
      <Link to="/browse">Browse</Link>
      {isAuthenticated ? (
        <>
          <Link to="/client/bookings">My Bookings</Link>
          <Link to="/client/profile">{currentUser?.name}</Link>
        </>
      ) : (
        <>
          <Link to="/login">Log In</Link>
          <Link to="/register">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;