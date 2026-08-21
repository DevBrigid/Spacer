import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import mockDatabase from '../../database/db.json';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price);

export default function SpaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const bookings = mockDatabase.bookings;
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const fallbackSpace = mockDatabase.spaces.find((item) => String(item.id) === id) || null;
  const displayedSpace = fallbackSpace;

  if (!displayedSpace) return <div className="mx-auto max-w-3xl px-6 py-16"><button onClick={() => navigate('/spaces')} className="text-sm underline underline-offset-4">← Back to spaces</button><p className="mt-8 text-sm text-stone-500">This space could not be found.</p></div>;

  const hasValidTimeRange = startTime && endTime && new Date(endTime) > new Date(startTime);
  const isBookedForSelectedTime = hasValidTimeRange && bookings.some((booking) => (
    String(booking.space_id) === String(displayedSpace.id)
    && booking.status !== 'rejected'
    && new Date(startTime) < new Date(booking.end_time)
    && new Date(endTime) > new Date(booking.start_time)
  ));

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/spacer/booking/${displayedSpace.id}` } });
      return;
    }
    navigate(`/spacer/booking/${displayedSpace.id}`, { state: { startTime, endTime } });
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
      <button onClick={() => navigate('/spaces')} className="text-sm font-medium text-stone-600 underline-offset-4 hover:text-black hover:underline">← Back to spaces</button>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div><img src={Array.isArray(displayedSpace.images) ? displayedSpace.images[0] : displayedSpace.images} alt={displayedSpace.name} className="h-96 w-full rounded-xl object-cover" /><h1 className="mt-7 text-3xl font-semibold tracking-tight">{displayedSpace.name}</h1><p className="mt-2 text-sm text-stone-500">{displayedSpace.location} · Up to {displayedSpace.capacity} guests</p><div className="mt-8 border-t border-stone-200 pt-6"><h2 className="font-semibold">About this space</h2><p className="mt-3 leading-7 text-stone-600">{displayedSpace.description}</p></div></div>
        <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6 shadow-sm"><p className="text-2xl font-semibold">KES {formatPrice(displayedSpace.price_per_hour)} <span className="text-sm font-normal text-stone-500">/ hour</span></p><div className="mt-6 grid gap-4"><label className="text-xs font-medium text-stone-600">Start time<input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} className="mt-2 w-full border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-black" /></label><label className="text-xs font-medium text-stone-600">End time<input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="mt-2 w-full border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-black" /></label></div>{startTime && endTime && !hasValidTimeRange && <p className="mt-3 text-xs text-red-600">Choose an end time after the start time.</p>}{hasValidTimeRange && <p className={`mt-3 text-sm font-medium ${isBookedForSelectedTime ? 'text-red-600' : 'text-emerald-700'}`}>{isBookedForSelectedTime ? 'Booked for this time' : 'Available for this time'}</p>}<button onClick={handleBooking} disabled={!hasValidTimeRange || isBookedForSelectedTime} className="mt-6 w-full bg-black py-3 text-sm font-medium text-white enabled:hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300">{isBookedForSelectedTime ? 'Unavailable for this time' : hasValidTimeRange ? 'Book this space' : 'Select a time to book'}</button></aside>
      </div>
    </main>
  );
}
