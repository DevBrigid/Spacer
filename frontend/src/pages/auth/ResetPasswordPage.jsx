import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { confirmPasswordReset } from '../../store/authSlice';

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, error } = useSelector((state) => state.auth);
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;
    if (password.length < 8) return;
    if (password !== confirmPassword) return;

    const result = await dispatch(confirmPasswordReset({ token, password }));
    if (confirmPasswordReset.fulfilled.match(result)) {
      navigate('/login', { replace: true, state: { message: 'Password updated successfully. Please sign in.' } });
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: '420px', margin: '60px auto' }}>
      <h2>Set New Password</h2>
      <p>Choose a secure password to finish resetting your account.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>New password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </div>

        <div className="input-group">
          <label>Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />
        </div>

        {!token && <p className="error-message">Missing reset token.</p>}
        {password && confirmPassword && password !== confirmPassword && (
          <p className="error-message">Passwords do not match.</p>
        )}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="primary-button" disabled={status === 'loading' || !token}>
          {status === 'loading' ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <p style={{ marginTop: '16px', textAlign: 'center' }}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}

export default ResetPasswordPage;
