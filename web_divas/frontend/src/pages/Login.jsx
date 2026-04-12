import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, provider } from '../firebase'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [err, setErr]         = useState(null)
  const [loading, setLoading] = useState(false)

  if (user) { navigate('/admin'); return null }

  const handleLogin = async () => {
    setLoading(true); setErr(null)
    try {
      await signInWithPopup(auth, provider)
      navigate('/admin')
    } catch (e) {
      setErr(e.message || 'login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.cardTop}>
          <div style={s.icon}>⬡</div>
          <h1 style={s.title}>ADMIN ACCESS</h1>
          <p style={s.sub}>authenticate to manage club content</p>
        </div>

        <div className="divider" />

        {/* Terminal-style info */}
        <div style={s.infoBlock}>
          <div style={s.infoLine}><span style={s.key}>access_level</span><span style={s.val}>admin</span></div>
          <div style={s.infoLine}><span style={s.key}>auth_provider</span><span style={s.val}>firebase / google</span></div>
          <div style={s.infoLine}><span style={s.key}>scope</span><span style={s.val}>team · events · projects</span></div>
        </div>

        <div className="divider" />

        {err && (
          <div style={s.error}>⚠ {err}</div>
        )}

        <button onClick={handleLogin} disabled={loading} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
          {loading
            ? <><span className="blink">█</span> authenticating...</>
            : '$ sign in with google'
          }
        </button>

        <p style={s.note}>
          // public pages don't require login.<br />
          // only club admins should sign in here.
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '80vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  card: {
    background: 'var(--bg-card)', border: '1px solid var(--border-mid)',
    borderRadius: 'var(--radius-lg)', padding: '40px 36px',
    maxWidth: 400, width: '100%',
  },
  cardTop: { textAlign: 'center', marginBottom: 8 },
  icon: { fontSize: '2rem', color: 'var(--accent)', marginBottom: 16 },
  title: { fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', marginBottom: 8 },
  sub:   { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' },
  infoBlock: { display: 'flex', flexDirection: 'column', gap: 8 },
  infoLine:  { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 13 },
  key:  { color: 'var(--text-dim)' },
  val:  { color: 'var(--accent2)' },
  error: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--danger)', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 16 },
  note:  { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 20, lineHeight: 1.8 },
}
