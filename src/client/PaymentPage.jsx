import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('254700000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!booking) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>No booking selected for payment.</h3>
        <button onClick={() => navigate('/client/my-bookings')} className="sp-btn-black" style={{ marginTop: '16px' }}>
          Back to My Bookings
        </button>
      </div>
    );
  }

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      // Update status in localStorage
      const existing = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
      const updated = existing.map((item) =>
        item.id === booking.id ? { ...item, status: 'Paid' } : item
      );
      localStorage.setItem('spacer_bookings', JSON.stringify(updated));
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f9fafb' }}>
      <div>
        <header className="sp-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link">Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link">Booking Page</Link>
            <Link to="/client/my-bookings" className="sp-nav-link">My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        <main className="sp-container">
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Checkout & Payment</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Complete your transaction for Booking #{booking.id}</p>
          </div>

          <div className="sp-layout-split" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <div className="sp-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px' }}>
              {isPaid ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Payment Successful!</h2>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px', marginBottom: '24px' }}>
                    Your payment of <b>KES {booking.totalDue?.toLocaleString()}</b> was confirmed.
                  </p>
                  <button onClick={() => navigate('/client/my-bookings')} className="sp-btn-black" style={{ padding: '12px 24px' }}>
                    View Updated Bookings →
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePayNow}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Select Payment Method</h3>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: paymentMethod === 'mpesa' ? '2px solid #000' : '1px solid #e5e7eb',
                        background: paymentMethod === 'mpesa' ? '#000' : '#fff',
                        color: paymentMethod === 'mpesa' ? '#fff' : '#000',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      M-Pesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '8px',
                        border: paymentMethod === 'card' ? '2px solid #000' : '1px solid #e5e7eb',
                        background: paymentMethod === 'card' ? '#000' : '#fff',
                        color: paymentMethod === 'card' ? '#fff' : '#000',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Credit / Debit Card
                    </button>
                  </div>

                  {paymentMethod === 'mpesa' ? (
                    <div className="sp-field" style={{ marginBottom: '24px' }}>
                      <label className="sp-label">M-Pesa Phone Number</label>
                      <input
                        type="text"
                        className="sp-input"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 254712345678"
                        required
                      />
                      <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                        An STK push prompt will be sent to this phone number.
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                      <div className="sp-field">
                        <label className="sp-label">Card Number</label>
                        <input type="text" className="sp-input" placeholder="4532 •••• •••• 8892" required />
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="sp-field" style={{ flex: 1 }}>
                          <label className="sp-label">Expiry Date</label>
                          <input type="text" className="sp-input" placeholder="MM/YY" required />
                        </div>
                        <div className="sp-field" style={{ flex: 1 }}>
                          <label className="sp-label">CVV</label>
                          <input type="text" className="sp-input" placeholder="123" required />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="sp-btn-black"
                    disabled={isProcessing}
                    style={{ width: '100%', padding: '16px', fontSize: '15px', fontWeight: '800' }}
                  >
                    {isProcessing ? 'Processing Payment...' : `PAY KES ${booking.totalDue?.toLocaleString()} NOW →`}
                  </button>
                </form>
              )}
            </div>

            <div>
              <div className="sp-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px' }}>Order Summary</h3>
                <img src={booking.image} alt={booking.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '16px', fontWeight: '800' }}>{booking.title}</h4>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>{booking.location}</p>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <div className="sp-row"><span>Date</span><b>{booking.date}</b></div>
                  <div className="sp-row"><span>Duration</span><b>{booking.duration}</b></div>
                  <div className="sp-row sp-row-total" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <span>Amount Due</span>
                    <span>KES {booking.totalDue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="sp-footer" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <span className="sp-logo" style={{ fontSize: '16px' }}>Spacer ®</span>
        <div className="sp-footer-text">Connecting people with open space and like-minded people.</div>
      </footer>
    </div>
  );
};

export default PaymentPage;
