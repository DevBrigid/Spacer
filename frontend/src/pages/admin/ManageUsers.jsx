import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUserDetails,
} from "../../store/adminSlice";

function ManageUsers() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.admin.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone_number: "", role: "client" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "client",
  });

  const filteredUsers = users.filter((user) =>
    `${user.name || ''} ${user.email || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      role: user.role || "client",
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateUserDetails({
      userId: editingUserId,
      userData: editForm,
    }));

    if (updateUserDetails.fulfilled.match(result)) {
      setEditingUserId(null);
      setEditForm({ name: "", email: "", phone_number: "", role: "client" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");
    const result = await dispatch(addUser(formData));
    if (!addUser.fulfilled.match(result)) {
      setFormError(result.payload || "Could not create the user.");
      return;
    }

    setFormData({
      name: "",
      email: "",
      password: "",
      phone_number: "",
      role: "client",
    });

    setFormSuccess("User created successfully. You can add another user below.");
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Manage Users</h1>
          <p>View and manage Spacer users.</p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button className="primary-button" onClick={() => {
            setFormError("");
            setFormSuccess("");
            setShowForm(true);
          }}>
            + Add User
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-header">
            <div>
              <h2>Add User</h2>
              <p>Create a new platform user and set their initial password.</p>
            </div>

            <button type="button" className="close-button" onClick={() => setShowForm(false)}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {formError && <p className="mb-4 text-sm text-red-600" role="alert">{formError}</p>}
            {formSuccess && <p className="mb-4 text-sm text-emerald-700" role="status">{formSuccess}</p>}
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
                <label>Initial Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>

              <div className="input-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
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
                editingUserId === user.id ? (
                  <tr key={user.id}>
                    <td colSpan="5">
                      <form onSubmit={handleEditSubmit} className="form-card" style={{ margin: 0 }}>
                        <div className="form-grid">
                          <div className="input-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                              required
                            />
                          </div>

                          <div className="input-group">
                            <label>Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                              required
                            />
                          </div>

                          <div className="input-group">
                            <label>Phone Number</label>
                            <input
                              type="tel"
                              value={editForm.phone_number}
                              onChange={(event) => setEditForm({ ...editForm, phone_number: event.target.value })}
                            />
                          </div>

                          <div className="input-group">
                            <label>Role</label>
                            <select
                              value={editForm.role}
                              onChange={(event) => setEditForm({ ...editForm, role: event.target.value })}
                            >
                              <option value="client">Client</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-buttons">
                          <button type="button" className="secondary-button" onClick={() => setEditingUserId(null)}>
                            Cancel
                          </button>
                          <button type="submit" className="primary-button">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>{String(user.role || 'client').charAt(0).toUpperCase() + String(user.role || 'client').slice(1)}</td>

                    <td>
                      <span
                        className={
                          String(user.status || 'Active') === "Active"
                            ? "status available"
                            : "status inactive"
                        }
                      >
                        {user.status || 'Active'}
                      </span>
                    </td>

                    <td>
                      <button
                        className="table-button"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => dispatch(deleteUser(user.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default ManageUsers;
