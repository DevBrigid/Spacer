import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ClientDash = () => {
  const navigate = useNavigate();
  const [activeCount, setActiveCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('spacer_bookings') || '[]');
    setActiveCount(savedBookings.length);
    const spent = savedBookings.reduce((sum, item) => sum + (item.totalDue || 0), 0);
    setTotalSpent(spent);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#f9fafb' }}>
      <div>
        {/* Navigation Bar */}
        <header className="sp-header" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <span className="sp-logo" onClick={() => navigate('/client/dashboard')}>SPACER</span>
          <div className="sp-nav">
            <Link to="/client/dashboard" className="sp-nav-link" style={{ fontWeight: '700', color: '#000000' }}>Dashboard</Link>
            <Link to="/client/booking" className="sp-nav-link">Booking-page</Link>
            <Link to="/client/my-bookings" className="sp-nav-link">My Bookings</Link>
            <button onClick={() => navigate('/')} className="sp-btn-black">Logout</button>
          </div>
        </header>

        {/* Hero Banner with Background Image Overlay */}
        <div style={{
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '64px 64px 80px 64px',
          margin: '0 auto',
          maxWidth: '1360px',
          borderRadius: '0 0 16px 16px'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a7f3d0' }}>
              Client Overview
            </span>
            <h1 style={{ fontSize: '36px', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
              Welcome Back!
            </h1>
            <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Explore versatile creative lofts, modern workspaces, and collaborative meeting rooms designed for your productivity.
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <button onClick={() => navigate('/client/booking')} className="sp-btn-black" style={{ backgroundColor: '#ffffff', color: '#000000', padding: '12px 24px', fontSize: '13px' }}>
                Book a Space
              </button>
              <button onClick={() => navigate('/client/my-bookings')} className="sp-btn-outline" style={{ backgroundColor: 'transparent', color: '#ffffff', borderColor: '#ffffff', padding: '12px 24px', fontSize: '13px' }}>
                View My Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="sp-container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2, padding: '0 64px' }}>
          {/* Real-time Metric Cards */}
          <div className="sp-space-grid" style={{ gap: '20px' }}>
            <div className="sp-card" style={{ background: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <p className="sp-card-label">Active Bookings</p>
              <p className="sp-card-value">{activeCount}</p>
              <p style={{ fontSize: '12px', color: activeCount > 0 ? '#059669' : '#9ca3af', marginTop: '8px', fontWeight: '600' }}>
                {activeCount > 0 ? `● ${activeCount} active reservation` : 'No active reservations'}
              </p>
            </div>

            <div className="sp-card" style={{ background: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <p className="sp-card-label">Total Spent</p>
              <p className="sp-card-value">KES {totalSpent.toLocaleString()}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Calculated from current orders</p>
            </div>

            <div className="sp-card" style={{ background: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
              <p className="sp-card-label">Saved Spaces</p>
              <p className="sp-card-value">3</p>
              <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Available for fast checkout</p>
            </div>
          </div>

          {/* Featured Spaces Section */}
          <div style={{ marginTop: '48px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Available Spaces</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>Curated work environments for immediate reservation</p>
              </div>
              <Link to="/client/booking" style={{ fontSize: '13px', fontWeight: '700', color: '#000000', textDecoration: 'none' }}>
                Browse All Spaces →
              </Link>
            </div>

            <div className="sp-space-grid">
              <div className="sp-card sp-card-interactive" style={{ padding: '16px', background: '#ffffff' }} onClick={() => navigate('/client/booking')}>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop" 
                  alt="Studio B" 
                  className="sp-card-image" 
                />
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginTop: '8px' }}>The Creative Loft - Studio B</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>GTC Building, Westlands, Nairobi</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>KES 5,000 / hr</span>
                  <span className="sp-btn-black" style={{ padding: '6px 14px', fontSize: '11px' }}>Reserve</span>
                </div>
              </div>

              <div className="sp-card sp-card-interactive" style={{ padding: '16px', background: '#ffffff' }} onClick={() => navigate('/client/booking')}>
                <img 
                  src="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=600&auto=format&fit=crop" 
                  alt="Innovation Hub" 
                  className="sp-card-image" 
                />
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginTop: '8px' }}>Innovation Hub - Suite 402</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Kilimani, Nairobi</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>KES 4,200 / hr</span>
                  <span className="sp-btn-black" style={{ padding: '6px 14px', fontSize: '11px' }}>Reserve</span>
                </div>
              </div>

              <div className="sp-card sp-card-interactive" style={{ padding: '16px', background: '#ffffff' }} onClick={() => navigate('/client/booking')}>
                <img 
                  src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop" 
                  alt="Executive Suite" 
                  className="sp-card-image" 
                />
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginTop: '8px' }}>Executive Conference Hall</h3>
                <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>CBD, Nairobi</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                  <span style={{ fontWeight: '800', fontSize: '14px' }}>KES 7,500 / hr</span>
                  <span className="sp-btn-black" style={{ padding: '6px 14px', fontSize: '11px' }}>Reserve</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Page Footer */}
      <footer className="sp-footer" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <span className="sp-logo" style={{ fontSize: '16px' }}>Spacer ®</span>
        <div className="sp-footer-text">Connecting people with open space and like-minded people.</div>
      </footer>
    </div>
  );
};

export default ClientDash;