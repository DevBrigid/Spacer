import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientDash from './client/ClientDash';
import BookingPage from './client/BookingPage';
import MyBookings from './client/MyBookings';
import PaymentPage from './client/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
        <Route path="/client/dashboard" element={<ClientDash />} />
        <Route path="/client/booking" element={<BookingPage />} />
        <Route path="/client/my-bookings" element={<MyBookings />} />
        <Route path="/client/payment" element={<PaymentPage />} />
        <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
