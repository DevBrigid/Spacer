import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import mockDatabase from '../../database/db.json';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price || 0);

export default function InvoicePage() {
  const booking = useSelector((state) => state.bookings);
  const payment = useSelector((state) => state.payments);
  const user = useSelector((state) => state.auth.currentUser);
  const space = mockDatabase.spaces.find((item) => String(item.id) === String(booking.selectedSpaceId));

  if (payment.status !== 'success' || !space) return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-semibold">No payment receipt available</h1><p className="mt-3 text-sm text-stone-600">Complete an M-Pesa payment to view your invoice.</p><Link to="/spaces" className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Browse spaces</Link></main>;

  const subtotal = booking.totalAmount || 0;
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round((subtotal + serviceFee) * 0.16);
  const paidAt = payment.paidAt ? new Date(payment.paidAt).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now';

  return <main className="mx-auto max-w-3xl px-6 py-12 md:py-16"><section className="border border-stone-200 bg-white p-6 shadow-sm md:p-10"><div className="flex flex-col justify-between gap-5 border-b border-stone-200 pb-6 sm:flex-row"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Payment received</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Your Spacer invoice</h1><p className="mt-2 text-sm text-stone-500">A copy of this receipt is available here whenever you need it.</p></div><div className="text-sm sm:text-right"><strong>Receipt {payment.receiptNumber}</strong><p className="mt-1 text-stone-500">{paidAt}</p></div></div><div className="mt-8 grid gap-8 sm:grid-cols-2"><div><p className="text-xs font-medium uppercase tracking-wide text-stone-500">Billed to</p><p className="mt-2 font-semibold">{user?.name || 'Spacer client'}</p><p className="text-sm text-stone-600">{user?.email}</p><p className="text-sm text-stone-600">M-Pesa: {payment.phoneNumber}</p></div><div><p className="text-xs font-medium uppercase tracking-wide text-stone-500">Reservation</p><p className="mt-2 font-semibold">{space.name}</p><p className="text-sm text-stone-600">{space.location}</p><p className="text-sm text-stone-600">{booking.startTime ? new Date(booking.startTime).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : ''}</p></div></div><div className="mt-8 border-t border-stone-200 pt-6"><div className="flex justify-between py-2 text-sm"><span>Space hire ({booking.durationHours} hours)</span><span>KES {formatPrice(subtotal)}.00</span></div><div className="flex justify-between py-2 text-sm"><span>Service fee</span><span>KES {formatPrice(serviceFee)}.00</span></div><div className="flex justify-between py-2 text-sm"><span>Tax</span><span>KES {formatPrice(tax)}.00</span></div><div className="mt-3 flex justify-between border-t border-stone-200 pt-4 text-lg font-semibold"><span>Total paid</span><span>KES {formatPrice(payment.amount)}.00</span></div></div><div className="mt-8 flex flex-wrap gap-3"><Link to="/spacer/bookings" className="bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">View my bookings</Link><Link to="/spaces" className="border border-stone-300 px-4 py-2.5 text-sm font-medium hover:border-black">Browse more spaces</Link></div></section></main>;
}
