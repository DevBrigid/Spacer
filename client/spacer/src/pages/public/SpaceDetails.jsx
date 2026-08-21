import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SpaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find in Redux store or match local fallback mock
  const reduxSpace = useSelector(state => state.spaces.find(s => s.id == id));
  const currentUser = useSelector(state => state.users.currentUser);

  const fallbackSpace = {
    id: id,
    title: "The Creative Loft - Studio B",
    location: "GTC Building, Westlands, Nairobi",
    description: "Studio B offers a beautifully sunlit layout curated specifically for designers, creators, and small teams. Outfitted with premium hardware, adjustable heights, high-speed fiber internet, and complimentary local coffee. Enjoy complete private access to this professional-grade environment.",
    hourlyRate: 7000,
    rateText: "KES 7,000 / hour",
    amenities: ["High-Speed WiFi", "Free Parking", "Kitchen Access", "Whiteboard", "Air Conditioning", "Local Coffee"],
    host: "Hosted by Brigid M.",
    hostInfo: "Host since 2025 • ★ 4.9 (124 reviews)",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
  };

  const space = reduxSpace || fallbackSpace;

  const handleBooking = () => {
    if (!currentUser) {
      alert("Please log in to proceed with booking.");
      navigate('/login');
    } else {
      navigate(`/book/${space.id}`);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/browse')} style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '15px' }}>
        ← Back to Browse
      </button>

      <h2>{space.title}</h2>
      <p style={{ color: '#6b7280', margin: '-10px 0 15px' }}>📍 {space.location || "GTC Building, Westlands, Nairobi"}</p>

      <img src={space.image} alt={space.title} style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '6px' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <h3>{space.rateText || `KES ${space.hourlyRate} / hour`}</h3>
        <button onClick={handleBooking} style={btnStyle}>
          BOOK NOW!
        </button>
      </div>

      <hr />

      <h3>About the Space</h3>
      <p style={{ lineHeight: '1.6', color: '#374151' }}>{space.description}</p>

      <h3>Amenities</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '25px' }}>
        {(space.amenities || ["High-Speed WiFi", "Free Parking", "Kitchen Access", "Whiteboard", "Air Conditioning", "Local Coffee"]).map((item, idx) => (
          <div key={idx} style={{ background: '#f3f4f6', padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem' }}>
            ✓ {item}
          </div>
        ))}
      </div>

      <hr />

      <div style={{ margin: '20px 0' }}>
        <h4>{space.host || "Hosted by Brigid M."}</h4>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{space.hostInfo || "Host since 2025 • ★ 4.9 (124 reviews)"}</p>
      </div>

      <footer style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginTop: '40px' }}>
        <p><strong>Spacer©</strong> — Connecting people with open spaces and like-minded people</p>
        <p>spacer©2026</p>
      </footer>
    </div>
  );
}

const btnStyle = { background: '#2563eb', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };