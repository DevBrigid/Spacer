// components/ChangePasswordForm.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../store/authSlice';

function ChangePasswordForm() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(changePassword({ currentPassword, newPassword }));
    if (changePassword.fulfilled.match(result)) {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Updating...' : 'Update Password'}
      </button>
      {success && <p>Password updated successfully.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default ChangePasswordForm;