import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Navbar() {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  return (
    <nav className="public-nav">
      <Link className="nav-brand" to="/">SPACER</Link>
      <div className="nav-links">
        <Link to="/">Home Page</Link>
        <Link to="/spaces">Browse Spaces</Link>
        {isAuthenticated ? <Link className="nav-auth" to="/profile">{currentUser?.name || 'Account'}</Link> : <Link className="nav-auth" to="/login">LOGIN / REGISTER</Link>}
      </div>
    </nav>
  );
}

export default Navbar;