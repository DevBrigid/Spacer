import { apiFetch } from './api';

const BLOCKING_STATUSES = new Set(['pending', 'confirmed', 'approved']);

export const hasBookingConflict = (bookings, spaceId, startTime, endTime) => bookings.some((booking) => (
  String(booking.space_id ?? booking.spaceId) === String(spaceId)
  && BLOCKING_STATUSES.has(String(booking.status).toLowerCase())
  && new Date(startTime) < new Date(booking.end_time ?? booking.endTime)
  && new Date(endTime) > new Date(booking.start_time ?? booking.startTime)
));

async function getBookings(spaceId) {
  const bookings = await apiFetch(`/spaces/${spaceId}/bookings`);
  return Array.isArray(bookings) ? bookings : [];
}

export async function assertTimeSlotAvailable(spaceId, startTime, endTime) {
  const bookings = await getBookings(spaceId);
  if (hasBookingConflict(bookings, spaceId, startTime, endTime)) {
    throw new Error('This time slot was just booked by another client. Please choose another time.');
  }
}

export async function reserveTimeSlot({ spaceId, spaceName, userId, startTime, endTime, durationHours, totalAmount, token }) {
  await assertTimeSlotAvailable(spaceId, startTime, endTime);
  return apiFetch('/spacer/my/bookings', {
    method: 'POST',
    body: JSON.stringify({
      spaceId,
      spaceName,
      userId,
      startTime,
      endTime,
      durationHours,
      totalAmount,
    }),
  }, token);
}

export async function updateReservationStatus(id, status, token) {
  return apiFetch(`/spacer/my/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);
}

export async function cancelReservation(id, token) {
  await apiFetch(`/spacer/my/bookings/${id}`, { method: 'DELETE' }, token);
}
