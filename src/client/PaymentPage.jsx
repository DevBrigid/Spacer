import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('254712345678');
  const [isPending, setIsPending] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    if (savedBookings.length > 0) {
      setBooking(savedBookings[0]);
    }
  }, []);

  const subtotal = booking?.subtotal || 25000;
  const serviceFee = booking?.serviceFee || Math.round(subtotal * 0.05);
  const tax = booking?.estimatedTax || Math.round((subtotal + serviceFee) * 0.16);
  const total = booking?.totalDue || (subtotal + serviceFee + tax);

  const isValidPhone = /^\+?254\d{9}$|^0\d{9}$/.test(phoneNumber.replace(/\s/g, ''));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValidPhone) return;

    setIsPending(true);

    setTimeout(() => {
      const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
      if (savedBookings.length > 0) {
        savedBookings[0].status = 'Paid';
        localStorage.setItem('spacer_bookings', JSON.stringify(savedBookings));
      }

      setIsPending(false);
      alert(`STK Push sent to ${phoneNumber}! Enter your M-Pesa PIN on your phone to complete payment.`);
      navigate('/client/my-bookings');
    }, 1200);
  };

  return (
    <div className="public-page checkout-page" style={{ padding: '32px 64px', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="checkout-header" style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ fontSize: '11px', fontWeight: '800', color: '#059669', letterSpacing: '1px' }}>SPACER / M-PESA</p>
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Pay with M-Pesa</h1>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>Enter the number that should receive the M-Pesa prompt.</p>
      </header>

      <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
        <section className="checkout-form">
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Mobile payment</h2>
          <p className="text-sm text-stone-600" style={{ fontSize: '13px', color: '#4b5563', marginBottom: '20px' }}>
            We will send a secure STK push to your phone. Enter your M-Pesa PIN on your device to complete the payment.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: '700' }}>
              M-Pesa phone number
              <input 
                type="tel" 
                value={phoneNumber} 
                onChange={(event) => setPhoneNumber(event.target.value)} 
                placeholder="+254 7XX XXX XXX" 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            {phoneNumber && !isValidPhone ? (
              <p style={{ fontSize: '12px', color: '#dc2626' }}>Use a Kenyan number, for example +254712345678.</p>
            ) : null}

            <button 
              className="primary-button pay-button" 
              disabled={isPending || !isValidPhone}
              style={{ backgroundColor: '#059669', color: '#ffffff', padding: '14px', borderRadius: '6px', fontWeight: '700', border: 'none', cursor: 'pointer', marginTop: '8px' }}
            >
              {isPending ? 'Sending M-Pesa prompt…' : `Pay KES ${total.toLocaleString()}.00`}
            </button>
          </form>
        </section>

        <aside className="order-summary" style={{ border: '1px solid #e5e7eb', padding: '24px', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Order Summary</h2>
          <div className="summary-space" style={{ marginBottom: '16px' }}>
            <strong style={{ display: 'block', fontSize: '15px' }}>{booking?.title || 'The Creative Loft - Studio B'}</strong>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{booking?.location || '254 Building, Westlands, Nairobi'}</span>
          </div>
          
          <p className="summary-label" style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', marginTop: '16px' }}>RESERVATION</p>
          <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>{booking?.duration || '5 Hours (10:00 AM - 3:00 PM)'}</p>
          
          <dl style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <dt>Subtotal</dt>
              <dd>KES {subtotal.toLocaleString()}.00</dd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <dt>Service fee</dt>
              <dd>KES {serviceFee.toLocaleString()}.00</dd>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <dt>Tax</dt>
              <dd>KES {tax.toLocaleString()}.00</dd>
            </div>
            <div className="total" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
              <dt>Total Due</dt>
              <dd>KES {total.toLocaleString()}.00</dd>
            </div>
          </dl>
        </aside>
      </div>

      <footer className="site-footer" style={{ borderTop: '1px solid #e5e7eb', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
        <strong>Spacer©</strong>
        <span>Connecting people with open spaces and like-minded people</span>
        <small>spacer©2026</small>
      </footer>
    </div>
  );
}