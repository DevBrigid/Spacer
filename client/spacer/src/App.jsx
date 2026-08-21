<<<<<<< Updated upstream
import './index.css'
=======
import './index.css';
>>>>>>> Stashed changes
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadUserFromStorage } from './store/authSlice';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< Updated upstream
import PrivateRoute from './routes/PrivateRoute';
=======

import { loadUserFromStorage, fetchCurrentUser } from './store/authSlice';

>>>>>>> Stashed changes
import AdminRoute from './routes/AdminRoute';

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

import './App.css'
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

function App() {
  const dispatch = useDispatch();
  const { token, authChecked, fetchCurrentUser } = useSelector((state) => state.auth);

  //restore session on app load
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [token, dispatch, fetchCurrentUser]);

  if (!authChecked && localStorage.getItem('token')) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
<<<<<<< Updated upstream
          <Route path='/' element={<LandingPage/>} />
          <Route path='/spaces' element={<BrowsePage/>} />
          <Route path='/spaces/:id' element={<SpaceDetails/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
        

          {/* Client - login required */}
          <Route path='/spacer' element={<PrivateRoute><ClientDashboard/></PrivateRoute>}/>
          <Route path='/spacer/profile' element={<PrivateRoute><ClientProfile/></PrivateRoute>}/>
          <Route path='/spacer/bookings' element={<PrivateRoute><MyBookings/></PrivateRoute>}/>
          <Route path='/spacer/booking/:spacerId' element={<PrivateRoute><BookingPage/></PrivateRoute>}/>
          <Route path='/spacer/agreement' element={<PrivateRoute><AgreementPage/></PrivateRoute>}/>
          <Route path='/spacer/payment' element={<PrivateRoute><PaymentPage/></PrivateRoute>}/>
        </Route>

        {/* Admin - admin role required */}
        <Route path='/admin' element={<AdminRoute><AdminLayout/></AdminRoute>}>
          <Route index element={<AdminDashBoard/>}/>
          <Route path='/admin/spaces' element={<AdminRoute><ManageSpaces/></AdminRoute>}/>
          <Route path='/admin/users' element={<AdminRoute><ManageUsers/></AdminRoute>}/>
          <Route path='/admin/bookings' element={<AdminRoute><BookingHistory/></AdminRoute>}/>
          <Route path='admin/profile' element={<AdminRoute><AdminProfile/></AdminRoute>}/>
=======
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
>>>>>>> Stashed changes
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< Updated upstream
export default App
=======
export default App;
>>>>>>> Stashed changes
