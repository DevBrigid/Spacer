import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBookings = createAsyncThunk(
  'bookings/fetchAll',
  async () => {
    const res = await fetch('http://localhost:3001/bookings');
    const data = await res.json();

    // normalize field names to match what components expect
    return data.map((b) => ({
      id: b.id,
      client: b.client_name,     
      space: b.space_name,        
      date: b.start_time?.split('T')[0],
      duration: b.duration_hours,
      amount: b.total_amount,
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1), // "pending" → "Pending"
    }));
  }
);

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
        bookings:[],
        selectedSpaceId: null,
        startTime: null,
        endTime: null,
        durationHours: 0,
        totalAmount: 0,
        signedAt: null,
        bookingStatus: 'idle'
    },
    reducers: {
        setBookingDetails: (state, action) => {
            const { spaceId, startTime, endTime, pricePerHour } = action.payload;

            state.selectedSpaceId = spaceId;
            state.startTime = startTime;
            state.endTime = endTime;

            const durationMs = new Date(endTime) - new Date(startTime);
            const durationHours = durationMs / (1000 * 60 * 60);

            state.durationHours = durationHours;
            state.totalAmount = durationHours * pricePerHour;
        },
        confirmBooking: (state) => {
            state.bookingStatus = 'confirmed'
        },
        resetBooking: (state) => {
            state.selectedSpaceId = null;
            state.startTime = null;
            state.endTime = null;
            state.durationHours = 0;
            state.totalAmount = 0;
            state.bookingStatus = 'idle';
        },
        signAgreement: (state) => {
            state.signedAt = new Date().toISOString();
        },
        approveBooking: (state, action) => {
            const booking = state.bookings.find((b) => b.id === action.payload);
            if (booking) booking.status = 'Approved';
        },
        rejectBooking: (state, action) => {
            const booking = state.bookings.find((b) => b.id === action.payload);
            if (booking) booking.status = 'Rejected';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchBookings.fulfilled, (state, action) => {
            state.bookings = action.payload;
        });
    },
});

export const { setBookingDetails, confirmBooking, resetBooking, approveBooking, rejectBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;