import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../../store/authSlice';
import ChangePasswordForm from '../../components/ChangePasswordForm';

export default function ClientProfile() {
  const dispatch = useDispatch();
  const { currentUser: user, status, error } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone_number: user?.phone_number || '' });
  const [saved, setSaved] = useState(false);
  const handleChange = (event) => { setProfile({ ...profile, [event.target.name]: event.target.value }); setSaved(false); };
  const handleSubmit = async (event) => { event.preventDefault(); const result = await dispatch(updateProfile(profile)); if (updateProfile.fulfilled.match(result)) setSaved(true); };

  return <div className="client-page public-page"><header className="browse-header"><p className="eyebrow">SPACER / YOUR SPACE</p><h1>Profile</h1><p>Manage the details attached to your Spacer account.</p></header><section className="profile-panel dashboard-section"><div className="profile-avatar">{(user?.name || 'S').charAt(0).toUpperCase()}</div><h2>{user?.name || 'Spacer member'}</h2><p>{user?.email || 'No email added yet'}</p></section><section className="dashboard-section profile-panel"><h2>Personal information</h2><form onSubmit={handleSubmit} className="mt-6"><div className="form-grid"><div className="input-group"><label>Full name</label><input type="text" name="name" value={profile.name} onChange={handleChange} required /></div><div className="input-group"><label>Email address</label><input type="email" name="email" value={profile.email} onChange={handleChange} required /></div><div className="input-group"><label>Phone number</label><input type="tel" name="phone_number" value={profile.phone_number} onChange={handleChange} required /></div></div>{error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}<div className="form-buttons">{saved ? <span className="saved-message">Changes saved</span> : null}<button type="submit" className="primary-button" disabled={status === 'loading'}>{status === 'loading' ? 'Saving...' : 'Save changes'}</button></div></form></section><section className="dashboard-section profile-panel"><h2>Change password</h2><ChangePasswordForm /></section><Link className="outline-button mb-8 inline-block" to="/spacer">Back to dashboard</Link><footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer></div>;
}
