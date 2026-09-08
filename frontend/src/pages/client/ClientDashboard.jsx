import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function ClientDashboard() {
  const user = useSelector((state) => state.auth?.currentUser ?? state.users?.user ?? null);
  const bookings = useSelector((state) => state.bookings?.bookings ?? []);
  const dispatch = useDispatch();
  const name = user?.name?.split(' ')[0] || 'there';
  const userBookings = bookings.filter((booking) => String(booking.userId) === String(user?.id));
  const confirmedBookings = userBookings.filter((booking) => booking.status?.toLowerCase() === 'confirmed');
  const totalSpent = userBookings.reduce((total, booking) => total + Number(booking.amount || 0), 0);
  const nextBooking = userBookings[0];
  const formatDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be confirmed';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-12">
      <header className="overflow-hidden rounded-2xl bg-stone-950 px-6 py-8 text-white md:px-10 md:py-12"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">Spacer / client dashboard</p><h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Welcome back, {name}.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">Your spaces, reservations, and account details—all in one place.</p></div><div className="flex flex-wrap gap-3"><Link className="bg-lime-300 px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-white" to="/spaces">Browse spaces</Link><Link className="border border-stone-600 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white" to="/spacer/profile">Profile</Link></div></div></header>

      <section className="mt-6 grid gap-4 sm:grid-cols-3"><StatCard label="Your bookings" value={userBookings.length} detail="All reservations" /><StatCard label="Confirmed" value={confirmedBookings.length} detail="Ready to go" /><StatCard label="Total reserved" value={`KES ${totalSpent.toLocaleString()}`} detail="Across all bookings" /></section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]"><div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Reservations</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Your upcoming plans</h2></div><Link to="/spacer/bookings" className="text-sm font-medium text-stone-700 underline underline-offset-4 hover:text-black">View all</Link></div>{userBookings.length ? <div className="mt-6 divide-y divide-stone-100">{userBookings.slice(0, 3).map((booking) => <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between" key={booking.id}><div><p className="font-semibold text-stone-950">{booking.space}</p><p className="mt-1 text-sm text-stone-500">{formatDate(booking.date)} · {booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}</p></div><div className="flex items-center gap-4"><span className="text-sm font-medium text-stone-700">KES {Number(booking.amount || 0).toLocaleString()}</span><span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span></div></div>)}</div> : <div className="mt-6 rounded-xl bg-stone-50 p-6"><p className="font-medium text-stone-900">Your calendar is open.</p><p className="mt-1 text-sm text-stone-600">Find a space for your next meeting, workshop, or celebration.</p><Link to="/spaces" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Explore spaces</Link></div>}</div><aside className="rounded-2xl border border-stone-200 bg-lime-50 p-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">Next booking</p>{nextBooking ? <><h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">{nextBooking.space}</h2><p className="mt-2 text-sm leading-6 text-stone-700">{formatDate(nextBooking.date)} · {nextBooking.duration} {nextBooking.duration === 1 ? 'hour' : 'hours'}</p><Link to="/spacer/bookings" className="mt-6 inline-block bg-stone-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">View reservation</Link></> : <><h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">Nothing booked yet</h2><p className="mt-2 text-sm leading-6 text-stone-700">Start with a space that fits your plans.</p><Link to="/spaces" className="mt-6 inline-block bg-stone-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700">Find a space</Link></>}</aside></section>
      <div className="mt-8 flex justify-end"><button className="text-sm text-stone-500 hover:text-stone-950" onClick={() => dispatch(logout())}>Log out</button></div>
    </div>
  );
}

function StatCard({ label, value, detail }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-stone-500">{label}</p><p className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">{value}</p><p className="mt-2 text-xs text-stone-500">{detail}</p></div>;
}
