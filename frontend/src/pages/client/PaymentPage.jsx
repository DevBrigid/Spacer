import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import mockDatabase from '../../database/db.json';
import { initiatePayment } from '../../store/paymentsSlice';
import { addBooking } from '../../store/bookingsSlice';
import { cancelReservation, reserveTimeSlot, updateReservationStatus } from '../../utils/bookingAvailability';

export default function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payment = useSelector((state) => state.payments);
  const booking = useSelector((state) => state.bookings);
  const user = useSelector((state) => state.auth.currentUser);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [bookingError, setBookingError] = useState('');
  const [isReserving, setIsReserving] = useState(false);
  const space = mockDatabase.spaces.find((item) => String(item.id) === String(booking.selectedSpaceId));
  const subtotal = booking.totalAmount || 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal + serviceFee) * 0.16);
  const total = subtotal + serviceFee + tax;
  const isValidPhone = /^\+?254\d{9}$|^0\d{9}$/.test(phoneNumber.replace(/\s/g, ''));
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidPhone) return;
    setBookingError('');
    setIsReserving(true);
    let reservation;
    try {
      reservation = await reserveTimeSlot({ spaceId: space.id, spaceName: space.name, userId: user?.id, startTime: booking.startTime, endTime: booking.endTime, durationHours: booking.durationHours, totalAmount: total });
      const result = await dispatch(initiatePayment({ bookingId: reservation.id, amount: total, phoneNumber }));
      if (!initiatePayment.fulfilled.match(result)) throw new Error('Payment was not completed.');
      await updateReservationStatus(reservation.id, 'confirmed');
      dispatch(addBooking({ id: reservation.id, userId: user?.id, client: user?.name || 'Spacer Client', space: space.name, date: booking.startTime?.split('T')[0], duration: booking.durationHours, amount: total, status: 'Confirmed' }));
      navigate('/spacer/invoice');
    } catch (error) {
      if (reservation?.id) await cancelReservation(reservation.id);
      setBookingError(error.message || 'Your booking could not be completed.');
    } finally {
      setIsReserving(false);
    }
  };

  if (!space || !subtotal) return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-semibold">Your booking details are missing.</h1><p className="mt-3 text-sm text-stone-600">Choose a space and time before continuing to payment.</p><Link to="/spaces" className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Browse spaces</Link></main>;

  return (
      <div className="public-page checkout-page">
      <header className="checkout-header"><p className="eyebrow">SPACER / M-PESA</p><h1>Pay with M-Pesa</h1><p>Enter the number that should receive the M-Pesa prompt.</p></header>
      <div className="checkout-grid"><section className="checkout-form"><h2>Mobile payment</h2><p className="text-sm text-stone-600">We will send a secure STK push to your phone. Enter your M-Pesa PIN on your device to complete the payment.</p><form onSubmit={handleSubmit}><label>M-Pesa phone number<input type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+254 7XX XXX XXX" required /></label>{phoneNumber && !isValidPhone ? <p className="-mt-3 mb-4 text-sm text-red-600">Use a Kenyan number, for example +254712345678.</p> : null}{bookingError ? <p className="-mt-3 mb-4 text-sm text-red-600" role="alert">{bookingError}</p> : null}<button className="primary-button pay-button" disabled={payment.status === 'pending' || isReserving || !isValidPhone}>{payment.status === 'pending' || isReserving ? 'Reserving your time slot…' : `Pay KES ${total.toLocaleString()}.00`}</button></form></section><aside className="order-summary"><h2>Order Summary</h2><div className="summary-space"><strong>{space.name}</strong><span>{space.location}</span></div><p className="summary-label">RESERVATION</p><p>{booking.startTime ? new Date(booking.startTime).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : ''} — {booking.endTime ? new Date(booking.endTime).toLocaleTimeString('en-KE', { timeStyle: 'short' }) : ''}</p><dl><div><dt>Subtotal ({booking.durationHours} hours)</dt><dd>KES {subtotal.toLocaleString()}.00</dd></div><div><dt>Service fee</dt><dd>KES {serviceFee.toLocaleString()}.00</dd></div><div><dt>Tax</dt><dd>KES {tax.toLocaleString()}.00</dd></div><div className="total"><dt>Total Due</dt><dd>KES {total.toLocaleString()}.00</dd></div></dl></aside></div><footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer>
    </div>
  );
}
