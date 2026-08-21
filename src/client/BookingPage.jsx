import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState('2026-08-24');
  const [durationHours, setDurationHours] = useState(5);

  const hourlyRate = 5000;
  const subtotal = hourlyRate * durationHours;
  const serviceFee = 1500;
  const estimatedTax = 3440;
  const totalDue = subtotal + serviceFee + estimatedTax;

  const spaceDetails = {
    id: 101,
    title: "The Creative Loft - Studio B",
    location: "254 Building, Westlands, Nairobi",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    description: "Studio B offers a beautifully sunlit space, curated specifically for designers, creators, and teams. Built with premium furniture, adjustable heights, high-speed fiber internet, and complimentary local coffee. Enjoy complete private access to the proofing room and audio corner.",
    amenities: ["High-Speed Wi-Fi", "Ergonomic Desks", "Local Coffee", "Audio Corner", "Proofing Room"]
  };

  const handleConfirmBooking = () => {
    const bookingPayload = {
      ...spaceDetails,
      date: selectedDate,
      duration: `${durationHours} Hours (10:00 AM - 3:00 PM)`,
      hours: durationHours,
      subtotal,
      serviceFee,
      estimatedTax,
      totalDue,
      status: 'Pending'
    };

    const existingBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    localStorage.setItem('spacer_bookings', JSON.stringify([bookingPayload, ...existingBookings]));

    navigate('/client/payment', { state: { booking: bookingPayload } });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
      <div>
        <header className="sp-header" style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 64px' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')} style={{ fontWeight: '800', cursor: 'pointer', fontSize: '18px' }}>SPACER</span>
          <div className="sp-nav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link to="/client/dashboard" className="sp-nav-link" style={{ textDecoration: 'none', color: '#000' }}>Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link" style={{ textDecoration: 'none', color: '#000', fontWeight: '700' }}>Booking</Link>
            <Link to="/client/my-bookings" className="sp-nav-link" style={{ textDecoration: 'none', color: '#000' }}>My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black" style={{ background: '#000', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Logout</button>
          </div>
        </header>

        <main className="sp-container" style={{ maxWidth: '1140px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px' }}>
            
            {/* Left Column: Details */}
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>{spaceDetails.title}</h1>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>{spaceDetails.location}</p>

              <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
                <img src={spaceDetails.image} alt="Space" style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>About the Space</h3>
                <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>{spaceDetails.description}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>Amenities</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {spaceDetails.amenities.map((item, idx) => (
                    <span key={idx} style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#10b981' }}>✓</span> {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Form */}
            <div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Book this Space</h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>Duration (Hours)</label>
                  <select 
                    value={durationHours} 
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value={1}>1 Hour (10:00 AM - 11:00 AM)</option>
                    <option value={2}>2 Hours (10:00 AM - 12:00 PM)</option>
                    <option value={5}>5 Hours (10:00 AM - 3:00 PM)</option>
                    <option value={8}>8 Hours (9:00 AM - 5:00 PM)</option>
                  </select>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginBottom: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>KES {hourlyRate.toLocaleString()} × {durationHours} hrs</span>
                    <span style={{ fontWeight: '600' }}>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Service fee</span>
                    <span style={{ fontWeight: '600' }}>KES {serviceFee.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Estimated Tax</span>
                    <span style={{ fontWeight: '600' }}>KES {estimatedTax.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '15px' }}>
                    <span>Total</span>
                    <span>KES {totalDue.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleConfirmBooking}
                  style={{ width: '100%', backgroundColor: '#000000', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <footer className="sp-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '24px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="sp-logo" style={{ fontSize: '14px', fontWeight: '800' }}>Spacer ®</span>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>Connecting people with open space and like-minded people.</div>
      </footer>
    </div>
  );
};

export default BookingPage;
