import './index.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadUserFromStorage } from './store/authSlice';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import LandingPage from './pages/public/LandingPage';
import BrowsePage from './pages/public/BrowsePage';
import SpaceDetails from './pages/public/SpaceDetails';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/ClientProfile';
import BookingPage from './pages/client/BookingPage';
import MyBookings from './pages/client/MyBookings';
import AgreementPage from './pages/client/AgreementPage';
import PaymentPage from './pages/client/PaymentPage';

import AdminDashBoard from './pages/admin/AdminDashBoard';
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
    return <p>Loading...</p>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<ClientLayout />}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
