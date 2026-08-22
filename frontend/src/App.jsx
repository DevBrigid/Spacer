import './index.css'
import './App.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { loadUserFromStorage, fetchCurrentUser } from './store/authSlice';

import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import LandingPage from './pages/public/LandingPage';
import BrowsePage from './pages/public/BrowsePage';
import SpaceDetails from './pages/public/SpaceDetails';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/ClientProfile';
import BookingPage from './pages/client/BookingPage';
import MyBookings from './pages/client/MyBookings';
import AgreementPage from './pages/public/AgreementPage';
import PaymentPage from './pages/client/PaymentPage';
import InvoicePage from './pages/client/InvoicePage';

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

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser(token));
    }
  }, [token, dispatch]);

  if (!authChecked && localStorage.getItem('token')) {
    return <p>Loading...</p>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<ClientLayout />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/spaces' element={<BrowsePage />} />
          <Route path='/spaces/:id' element={<SpaceDetails />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/agreement' element={<AgreementPage />} />
          <Route path='/terms' element={<TermsOfService />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />

          {/* Client - login required */}
          <Route path='/spacer' element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
          <Route path='/spacer/profile' element={<PrivateRoute><ClientProfile /></PrivateRoute>} />
          <Route path='/spacer/bookings' element={<PrivateRoute><MyBookings /></PrivateRoute>} />
          <Route path='/spacer/booking/:spacerId' element={<PrivateRoute><BookingPage /></PrivateRoute>} />
          <Route path='/spacer/agreement' element={<PrivateRoute><AgreementPage /></PrivateRoute>} />
          <Route path='/spacer/payment' element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path='/spacer/invoice' element={<PrivateRoute><InvoicePage /></PrivateRoute>} />
        </Route>

        {/* Admin - admin role required */}
        <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path='spaces' element={<ManageSpaces />} />
          <Route path='users' element={<ManageUsers />} />
          <Route path='bookings' element={<BookingHistory />} />
          <Route path='profile' element={<AdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
