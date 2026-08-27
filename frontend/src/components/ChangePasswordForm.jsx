import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, clearAuthMessages } from '../store/authSlice';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const isLoading = status === 'loading';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearAuthMessages());

    if (newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('New passwords do not match.');
      return;
    }

    dispatch(changePassword({ currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => {});
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">Change Password</h3>

      {(localError || error) && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-black py-2 text-sm font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
