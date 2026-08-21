import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const handleProceedToPayment = (booking) => {
    // Navigates directly to the Payment Page passing the booking data
    navigate('/client/payment', { state: { booking } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f9fafb' }}>
      <div>
        <header className="sp-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link">Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link">Booking Page</Link>
            <Link to="/client/my-bookings" className="sp-nav-link" style={{ fontWeight: '700', color: '#000000' }}>My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        <main className="sp-container">
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>My Bookings</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage your active reservations and complete pending payments below.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="sp-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No Active Bookings</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>You haven't ordered any spaces yet.</p>
              <button onClick={() => navigate('/client/booking')} className="sp-btn-black">
                Go to Booking Page →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="sp-card" style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={booking.image} alt={booking.title} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          background: booking.status === 'Paid' ? '#dcfce7' : '#fef3c7', 
                          color: booking.status === 'Paid' ? '#15803d' : '#b45309', 
                          padding: '2px 8px', 
                          borderRadius: '12px' 
                        }}>
                          {booking.status}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>ID: #{booking.id}</span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{booking.title}</h3>
                      <p style={{ color: '#6b7280', fontSize: '13px' }}>{booking.location}</p>
                      <span style={{ fontSize: '12px', color: '#374151', marginTop: '4px', display: 'inline-block' }}>
                        📅 {booking.date} • ⏱ {booking.duration}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>Total Amount</span>
                      <span style={{ fontSize: '18px', fontWeight: '800' }}>KES {booking.totalDue?.toLocaleString()}</span>
                    </div>
                    {booking.status !== 'Paid' ? (
                      <button 
                        onClick={() => handleProceedToPayment(booking)} 
                        className="sp-btn-black" 
                        style={{ padding: '10px 18px', fontSize: '13px', fontWeight: '700' }}
                      >
                        Proceed to Payment →
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
                        ✓ Payment Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <footer className="sp-footer" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <span className="sp-logo" style={{ fontSize: '16px' }}>Spacer ®</span>
        <div className="sp-footer-text">Connecting people with open space and like-minded people.</div>
      </footer>
    </div>
  );
};

export default MyBookings;
