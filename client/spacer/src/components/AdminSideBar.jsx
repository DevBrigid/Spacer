import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/spaces', label: 'Spaces' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/profile', label: 'Profile' },
];

function AdminSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <nav style={{ width: '200px', background: '#3B2B3B', color: '#fff', padding: '16px 12px', minHeight: '100vh' }}>
      <p style={{ fontWeight: 500, marginBottom: '20px' }}>Spacer Admin</p>

      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          style={{
            display: 'block',
            padding: '8px 10px',
            borderRadius: '6px',
            marginBottom: '2px',
            background: location.pathname === link.to ? '#815E82' : 'transparent',
            color: '#fff',
          }}
        >
          {link.label}
        </Link>
      ))}

      <button onClick={() => dispatch(logout())} style={{ marginTop: '20px' }}>
        Log Out
      </button>
    </nav>
  );
}

export default AdminSidebar;