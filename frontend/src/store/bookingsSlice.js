import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mockDatabase from '../database/db.json';

const localBookings = () => mockDatabase.bookings.map((booking) => ({ id: booking.id, client: mockDatabase.users.find((user) => user.id === booking.user_id)?.name || 'Spacer Client', space: booking.space_name, date: booking.start_time?.split('T')[0], duration: booking.duration_hours, amount: booking.total_amount, status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }));
export const fetchBookings = createAsyncThunk('bookings/fetchAll', async () => localBookings());

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: localBookings(), selectedSpaceId: null, startTime: null, endTime: null, durationHours: 0, totalAmount: 0, signedAt: null, bookingStatus: 'idle' },
  reducers: {
    setBookingDetails: (state, action) => { const { spaceId, startTime, endTime, pricePerHour } = action.payload; state.selectedSpaceId = spaceId; state.startTime = startTime; state.endTime = endTime; state.durationHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60); state.totalAmount = state.durationHours * pricePerHour; },
    confirmBooking: (state) => { state.bookingStatus = 'confirmed'; },
    resetBooking: (state) => { state.selectedSpaceId = null; state.startTime = null; state.endTime = null; state.durationHours = 0; state.totalAmount = 0; state.bookingStatus = 'idle'; },
    signAgreement: (state) => { state.signedAt = new Date().toISOString(); },
    approveBooking: (state, action) => { const booking = state.bookings.find((item) => item.id === action.payload); if (booking) booking.status = 'Approved'; },
    rejectBooking: (state, action) => { const booking = state.bookings.find((item) => item.id === action.payload); if (booking) booking.status = 'Rejected'; },
  },
  extraReducers: (builder) => builder.addCase(fetchBookings.fulfilled, (state, action) => { state.bookings = action.payload; }),
});

export const { setBookingDetails, confirmBooking, resetBooking, approveBooking, rejectBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
