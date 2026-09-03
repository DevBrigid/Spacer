import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { setBookingDetails } from '../../store/bookingsSlice';

export default function MyBookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookings = useSelector((state) => state.bookings.bookings);
  const user = useSelector((state) => state.auth.currentUser);
  const userBookings = bookings.filter((booking) => String(booking.userId) === String(user?.id));
  const [selectedStatus, setSelectedStatus] = useState('All');
  const statuses = ['All', ...new Set(userBookings.map((booking) => booking.status))];
  const filteredBookings = selectedStatus === 'All' ? userBookings : userBookings.filter((booking) => booking.status === selectedStatus);

  const handlePayNow = (booking) => {
    const startTime = booking.startTime || `${booking.date}T09:00:00`;
    const durationHours = Number(booking.duration || 1) || 1;
    const endTime = booking.endTime || new Date(new Date(startTime).getTime() + (durationHours * 60 * 60 * 1000)).toISOString();
    const pricePerHour = Number(booking.amount || 0) / durationHours;

    dispatch(setBookingDetails({
      spaceId: booking.spaceId,
      spaceName: booking.space,
      spaceLocation: booking.location || '',
      startTime,
      endTime,
      pricePerHour,
      durationHours,
      totalAmount: Number(booking.amount || 0),
      activeBookingId: booking.id,
    }));

    navigate('/spacer/payment');
  };

  return (
    <div className="client-page public-page">
      <header className="browse-header"><p className="eyebrow">SPACER / YOUR SPACE</p><h1>My Bookings</h1><p>All your upcoming and past reservations in one place.</p></header>
      <section className="dashboard-section"><div className="section-header"><div><h2>Reservations</h2><span>{filteredBookings.length} {selectedStatus === 'All' ? 'bookings' : selectedStatus.toLowerCase()}</span></div><div className="filter-buttons">{statuses.map((status) => <button key={status} className={`filter-button ${selectedStatus === status ? 'active' : ''}`} onClick={() => setSelectedStatus(status)}>{status}{status !== 'All' ? ` (${userBookings.filter((booking) => booking.status === status).length})` : ''}</button>)}</div></div>{userBookings.length ? filteredBookings.length ? filteredBookings.map((booking) => <div className="booking-row" key={booking.id}><div><strong>{booking.space}</strong></div><span>{booking.date}</span><span>{booking.duration} hours</span><strong>KES {Number(booking.amount || 0).toLocaleString()}</strong><span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span>{String(booking.status).toLowerCase() === 'pending' && <button className="primary-button" onClick={() => handlePayNow(booking)}>{String(booking.paymentStatus).toLowerCase() === 'pending' ? 'Resume payment' : 'Pay now'}</button>}</div>) : <div className="empty-dashboard"><p>No {selectedStatus.toLowerCase()} bookings yet.</p><button className="text-button" onClick={() => setSelectedStatus('All')}>Show all bookings</button></div> : <div className="empty-dashboard"><p>No bookings yet.</p><Link to="/spaces" className="primary-button">Browse Spaces</Link></div>}</section>
      <footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer>
    </div>
  );
}
