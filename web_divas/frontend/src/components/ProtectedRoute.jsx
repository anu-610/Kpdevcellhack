// ProtectedRoute.jsx
// Wraps admin routes. If no user → redirect to /login.
// Shows a loading block while Firebase resolves auth state.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-pixel)',
        fontSize: '0.7rem',
        color: 'var(--mid)',
        gap: '8px',
      }}>
        <span style={{ animation: 'blink 1s infinite' }}>█</span>
        LOADING...
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}
