import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const spaces = useSelector((state) => state.spaces.spaces);
  const bookings = useSelector((state) => state.bookings.bookings)

  const totalSpaces = spaces.length;

  const availableSpaces = spaces.filter(
    (space) => space.status === "Available"
  ).length;

  const bookedSpaces = spaces.filter(
    (space) => space.status === "Booked"
  ).length;

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          Spacer
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/admin"
            className="nav-link active"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/spaces"
            className="nav-link"
          >
            Manage Spaces
          </Link>

          <Link
            to="/admin/bookings"
            className="nav-link"
          >
            Booking History
          </Link>

          <Link
            to="/admin/users"
            className="nav-link"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/profile"
            className="nav-link"
          >
            Profile
          </Link>

        </nav>

      </aside>


      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, Admin
            </p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">
              A
            </div>

            <span>Admin</span>
          </div>

        </header>


        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">

            <span>Total Spaces</span>

            <h2>
              {totalSpaces}
            </h2>

          </div>


          <div className="stat-card">

            <span>Available Spaces</span>

            <h2>
              {availableSpaces}
            </h2>

          </div>


          <div className="stat-card">

            <span>Booked Spaces</span>

            <h2>
              {bookedSpaces}
            </h2>

          </div>


          <div className="stat-card">

            <span>Total Bookings</span>

            <h2>
              {bookings.length}
            </h2>

          </div>

        </section>


        {/* RECENT SPACES */}
        <section className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>Recent Spaces</h2>

              <p>
                Recently added spaces
              </p>
            </div>

            <Link
              to="/admin/spaces"
              className="view-all"
            >
              View all
            </Link>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>
                  <th>Space</th>
                  <th>Location</th>
                  <th>Price / Hour</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {spaces.slice(0, 5).map((space) => (

                  <tr key={space.id}>

                    <td>
                      <strong>
                        {space.name}
                      </strong>
                    </td>

                    <td>
                      {space.location}
                    </td>

                    <td>
                      KES{" "}
                      {Number(
                        space.pricePerHour
                      ).toLocaleString()}
                    </td>

                    <td>
                      {space.capacity}
                    </td>

                    <td>

                      <span
                        className={
                          space.status === "Available"
                            ? "status available"
                            : "status booked"
                        }
                      >
                        {space.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;