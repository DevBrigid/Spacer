import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  approveBooking,
  rejectBooking,
  fetchBookings,
} from "../../store/bookingsSlice";

function BookingHistory() {
  const dispatch = useDispatch();

  const bookings = useSelector((state) => state.bookings.bookings);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Booking History</h1>
          <p>View and manage space bookings.</p>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>Bookings</h2>
            <p>{filteredBookings.length} bookings</p>
          </div>

          <div className="filter-buttons">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                className={
                  filter === status
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Space</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.client}</strong>
                  </td>

                  <td>{booking.space}</td>

                  <td>{booking.date}</td>

                  <td>{booking.duration} hours</td>

                  <td>KES {booking.amount.toLocaleString()}</td>

                  <td>
                    <span className={`status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    {booking.status === "Pending" && (
                      <>
                        <button
                          className="table-button"
                          onClick={() => dispatch(approveBooking(booking.id))}
                        >
                          Approve
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => dispatch(rejectBooking(booking.id))}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default BookingHistory;