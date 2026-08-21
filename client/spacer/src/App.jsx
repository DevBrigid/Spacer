import './index.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { loadUserFromStorage } from './store/authSlice';
import AdminRoute from './routes/AdminRoute';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

import AuthPage from './pages/public/AuthPage';
import LandingPage from './pages/public/LandingPage';
import BrowseSpaces from './pages/public/BrowseSpaces';
import SpaceDetails from './pages/public/SpaceDetails';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

import ClientDashboard from './pages/client/ClientDashboard';
import MyBookings from './pages/client/MyBookings';
import PaymentPage from './pages/client/PaymentPage';
import ClientProfile from './pages/client/ClientProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import BookingHistory from './pages/admin/BookingHistory';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSpaces from './pages/admin/ManageSpaces';
import AdminProfile from './pages/admin/AdminProfile';

function App() {
  const dispatch = useDispatch();
  const { token, authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  if (!authChecked && token) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/spaces" element={<BrowseSpaces />} />
          <Route path="/spaces/:id" element={<SpaceDetails />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/profile" element={<ClientProfile />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/book/:id" element={<PaymentPage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="spaces" element={<ManageSpaces />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
