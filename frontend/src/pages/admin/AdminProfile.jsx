import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/authSlice";
import AdminSidebar from "../../components/AdminSidebar";
import ChangePasswordForm from "../../components/ChangePasswordForm";

function AdminProfile() {
  const dispatch = useDispatch();
  const { currentUser, status } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone_number || "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateProfile(profile));
    if (updateProfile.fulfilled.match(result)) {
      setSaved(true);
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar />

      <main className="admin-main">
        <div className="page-heading">
          <h1>My Profile</h1>
          <p>Manage your administrator account.</p>
        </div>

        <section className="profile-card">
          <div className="large-profile-circle">
            {currentUser?.name?.[0] || "A"}
          </div>
          <div>
            <h2>{currentUser?.name}</h2>
            <p>Administrator</p>
          </div>
        </section>

        <section className="form-card profile-form">
          <h2>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-buttons">
              {saved && <span className="saved-message">Changes saved</span>}
              <button type="submit" className="primary-button" disabled={status === 'loading'}>
                {status === 'loading' ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        <section className="form-card profile-form">
          <h2>Change Password</h2>
          <ChangePasswordForm />
        </section>
      </main>
    </div>
  );
}

export default AdminProfile;