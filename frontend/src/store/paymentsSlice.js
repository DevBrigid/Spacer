import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//simulates calling Mpesa STK Push + waiting for the callback result
export const initiatePayment = createAsyncThunk(
    'payments/initiate',
    async (paymentDetails) => {
        // paymentDetails = { bookingId, amount, phoneNumber }

        //Fake network delay, like a real STK push prompt would take
        await new Promise((resolve) => setTimeout(resolve, 2000));

        //Fake successful response response - shaped like the real MPesa callback payload
        return {
            merchantRequestId: 'merchant' + Date.now(),
            checkoutRequestId: 'checkout' + Date.now(),
            receiptNumber: `SP${Date.now().toString().slice(-8)}`,
            status: 'success',
            resultDesc: 'The payment has been made successfully',
            amount: paymentDetails.amount,
            phoneNumber: paymentDetails.phoneNumber,
            paidAt: new Date().toISOString(),
        };
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
            state.resultDesc = action.error.message;
        });
    },
});

export const { resetPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer;
