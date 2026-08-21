import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price || 0);

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
      setBookings(Array.isArray(saved) ? saved : []);
    } catch {
      setBookings([]);
    }
  }, []);

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0a0a0a', margin: 0 }}>My Bookings</h1>
          <p style={{ fontSize: '14px', color: '#525252', marginTop: '4px' }}>Manage and view all your active and previous reservations.</p>
        </div>
        <Link to="/spaces" style={{ backgroundColor: '#000', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: '600' }}>
          + Book New Space
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #e5e5e5', marginTop: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#171717' }}>No bookings found</h3>
          <p style={{ fontSize: '14px', color: '#737373', marginTop: '6px' }}>You haven't reserved any spaces yet.</p>
          <Link to="/spaces" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: '#000', fontWeight: '600', textDecoration: 'underline' }}>
            Explore available spaces →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
          {bookings.map((booking, index) => (
            <div key={index} style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: booking.status === 'Confirmed' ? '#16a34a' : '#d97706', backgroundColor: booking.status === 'Confirmed' ? '#f0fdf4' : '#fffbeb', padding: '3px 8px', borderRadius: '4px' }}>
                  {booking.status || 'Pending'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0a0a0a', margin: '8px 0 4px 0' }}>{booking.title || 'Workspace Space'}</h3>
                <p style={{ fontSize: '13px', color: '#525252', margin: 0 }}>{booking.location}</p>
                <div style={{ fontSize: '12px', color: '#737373', marginTop: '8px' }}>
                  <strong>Duration:</strong> {booking.duration || 'N/A'} · <strong>Start:</strong> {booking.startTime ? new Date(booking.startTime).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>Total Amount</p>
                <p style={{ fontSize: '18px', fontWeight: '800', color: '#0a0a0a', margin: '2px 0 0 0' }}>KES {formatPrice(booking.totalDue || booking.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}