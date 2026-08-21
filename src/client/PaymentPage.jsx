import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking || {
    id: '9921',
    title: 'The Creative Floor',
    location: 'Studio B • Westlands',
    subtotal: 20000,
    serviceFee: 1500,
    tax: 3440,
    totalDue: 24940
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    localStorage.setItem('spacer_bookings', JSON.stringify([booking, ...existing]));
    navigate('/client/my-bookings');
  };

  return (
    <div>
      <header className="sp-header">
        <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
      </header>

      <main className="sp-container">
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>Secure Checkout</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '32px' }}>Complete your booking reservation with encrypted payment</p>

        <div className="sp-layout-split">
          <form onSubmit={handlePayNow} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Saved Payment Methods</p>
              <div className="sp-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '700' }}>Visa ending in 4242</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Expires 12/28</p>
                </div>
                <input type="radio" name="payment" defaultChecked />
              </div>
            </div>

            <p style={{ fontSize: '13px', fontWeight: '700' }}>Or enter new card details</p>
            <div className="sp-field">
              <label className="sp-label">Card Number</label>
              <input type="text" placeholder="0000 0000 0000 0000" className="sp-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="sp-field">
                <label className="sp-label">Expiration Date</label>
                <input type="text" placeholder="MM / YY" className="sp-input" />
              </div>
              <div className="sp-field">
                <label className="sp-label">CVV</label>
                <input type="text" placeholder="***" className="sp-input" />
              </div>
            </div>

            <button type="submit" className="sp-btn-black" style={{ padding: '14px', marginTop: '12px' }}>
              Pay Now (KES {booking.totalDue?.toLocaleString()})
            </button>
          </form>

          <div>
            <div className="sp-checkout-summary">
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>Order Summary</h3>
              <p style={{ fontSize: '13px', fontWeight: '700' }}>{booking.title}</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '16px' }}>{booking.location}</p>

              <div className="sp-row"><span>Subtotal</span><b>KES {booking.subtotal?.toLocaleString()}</b></div>
              <div className="sp-row"><span>Service fee</span><b>KES {booking.serviceFee?.toLocaleString()}</b></div>
              <div className="sp-row"><span>Tax</span><b>KES {booking.tax?.toLocaleString()}</b></div>
              <div className="sp-row sp-row-total"><span>Total Due</span><span>KES {booking.totalDue?.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
