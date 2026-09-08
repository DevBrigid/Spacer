import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../store/authSlice";

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const result = await dispatch(requestPasswordReset(trimmedEmail));
    if (requestPasswordReset.fulfilled.match(result)) {
      setSent(true);
      setEmail(trimmedEmail);
      setResetToken(result.payload?.reset_token || "");
    } else {
      setSent(false);
      setResetToken("");
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2>Reset Password</h2>
      <p>Enter your email and we'll send you a reset link.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {sent && (
          <div className="saved-message">
            <p>Check your email for a reset link.</p>
            {resetToken && (
              <p style={{ marginTop: "8px" }}>
                <Link to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>Set a new password now</Link>
              </p>
            )}
          </div>
        )}

        <button type="submit" className="primary-button" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p style={{ marginTop: "16px", textAlign: "center" }}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}

export default ForgotPasswordPage;