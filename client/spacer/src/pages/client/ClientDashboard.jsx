import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/usersSlice';

export default function ClientDashboard() {
  const user = useSelector((state) => state.users.user || state.auth.currentUser);
  const bookings = useSelector((state) => state.bookings.bookings);
  const dispatch = useDispatch();
  const name = user?.name || 'there';

  return (
    <div className="client-page public-page">
      <header className="client-header"><div><p className="eyebrow">SPACER / YOUR SPACE</p><h1>Welcome back, {name}</h1><p>Find your next place to meet, create, or celebrate.</p></div><div className="client-actions"><Link className="primary-button" to="/spaces">Browse Spaces</Link><Link className="outline-button" to="/profile">Profile</Link><button className="text-button" onClick={() => dispatch(logout())}>Logout</button></div></header>
      <section className="client-stats"><div><span>Upcoming bookings</span><strong>{bookings.length}</strong></div><div><span>Saved spaces</span><strong>04</strong></div><div><span>Member since</span><strong>2026</strong></div></section>
      <section className="dashboard-section client-booking-preview"><div className="section-header"><div><h2>Your bookings</h2><p>Keep track of the spaces you have reserved.</p></div><Link to="/bookings" className="text-button">View all ↗</Link></div>{bookings.length ? bookings.slice(0, 3).map((booking) => <div className="booking-row" key={booking.id}><strong>{booking.space}</strong><span>{booking.date}</span><span className="status available">{booking.status}</span></div>) : <div className="empty-dashboard"><p>Your next great space is waiting.</p><Link to="/spaces" className="text-button">Explore spaces ↗</Link></div>}</section>
      <footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer>
    </div>
  );
}
