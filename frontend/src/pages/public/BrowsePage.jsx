import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockDatabase from '../../database/db.json';

const formatPrice = (price) => new Intl.NumberFormat('en-KE').format(price);

export default function BrowsePage() {
  const navigate = useNavigate();
  const [spaces] = useState(mockDatabase.spaces);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('All locations');
  const [availability, setAvailability] = useState('All spaces');
  const [minimumCapacity, setMinimumCapacity] = useState('Any capacity');
  const [maximumPrice, setMaximumPrice] = useState('Any price');

  const locations = useMemo(
    () => [...new Set(spaces.map((space) => space.location))].sort(),
    [spaces],
  );

  const filteredSpaces = useMemo(() => spaces.filter((space) => {
    const searchableText = `${space.name} ${space.description} ${space.location}`.toLowerCase();
    const matchesSearch = searchableText.includes(query.trim().toLowerCase());
    const matchesLocation = location === 'All locations' || space.location === location;
    const matchesAvailability = availability === 'All spaces' || space.status === availability;
    const matchesCapacity = minimumCapacity === 'Any capacity' || space.capacity >= Number(minimumCapacity);
    const matchesPrice = maximumPrice === 'Any price' || space.price_per_hour <= Number(maximumPrice);
    return matchesSearch && matchesLocation && matchesAvailability && matchesCapacity && matchesPrice;
  }), [availability, location, maximumPrice, minimumCapacity, query, spaces]);

  const resetFilters = () => {
    setQuery('');
    setLocation('All locations');
    setAvailability('All spaces');
    setMinimumCapacity('Any capacity');
    setMaximumPrice('Any price');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Spacer collection</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">Find a space for your next idea.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">From focused meetings to full-scale celebrations, discover spaces that make room for what matters.</p>

          <label className="mt-8 flex max-w-3xl items-center gap-3 border border-stone-300 bg-white px-4 py-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black">
            <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by space, location, or occasion" className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400" />
          </label>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12">
        <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Browse spaces</h2>
            <p className="mt-1 text-sm text-stone-500">{`${filteredSpaces.length} ${filteredSpaces.length === 1 ? 'space' : 'spaces'} found`}</p>
          </div>
          <button onClick={resetFilters} className="text-left text-sm font-medium text-stone-600 underline-offset-4 hover:text-black hover:underline">Clear filters</button>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Filter label="Location" value={location} onChange={setLocation} options={['All locations', ...locations]} />
          <Filter label="Availability" value={availability} onChange={setAvailability} options={['All spaces', 'available', 'booked']} />
          <Filter label="Guests" value={minimumCapacity} onChange={setMinimumCapacity} options={['Any capacity', '10', '20', '30', '40']} optionLabel={(option) => option === 'Any capacity' ? option : `${option}+ guests`} />
          <Filter label="Hourly budget" value={maximumPrice} onChange={setMaximumPrice} options={['Any price', '1500', '2000', '5000']} optionLabel={(option) => option === 'Any price' ? option : `Up to KES ${formatPrice(option)}`} />
        </div>

        {filteredSpaces.length === 0 ? <div className="mt-8 border border-dashed border-stone-300 bg-white p-10 text-center"><p className="font-medium text-stone-900">No spaces match these filters.</p><button onClick={resetFilters} className="mt-3 text-sm font-medium underline underline-offset-4">Show all spaces</button></div> : null}

        {filteredSpaces.length > 0 ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpaces.map((space) => <article key={space.id} className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative overflow-hidden"><img src={space.images?.[0]} alt={space.name} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" /><span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium capitalize ${space.status === 'available' ? 'bg-white/95 text-emerald-700' : 'bg-stone-900/90 text-white'}`}>{space.status}</span></div>
            <div className="p-5"><p className="text-xs font-medium uppercase tracking-wide text-stone-500">{space.location}</p><h3 className="mt-2 text-lg font-semibold text-stone-950">{space.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{space.description}</p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t border-stone-100 pt-4"><div><p className="text-base font-semibold text-stone-950">KES {formatPrice(space.price_per_hour)}</p><p className="text-xs text-stone-500">per hour · up to {space.capacity} guests</p></div><button onClick={() => navigate(`/spaces/${space.id}`)} className="shrink-0 bg-black px-3 py-2 text-xs font-medium text-white transition hover:bg-stone-700">View space</button></div>
            </div>
          </article>)}
        </div> : null}
      </main>
    </div>
  );
}

function Filter({ label, value, onChange, options, optionLabel = (option) => option }) {
  return <label className="block text-xs font-medium text-stone-600">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full appearance-none border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-black focus:ring-1 focus:ring-black">{options.map((option) => <option key={option} value={option}>{optionLabel(option)}</option>)}</select></label>;
}
