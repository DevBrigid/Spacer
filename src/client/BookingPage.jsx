import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

const DEFAULT_SPACES = [
  { id: '1', name: 'The Creative Loft - Studio B', location: 'GTC Building, Westlands, Nairobi', price_per_hour: 5000, capacity: 10, images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop'] },
  { id: '2', name: 'Innovation Hub - Suite 402', location: 'Kilimani, Nairobi', price_per_hour: 4200, capacity: 8, images: ['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=600&auto=format&fit=crop'] },
  { id: '3', name: 'Executive Conference Hall', location: 'CBD, Nairobi', price_per_hour: 7500, capacity: 25, images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop'] }
];

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price || 0);

export default function BookingPage() {
  const { spacerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const space = DEFAULT_SPACES.find((item) => String(item.id) === String(spacerId)) || DEFAULT_SPACES[0];
  const [startTime, setStartTime] = useState(location.state?.startTime || '');
  const [endTime, setEndTime] = useState(location.state?.endTime || '');

  const durationHours = useMemo(() => {
    const duration = (new Date(endTime) - new Date(startTime)) / 3_600_000;
    return startTime && endTime && duration > 0 ? duration : 0;
  }, [endTime, startTime]);

  const subtotal = durationHours * (space?.price_per_hour || 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const estimatedTax = Math.round((subtotal + serviceFee) * 0.16);
  const totalDue = subtotal + serviceFee + estimatedTax;

  const continueToPayment = (event) => {
    event.preventDefault();
    if (!durationHours) return;

    const newBooking = {
      spaceId: space.id,
      title: space.name,
      location: space.location,
      startTime,
      endTime,
      duration: `${durationHours} Hours`,
      subtotal,
      serviceFee,
      estimatedTax,
      totalDue,
      status: 'Pending'
    };

    const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    localStorage.setItem('spacer_bookings', JSON.stringify([newBooking, ...savedBookings]));

    navigate('/spacer/payment');
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <Link to={`/spaces/${space.id}`} style={{ fontSize: '13px', fontWeight: '600', color: '#525252', textDecoration: 'none' }}>
        ← Back to space
      </Link>

      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        <section>
          <p style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#737373', margin: 0 }}>
            Reserve your space
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0a0a0a', marginTop: '8px', marginBottom: '8px' }}>
            Confirm your booking
          </h1>
          <p style={{ fontSize: '14px', color: '#525252', lineHeight: '1.5', margin: 0 }}>
            Choose the time you need. You will review payment details before the reservation is confirmed.
          </p>

          <form onSubmit={continueToPayment} style={{ marginTop: '32px', backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', fontWeight: '600', color: '#404040' }}>
              Start time
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(event) => setStartTime(event.target.value)} 
                required 
                style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid #d4d4d4', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', fontWeight: '600', color: '#404040' }}>
              End time
              <input 
                type="datetime-local" 
                value={endTime} 
                onChange={(event) => setEndTime(event.target.value)} 
                required 
                style={{ marginTop: '8px', padding: '10px 12px', border: '1px solid #d4d4d4', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
              />
            </label>

            {startTime && endTime && !durationHours ? (
              <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>Your end time must be after your start time.</p>
            ) : null}

            <button 
              type="submit" 
              disabled={!durationHours} 
              style={{ width: '100%', backgroundColor: durationHours ? '#000000' : '#d4d4d4', color: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: durationHours ? 'pointer' : 'not-allowed', marginTop: '8px' }}
            >
              Continue to payment
            </button>
          </form>
        </section>

        <aside style={{ height: 'fit-content', border: '1px solid #e5e5e5', backgroundColor: '#fafafa', borderRadius: '12px', padding: '24px' }}>
          <img src={Array.isArray(space.images) ? space.images[0] : space.images} alt="" style={{ height: '160px', width: '100%', borderRadius: '8px', objectFit: 'cover' }} />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0a0a0a', marginTop: '20px', marginBottom: '4px' }}>{space.name}</h2>
          <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>{space.location} · Up to {space.capacity} guests</p>

          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e5e5', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#525252' }}>Hourly rate</span>
              <strong>KES {formatPrice(space.price_per_hour)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#525252' }}>Duration</span>
              <strong>{durationHours || 0} hours</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e5e5', paddingTop: '12px', fontSize: '15px' }}>
              <strong>Subtotal</strong>
              <strong>KES {formatPrice(subtotal)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}