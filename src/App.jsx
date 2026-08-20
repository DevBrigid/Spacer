import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ClientDash from './client/ClientDash';
import BookingPage from './client/BookingPage';
import PaymentPage from './client/PaymentPage';
import MyBookings from './client/MyBookings';
import SpacesDirectory from './client/SpacesDirectory';

function App() {
  const [theme, setTheme] = useState('dark');
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <div className={`app-container ${theme === 'light' ? 'light-theme' : ''}`}>
        <nav className="navbar">
          <Link to="/client/dashboard" className="nav-brand">
            Spacer<span style={{ color: '#34d399' }}>.Client</span>
          </Link>
          <div className="nav-links">
            <Link to="/client/spaces" className="nav-item">Explore Spaces</Link>
            <Link to="/client/my-bookings" className="nav-item">Records & History</Link>
            <button onClick={toggleTheme} className="btn-theme">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </nav>

        {toast && <div className="toast-popup">🔔 {toast}</div>}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="/client/dashboard" element={<ClientDash />} />
            <Route path="/client/spaces" element={<SpacesDirectory />} />
            <Route path="/client/book/:spaceId" element={<BookingPage triggerToast={triggerToast} />} />
            <Route path="/client/payment" element={<PaymentPage triggerToast={triggerToast} />} />
            <Route path="/client/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;