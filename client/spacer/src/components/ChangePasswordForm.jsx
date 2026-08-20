import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/authSlice";

function ChangePasswordForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
    );

    if (changePassword.fulfilled.match(result)) {
      setSaved(true);
      setFormData({ currentPassword: "", newPassword: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="input-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-buttons">
        {saved && <span className="saved-message">Password updated</span>}

        <button type="submit" className="primary-button" disabled={status === "loading"}>
          {status === "loading" ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;