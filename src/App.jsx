import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ClientDash from './client/ClientDash.jsx';
import BookingPage from './client/BookingPage.jsx';
import PaymentPage from './client/PaymentPage.jsx';
import MyBookings from './client/MyBookings.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="/client/dashboard" element={<ClientDash />} />
        <Route path="/client/booking" element={<BookingPage />} />
        <Route path="/client/payment" element={<PaymentPage />} />
        <Route path="/client/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
