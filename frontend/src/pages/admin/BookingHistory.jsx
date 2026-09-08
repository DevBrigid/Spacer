import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminBookings } from "../../store/bookingsSlice";

function BookingHistory() {
  const dispatch = useDispatch();

  const bookings = useSelector((state) => state.bookings.bookings);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchAdminBookings());
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
            {["All", "Pending", "Confirmed"].map((status) => (
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
                <th>Space</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.space}</td>

                  <td>{booking.date}</td>

                  <td>{booking.duration} hours</td>

                  <td>KES {booking.amount.toLocaleString()}</td>

                  <td>
                    <span className={`status ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
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