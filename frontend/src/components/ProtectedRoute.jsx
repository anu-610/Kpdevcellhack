import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  // ── While auth state is being resolved, show a full-page skeleton ──────────
  // This is critical: without this, the component redirects to / on refresh
  // before the session has been read from localStorage.
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Animated logo placeholder */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '2px solid #00ff8833',
            borderTopColor: '#00ff88',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#444',
            letterSpacing: '0.1em',
          }}
        >
          VERIFYING ACCESS...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Not authenticated or not an admin → redirect to home ──────────────────
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}