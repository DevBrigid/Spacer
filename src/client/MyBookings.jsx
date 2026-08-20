import React, { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    setBookings(saved);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('spacer_bookings');
    setBookings([]);
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="glass-title" style={{ fontSize: '24px' }}>Records & Booking History</h1>
        {bookings.length > 0 && (
          <button onClick={handleClearHistory} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>
            Clear Storage
          </button>
        )}
      </div>

      <div className="glass-section" style={{ padding: '0', overflow: 'hidden' }}>
        {bookings.length === 0 ? (
          <p style={{ color: 'var(--text-sub)', fontSize: '14px', padding: '24px' }}>No booking records found in storage.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-sub)', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>ID</th>
                <th style={{ padding: '16px 20px' }}>Space</th>
                <th style={{ padding: '16px 20px' }}>Duration</th>
                <th style={{ padding: '16px 20px' }}>Amount</th>
                <th style={{ padding: '16px 20px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--text-sub)' }}>#{b.id}</td>
                  <td style={{ padding: '16px 20px', fontWeight: '600' }}>{b.spaceName}</td>
                  <td style={{ padding: '16px 20px' }}>{b.duration} {b.unit}(s)</td>
                  <td style={{ padding: '16px 20px', fontWeight: '800', color: '#34d399' }}>${b.totalAmount}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={b.status === 'Confirmed' ? 'badge-emerald' : 'badge-amber'}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyBookings;