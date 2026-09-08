import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from '../utils/api';

export const initiatePayment = createAsyncThunk(
    'payments/initiate',
    async (paymentDetails, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const payload = {
                booking_id: Number(paymentDetails.bookingId),
                amount: Number(paymentDetails.amount),
                phone_number: String(paymentDetails.phoneNumber || '').replace(/\s+/g, ''),
            };

            const response = await apiFetch('/payments/stkpush', {
                method: 'POST',
                body: JSON.stringify(payload),
            }, token);

            return {
                merchantRequestId: response.merchant_request_id,
                checkoutRequestId: response.checkout_request_id,
                receiptNumber: response.mpesa_receipt_number,
                status: String(response.status || 'pending').toLowerCase(),
                resultDesc: response.status === 'PENDING' ? 'M-Pesa STK push sent to your phone.' : 'Payment request received.',
                amount: Number(response.amount || paymentDetails.amount || 0),
                phoneNumber: response.phone_number,
                paidAt: response.created_at || new Date().toISOString(),
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchPaymentByBookingId = createAsyncThunk(
    'payments/fetchByBookingId',
    async (bookingId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const response = await apiFetch(`/payments/booking/${bookingId}`, {}, token);

            return {
                merchantRequestId: response.merchant_request_id,
                checkoutRequestId: response.checkout_request_id,
                receiptNumber: response.mpesa_receipt_number,
                status: String(response.status || 'pending').toLowerCase(),
                resultDesc: response.status === 'COMPLETED' ? 'Payment received.' : response.status === 'FAILED' ? 'Payment failed.' : 'M-Pesa STK push sent to your phone.',
                amount: Number(response.amount || 0),
                phoneNumber: response.phone_number,
                paidAt: response.created_at || new Date().toISOString(),
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const paymentsSlice = createSlice({
    name:'payments',
    initialState: {
        merchantRequestId: null,
        checkoutRequestId: null,
        status: 'idle',
        resultDesc: null,
        amount: 0,
        phoneNumber: null,
        receiptNumber: null,
        paidAt: null,
    },
    reducers: {
        resetPayment: (state) => {
            state.merchantRequestId = null;
            state.checkoutRequestId = null;
            state.status = 'idle';
            state.resultDesc = null;
            state.amount = 0;
            state.phoneNumber = null;
            state.receiptNumber = null;
            state.paidAt = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(initiatePayment.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(initiatePayment.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.merchantRequestId = action.payload.merchantRequestId;
            state.checkoutRequestId = action.payload.checkoutRequestId;
            state.resultDesc = action.payload.resultDesc;
            state.amount = action.payload.amount;
            state.phoneNumber = action.payload.phoneNumber;
            state.receiptNumber = action.payload.receiptNumber;
            state.paidAt = action.payload.paidAt;
        })
        .addCase(initiatePayment.rejected, (state, action) => {
            state.status = 'failed';
            state.resultDesc = action.payload || action.error.message;
        })
        .addCase(fetchPaymentByBookingId.pending, (state) => {
            state.status = state.status === 'idle' ? 'pending' : state.status;
        })
        .addCase(fetchPaymentByBookingId.fulfilled, (state, action) => {
            state.status = action.payload.status;
            state.merchantRequestId = action.payload.merchantRequestId;
            state.checkoutRequestId = action.payload.checkoutRequestId;
            state.resultDesc = action.payload.resultDesc;
            state.amount = action.payload.amount;
            state.phoneNumber = action.payload.phoneNumber;
            state.receiptNumber = action.payload.receiptNumber;
            state.paidAt = action.payload.paidAt;
        })
        .addCase(fetchPaymentByBookingId.rejected, (state, action) => {
            state.status = 'failed';
            state.resultDesc = action.payload || action.error.message;
        });
    },
});

export const { resetPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
