import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const [hours, setHours] = useState(4);

  const basePrice = 5000 * hours;
  const serviceFee = 1500;
  const tax = Math.round(basePrice * 0.16);
  const totalDue = basePrice + serviceFee + tax;

  const handleBooking = () => {
    const bookingDetails = {
      id: Math.floor(1000 + Math.random() * 9000),
      title: 'The Creative Loft - Studio B',
      location: 'GTC Building, Westlands, Nairobi',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      totalDue
    };
    navigate('/client/payment', { state: { booking: bookingDetails } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <header className="sp-header">
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link">Dashboard</Link>
            <Link to="/client/my-bookings" className="sp-nav-link">My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        <main className="sp-container">
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>The Creative Loft - Studio B</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>GTC Building, Westlands, Nairobi</p>
          </div>

          <div className="sp-layout-split">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                alt="Studio B" 
                className="sp-img-banner" 
              />
              <div style={{ marginTop: '28px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>About the Space</h3>
                <p style={{ color: '#4b5563', fontSize: '13px', lineHeight: '1.6' }}>
                  Studio B offers a beautifully sunlit layout curated specifically for designers, creators, and small teams.
                </p>
              </div>
            </div>

            <div>
              <div className="sp-card">
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px' }}>Book this Space</h3>
                
                <div className="sp-field" style={{ marginBottom: '14px' }}>
                  <label className="sp-label">Date</label>
                  <input type="text" value="August 24, 2026" readOnly className="sp-input" style={{ background: '#f9fafb' }} />
                </div>

                <div className="sp-field" style={{ marginBottom: '18px' }}>
                  <label className="sp-label">Duration</label>
                  <select className="sp-select" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
                    <option value={2}>2 Hours</option>
                    <option value={4}>4 Hours</option>
                    <option value={8}>8 Hours</option>
                  </select>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '18px' }}>
                  <div className="sp-row"><span>KES 5,000.00 × {hours} hrs</span><b>KES {basePrice.toLocaleString()}.00</b></div>
                  <div className="sp-row"><span>Service fee</span><b>KES {serviceFee.toLocaleString()}.00</b></div>
                  <div className="sp-row"><span>Estimated Tax</span><b>KES {tax.toLocaleString()}.00</b></div>
                  <div className="sp-row sp-row-total"><span>Total</span><span>KES {totalDue.toLocaleString()}.00</span></div>
                </div>

                <button onClick={handleBooking} className="sp-btn-black" style={{ width: '100%', padding: '12px' }}>
                  BOOK NOW!
                </button>
              </div>
            </div>
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

export default BookingPage;
