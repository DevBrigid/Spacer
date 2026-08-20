import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = ({ triggerToast }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const booking = state?.booking;

  const handleSimulatePayment = () => {
    if (!booking) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const existing = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
      const confirmedBooking = { ...booking, status: 'Confirmed' };
      localStorage.setItem('spacer_bookings', JSON.stringify([confirmedBooking, ...existing]));

      triggerToast('Payment Successful! Saved to records.');
      navigate('/client/my-bookings');
    }, 1200);
  };

  if (!booking) {
    return (
      <div className="glass-card glass-card-sm" style={{ textAlign: 'center' }}>
        <h2>No Active Session</h2>
        <button onClick={() => navigate('/client/spaces')} className="btn-emerald" style={{ marginTop: '16px' }}>Explore Spaces</button>
      </div>
    );
  }

  return (
    <div className="glass-card glass-card-sm">
      <h1 className="glass-title" style={{ fontSize: '24px', marginBottom: '20px' }}>Billing Checkout</h1>
      
      <div className="stat-box" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Space Name:</span> <span style={{ fontWeight: '600' }}>{booking.spaceName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>Reserved Duration:</span> <span>{booking.duration} {booking.unit}(s)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
          <span>Total Billed:</span> <span style={{ color: '#34d399' }}>${booking.totalAmount}</span>
        </div>
      </div>

      <button onClick={handleSimulatePayment} disabled={loading} className="btn-emerald" style={{ width: '100%', padding: '14px' }}>
        {loading ? 'Processing Transaction...' : `Confirm & Pay ($${booking.totalAmount})`}
      </button>
    </div>
  );
};

export default PaymentPage;