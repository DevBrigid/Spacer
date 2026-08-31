import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import mockDatabase from '../../database/db.json';
import { setBookingDetails } from '../../store/bookingsSlice';
import { assertTimeSlotAvailable } from '../../utils/bookingAvailability';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price || 0);

function BookingPage() {
  const { spacerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const space = mockDatabase.spaces.find((item) => String(item.id) === String(spacerId));
  const [startTime, setStartTime] = useState(location.state?.startTime || '');
  const [endTime, setEndTime] = useState(location.state?.endTime || '');
  const [availabilityError, setAvailabilityError] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const durationHours = useMemo(() => {
    const duration = (new Date(endTime) - new Date(startTime)) / 3_600_000;
    return startTime && endTime && duration > 0 ? duration : 0;
  }, [endTime, startTime]);
  const total = durationHours * (space?.price_per_hour || 0);

  if (!space) return <main className="mx-auto max-w-3xl px-6 py-16"><p className="text-sm text-stone-600">This space is no longer available.</p><Link to="/spaces" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Browse spaces</Link></main>;

  const continueToPayment = async (event) => {
    event.preventDefault();
    if (!durationHours) return;
    setIsCheckingAvailability(true);
    setAvailabilityError('');
    try {
      await assertTimeSlotAvailable(space.id, startTime, endTime);
      dispatch(setBookingDetails({ spaceId: space.id, startTime, endTime, pricePerHour: space.price_per_hour }));
      navigate('/spacer/payment');
    } catch (error) {
      setAvailabilityError(error.message);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return <main className="mx-auto max-w-5xl px-6 py-10 md:px-12"><Link to={`/spaces/${space.id}`} className="text-sm font-medium text-stone-600 underline-offset-4 hover:text-black hover:underline">← Back to space</Link><div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><section><p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Reserve your space</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">Confirm your booking</h1><p className="mt-3 text-sm leading-6 text-stone-600">Choose the time you need. You will review payment details before the reservation is confirmed.</p><form onSubmit={continueToPayment} className="mt-8 space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"><label className="block text-sm font-medium text-stone-700">Start time<input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} required className="mt-2 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-black" /></label><label className="block text-sm font-medium text-stone-700">End time<input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} required className="mt-2 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-black" /></label>{startTime && endTime && !durationHours ? <p className="text-sm text-red-600">Your end time must be after your start time.</p> : null}{availabilityError ? <p className="text-sm text-red-600" role="alert">{availabilityError}</p> : null}<button type="submit" disabled={!durationHours || isCheckingAvailability} className="w-full bg-black py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300">{isCheckingAvailability ? 'Checking availability…' : 'Continue to payment'}</button></form></section><aside className="h-fit rounded-xl border border-stone-200 bg-stone-50 p-6"><img src={Array.isArray(space.images) ? space.images[0] : space.images} alt="" className="h-40 w-full rounded-lg object-cover" /><h2 className="mt-5 text-xl font-semibold text-stone-950">{space.name}</h2><p className="mt-1 text-sm text-stone-500">{space.location} · Up to {space.capacity} guests</p><div className="mt-6 space-y-3 border-t border-stone-200 pt-5 text-sm"><div className="flex justify-between"><span>Hourly rate</span><strong>KES {formatPrice(space.price_per_hour)}</strong></div><div className="flex justify-between"><span>Duration</span><strong>{durationHours || 0} hours</strong></div><div className="flex justify-between border-t border-stone-200 pt-3 text-base"><strong>Subtotal</strong><strong>KES {formatPrice(total)}</strong></div></div></aside></div></main>;
}

export default BookingPage;
