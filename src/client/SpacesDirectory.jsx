import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SPACES = [
  { id: '1', name: 'Innovation Hub Suite', type: 'Private Office', hourlyRate: 25, dailyRate: 150, capacity: '6 People', amenities: ['Wi-Fi', 'Projector', 'Coffee Bar'] },
  { id: '2', name: 'Executive Boardroom', type: 'Conference Room', hourlyRate: 40, dailyRate: 240, capacity: '12 People', amenities: ['Soundproof', '4K Display', 'Whiteboard'] },
  { id: '3', name: 'Creative Desk Alpha', type: 'Dedicated Desk', hourlyRate: 10, dailyRate: 60, capacity: '1 Person', amenities: ['24/7 Access', 'Wi-Fi', 'Locker'] }
];

const SpacesDirectory = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = SPACES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 className="glass-title">Explore Workspaces</h1>
          <p className="glass-subtitle">Filter by workspace type or search available amenities.</p>
        </div>
        <input
          type="text"
          placeholder="Search space name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(space => (
          <div key={space.id} className="stat-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge-emerald" style={{ fontSize: '10px' }}>{space.type}</span>
              <h3 style={{ marginTop: '10px', fontSize: '18px' }}>{space.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>Capacity: {space.capacity}</p>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '12px 0' }}>
                {space.amenities.map(a => (
                  <span key={a} style={{ background: 'rgba(255,255,255,0.1)', fontSize: '11px', padding: '4px 8px', borderRadius: '6px' }}>{a}</span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>${space.hourlyRate}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>/hr</span>
              </div>
              <button onClick={() => navigate(`/client/book/${space.id}`)} className="btn-emerald" style={{ padding: '8px 16px', fontSize: '12px' }}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpacesDirectory;