import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientDash = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    setBookings(saved);
  }, []);

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="glass-title">Welcome Back</h1>
          <p className="glass-subtitle">Manage active workspace reservations and review invoices.</p>
        </div>
        <Link to="/client/spaces" className="btn-emerald">
          Book Space Now
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Active Rentals</div>
          <div className="stat-value" style={{ color: '#38bdf8' }}>
            {bookings.filter((b) => b.status === 'Confirmed').length}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value" style={{ color: '#a5b4fc' }}>
            ${bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
          </div>
        </div>
      </div>

      <div className="glass-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Recent Records</h2>
          <Link to="/client/my-bookings" style={{ color: '#38bdf8', fontSize: '13px', textDecoration: 'none' }}>View All</Link>
        </div>
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-sub)', fontSize: '14px', marginTop: '12px' }}>No records found in local storage.</p>
        ) : (
          bookings.slice(0, 3).map((b) => (
            <div key={b.id} className="activity-item">
              <div>
                <p style={{ fontWeight: '600' }}>{b.spaceName}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)' }}>ID: #{b.id}</p>
              </div>
              <span className={b.status === 'Confirmed' ? 'badge-emerald' : 'badge-amber'}>
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientDash;