const API_URL = 'http://localhost:3001';
const BLOCKING_STATUSES = new Set(['pending', 'confirmed', 'approved']);

export const hasBookingConflict = (bookings, spaceId, startTime, endTime) => bookings.some((booking) => (
  String(booking.space_id) === String(spaceId)
  && BLOCKING_STATUSES.has(String(booking.status).toLowerCase())
  && new Date(startTime) < new Date(booking.end_time)
  && new Date(endTime) > new Date(booking.start_time)
));

async function getBookings() {
  const response = await fetch(`${API_URL}/bookings`);
  if (!response.ok) throw new Error('We could not check availability. Please try again.');
  return response.json();
}

export async function assertTimeSlotAvailable(spaceId, startTime, endTime) {
  const bookings = await getBookings();
  if (hasBookingConflict(bookings, spaceId, startTime, endTime)) {
    throw new Error('This time slot was just booked by another client. Please choose another time.');
  }
}

export async function reserveTimeSlot({ spaceId, spaceName, userId, startTime, endTime, durationHours, totalAmount }) {
  await assertTimeSlotAvailable(spaceId, startTime, endTime);
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      space_id: spaceId,
      space_name: spaceName,
      user_id: userId,
      start_time: startTime,
      end_time: endTime,
      duration_hours: durationHours,
      total_amount: totalAmount,
      status: 'pending',
    }),
  });
  if (!response.ok) throw new Error('We could not reserve this time slot. Please try again.');
  return response.json();
}

export async function updateReservationStatus(id, status) {
  const response = await fetch(`${API_URL}/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Your reservation could not be confirmed.');
  return response.json();
}

export async function cancelReservation(id) {
  await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' });
}
