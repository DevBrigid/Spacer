import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1f2937' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '8px', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '10px' }}>
          MEET, CREATE, CELEBRATE!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: '650px', margin: '0 auto 25px' }}>
          A platform that enables people to meet, create (collaborate with colleagues), and celebrate!
        </p>
        <button 
          onClick={() => navigate('/browse')} 
          style={primaryBtnStyle}
        >
          GET STARTED
        </button>
      </section>

      {/* Popular Space Categories */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Popular Space Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {['Apartments', 'Villas', 'Offices'].map((cat, i) => (
            <div key={i} style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>{cat}</h3>
              <p style={{ color: '#6b7280' }}>Discover top-tier {cat.toLowerCase()} tailored for your specific events or meetings.</p>
              <button onClick={() => navigate('/browse')} style={outlineBtnStyle}>BROWSE SPACES</button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works! */}
      <section style={{ background: '#f9fafb', padding: '40px 20px', borderRadius: '8px', marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '30px' }}>How It Works!</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={stepStyle}>
            <h4>1. Browse Spaces</h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>Discover carefully selected unique spaces designed to fit your needs.</p>
          </div>
          <div style={stepStyle}>
            <h4>2. Register/ Login</h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>Sign up or login to make booking quick and seamless.</p>
          </div>
          <div style={stepStyle}>
            <h4>3. Book Spaces</h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>Choose your preferred space, select your date and time, and complete your booking securely in just a few clicks.</p>
          </div>
          <div style={stepStyle}>
            <h4>4. Enjoy the Space</h4>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>Arrive, settle in, and enjoy a comfortable experience in a space that feels right for you.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button onClick={() => navigate('/browse')} style={primaryBtnStyle}>Browse Spaces Now</button>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '20px' }}>REVIEWS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={reviewCardStyle}>
            <p>“A terrific idea to meet people with similar interests”</p>
            <strong>— Adam</strong> <br /><small style={{ color: '#6b7280' }}>Spacer Client</small>
          </div>
          <div style={reviewCardStyle}>
            <p>“A fantastic way to lease out your space”</p>
            <strong>— Amani</strong> <br /><small style={{ color: '#6b7280' }}>Spacer Host</small>
          </div>
          <div style={reviewCardStyle}>
            <p>“A genuine way to collaborate with colleagues”</p>
            <strong>— Max</strong> <br /><small style={{ color: '#6b7280' }}>Spacer Client</small>
          </div>
        </div>
      </section>

      {/* JOIN SPACER TODAY! */}
      <section style={{ textAlign: 'center', padding: '40px 20px', background: '#eff6ff', borderRadius: '8px', marginBottom: '40px' }}>
        <h2>JOIN SPACER TODAY!</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '15px' }}>
          <button onClick={() => navigate('/login')} style={primaryBtnStyle}>Login</button>
          <button onClick={() => navigate('/login')} style={outlineBtnStyle}>Register</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
        <p><strong>Spacer©</strong> — Connecting people with open spaces and like-minded people</p>
        <p>spacer©2026</p>
      </footer>
    </div>
  );
}

const primaryBtnStyle = { background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const outlineBtnStyle = { background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const stepStyle = { background: '#fff', padding: '15px', borderRadius: '6px', border: '1px solid #e5e7eb' };
const reviewCardStyle = { background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', fontStyle: 'italic' };