# Spacer — What to Import From the Store

Quick guide for building pages. You don't need to know how these work inside — just copy the pattern below and use what's listed for your page.

**Every time, at the top of your component:**
```jsx
import { useDispatch, useSelector } from 'react-redux';

const dispatch = useDispatch();
const { ...fields } = useSelector((state) => state.SLICE_NAME);
```

---

## Logging in / Registering / Profile → `state.auth`

**What you can read:**
- `currentUser` — the logged-in user's info (`name`, `email`, `phone_number`, `role`), or `null` if nobody's logged in
- `isAuthenticated` — `true`/`false`
- `status` — is something loading right now?
- `error` — a message if something went wrong

**What you can trigger:**
```jsx
dispatch(loginUser({ email, password }))
dispatch(registerUser({ name, email, phone_number, password }))
dispatch(changePassword({ currentPassword, newPassword }))
dispatch(resetPassword(email))   // forgot password
dispatch(logout())
```

Import from: `store/authSlice.js`

---

## Browse Spaces / Space Details → `state.spaces`

**What you can read:**
- `list` — all spaces, use this on the Browse page
- `selectedSpace` — one space, use this on the Space Details page

**What you can trigger:**
```jsx
dispatch(fetchSpaces())        // call this when Browse page loads
dispatch(fetchSpaceById(id))   // call this when Space Details page loads
```

Import from: `store/spacesSlice.js`

---

## Booking a Space → `state.bookings`

**What you can read:**
- `durationHours`, `totalAmount` — already calculated for you, just display them
- `signedAt` — becomes a timestamp once someone agrees to the terms

**What you can trigger:**
```jsx
dispatch(setBookingDetails({ spaceId, startTime, endTime, pricePerHour }))
dispatch(signAgreement())   // only call this when "Go to Payment" is clicked
dispatch(confirmBooking())
```

Import from: `store/bookingsSlice.js`

---

## Payment Page → `state.payments`

**What you can read:**
- `status` — `'idle'`, `'pending'`, `'success'`, or `'failed'`

**What you can trigger:**
```jsx
dispatch(initiatePayment({ bookingId, amount, phoneNumber }))
```

Import from: `store/paymentsSlice.js`

---

## Admin Pages → `state.admin`

**What you can read:**
- `mySpaces` — spaces this admin added
- `users` — all users, for the Manage Users page

**What you can trigger:**
```jsx
dispatch(addSpace(spaceObject))
dispatch(updateSpaceStatus({ spaceId, status }))
dispatch(addUser(userObject))
```

Import from: `store/adminSlice.js`

---

## Routing — already set up, nothing to add

- Any page that needs someone logged in → automatically protected, no action needed from you
- Admin pages → automatically protected, only admins can reach them
- Just build your page component — it'll show up inside the right layout (top navbar or sidebar) automatically based on the URL