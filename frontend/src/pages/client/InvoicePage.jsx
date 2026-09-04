import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentByBookingId } from '../../store/paymentsSlice';
import { fetchBookings, updateBookingStatus } from '../../store/bookingsSlice';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price || 0);

export default function InvoicePage() {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.bookings);
  const payment = useSelector((state) => state.payments);
  const user = useSelector((state) => state.auth.currentUser);
  const token = useSelector((state) => state.auth.token);
  const spaces = useSelector((state) => state.spaces.spaces);
  const space = spaces.find((item) => String(item.id) === String(booking.selectedSpaceId)) || {
    id: booking.selectedSpaceId,
    name: booking.spaceName || 'Selected space',
    location: booking.spaceLocation || 'Location unavailable',
  };

  const handleDownloadInvoice = async () => {
    if (!booking.activeBookingId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/bookings/${booking.activeBookingId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invoice is not available yet.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${booking.activeBookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error.message || 'Unable to download invoice.');
    }
  };

  useEffect(() => {
    if (!booking.activeBookingId) return undefined;

    let cancelled = false;
    let timeoutId;

    const pollPayment = async () => {
      if (cancelled) return;

      try {
        const result = await dispatch(fetchPaymentByBookingId(booking.activeBookingId)).unwrap();
        const paymentStatus = String(result?.status || '').toLowerCase();
        if (paymentStatus === 'completed') {
          // The Daraja callback has committed the booking confirmation. Keep
          // the client booking list in sync without waiting for a page reload.
          dispatch(updateBookingStatus({ id: booking.activeBookingId, status: 'confirmed' }));
          dispatch(fetchBookings());
          return;
        }
        if (paymentStatus === 'failed') {
          return;
        }
      } catch {
        return;
      }

      // The callback is server-side; short polling makes its confirmed state
      // visible to the customer as soon as it is committed.
      timeoutId = setTimeout(pollPayment, 1000);
    };

    pollPayment();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [booking.activeBookingId, dispatch]);

  const hasPaymentRecord = ['success', 'completed', 'pending'].includes(String(payment.status || '').toLowerCase());
  const paymentIsComplete = ['success', 'completed'].includes(String(payment.status || '').toLowerCase());

  if (!hasPaymentRecord || (!booking.selectedSpaceId && !booking.spaceName)) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">No payment receipt available</h1>
        <p className="mt-3 text-sm text-stone-600">Complete an M-Pesa payment to view your invoice.</p>
        <Link to="/spaces" className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Browse spaces</Link>
      </main>
    );
  }

  const subtotal = booking.totalAmount || 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal + serviceFee) * 0.16);
  const paidAt = payment.paidAt ? new Date(payment.paidAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now';

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <section className="border border-stone-200 bg-white p-6 shadow-sm md:p-10">
        <div className="flex flex-col justify-between gap-5 border-b border-stone-200 pb-6 sm:flex-row">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${paymentIsComplete ? 'text-emerald-700' : 'text-amber-700'}`}>
              {paymentIsComplete ? 'Payment received' : 'Payment pending'}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {paymentIsComplete ? 'Your Spacer invoice' : 'Complete your M-Pesa payment'}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {paymentIsComplete
                ? 'A copy of this receipt is available here whenever you need it.'
                : 'The M-Pesa prompt was sent to your phone. We are checking the payment status automatically.'}
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <strong>{paymentIsComplete ? `Receipt ${payment.receiptNumber}` : 'Awaiting M-Pesa confirmation'}</strong>
            <p className="mt-1 text-stone-500">{paidAt}</p>
            {paymentIsComplete && (
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="mt-3 inline-flex items-center rounded-md bg-stone-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-stone-700"
              >
                Download invoice
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Billed to</p>
            <p className="mt-2 font-semibold">{user?.name || 'Spacer client'}</p>
            <p className="text-sm text-stone-600">{user?.email}</p>
            <p className="text-sm text-stone-600">M-Pesa: {payment.phoneNumber}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Reservation</p>
            <p className="mt-2 font-semibold">{space.name}</p>
            <p className="text-sm text-stone-600">{space.location}</p>
            <p className="text-sm text-stone-600">
              {booking.startTime ? new Date(booking.startTime).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6">
          <div className="flex justify-between py-2 text-sm">
            <span>Space hire ({booking.durationHours} hours)</span>
            <span>KES {formatPrice(subtotal)}.00</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Service fee</span>
            <span>KES {formatPrice(serviceFee)}.00</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span>Tax</span>
            <span>KES {formatPrice(tax)}.00</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 py-3 text-base font-semibold">
            <span>Total</span>
            <span>KES {formatPrice(subtotal + serviceFee + tax)}.00</span>
          </div>
        </div>
      </section>
    </main>
  );
}
