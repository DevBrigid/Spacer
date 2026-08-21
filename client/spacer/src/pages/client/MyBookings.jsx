import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function MyBookings() {
  const bookings = useSelector((state) => state.bookings.bookings);
  return (
    <div className="client-page public-page">
      <header className="browse-header"><p className="eyebrow">SPACER / YOUR SPACE</p><h1>My Bookings</h1><p>All your upcoming and past reservations in one place.</p></header>
      <section className="dashboard-section"><div className="section-header"><h2>Reservations</h2><span>{bookings.length} bookings</span></div>{bookings.length ? bookings.map((booking) => <div className="booking-row" key={booking.id}><div><strong>{booking.space}</strong><small>{booking.client}</small></div><span>{booking.date}</span><span>{booking.duration} hours</span><strong>KES {Number(booking.amount || 0).toLocaleString()}</strong><span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span></div>) : <div className="empty-dashboard"><p>No bookings yet.</p><Link to="/spaces" className="primary-button">Browse Spaces</Link></div>}</section>
      <footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer>
    </div>
  );
}
