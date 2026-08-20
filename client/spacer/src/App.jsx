import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import BrowseSpaces from './pages/public/BrowseSpaces'
import SpaceDetails from './pages/public/SpaceDetails'
import AuthPage from './pages/public/AuthPage'

// Temporary inline component if you haven't created Dashboard.jsx yet
const Dashboard = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Dashboard</h1>
    <p>Welcome to your spacer dashboard!</p>
  </div>
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/browse" element={<BrowseSpaces />} />
      <Route path="/space/:id" element={<SpaceDetails />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Redirects any unknown route back to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App