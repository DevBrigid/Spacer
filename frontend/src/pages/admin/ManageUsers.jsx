import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addUser,
  deleteUser,
  toggleUserStatus,
} from "../../store/adminSlice";

function ManageUsers() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.admin.users);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Client",
    status: "Active",
  });

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(addUser(formData));

    setFormData({
      name: "",
      email: "",
      role: "Client",
      status: "Active",
    });

    setShowForm(false);
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage Spacer users.</p>
        </div>

        <button className="primary-button" onClick={() => setShowForm(true)}>
          + Add User
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <div>
              <h2>Add User</h2>
              <p>Create a new platform user.</p>
            </div>

            <button className="close-button" onClick={() => setShowForm(false)}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="Client">Client</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                Add User
              </button>
            </div>
          </form>
        </div>
      )}

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <h2>All Users</h2>
            <p>{users.length} registered users</p>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.name}</strong>
                  </td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    <span
                      className={
                        user.status === "Active"
                          ? "status available"
                          : "status inactive"
                      }
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="table-button"
                      onClick={() => dispatch(toggleUserStatus(user.id))}
                    >
                      {user.status === "Active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => dispatch(deleteUser(user.id))}
                    >
                      Delete
                    </button>
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

export default ManageUsers;