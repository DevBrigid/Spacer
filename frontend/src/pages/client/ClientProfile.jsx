import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function ClientProfile() {
  const user = useSelector((state) => state.users.user || state.auth.currentUser) || {};
  return <div className="client-page public-page"><header className="browse-header"><p className="eyebrow">SPACER / YOUR SPACE</p><h1>Profile</h1><p>Manage the details attached to your Spacer account.</p></header><section className="profile-panel dashboard-section"><div className="profile-avatar">{(user.name || 'S').charAt(0).toUpperCase()}</div><h2>{user.name || 'Spacer member'}</h2><p>{user.email || 'No email added yet'}</p><Link className="outline-button" to="/spacer">Back to dashboard</Link></section><footer className="site-footer"><strong>Spacer©</strong><span>Connecting people with open spaces and like-minded people</span><small>spacer©2026</small></footer></div>;
}
