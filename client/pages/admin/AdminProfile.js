import React, { useState } from "react";

import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";

function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@spacer.com",
    phone: "+254 700 000 000",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSaved(true);
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <main className="admin-main">
        <AdminNavbar />

        <div className="page-heading">
          <div>
            <h1>My Profile</h1>
            <p>
              Manage your administrator account.
            </p>
          </div>
        </div>

        <section className="profile-card">
          <div className="large-profile-circle">
            A
          </div>

          <div>
            <h2>{profile.name}</h2>
            <p>Administrator</p>
          </div>
        </section>

        <section className="form-card profile-form">
          <div className="form-header">
            <div>
              <h2>Personal Information</h2>
              <p>
                Update your account information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-buttons">
              {saved && (
                <span className="saved-message">
                  Changes saved
                </span>
              )}

              <button
                type="submit"
                className="primary-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminProfile;