import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking || {
    title: "The Creative Loft",
    location: "254 Building, Westlands, Nairobi",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    date: "August 24, 2026",
    duration: "10:00 AM - 3:00 PM",
    subtotal: 25000,
    serviceFee: 1500,
    estimatedTax: 3440,
    totalDue: 29940
  };

  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'saved' | 'card'
  const [phoneNumber, setPhoneNumber] = useState('254712345678');
  const [cardNumber, setCardNumber] = useState('2302 8893 9400 0000');
  const [expiration, setExpiration] = useState('08/28');
  const [cvv, setCvv] = useState('321');
  const [streetAddress, setStreetAddress] = useState('Street Address, Apt, Suite');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
      const updatedBookings = savedBookings.map(b => b.id === booking.id ? { ...b, status: 'Paid' } : b);
      localStorage.setItem('spacer_bookings', JSON.stringify(updatedBookings));

      setIsProcessing(false);
      if (paymentMethod === 'mpesa') {
        alert(`STK Push sent to ${phoneNumber}! Enter your M-Pesa PIN on your phone to complete payment.`);
      } else {
        alert('Payment Successful!');
      }
      navigate('/client/my-bookings');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
      <div>
        <header className="sp-header" style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 64px' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')} style={{ fontWeight: '800', cursor: 'pointer', fontSize: '18px' }}>SPACER</span>
        </header>

        <main className="sp-container" style={{ maxWidth: '1140px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
            
            {/* Payment Options Column */}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>Secure Checkout</h1>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '28px' }}>Complete your booking reservation with encrypted payment.</p>

              {/* Payment Method Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#374151' }}>Select Payment Method</span>
                
                {/* M-Pesa Option */}
                <div 
                  onClick={() => setPaymentMethod('mpesa')}
                  style={{ 
                    border: paymentMethod === 'mpesa' ? '2px solid #059669' : '1px solid #e5e7eb', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'mpesa' ? '#f0fdf4' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '26px', background: '#059669', color: '#ffffff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '10px' }}>
                      M-PESA
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Lipa na M-PESA</p>
                      <p style={{ fontSize: '11px', color: '#6b7280' }}>Instant Express Prompt (STK Push)</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'mpesa'} readOnly />
                </div>

                {/* Saved Card Option */}
                <div 
                  onClick={() => setPaymentMethod('saved')}
                  style={{ 
                    border: paymentMethod === 'saved' ? '2px solid #000' : '1px solid #e5e7eb', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'saved' ? '#f9fafb' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '26px', background: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '10px' }}>
                      VISA
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '700' }}>Visa ending in 4242</p>
                      <p style={{ fontSize: '11px', color: '#6b7280' }}>Expires 08/28</p>
                    </div>
                  </div>
                  <input type="radio" checked={paymentMethod === 'saved'} readOnly />
                </div>

                {/* New Card Option */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  style={{ 
                    border: paymentMethod === 'card' ? '2px solid #000' : '1px solid #e5e7eb', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    justify: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'card' ? '#f9fafb' : '#ffffff'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Credit or Debit Card</span>
                  <input type="radio" checked={paymentMethod === 'card'} readOnly />
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {paymentMethod === 'mpesa' && (
                  <div style={{ border: '1px solid #d1fae5', padding: '20px', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#065f46', marginBottom: '6px' }}>M-Pesa Phone Number</label>
                    <input 
                      type="text" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 254712345678"
                      required
                      style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box' }}
                    />
                    <p style={{ fontSize: '11px', color: '#047857', marginTop: '6px' }}>A prompt will be sent to this mobile device to enter your PIN.</p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Card number</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Expiration date</label>
                        <input 
                          type="text" 
                          value={expiration} 
                          onChange={(e) => setExpiration(e.target.value)}
                          placeholder="MM / YY"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>CVC</label>
                        <input 
                          type="text" 
                          value={cvv} 
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="CVC"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Billing Address</label>
                      <input 
                        type="text" 
                        value={streetAddress} 
                        onChange={(e) => setStreetAddress(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={isProcessing}
                  style={{ 
                    backgroundColor: paymentMethod === 'mpesa' ? '#059669' : '#000000', 
                    color: '#ffffff', 
                    padding: '14px', 
                    borderRadius: '6px', 
                    fontWeight: '700', 
                    fontSize: '14px', 
                    border: 'none', 
                    cursor: 'pointer', 
                    marginTop: '8px' 
                  }}
                >
                  {isProcessing ? 'Processing...' : paymentMethod === 'mpesa' ? `Pay via M-PESA (KES ${booking.totalDue?.toLocaleString()})` : `Pay Now (KES ${booking.totalDue?.toLocaleString()})`}
                </button>
              </form>
            </div>

            {/* Summary Column */}
            <div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <img src={booking.image} alt="Thumbnail" style={{ width: '64px', height: '64px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{booking.title}</h4>
                    <p style={{ fontSize: '11px', color: '#6b7280' }}>{booking.location}</p>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#374151', marginBottom: '16px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
                  <strong>Reservation:</strong><br />
                  <span>{booking.date} ({booking.duration})</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                    <span>Subtotal</span>
                    <span>KES {booking.subtotal?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                    <span>Service fee</span>
                    <span>KES {booking.serviceFee?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                    <span>Estimated Tax</span>
                    <span>KES {booking.estimatedTax?.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px', color: '#000' }}>
                    <span>Total Due</span>
                    <span>KES {booking.totalDue?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <footer className="sp-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="sp-logo" style={{ fontSize: '14px', fontWeight: '800' }}>Spacer ®</span>
      </footer>
    </div>
  );
};

export default PaymentPage;
