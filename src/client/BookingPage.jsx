import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BookingPage = ({ triggerToast }) => {
  const { spaceId } = useParams();
  const navigate = useNavigate();

  const space = { id: spaceId || '1', name: 'Innovation Hub Suite', hourlyRate: 25, dailyRate: 150 };
  const [bookingType, setBookingType] = useState('hourly');
  const [duration, setDuration] = useState(1);
  const [agreed, setAgreed] = useState(false);

  const baseRate = (bookingType === 'hourly' ? space.hourlyRate : space.dailyRate) * duration;
  const serviceTax = Math.round(baseRate * 0.1);
  const totalAmount = baseRate + serviceTax;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return alert('Accept agreement terms.');

    const newBooking = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      spaceName: space.name,
      type: bookingType,
      duration: Number(duration),
      unit: bookingType === 'hourly' ? 'Hour' : 'Day',
      totalAmount,
      status: 'Pending Payment',
    };

    triggerToast('Booking configured! Proceeding to payment.');
    navigate('/client/payment', { state: { booking: newBooking } });
  };

  return (
    <div className="glass-card glass-card-sm">
      <h1 className="glass-title" style={{ fontSize: '24px' }}>Book: {space.name}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setBookingType('hourly')}
            className={bookingType === 'hourly' ? 'btn-emerald' : 'stat-box'}
            style={{ cursor: 'pointer', textAlign: 'center', padding: '12px' }}
          >
            Hourly (${space.hourlyRate}/hr)
          </button>
          <button
            type="button"
            onClick={() => setBookingType('daily')}
            className={bookingType === 'daily' ? 'btn-emerald' : 'stat-box'}
            style={{ cursor: 'pointer', textAlign: 'center', padding: '12px' }}
          >
            Daily (${space.dailyRate}/day)
          </button>
        </div>

        <div>
          <label className="stat-label" style={{ display: 'block', marginBottom: '6px' }}>Duration ({bookingType}s)</label>
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-field"
          />
        </div>

        {/* Itemized Calculation */}
        <div className="stat-box" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Base Rate:</span> <span>${baseRate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Service & Maintenance (10%):</span> <span>${serviceTax}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', fontSize: '16px', fontWeight: '800' }}>
            <span>Total Amount:</span> <span style={{ color: '#34d399' }}>${totalAmount}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '14px', borderRadius: '12px', fontSize: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#fbbf24' }}>
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I accept the Space Incubator Terms</span>
          </label>
        </div>

        <button type="submit" disabled={!agreed} className={agreed ? 'btn-emerald' : 'btn-emerald btn-disabled'} style={{ width: '100%', padding: '14px' }}>
          Proceed to Billing
        </button>
      </form>
    </div>
  );
};

export default BookingPage;