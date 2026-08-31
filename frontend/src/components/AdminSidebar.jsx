import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/spaces", label: "Manage Spaces" },
  { to: "/admin/bookings", label: "Booking History" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/profile", label: "Profile" },
];

function AdminSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">Spacer</div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "nav-link active" : "nav-link"}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button onClick={() => dispatch(logout())} className="table-button">
        Log Out
      </button>
    </aside>
  );
}

export default AdminSidebar;