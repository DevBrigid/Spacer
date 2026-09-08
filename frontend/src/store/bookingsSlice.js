import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../utils/api';

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const data = await apiFetch('/spacer/my/bookings', {}, token);
    return Array.isArray(data) ? data.map((booking) => ({
      id: booking.id,
      userId: booking.userId ?? booking.user_id,
      client: 'Client',
      spaceId: booking.spaceId ?? booking.space_id,
      space: booking.spaceName || booking.space_name || booking.space,
      date: booking.startTime?.split('T')[0] || booking.start_time?.split('T')[0],
      startTime: booking.startTime || booking.start_time,
      endTime: booking.endTime || booking.end_time,
      duration: booking.durationHours ?? booking.duration_hours ?? booking.duration,
      amount: booking.totalAmount ?? booking.total_amount ?? booking.amount,
      status: booking.status,
      paymentStatus: booking.paymentStatus ?? booking.payment_status ?? null,
    })) : [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchAdminBookings = createAsyncThunk('bookings/fetchAdminAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const data = await apiFetch('/admin/bookings', {}, token);
    return Array.isArray(data) ? data.map((booking) => ({
      id: booking.id,
      userId: booking.userId ?? booking.user_id,
      client: booking.client || 'Client',
      spaceId: booking.spaceId ?? booking.space_id,
      space: booking.spaceName || booking.space_name || booking.space,
      date: booking.startTime?.split('T')[0] || booking.start_time?.split('T')[0],
      startTime: booking.startTime || booking.start_time,
      endTime: booking.endTime || booking.end_time,
      duration: booking.durationHours ?? booking.duration_hours ?? booking.duration,
      amount: booking.totalAmount ?? booking.total_amount ?? booking.amount,
      status: booking.status,
    })) : [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: [], selectedSpaceId: null, spaceName: null, spaceLocation: null, activeBookingId: null, startTime: null, endTime: null, durationHours: 0, totalAmount: 0, signedAt: null, bookingStatus: 'idle' },
  reducers: {
    setBookingDetails: (state, action) => {
      const { spaceId, spaceName, spaceLocation, startTime, endTime, pricePerHour, totalAmount, durationHours, activeBookingId } = action.payload;
      state.selectedSpaceId = spaceId;
      state.spaceName = spaceName ?? state.spaceName ?? null;
      state.spaceLocation = spaceLocation ?? state.spaceLocation ?? null;
      state.activeBookingId = activeBookingId ?? null;
      state.startTime = startTime;
      state.endTime = endTime;

      const parsedDuration = Number(durationHours) || (startTime && endTime ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) : 0);
      state.durationHours = Number.isFinite(parsedDuration) && parsedDuration > 0 ? parsedDuration : 0;

      const computedTotal = Number(totalAmount) || (state.durationHours * (pricePerHour || 0));
      state.totalAmount = Number.isFinite(computedTotal) ? computedTotal : 0;
    },
    addBooking: (state, action) => { state.bookings.unshift({ id: Date.now(), ...action.payload }); },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find((item) => String(item.id) === String(id));
      if (booking) booking.status = status;
    },
    confirmBooking: (state) => { state.bookingStatus = 'confirmed'; },
    resetBooking: (state) => { state.selectedSpaceId = null; state.spaceName = null; state.spaceLocation = null; state.activeBookingId = null; state.startTime = null; state.endTime = null; state.durationHours = 0; state.totalAmount = 0; state.bookingStatus = 'idle'; },
    signAgreement: (state) => { state.signedAt = new Date().toISOString(); },
    approveBooking: (state, action) => { const booking = state.bookings.find((item) => item.id === action.payload); if (booking) booking.status = 'Approved'; },
    rejectBooking: (state, action) => { const booking = state.bookings.find((item) => item.id === action.payload); if (booking) booking.status = 'Rejected'; },
  },
  extraReducers: (builder) => builder
    .addCase(fetchBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
    .addCase(fetchAdminBookings.fulfilled, (state, action) => { state.bookings = action.payload; }),
});

export const { setBookingDetails, addBooking, updateBookingStatus, confirmBooking, resetBooking, approveBooking, rejectBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
