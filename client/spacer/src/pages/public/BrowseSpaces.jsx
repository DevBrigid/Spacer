import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function BrowseSpaces() {
  const reduxSpaces = useSelector(state => state.spaces);
  const navigate = useNavigate();

  // Filter States from Figma design
  const [propertyType, setPropertyType] = useState('All');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  // Fallback Figma mock data if Redux initial state is clean
  const spaces = reduxSpaces.length > 0 ? reduxSpaces : [
    {
      id: 1,
      title: "Office space in Westlands, Nairobi",
      location: "Westlands, Nairobi",
      category: "Office",
      description: "This office space sits on the 10th floor of the building with a view of Nairobi city.",
      rateText: "KES 20,000 a day",
      hourlyRate: 20000,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Villa in Milimani, Kisumu",
      location: "Milimani, Kisumu",
      category: "Villa",
      description: "This space is the whole villa which has amenities like the pool and in-house board games.",
      rateText: "KES 8,000 a day",
      hourlyRate: 8000,
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Apartment in Lavington, Nairobi",
      location: "Lavington, Nairobi",
      category: "Apartment",
      description: "This apartment sits on the 14th floor of the building and offers various amenities.",
      rateText: "KES 7,000 an hour",
      hourlyRate: 7000,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const filteredSpaces = spaces.filter(s => {
    const matchType = propertyType === 'All' || s.category.toLowerCase() === propertyType.toLowerCase();
    const matchLoc = !location || s.location.toLowerCase().includes(location.toLowerCase());
    const matchPrice = !price || s.hourlyRate <= parseFloat(price);
    return matchType && matchLoc && matchPrice;
  });

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>Browse Spaces</h2>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Find and book unique venues tailored to your activity requirements.</p>

      {/* Where would you like to book? Search Box */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3>Where would you like to book?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Property Type</label>
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} style={inputStyle}>
              <option value="All">All Types</option>
              <option value="Office">Office</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" placeholder="e.g. Westlands, Nairobi" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price (Max KES)</label>
            <input type="number" placeholder="Filter by price" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Popular Spaces */}
      <h3>Popular Spaces</h3>
      {filteredSpaces.length === 0 ? (
        <p style={{ color: '#ef4444' }}>No spaces found matching your filter criteria.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {filteredSpaces.map(space => (
            <div key={space.id} style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <img src={space.image} alt={space.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{space.title}</h4>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', height: '40px', overflow: 'hidden' }}>{space.description}</p>
                <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{space.rateText || `KES ${space.hourlyRate} / hour`}</p>
                <button 
                  onClick={() => navigate(`/space/${space.id}`)} 
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                >
                  View Details & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
        <p><strong>Spacer©</strong> — Connecting people with open spaces and like-minded people</p>
        <p>spacer©2026</p>
      </footer>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px' };
const inputStyle = { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };