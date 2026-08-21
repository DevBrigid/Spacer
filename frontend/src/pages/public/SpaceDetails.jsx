import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import mockDatabase from '../../database/db.json';

const API_URL = 'http://localhost:3001';
const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price);

export default function SpaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const fallbackSpace = mockDatabase.spaces.find((item) => String(item.id) === id) || null;
  const [space, setSpace] = useState(fallbackSpace);
  const displayedSpace = String(space?.id) === id ? space : fallbackSpace;

  useEffect(() => {
    async function loadSpace() {
      try {
        const response = await fetch(`${API_URL}/spaces/${id}`);
        if (!response.ok) throw new Error('Space not found');
        setSpace(await response.json());
      } catch {
        // Keep displaying the bundled db.json record when the mock API is offline.
      }
    }
    loadSpace();
  }, [id]);

  if (!displayedSpace) return <div className="mx-auto max-w-3xl px-6 py-16"><button onClick={() => navigate('/spaces')} className="text-sm underline underline-offset-4">← Back to spaces</button><p className="mt-8 text-sm text-stone-500">This space could not be found.</p></div>;

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/spacer/booking/${displayedSpace.id}` } });
      return;
    }
    navigate(`/spacer/booking/${displayedSpace.id}`);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
      <button onClick={() => navigate('/spaces')} className="text-sm font-medium text-stone-600 underline-offset-4 hover:text-black hover:underline">← Back to spaces</button>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div><img src={displayedSpace.images?.[0]} alt={displayedSpace.name} className="h-96 w-full rounded-xl object-cover" /><h1 className="mt-7 text-3xl font-semibold tracking-tight">{displayedSpace.name}</h1><p className="mt-2 text-sm text-stone-500">{displayedSpace.location} · Up to {displayedSpace.capacity} guests</p><div className="mt-8 border-t border-stone-200 pt-6"><h2 className="font-semibold">About this space</h2><p className="mt-3 leading-7 text-stone-600">{displayedSpace.description}</p></div></div>
        <aside className="h-fit rounded-xl border border-stone-200 bg-white p-6 shadow-sm"><p className="text-2xl font-semibold">KES {formatPrice(displayedSpace.price_per_hour)} <span className="text-sm font-normal text-stone-500">/ hour</span></p><p className="mt-2 text-sm capitalize text-stone-500">Currently {displayedSpace.status}</p><button onClick={handleBooking} className="mt-6 w-full bg-black py-3 text-sm font-medium text-white hover:bg-stone-700">Book this space</button></aside>
      </div>
    </main>
  );
}
