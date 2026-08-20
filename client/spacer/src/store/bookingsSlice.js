import { createSlice } from "@reduxjs/toolkit";

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState: {
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
    },
});

export const { setBookingDetails, confirmBooking, resetBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;