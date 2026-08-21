import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const availableSpaces = [
  {
    id: 'sp-1',
    title: 'The Creative Loft - Studio B',
    location: 'GTC Building, Westlands, Nairobi',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
    dailyRate: 35000,
    hourlyRate: 5000,
    category: 'Studio'
  },
  {
    id: 'sp-2',
    title: 'Innovation Hub - Suite 402',
    location: 'Kilimani, Nairobi',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    dailyRate: 28000,
    hourlyRate: 4200,
    category: 'Private Office'
  },
  {
    id: 'sp-3',
    title: 'Executive Boardroom',
    location: 'CBD, Nairobi',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=1200&auto=format&fit=crop',
    dailyRate: 50000,
    hourlyRate: 7500,
    category: 'Meeting Room'
  },
  {
    id: 'sp-4',
    title: 'Minimalist Photography Studio',
    location: 'Lavington, Nairobi',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    dailyRate: 25000,
    hourlyRate: 3800,
    category: 'Studio'
  },
  {
    id: 'sp-5',
    title: 'Skyline Workspace & Terrace',
    location: 'Upper Hill, Nairobi',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1200&auto=format&fit=crop',
    dailyRate: 40000,
    hourlyRate: 6000,
    category: 'Event Space'
  }
];

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedSpace, setSelectedSpace] = useState(availableSpaces[0]);
  const [bookingType, setBookingType] = useState('hourly');
  const [startDate, setStartDate] = useState('2026-08-25');
  const [duration, setDuration] = useState(2);
  const [attendees, setAttendees] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  const ratePerUnit = bookingType === 'daily' ? selectedSpace.dailyRate : selectedSpace.hourlyRate;
  const basePrice = ratePerUnit * duration;
  const serviceFee = 1500;
  const tax = Math.round(basePrice * 0.16);
  const totalDue = basePrice + serviceFee + tax;

  const handleOrderNow = (e) => {
    e.preventDefault();
    
    const newBooking = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      title: selectedSpace.title,
      location: selectedSpace.location,
      image: selectedSpace.image,
      bookingType,
      date: startDate,
      duration: `${duration} ${bookingType === 'daily' ? 'Day(s)' : 'Hour(s)'}`,
      totalDue,
      status: 'Confirmed'
    };

    const existing = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    localStorage.setItem('spacer_bookings', JSON.stringify([newBooking, ...existing]));

    navigate('/client/my-bookings');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f9fafb' }}>
      <div>
        {/* Navigation Header without Browse Spaces */}
        <header className="sp-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link">Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link" style={{ fontWeight: '700', color: '#000000' }}>Booking Page</Link>
            <Link to="/client/my-bookings" className="sp-nav-link">My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        <main className="sp-container">
          {/* Section 1: Image Gallery to Choose Space */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Booking Page</h1>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Select an available space below, enter your reservation details, and order to confirm.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {availableSpaces.map((space) => {
                const isSelected = space.id === selectedSpace.id;
                return (
                  <div 
                    key={space.id} 
                    onClick={() => setSelectedSpace(space)}
                    style={{
                      border: isSelected ? '2px solid #000000' : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={space.image} 
                      alt={space.title} 
                      style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                    />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>
                      {space.category}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {space.title}
                    </h4>
                    <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '6px' }}>
                      KES {space.hourlyRate.toLocaleString()} / hr
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Reservation Form & Pricing Breakdown */}
          <div className="sp-layout-split" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            <form onSubmit={handleOrderNow} className="sp-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
                Reservation Details: <span style={{ color: '#6b7280', fontWeight: '600' }}>{selectedSpace.title}</span>
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => { setBookingType('hourly'); setDuration(2); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: bookingType === 'hourly' ? '2px solid #000' : '1px solid #e5e7eb',
                    background: bookingType === 'hourly' ? '#000' : '#fff',
                    color: bookingType === 'hourly' ? '#fff' : '#000',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Hourly Rental
                </button>
                <button
                  type="button"
                  onClick={() => { setBookingType('daily'); setDuration(1); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: bookingType === 'daily' ? '2px solid #000' : '1px solid #e5e7eb',
                    background: bookingType === 'daily' ? '#000' : '#fff',
                    color: bookingType === 'daily' ? '#fff' : '#000',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Daily Rental
                </button>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div className="sp-field" style={{ flex: 1 }}>
                  <label className="sp-label">Start Date</label>
                  <input 
                    type="date" 
                    className="sp-input" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    required 
                  />
                </div>

                <div className="sp-field" style={{ flex: 1 }}>
                  <label className="sp-label">{bookingType === 'daily' ? 'Number of Days' : 'Number of Hours'}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={bookingType === 'daily' ? 30 : 12}
                    className="sp-input" 
                    value={duration} 
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))} 
                    required 
                  />
                </div>
              </div>

              <div className="sp-field" style={{ marginBottom: '16px' }}>
                <label className="sp-label">Number of Attendees</label>
                <input 
                  type="number" 
                  min="1"
                  className="sp-input" 
                  value={attendees} 
                  onChange={(e) => setAttendees(parseInt(e.target.value) || 1)} 
                  required 
                />
              </div>

              <div className="sp-field" style={{ marginBottom: '24px' }}>
                <label className="sp-label">Special Requests (Optional)</label>
                <textarea 
                  className="sp-input" 
                  rows="3" 
                  placeholder="e.g. Projector setup, catering, audio systems..." 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="sp-btn-black" 
                style={{ width: '100%', padding: '16px', fontSize: '15px', fontWeight: '800' }}
              >
                ORDER NOW →
              </button>
            </form>

            <div>
              <div className="sp-card" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', position: 'sticky', top: '24px' }}>
                <img src={selectedSpace.image} alt={selectedSpace.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase' }}>{selectedSpace.category}</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{selectedSpace.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>{selectedSpace.location}</p>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                  <div className="sp-row"><span>Rate ({bookingType})</span><b>KES {ratePerUnit.toLocaleString()}</b></div>
                  <div className="sp-row"><span>Duration</span><b>{duration} {bookingType === 'daily' ? 'Day(s)' : 'Hour(s)'}</b></div>
                  <div className="sp-row"><span>Base Price</span><b>KES {basePrice.toLocaleString()}</b></div>
                  <div className="sp-row"><span>Service Fee</span><b>KES {serviceFee.toLocaleString()}</b></div>
                  <div className="sp-row"><span>Tax (16%)</span><b>KES {tax.toLocaleString()}</b></div>
                  <div className="sp-row sp-row-total" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                    <span>Total Due</span>
                    <span>KES {totalDue.toLocaleString()}</span>
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

export default BookingPage;
