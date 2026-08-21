import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    setBookings(saved.length > 0 ? saved : [
      {
        id: '8821',
        title: 'The Creative Loft - Studio B',
        location: 'GTC Building, Westlands, Nairobi',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
        totalDue: 24940,
        date: 'Aug 24, 2026'
      }
    ]);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <header className="sp-header">
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link">Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link">Browse Spaces</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        <main className="sp-container">
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>My Bookings</h1>

          <div className="sp-space-grid">
            {bookings.map((item, idx) => (
              <div key={idx} className="sp-card sp-card-interactive" style={{ padding: '16px' }}>
                <img src={item.image} alt={item.title} className="sp-card-image" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    Confirmed
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>{item.date || 'Upcoming'}</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{item.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>{item.location}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>Ref #{item.id}</span>
                  <span style={{ fontSize: '15px', fontWeight: '800' }}>KES {item.totalDue?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="sp-footer">
        <span className="sp-logo" style={{ fontSize: '16px' }}>Spacer ®</span>
        <div className="sp-footer-text">Connecting people with open space and like-minded people.</div>
      </footer>
    </div>
  );
};

export default MyBookings;
